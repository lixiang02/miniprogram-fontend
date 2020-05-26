const axios = require('axios');

const BaseUrl = 'http://ldx520.top'
const defaultOptions = {
    method: 'get',
    url: BaseUrl
}

module.exports = async function fetchLocal(options) {
    try {
        if (options.url && !/^http:\/\/localhost/.test(options.url)) {
            options.url = `${defaultOptions.url}${options.url}`
        }
        const response = await axios(Object.assign({}, defaultOptions, options));
        if (response && response.status === 200 && response.statusText === 'OK' && response.data) {
            return processAfterFetch(response.data)
        }
        throw new Error(response)
    } catch (error) {
        throw new Error(error)
    }
}

function processAfterFetch(data) {
    if (data && data.code === 0) {
        return data.data
    }
    return data
}