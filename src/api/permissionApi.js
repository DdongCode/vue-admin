import axios from 'axios';

const BASE_URL = '/jamscoco/permission'

//获取导航菜单
export const getMenusRequest = ()=>{
    return axios.get(`${BASE_URL}/getMenu`).then(res => res.data)
}
