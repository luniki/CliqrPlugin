define [
  'backbone'
  'utils'
  'models/question'
  'views/questions_results_view'
], (Backbone, utils, Question, ResultsView) ->

  class QuestionView extends Backbone.View
    events:
      #"click .fullscreen": "showFS"
      "click .appeal.start button":   "startQuestion"
      "click a.qr": "showQRCode"

    ###
    showFS: ->
      container = @$("#layout_page")[0]
      if container.requestFullscreen
        container.requestFullscreen()
      else if container.mozRequestFullScreen
        container.mozRequestFullScreen()
      else if container.webkitRequestFullscreen
        container.webkitRequestFullscreen()
      false
    ###

    initialize: ->
      @resultsView = new ResultsView
        model: @model.toJSON().answers

      @model.on "change:answers", @updateAnswers

    render: ->
      @$(".question").append @resultsView.render().el
      @

    updateAnswers: (model, answers, options) =>
      @resultsView.update answers

    startQuestion: (event) ->
      @$(".appeal.start").addClass("busy")

    showQRCode: (event) ->
      # do not show code, handle this on your own
      event.preventDefault()

      utils.changeToPage new QRView @model
