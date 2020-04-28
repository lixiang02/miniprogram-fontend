const config = require('../config/local.json')
const rq = require('../lib/request')
const TokenServer = require('./access-token')

class FileServer extends TokenServer {
    async uploadFile({ path, file }) {
        try {
            const {
                url,
                token: xCosSecurityToken,
                authorization: Signature,
                file_id,
                cos_file_id: xCosMetaFileid
            } = await this.getUploadFileUrl({ path });

            const options = {
                method: 'post',
                url,
                data: {
                    key: path,
                    Signature,
                    'x-cos-security-token': xCosSecurityToken,
                    'x-cos-meta-fileid': xCosMetaFileid,
                    file // 文件的二进制内容
                }
            }
            const result = await rq(options);
            console.log('---上传图片--')
            // if (result.errcode !== 0) {
            //     throw new Error(`GET UploadFile Fail : ${result}`)
            // }
            return { result, fileId: file_id }
        } catch (error) {
          throw new Error(error)
        }
    }

    async getUploadFileUrl({ path }) {
        
        try {
            const { access_token } = await this.getAccessToken();
            const options = {
                method: 'post',
                url: `${config.BaseUrl}/tcb/uploadfile`,
                params: { 
                    access_token,
                },
                data: {
                    env: config.env,
                    path // "path": "this/is/a/example/file.path"
                }
            }
            const result = await rq(options);
            if (result.errcode !== 0) {
                throw new Error(`GET UploadFile Fail : ${result}`)
            }
            return result
            // {
            //     "errcode": 0,
            //     "errmsg": "ok",
            //     "url": "https://cos.ap-shanghai.myqcloud.com/7465-test2-4a89da-1258717764/testupload",
            //     "token": "Cukha70zkXIBqkh1OhUIFqjUmXLXeSWq7dff61099221bb270522b8e0cf21d72e0aWCfGXEIDT5bKVJgykFFr9_MeQ-ExrsZ8oiFdMwyYag8h0r-EJq_EaO94KzksxH6bAeb4Y7SwZjJqoy_4g1Na797F1IEG9Dnstm_rz02AgaP5HbJwt1P-XHT4Xjw_lafla079gtQKAP-EPbE5Tc8BRXIm32esjGDDDuDyml7IJqbsPolYZ4-CHQsisdx488loGAN4f7YRMkrrP1Pgi5XOm0-iG5HbWd3tHtuE2pzsGkTobO_fyz2PfSPaeUt_735ll38yIWpAFESAsZnBj2DcRSPBT2FJ_s5mOZACS53q6-tWXPO0AR3-EhOCQpiDKsldVsCxz00Uwhgm1T6Ozw777fJEFkUIngUdZ5yajy3LA84Mpfu6CLkFjfiBtz3wpmcCQxhijo_CrVHkmaMc2JBQ",
            //     "authorization": "q-sign-algorithm=sha1&q-ak=AKID98EDB528Sfqerp0Z_7l23we-u4Avrx04te9VvlzGihMTseysMgu7iSdh_hxEnoAy&q-sign-time=1557307130;1557308030&q-key-time=1557307130;1557308030&q-header-list=&q-url-param-list=&q-signature=ac95227b67a04157bb5e49b435c6ac3ce88e03f2",
            //     "file_id": "cloud://test2-4a89da.7465-test2-4a89da-1258717764/testupload",
            //     "cos_file_id": "HDze32/qZENCwWi5N5akgoXSv3U8DsccKaqCxTMGs0zFgvlD28j484/VYFPJ1l2QDh0Qy8wNbQCpxs5zEsLJln1lIY9RGYn1LzRQQQYFQm+Xwvw6S4YEZN1AIwY906mwIBgiI3gKGkU2K1+1ZEnEYEM4Uh/C1JxB4Q=="
            // }
        } catch (error) {
          throw new Error(error)
        }
    }

    async batchDownloadFile(fileList = []) {
        fileList = fileList.filter(e => e.fileId && e.maxAge && e.maxAge > 0).map(e => ({ fileid: e.fileId, max_age: e.maxAge }))

        if (!fileList.length) { return [] }

        try {
            const { access_token } = await this.getAccessToken();
            const options = {
                method: 'post',
                url: `${config.BaseUrl}/tcb/batchdownloadfile`,
                params: { 
                    access_token,
                },
                data: {
                    env: config.env,
                    file_list: fileList // "path": "this/is/a/example/file.path"
                }
            }
            const result = await rq(options);
            if (result.errcode !== 0) {
                throw new Error(`GET BatchDownloadFile Fail : ${result}`)
            }
            return result.file_list
            // [{
            //      "fileid": "cloud://test2-4a89da.7465-test2-4a89da/A.png",
            //      "download_url": "https://7465-test2-4a89da-1258717764.tcb.qcloud.la/A.png",
            //      "status": 0,
            //      "errmsg": "ok"
            // }]
        } catch (error) {
            throw new Error(error)
        }

    }

    async batchDeleteFile(fileIdList) {
        fileIdList = fileIdList.filter(Boolean)
        if (!fileIdList.length) { return [] }

        try {
            const { access_token } = await this.getAccessToken();
            const options = {
                method: 'post',
                url: `${config.BaseUrl}/tcb/batchdeletefile`,
                params: { 
                    access_token,
                },
                data: {
                    env: config.env,
                    fileid_list: fileIdList // "path": "this/is/a/example/file.path"
                }
            }
            const result = await rq(options);
            if (result.errcode !== 0) {
                throw new Error(`GET BatchDeleteFile Fail : ${result}`)
            }
            return result.delete_list
            // [{
            //      "fileid": "cloud://test2-4a89da.7465-test2-4a89da/A.png",
            //      "status": 0,
            //      "errmsg": "ok"
            // }]
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = new FileServer()