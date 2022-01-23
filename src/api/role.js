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

//添加角色
export const RoleAddRequest = (params)=>{
    return axios.request({
        url: `${BASE_URL}/addRole`,
        method: 'post',
        data:{
            ...params
        }
    }).then(res => res.data);
}

//编辑角色
export const RoleEditRequest = (params)=>{
    return axios.request({
        url: `${BASE_URL}/editRole`,
        method: 'post',
        data:{
            ...params
        }
    }).then(res => res.data);
}

//删除角色
export const RoleDelRequest = (roleId)=>{
    return axios.delete(`${BASE_URL}/deleteRole`,{
        params:roleId
    }).then(res => res.data)
}

//为角色分配权限
export const AssigningPermissionsRequest = (roleId,permissionIds)=>{
    return axios.request({
        url:`${BASE_URL}/AssigningPermissions`,
        method:'post',
        params:{
            roleId,
            permissionIds
        }
    }).then(res => res.data)
}

