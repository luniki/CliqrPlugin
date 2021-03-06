import Backbone from 'backbone'
import Radio from 'backbone.radio'
import _ from 'underscore'
import template from '../hbs/poll.hbs'
import { View } from 'backbone.marionette'

export default View.extend({
    className: 'cliqr--multiple-choice-poll-view',

    events: {
        'submit form': 'onSubmitForm'
    },

    initialize({ voting }) {
        this.voting = voting
    },

    template,

    templateContext() {
        const task = this.voting.getTask()
        return {
            response: this.model.toJSON(),
            voting: _.omit(this.voting.toJSON(), 'task'),
            task: task.toJSON(),
            answers: task.get('task').answers,
            isSingleSelect: task.get('task').type === 'single'
        }
    },

    onAttach() {
        Radio.channel('layout').request('apply:mathjax', this.$('.description, .text, span.math-tex:not(:has(.MathJax))'))
    },

    onSubmitForm(event) {
        event.preventDefault()

        const ary = Backbone.$(event.target)
            .closest('form')
            .serializeArray()
        this.model.set('response', { answer: _.map(ary, input => parseInt(input.value, 10)) })

        this.voting.trigger('newResponse', this.model, this.voting)
    }
})
