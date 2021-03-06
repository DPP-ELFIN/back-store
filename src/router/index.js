import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'


Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		component: Home,
		redirect: '/welcome',
		children: [{
				path: '/welcome',
				component: Welcome
			},
			{
				path: '/users',
				component: User
			},
			{
				path: '/rights',
				component: Rights
			},
			{
				path: '/Roles',
				component: Roles
			},
		]
	}
]

const router = new VueRouter({
	routes
})

//添加路由导航守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next();
	//获取登录的token判断登录状态
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) return next('/login')
	next()
})

export default router
