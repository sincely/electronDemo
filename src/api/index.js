import axios from 'axios'
import { GITLAB_URL, PRIVATE_TOKEN } from './base'

const config = {
    timeout: 3000,
    headers: {
        'Accept': 'application/json;charset=utf-8',
        'Content-Type': 'application/json;charset=utf-8',
    },
}

const request = axios.create(config);

request.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

request.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

const joinUrl = (url = "") => {
    return url = url.startsWith('http') ? url : `${GITLAB_URL}${url}`
}

const DEFAULT_PARAM = {
    private_token: PRIVATE_TOKEN
}

export class Http {
    static async get(url, params) {
        try {
            url = joinUrl(url)
            let res = await request.get(url, {params})
            return res.data
        } catch (error) {
            return error
        }
    }
    static async post(url, params) {
        try {
            url = joinUrl(url)
            let res = await request.post(url, params)
            return res.data
        } catch (error) {
            return error
        }
    }
    static async delete(url, params) {
        try {
            url = joinUrl(url)
            let res = await request.delete(url, { data: params })
            return res.data
        } catch (error) {
            return error
        }
    }
}

export class GITLAB {
    static async get(url, params) {
        try {
            url = `${GITLAB_URL}${url}`
            let {data, headers, status} = await request.get(url, {
                params:{
                    ...DEFAULT_PARAM,
                    ...params
                }
            })
            let res = {data,status}
            if(headers["x-total"] !== undefined){
                res.total = headers["x-total"]
            }
            return res
        } catch (error) {
            return error
        }
    }
}