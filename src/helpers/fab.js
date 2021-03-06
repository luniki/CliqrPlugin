import { SafeString, escapeExpression } from 'handlebars/runtime'

const iconMaker = (color, icon, text) => {
    return `<i class="cliqr--icon cliqr--icon-${icon} cliqr--icon-color-${color}" title="${text}" aria-hidden></i>`
}

const fab = function(klass, text, icon, { hash }) {
    let { disabled = false, once = false, flat = false, color = 'blue' } = hash
    const disabledAttr = disabled ? 'disabled' : ''

    text = escapeExpression(text)
    klass = 'js-' + escapeExpression(klass)
    color = escapeExpression(color)

    const addClasses =
        (escapeExpression(hash['class']) || '') + (once ? ' cliqr--click-once' : '') + (flat ? '  cliqr--flat' : '')

    return new SafeString(`
            <button type="button" class="button cliqr--button-fab ${klass} ${addClasses}"
                    name="${text}" title="${text}"
                    data-tooltip="${text}" ${disabledAttr}>
                ${iconMaker(color, escapeExpression(icon), text)}
            </button>`)
}

export default fab
