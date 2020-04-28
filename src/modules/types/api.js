const fetch = require('../../lib/request-local')

export async function getList() {
    return await fetch({
        url: '/types/list',
        params: {
            // limit: 11
        }
    })
    // return await fetch()// 'db.collection(\'product\').limit(10).get()'
}

export async function getItem(id) {
    return await fetch({
        url: `/types/${id}`,
        method: 'GET'
    })
}

export async function updateItem(params) {
    return await fetch({
        url: `/types/${params.id}`,
        method: 'PUT',
        data: params
    })
}

export async function addItem(params) {
    return await fetch({
        url: `/types`,
        method: 'POST',
        data: params
    })
}

export async function deleteItem(id) {
    return await fetch({
        url: `/types/${id}`,
        method: 'DELETE'
    })
}