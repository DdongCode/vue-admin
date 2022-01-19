import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './router/routes'
import {createRouter} from "./router/routes";
import 'font-awesome/css/font-awesome.min.css'
import {getMenusRequest} from './api/permissionApi';


import axios from 'axios'
import Home from "./views/Home";
import {_import} from "./api/api";

axios.defaults.baseURL = '/api'  //自动附加在所有axios请求前面
axios.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('user')
    if (token) {
        //添加请求头H_token
        config.headers.common['H_token'] = token
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)


const router = new VueRouter({
    routes
})

//路由前置拦截
router.beforeEach((to, from, next) => {
    if (to.path === '/login/login' || to.path === '/login/register') {
        sessionStorage.removeItem('user');
    }
    let user = sessionStorage.getItem('user');
    //存在动态权限路由的时候添加路由
    if (user) {
        if (store.getters.getDRoutes.length > 0) {
            router.matcher = createRouter(routes).matcher
            router.addRoutes([...routes,...store.getters.getDRoutes])
            routerGo(user, to, next)
        } else {
            getMenusRequest().then(data => {
                let {msg, code, menus} = data;
                if (code === 200) {
                    let notFound = {
                        path: '*',
                        hidden: true,
                        redirect: '/404'
                    }
                    let asyncRouter = filterAsyncRouter(menus);
                    //404规则最后加入
                    asyncRouter.push(notFound)
                    //将正常的路由配置存储进vuex
                    store.dispatch('store_d_routes', asyncRouter)
                    router.matcher = createRouter(routes).matcher
                    router.addRoutes([...routes,...store.getters.getDRoutes])
                    routerGo(user, to, next)
                }
            })
        }
    } else {
        routerGo(user, to, next)
    }

})

function routerGo(user, to, next) {
    if (!user && to.path !== '/login/login' && to.path !== '/login/register') {
        next({path: '/login/login'})
        if (to.path !== '/') {
            alert("登录过期，请重新登录")
        }
    } else {
        if (to.path === '/') {
            next({path: '/main'})
        }else {
            if (to.matched.length === 0) {
                next({path: to.path})
            } else {
                next()
            }
        }
    }
}

function filterAsyncRouter(menus) {
    return menus.filter(memu => {
        if (memu.path === '/') {
            memu.component = Home
        } else {
            let component = memu.component
            memu.component = () => _import(component)
        }
        if (memu.children) {
            memu.children = filterAsyncRouter(memu.children)
        }
        return true
    })
}


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

