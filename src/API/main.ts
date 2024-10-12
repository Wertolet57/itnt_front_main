import axios from 'axios'

export const API = axios.create({
    baseURL: 'http://62.217.181.172:8080/api',
    responseType: 'json',
    headers: {
        'X-Custom-Header': 'foobar',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
})

// export const socket = axios.create({
//     baseURL: 'ws://62.217.181.172:8080/9/5',
//     responseType: 'json',
//     headers: {
//         'X-Custom-Header': 'foobar',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('userToken')}`,
//     },
// })