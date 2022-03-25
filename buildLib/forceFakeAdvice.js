/**
 * @param {*} rawValue
 * @param {boolean} defaultValue
 * @return {boolean}
 * @private
 */
function _parseBoolean(rawValue, defaultValue = false) {
    if (!rawValue) {
        return !!defaultValue
    }
    return ["1", "yes", "true", "y"].includes(
        ("" + rawValue).toLowerCase().trim()
    )
}

/**
 * @param {boolean} isDevMode
 * @return {{FAKE_ADVICE_DELAY: number, FAKE_ADVICE: boolean}}
 */
function forceFakeAdvice(isDevMode) {
    require("dotenv").config()

    const force_fake_advice = _parseBoolean(
        process.env.FORCE_FAKE_ADVICE,
        false
    )

    const FAKE_ADVICE = (() => {
        if (force_fake_advice) {
            return true
        }
        if (!isDevMode) {
            return false
        }
        return _parseBoolean(process.env.FAKE_ADVICE, false)
    })()
    const FAKE_ADVICE_DELAY = (() => {
        const res = parseInt(process.env.FAKE_ADVICE_DELAY)
        return isNaN(res) ? 500 : res
    })()

    return {
        FAKE_ADVICE,
        FAKE_ADVICE_DELAY,
    }
}

module.exports = forceFakeAdvice
