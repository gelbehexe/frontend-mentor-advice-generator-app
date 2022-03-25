function getRandom(min, max) {
    const rawRes = Math.random() * (max - min) + min
    const useFloor = Math.random() < 0.5
    return useFloor ? Math.floor(rawRes) : Math.ceil(rawRes)
}

function formatError(msg, prefix = null) {
    return prefix ? `${prefix}: ${msg}` : msg
}

export { getRandom, formatError }
