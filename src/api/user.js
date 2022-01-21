import axios from 'axios';

const BASE_URL = '/jamscoco/user'

//获取用户信息
export const UserInfoRequest = ()=>{
    return axios.get(`${BASE_URL}/getUserInfo`).then(res => res.data)
}

//获取用户权限
export const UserPermissionRequest = ()=>{
    return axios.get(`${BASE_URL}/getUserPermission`).then(res => res.data)
}

//获取用户列表
export const UserListRequest = (queryname)=>{
    return axios.get(`${BASE_URL}/getUserList`,{
        params:queryname
    }).then(res => res.data)
}

//添加用户
export const UserAddRequest = (params)=>{
    return axios.request({
        url: `${BASE_URL}/addUser`,
        method: 'post',
        data:{
            ...params
        }
    }).then(res => res.data);
}

//编辑用户
export const UserEditRequest = (params)=>{
    return axios.request({
        url: `${BASE_URL}/editUser`,
        method: 'post',
        data:{
            ...params
        }
    }).then(res => res.data);
}

//删除用户
export const UserDelRequest = (userId)=>{
    return axios.delete(`${BASE_URL}/deleteUser`,{
        params:userId
    }).then(res => res.data)
}

//为用户分配角色
export const AssigningRolesRequest = (userId,roleIds)=>{
    return axios.request({
        url:`${BASE_URL}/AssigningRoles`,
        method:'post',
        params:{
            userId,
            roleIds
        }
    }).then(res => res.data)
}
