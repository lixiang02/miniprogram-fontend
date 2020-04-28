const config = require('../config/local.json')
const rq = require('../lib/request')
const TokenServer = require('./access-token')

class DbServer extends TokenServer {
    async requestBase({ url='', method='get', query='' }) {
        try {
            const { access_token } = await this.getAccessToken()

            const options = {
                method,
                url: `${config.BaseUrl}${url}`,// /tcb/databasequery
                params: { 
                    access_token,
                },
                data: {
                    env: config.env,
                    query
                }
            }
            const result = await rq(options);
            if (result.errcode === 0 && result.data) {
                return result
            }
            throw new Error(result)
        } catch (error) {
            throw new Error(error)
        }
    }

    async select({ query }) {
        try {
            return await this.requestBase({ 
                url: '/tcb/databasequery',
                query,// "db.collection(\"geo\").where({done:true}).limit(10).skip(1).get()"
                method: 'post'
            });
        } catch (error) {
            throw new Error(error)
        }
    }

    async update({ query }) {
        try {
            return await this.requestBase({ 
                url: '/tcb/databaseupdate',
                query,// "db.collection(\"geo\").where({age:14}).update({data:{age: _.inc(1)}})"
                method: 'post'
            });
        } catch (error) {
            throw new Error(error)
        }
    }

    async delete({ query }) {
        try {
            return await this.requestBase({ 
                url: '/tcb/databasedelete',
                query,//  "db.collection(\"geo\").where({done:false}).remove()"
                method: 'post'
            });
        } catch (error) {
            throw new Error(error)
        }
    }

    async add({ query }) {
        try {
            return await this.requestBase({ 
                url: '/tcb/databaseadd',
                query,
                method: 'post'
            });
            // "db.collection(\"geo\").add({
            //     data: [{
            //       description: \"item1\",
            //       due: new Date(\"2019-09-09\"),
            //       tags: [
            //         \"cloud\",
            //         \"database\"
            //       ],
            //       location: new db.Geo.Point(113, 23),
            //       done: false
            //     },
            //     {
            //       description: \"item2\",
            //       due: new Date(\"2019-09-09\"),
            //       tags: [
            //         \"cloud\",
            //         \"database\"
            //       ],
            //       location: new db.Geo.Point(113, 23),
            //       done: false
            //     }
            //     ]
            //   })"
        } catch (error) {
            throw new Error(error)
        }
    }

    async count({ query }) {
        try {
            return await this.requestBase({ 
                url: '/tcb/databasecount',// "db.collection(\"geo\").where({done:true}).count()"
                query,
                method: 'post'
            });
        } catch (error) {
            throw new Error(error)
        }
    }

    async aggregate({ query }) {
        try {
            return await this.requestBase({ 
                url: '/tcb/databaseaggregate',// "db.collection(\"test_collection\").aggregate().match({tags:\"cloud\"}).limit(10).end()"
                query,
                method: 'post'
            });
        } catch (error) {
            throw new Error(error)
        }
    }

    async getTablesInfo() {
        try {
            return await this.requestBase({ 
                url: '/tcb/databasecollectionget',
                method: 'post'
            });
        } catch (error) {
            
        }
    }
}

module.exports = new DbServer()

// async function main() {
//     const s = new DbServer()
//     const result = await s.selectTable()
//     console.log('---result--', result)
// }
// main()