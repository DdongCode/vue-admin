import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import login from "./views/index/login";
import register from "./views/index/register";

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,
        children: [
            {
                path: 'login',
                component: login
            },
            {
                path: 'register',
                component: register
            }
        ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '导航一',
        icon: 'el-icon-message',//图标
        children: [
            { path: '/main', component: Main, name: '主页',icon: 'el-icon-message'},
            { path: '/table', component: Table, name: 'Table',icon: 'el-icon-message'},
            { path: '/form', component: Form, name: 'Form',icon: 'el-icon-message' },
            { path: '/user', component: user, name: '列表',icon: 'el-icon-message' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        icon: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4',icon: 'el-icon-message' },
            { path: '/page5', component: Page5, name: '页面5',icon: 'el-icon-message' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        icon: 'fa fa-address-card',//图标
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三',icon: 'el-icon-message' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        icon: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts',icon: 'el-icon-message' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
