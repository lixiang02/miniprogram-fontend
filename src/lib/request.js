const axios = require('axios');

const defaultOptions = {
    method: 'get',
    url: ''
}


module.exports = async function fetch(options, errorMessage) {
    try {
        const response = await axios(Object.assign({}, defaultOptions, options));
        if (response && response.status === 200 && response.statusText === 'OK' && response.data) {
            return response.data
        }
        throw new Error(response)
    } catch (error) {
        if (errorMessage) {
            error.message = (error.message || '').concat(' \n', errorMessage)
        }
        throw new Error(error)
    }
}