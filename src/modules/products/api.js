const fetch = require('../../lib/request-local')

export async function getList() {
    return await fetch({
        url: '/product/list',
        params: {
            // limit: 11
        }
    })
    // return await fetch()// 'db.collection(\'product\').limit(10).get()'
}

export async function getItem(id) {
    return await fetch({
        url: `/product/${id}`,
        method: 'GET'
    })
}

export async function updateItem(params) {
    return await fetch({
        url: `/product/${params.id}`,
        method: 'PUT',
        data: params
    })
}

export async function addItem(params) {
    return await fetch({
        url: `/product`,
        method: 'POST',
        data: params
    })
}

export async function deleteItem(id) {
    return await fetch({
        url: `/product/${id}`,
        method: 'DELETE'
    })
}

export async function getTypes() {
    return await fetch({
        url: '/types/list/all',
        method: 'GET'
    })
}

export async function getImages(params) {
    return await fetch({
        url: '/images/list/all',
        method: 'GET',
        params
    })
}

// export async function fetchUpload(params) {
//     return await fetch({
//         url: '/files/upload',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         },
//         file: params.file
//     })
// }