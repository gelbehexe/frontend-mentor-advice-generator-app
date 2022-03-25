import { adviceStorage } from "@/lib/adviceStorage"

const FETCH_URL = "https://api.adviceslip.com/advice"

async function fetchAdvice() {
    const url = new URL(FETCH_URL)

    const headers = new Headers()
    headers.append("Accept", "application/json")

    // noinspection JSCheckFunctionSignatures
    const res = await fetch(url, {
        method: "GET",
        headers,
    }).then((res) => res.json())

    if (res.message) {
        throw res.message
    }

    if (!res.slip) {
        throw "Unexpected response from server"
    }

    let { id, advice } = { ...res.slip }

    // fix trashy chars
    advice = advice.replaceAll("â€˜", "'")

    return {
        id,
        advice,
    }
}

async function loadAdvice() {
    try {
        const slip = await fetchAdvice()
        try {
            await adviceStorage.store(slip)
        } catch (err) {
            console.warn(err)
        }
        return slip
    } catch (err) {
        console.warn(
            "Error fetching advice - try to get it from local storage",
            err
        )

        return await adviceStorage.getRandomSlip()
    }
}

const adviceProvider = {
    loadAdvice,
}

export { adviceProvider as default, loadAdvice }
