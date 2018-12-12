import Backbone from 'backbone'
import template from '../../hbs/tasks-edit.hbs'
import showError from '../error'
import taskTypes from '../models/task_types'
import Voting from '../models/voting'
import { hideLoading, showLoading } from '../utils'
import Viewmaster from './viewmaster'

const TasksEditView = Viewmaster.extend({
    tagName: 'article',

    className: 'cliqr--tasks-edit',

    taskType: null,

    initialize({ store }) {
        Viewmaster.prototype.initialize.call(this)

        const taskGroup = store.taskGroups.get(this.model.get('task_group_id'))
        store.trigger('navigation', 'task-group', taskGroup)

        taskTypes
            .fetchTaskType(this.model)
            .then(taskType => {
                const oldViews = this.getViews('main')
                if (oldViews) {
                    oldViews.forEach(v => this.stopListening(v))
                }

                const view = taskType.getEditView()
                this.listenTo(view, 'editTask', this.onEditTask)
                this.listenTo(view, 'cancel', this.onCancel)
                this.setView('main', view)
                this.render()
                view && view.postRender && view.postRender()

                return null
            })
            .catch(error => {
                showError('Could not fetch task type', error)
            })
    },

    template,

    context() {
        const task = this.model.toJSON()
        return {
            breadcrumb: {
                task_group_id: task.task_group_id,
                task_group_title: task.task_group_title,
                task_id: task.id,
                task_title: task.title
            }
        }
    },

    onClickStart(event) {
        event.preventDefault()
        const vtng = new Voting({ task_id: this.model.id })
        vtng.save()
            .then(model => {
                Backbone.history.navigate(`voting/${model.id}`, { trigger: true })
                return null
            })
            .catch(error => {
                showError('Could not start voting', error)
            })
    },

    onClickStop(event) {
        event.preventDefault()

        const running = this.model.getVotings().find(a => a.isRunning())
        running
            .save({ end: new Date().toISOString() })
            .then(() => {
                this.render()
                return null
            })
            .catch(error => {
                showError('Could not stop voting', error)
            })
    },

    onEditTask(model) {
        this.model.set(model.attributes, { silent: true })

        showLoading()

        this.model
            .save()
            .then(() => {
                Backbone.history.navigate(`task/show/${this.model.id}`, { trigger: true })
                hideLoading()
                return null
            })
            .catch(error => {
                hideLoading()
                showError('Could not edit task', error)
            })
    },
    onCancel(model) {
        Backbone.history.navigate(`task/show/${model.id}`, { trigger: true })
    }
})

export default TasksEditView
