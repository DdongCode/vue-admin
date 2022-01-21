import axios from 'axios';

const BASE_URL = '/jamscoco/role'

//获取用户角色
export const RoleGetRequest = (userId)=>{
    return axios.get(`${BASE_URL}/getRolesByUserId`,{
        params:userId
    }).then(res => res.data)
}

//获取所有角色
export const RoleAllRequest = ()=>{
    return axios.get(`${BASE_URL}/getAllRoles`).then(res => res.data)
}
