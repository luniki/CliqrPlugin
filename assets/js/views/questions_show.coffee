define [
  'views/template_view'
  'views/questions_results_view'
  'utils'
  'jquery.fittext'
], (TemplateView, ResultsView, utils) ->

  class QuestionView extends TemplateView
    template_id: "questions-show"

    className: "page questions-show"

    events:
      "click button.start":            "startQuestion"
      "click button.stop":             "stopQuestion"
      "click a.qr":                    "showQRCode"
      "submit form.questions-destroy": "confirmDestroy"
      "click .fullscreen":             "showFS"

    initialize: ->
      @resultsView = new ResultsView
        model: @model.toJSON().answers

      @listenTo @model, "change:answers", @updateAnswers
      @listenTo @model, "change:state",   @updateState

      @interval = setInterval (=> do @model.fetch), 2000

    remove: ->
      clearInterval @interval
      @resultsView.remove()
      super()

    render: ->
      context = _.extend @model.toJSON(),
        qr_code:   cliqr.config.PLUGIN_URL + "qr/" + cliqr.config.CID
        short_url: cliqr.config.SHORT_URL

      @$el.html @template context
      @$(".results").replaceWith @resultsView.render().el
      @

    postRender: ->
      @resultsView.postRender()
      @$(".vote .url").fitText()

    updateAnswers: (model, answers, options) =>
      @resultsView.update answers

    updateState: (model, state, options) =>
      @render()
      @postRender()

    showQRCode: (event) ->
      # do not show code, handle this on your own
      event.preventDefault()
      origin = $(event.target)
      dialog = origin
          .closest '.vote'
          .find '.dialog'
      content = dialog.html()

      $(document).one 'dialog-open', (event, parameters) ->
        $(parameters.dialog).fitText()

      STUDIP.Dialog.show content,
        id: "dialog-qr"
        width: 550
        height: 700
        title: dialog.attr 'title'
        resize: false

      @$(".question").toggleClass "qr-visible"

    confirmDestroy: (event) ->
      unless window.confirm jQuery(event.target).data "confirm"
        event.preventDefault()

    showFS: (event) ->
      event.preventDefault()

      container = @el

      methods = ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen"]
      for method in methods when container[method]
        do container[method]
        break


    startQuestion: (event) ->
      event.preventDefault()
      @$(".appeal.start").addClass("busy")
      @model.start().done(=> @model.fetch())



    stopQuestion: (event) ->
      event.preventDefault()
      @model.stop().done(=> @model.fetch())
