import axios from 'axios';
import * as url from "url";

//登录
export const requestLogin = params => {
    return axios.request({
        url: '/login',
        method: 'POST',
        params: params
    }).then(res => res.data);
};

//注销
export const requestLogout = () => {
    return axios.request({
            url: 'logout',
            method: 'post',
        }
    ).then(res => res.data);
}



