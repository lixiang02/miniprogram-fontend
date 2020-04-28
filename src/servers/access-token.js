const config = require('../config/local.json')
const rq = require('../lib/request')

class TokenServer {
    async getAccessToken() {
        try {
            const options = {
                method: 'get',
                url: 'https://api.weixin.qq.com/cgi-bin/token',
                params: {
                    grant_type: config.grant_type,
                    appid: config.appid,
                    secret: config.secret
                }
            }
            return await rq(options);
        } catch (error) {
          throw new Error('FAIL TO GET ACCESS TOKEN: ', error)
        }
    }
}

module.exports = TokenServer