<template>
    <div class="sidebar">
		<!-- 首页左边选项卡 -->
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu 
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                // {
                //     icon: 'el-icon-lx-home',
                //     index: 'dashboard',
                //     title: '系统首页'
                // },
                // {
                //     icon: 'el-icon-message-solid',
                //     index: 'tabs',
                //     title: '系统消息'
                // },             
                {
                    icon: 'el-icon-picture',
                    index: '2',
                    title: '轮播图',
                    subs: [
                        {
                            index: 'rotation',
                            title: '轮播图列表'
                         }
                        // ,{
                        //     index: 'fenlei',
                        //     title: '分类'
                        // }
                    ]
                },
                {
                    icon: 'el-icon-lx-global',
                    index: '3',
                    title: '服务支持',
					subs:[
						{
							index: 'service',
							title: '产品常见回答'
						},{
							index: 'data',
							title: '资料下载&培训材料'
						}
					]
                },
                {
                    icon: 'el-icon-camera-solid',
                    index: '4',
                    title: '产品',
                    subs: [
                        {
                            index: 'product',
                            title: '产品列表'
                        },
                        {
                            index: 'setup',
                            title: '首页产品展示'
                        },
						{
						    index: 'productFeature',
						    title: '功能管理'
						}
						
                    ]
                },
                {
                    icon: 'el-icon-tickets',
					index: '5',
                    title: '文章管理',
					subs: [
						{
							index: '/donate',
							title: '文章列表',
						}
						// ,
						// {
						// 	index: '/article',
						// 	title: '设置',
						// }
					]
                },
				{
				    icon: 'el-icon-s-grid',
				    index: '6',
				    title: '关于我们',
					subs:[
						// {
						// 	index:'/brief',
						// 	title:'公司简介'
						// },
						{
							index:'/recruit',
							title:'人才招聘'
						}
					]
				},
				{
				    icon: 'el-icon-setting',
				    index: '7',
				    title: '设置',
				    subs: [
				        {
				            index: '/field',
				            title: '领域分类管理'
				        }
				        /* ,{
				            index: '/productclass',
				            title: '产品分类管理'
				        } */
				    ]
				},
				{
				    icon: 'el-icon-s-claim',
				    index: '8',
				    title: '解决方案',
				    subs: [
				        {
				            index: '/solutionType',
				            title: '方案分类管理'
				        }
				    ]
				}
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏 
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
</style>
