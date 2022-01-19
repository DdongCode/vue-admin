import VueRouter from "vue-router";
let routes = [
    {
        path: '/login',
        component: () => import('@/views/Login'),
        hidden: true,
        children: [
            {
                path: 'login',
                component: ()=>import('@/components/index/login')
            },
            {
                path: 'register',
                component: ()=>import('@/components/index/register')
            }
        ]
    },
    {
        path: '/404',
        component: () =>import('@/views/404'),
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: ()=>import('@/views/Home'),
        name: '',
        icon: 'el-icon-message',//图标
        leaf: true,
        children: [
            { path: '/main', component: ()=>import('@/components/Main'), name: '首页',icon: 'el-icon-message'},
        ]
    },
];

export default routes

export const createRouter  = d_routes =>  new VueRouter({
    d_routes
})
