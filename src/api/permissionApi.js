import axios from 'axios';

const BASE_URL = '/jamscoco/permission'

//获取导航菜单
export const getMenusRequest = ()=>{
    return axios.get(`${BASE_URL}/getMenu`).then(res => res.data)
}

//获取用户角色
export const PermissionGetRequest = (roleId)=>{
    return axios.get(`${BASE_URL}/getPermissionsByRoleId`,{
        params:roleId
    }).then(res => res.data)
}

//获取权限树
export const PermissionTreeRequest = ()=>{
    return axios.get(`${BASE_URL}/getPermissionsTree`).then(res => res.data)
}

//添加/编辑权限
export const PermissionAddOrEditRequest = (params)=>{
    return axios.request({
        url: `${BASE_URL}/addOrEdit`,
        method: 'post',
        data:{
            ...params
        }
    }).then(res => res.data);
}

//删除权限
export const PermissionDelRequest = (permissionId)=>{
    return axios.delete(`${BASE_URL}/delete`,{
        params:permissionId
    }).then(res => res.data)
}

