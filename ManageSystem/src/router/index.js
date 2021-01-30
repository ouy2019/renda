import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/product'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/recruit',  //人才招聘
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/recruit.vue'),
                    meta: { title: '人才招聘' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: '系统消息' }
                },
                {
                    path: '/field', //领域分类管理
                    component: () => import(/* webpackChunkName: "field" */ '../components/page/field.vue'),
                    meta: { title: '领域分类管理' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 产品分类管理
                    path: '/productclass',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/productClass.vue'),
                    meta: { title: '产品分类管理' }
                },
				{
                    // 产品分类管理
                    path: '/productFeature',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/productFeature.vue'),
                    meta: { title: '产品分类管理' }
                },
				
                {
                    // 文章设置
                    path: '/article',
                    component: () => import(/* webpackChunkName: "article" */ '../components/page/article.vue'),
                    meta: { title: '设置' }
                },
                {
                    // 轮播图
                    path: '/rotation',
                    component: () => import(/* webpackChunkName: "rotation" */ '../components/page/rotation.vue'),
                    meta: { title: '轮播图列表' }
                },
                {
                    // 轮播图分类
                    path: '/fenlei',
                    component: () => import(/* webpackChunkName: "fenlei" */ '../components/page/fenlei.vue'),
                    meta: { title: '分类' }
                },
                {
                    // 服务支持
                    path: '/service',
                    component: () => import(/* webpackChunkName: "service" */ '../components/page/service.vue'),
                    meta: { title: '产品常见回答' }
                },
				{
				    // 服务支持
				    path: '/data',
				    component: () => import(/* webpackChunkName: "data" */ '../components/page/data.vue'),
				    meta: { title: '资料下载&培训材料' }
				},
                {
                    // 公司简介
                    path: '/brief',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/brief.vue'),
                    meta: { title: '公司简介', permission: true }
                },
                {
                    path: '/product', //产品
                    component: () => import(/* webpackChunkName: "product" */ '../components/page/product.vue'),
                    meta: { title: '产品列表' }
                },
                {
                    path: '/setup',  // 产品
                    component: () => import(/* webpackChunkName: "setup" */ '../components/page/productShow.vue'),
                    meta: { title: '首页展示控制' }
                },
                {
                    path: '/donate',   //文章管理
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '文章列表' }
                },{
                    path: '/ArticleAdd',
					query:{'update':false},
                    component: () => import(/* webpackChunkName: "ArticleAdd" */ '../components/page/ArticleAdd.vue'),
                    meta: { title: '文章添加' }
                },
				{
					path:'/rotationAdd',
					meta: { title: '轮播图添加' },
					component:()=>import("../components/page/rotationAdd.vue")
				},
				{
					path:'/solution/:id',
					meta: { title: '解决方案' },
					component:()=>import("../components/page/solution.vue")
				},
				{
					path:'/solutionType',
					meta: { title: '方案分类' },
					component:()=>import("../components/page/solutionType.vue")
				},
				{
					path:'/solutionManager/:id',
					meta: { title: '方案管理' },
					component:()=>import("../components/page/solutionManager.vue")
				}
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
    ]
})

export default router;



