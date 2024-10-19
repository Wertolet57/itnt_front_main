import axios from 'axios'

export const API = axios.create({
    baseURL: 'https://itnt.store/api',
    responseType: 'json',
    headers: {
        'X-Custom-Header': 'foobar',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
})