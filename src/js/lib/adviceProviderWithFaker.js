import { faker } from "@faker-js/faker"

let _fake_delay = process.env.FAKE_ADVICE_DELAY || 1500

function _createFakedSlip(faker) {
    const id = faker.datatype.number()
    const advice = faker.lorem.sentence()

    return {
        id,
        advice,
    }
}

function _getFakedSlip() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(_createFakedSlip(faker))
        }, _fake_delay)
    })
}

async function loadAdvice() {
    return await _getFakedSlip()
}

const adviceProvider = {
    loadAdvice,
}

export { adviceProvider as default, loadAdvice }
