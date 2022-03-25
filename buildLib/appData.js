const path = require("path")
const fs = require("fs")

/**
 * @typedef {{}} AppDataLinkRef
 * @property {string} name
 * @property {string} link
 *
 * @typedef {{}} AppData
 * @property {string} title
 * @property {AppDataLinkRef} [user]
 * @property {AppDataLinkRef} [sourceCode]
 */

/**
 * @typedef {{}} PackageDataPeopleObject
 * @param {string} name
 * @param {string} [email]
 * @param {string} [url]
 *
 * @typedef {PackageDataPeopleObject|string} PackageDataPeople
 *
 * @typedef {{}} PackageData
 * @property {string} [name]
 * @property {string} [description]
 * @property {PackageDataPeople} [author]
 */

/**
 * @typedef {{}|null|undefined} _Data
 */

/**
 * @type {_Data}
 */
let _packageData

/**
 * @type {_Data}
 */
let _appData

/**
 * @function
 * @param {string} filename
 * @param {string} [directory]
 * @return {string|null} Full path or null if not found
 *
 * @private
 **/
const _searchFileUpwards = (filename, directory = __dirname) => {
    const res = path.resolve(directory, filename)
    if (fs.existsSync(res)) {
        return res
    }

    const nextDir = path.resolve(directory, "..")

    if (nextDir === path.resolve("/")) {
        return null
    }

    return _searchFileUpwards(filename, nextDir)
}

/**
 * @function
 * @param {string} filePath
 * @return {{}} parsed json object
 *
 * @private
 **/
const _getParsedDataFromResolvedFilePath = (filePath) => {
    const rawData = fs.readFileSync(filePath).toString()
    return JSON.parse(rawData)
}

/**
 * @function
 * @param {string} baseFilename
 * @return {{}|null} parsed json object
 *
 * @private
 **/
const _getParsedData = (baseFilename) => {
    const filePath = _searchFileUpwards(baseFilename)
    if (!filePath) {
        return null
    }

    return _getParsedDataFromResolvedFilePath(filePath)
}

/**
 * @function
 * @return {PackageData|null} parsed json object or null if not found
 *
 * @private
 **/
const _getPackageData = () => {
    if (_packageData !== undefined) {
        return _packageData
    }

    return (_packageData = _getParsedData("package.json"))
}

/**
 * @function
 * @return {AppData|null} parsed json object or null if not found
 *
 * @private
 **/
const _getAppData = () => {
    if (_appData !== undefined) {
        return _appData
    }

    return (_appData = _getParsedData("appData.json"))
}

/**
 * @function
 * @param {string} title
 * @param {AppDataLinkRef} [user]
 * @param {AppDataLinkRef} [sourceCode]
 * @return {AppData}
 *
 * @private
 **/
const _buildData = (title, user, sourceCode) => {
    return {
        title,
        ...(user ? { user } : {}),
        ...(sourceCode ? { sourceCode } : {}),
    }
}
// -------------------- title
/**
 * @function
 * @return {string|null}
 *
 * @private
 **/
const _getTitleFromPackage = () => {
    const packageData = _getPackageData()
    return packageData?.description || packageData?.name || null
}

/**
 * @function
 * @return {string|null}
 *
 * @private
 **/
const _getTitleFromAppData = () => {
    return _getAppData()?.title || null
}

/**
 * @function
 * @return {string}
 *
 * @private
 **/
const _getDefaultTitle = () => {
    return path.basename(process.cwd())
}

/**
 * @function
 * @return {string}
 *
 * @private
 **/
const _getTitle = () => {
    return (
        _getTitleFromAppData() || _getTitleFromPackage() || _getDefaultTitle()
    )
}
// ---------------------------------

// --------------- user
/**
 * @function
 * @param {string} rawAuthor
 * @return {AppDataLinkRef}
 *
 * @private
 **/
const _parseAuthor = (rawAuthor) => {
    // console.log(rawAuthor.match(/^(.*?)(\s*<(.+8.+?)>)?/))
    const emailRegExpr = /\s*<(.+@.+?)>\s*/
    const emailMatch = rawAuthor.match(emailRegExpr)
    let rest = rawAuthor
    let email, url
    if (emailMatch) {
        rest = rest.replaceAll(new RegExp(emailRegExpr, "g"), "")
        email = emailMatch[1].trim()
    }

    const urlRegExpr = /\s*\((https?:\/\/.+?)\)\s*/
    const urlMatch = rest.match(urlRegExpr)
    if (urlMatch) {
        rest = rest.replaceAll(new RegExp(urlRegExpr, "g"), "")
        url = urlMatch[1].trim()
    }

    const emailLink = email ? `mailto:${email}` : undefined

    const name = rest.trim()
    const link = url || emailLink

    return {
        ...(name ? { name } : {}),
        ...(link ? { link } : {}),
    }
}

/**
 * @function
 * @return {AppDataLinkRef|null}
 *
 * @private
 **/
const _getUserFromPackage = () => {
    const packageData = _getPackageData()
    if (!packageData || !packageData.author) {
        return null
    }

    if (typeof packageData.author === "string") {
        return _parseAuthor(packageData.author)
    }

    if (typeof packageData.author !== "object") {
        return null
    }

    const link = packageData.author.url || packageData.author.email
    const name = packageData.author.name || link

    if (!name && !link) {
        return null
    }

    return {
        name,
        link,
    }
}

/**
 * @function
 * @return {AppDataLinkRef|null}
 *
 * @private
 **/
const _getUserFromAppData = () => {
    const appData = _getAppData()

    const link = appData?.user?.link || null
    const name = appData?.user?.name || link

    if (!link && !name) {
        return null
    }

    return {
        name,
        link,
    }
}

/**
 * @function
 * @return {AppDataLinkRef|null}
 *
 * @private
 **/
const _getUser = () => {
    return _getUserFromAppData() || _getUserFromPackage()
}
// ---------------------------------

// -----------------------sourceCode
/**
 * @function
 * @param {string} link
 * @return {string}
 * @private
 */
const _guessNameFromLink = (link) => {
    const uri = new URL(link)

    if (uri.hostname.endsWith("github.com")) {
        return "GitHub"
    }

    if (uri.hostname.match(/gitlab\.(com|org)$/)) {
        return "GitLab"
    }

    return link
}

/**
 * @function
 * @return {AppDataLinkRef|null}
 *
 * @private
 **/
const _getSourceCodeFromPackage = () => {
    const packageData = _getPackageData()
    if (!packageData) {
        return null
    }
    const repository = packageData.repository

    if (!repository) {
        return null
    }

    if (typeof repository === "string") {
        return {
            name: _guessNameFromLink(repository),
            link: repository,
        }
    }

    if (typeof repository !== "object") {
        return null
    }

    if (!repository.url) {
        return null
    }

    const link = repository.url

    const name = _guessNameFromLink(link)

    return {
        name,
        link,
    }
}

/**
 * @function
 * @return {AppDataLinkRef|null}
 *
 * @private
 **/
const _getSourceCodeFromAppData = () => {
    const appData = _getAppData()
    if (!appData) {
        return null
    }

    const link = appData?.sourceCode?.link
    if (!link) {
        return null
    }
    const name = appData?.sourceCode?.name || _guessNameFromLink(link)

    return {
        name,
        link,
    }
}
/**
 * @function
 * @return {AppDataLinkRef|null}
 *
 * @private
 **/
const _getSourceCode = () => {
    return _getSourceCodeFromAppData() || _getSourceCodeFromPackage()
}
// ---------------------------------

const appData = _buildData(_getTitle(), _getUser(), _getSourceCode())

module.exports = appData
