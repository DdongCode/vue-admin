import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'

import axios from 'axios'
axios.defaults.baseURL = '/api'  //自动附加在所有axios请求前面，则可以省略/api，直接写'/xxxx/xxx'。否则需要设置'/api/xxxx/xxx'
axios.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('user')
  if (token){
    //添加请求头H_token
    config.headers.common['H_token'] =  token
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

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login/login' || to.path == '/login/register') {
    sessionStorage.removeItem('user');
  }
  let user = sessionStorage.getItem('user');
  if (!user && to.path != '/login/login' && to.path != '/login/register') {
    next({ path: '/login/login' })
    if (to.path !='/'){
      alert("登录过期，请重新登录")
    }
  } else {
    next()
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

