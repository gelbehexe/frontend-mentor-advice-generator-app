import { formatError } from "@/lib/tools"

const _VERSION = 7
// noinspection JSUnresolvedVariable
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction || { READ_WRITE: "readwrite" }

// noinspection JSUnresolvedVariable
window.IDBKeyRange =
    window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    // noinspection JSUnresolvedVariable
    window.indexedDB =
        window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
}

let _indexedDB = window.indexedDB || null

function _formatRequestError(request, prefix = null) {
    const msg = `(${request.errorCode}) ${request.error}`

    return formatError(msg, prefix)
}

/**
 *
 * @param {{}} object
 * @param {string} method
 * @param params
 * @return {Promise<unknown>}
 */
function _getRequestResult(object, method, ...params) {
    return new Promise((resolve, reject) => {
        const request = object[method].call(object, ...params)

        let timeoutReached = true

        request.onerror = () => {
            timeoutReached = false
            reject(_formatRequestError(request))
        }

        request.onsuccess = () => {
            timeoutReached = false
            resolve(request.result)
        }

        setTimeout(() => {
            if (timeoutReached) {
                reject("Timeout")
            }
        }, 10000)
    })
}

function _removeOldStoreIfExists(db, storeName) {
    if (!db.objectStoreNames.contains(storeName)) {
        return db
    }
    try {
        db.deleteObjectStore(storeName)
        return db
    } catch (err) {
        throw formatError(err, `Error deleting object store "${storeName}"`)
    }
}

function _removeOldStoresIfExists(db) {
    _removeOldStoreIfExists(db, "advice")
}

function _getDb() {
    return new Promise((resolve, reject) => {
        const request = _indexedDB?.open("AdviceDatabase", _VERSION)
        if (!request) {
            resolve(null)
            return
        }
        request.onerror = () => {
            reject(_formatRequestError(request, "Error opening database"))
        }

        request.onsuccess = () => {
            if (request.result.version === _VERSION) {
                resolve(request.result)
            }
        }

        request.onupgradeneeded = () => {
            const db = request.result

            try {
                _removeOldStoresIfExists(db)
                const store = db.createObjectStore("advices")
                store.createIndex("id", "id", { unique: true })
                resolve(db)
            } catch (err) {
                reject(err)
            }
        }
    })
}

async function _getStore(mode) {
    if (!_indexedDB) {
        return null
    }

    const db = await _getDb()
    if (!db) {
        return null
    }

    const transaction = db.transaction("advices", mode)

    return transaction.objectStore("advices")
}

/**
 * @param {{id: number, advice: string}} slip
 * @return {Promise<{advice, id}>}
 */
async function store(slip) {
    const store = await _getStore("readwrite")
    if (!store) {
        return null
    }

    const { id } = slip

    const count = await _getRequestResult(store, "count", id)

    if (count) {
        return slip
    }

    store.add(slip, id)

    return slip
}

async function getRandomSlip() {
    const store = await _getStore("readonly")

    if (!store) {
        throw "Browser does not support local storage"
    }

    /**
     * @type {[number]}
     */
    const allKeys = await _getRequestResult(store, "getAllKeys")

    if (allKeys.length === 0) {
        throw "No stored advices found"
    }

    const randomId = allKeys.sort(() => Math.random() - 0.5)[0]

    return await _getRequestResult(store, "get", randomId)
}

export const adviceStorage = {
    store,
    getRandomSlip,
}
