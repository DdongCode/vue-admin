import {getMenusRequest} from '../api/permissionApi';
import Home from "../views/Home";
import {_import} from "../api/api";

export const getDRoutes = state => {
    //
    // getMenusRequest().then(data => {
    //     let {msg, code, menus} = data;
    //     if (code === 200) {
    //         //将正常的路由配置存储进vuex
    //         state.dynamicRoutes = filterAsyncRouter(menus)
    //     }
    // })
    return state.dynamicRoutes
}
