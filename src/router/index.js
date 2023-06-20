import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../views/admin/Admin.vue'
import Welcome from '../views/admin/Welcome.vue'
const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main'),
    redirect: "/welcome",
    children: [
      {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta:{requireAuth:true}
      },
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        meta:{requireAuth:true}
      },
      {
        path: '/updatePwd',
        name: 'UpdatePwd',
        component: () => import('../views/admin/UpdatePwd'),
        meta:{requireAuth:true}
      },
      {
        path: '/bjinfo',
        name: 'Bjinfo',
        component: () => import('../views/admin/Bjinfo'),
        meta:{requireAuth:true}
      },
      {
        path: '/bminfo',
        name: 'Bminfo',
        component: () => import('../views/admin/Bminfo'),
        meta:{requireAuth:true}
      },
      {
        path: '/kcbjinfo',
        name: 'Kcbjinfo',
        component: () => import('../views/admin/Kcbjinfo'),
        meta:{requireAuth:true}
      },
      {
        path: '/timu',
        name: 'Timu',
        component: () => import('../views/admin/Timu'),
        meta:{requireAuth:true}
      },
      {
        path: '/datiAll',
        name: 'DatiAll',
        component: () => import('../views/admin/DatiAll'),
        meta:{requireAuth:true}
      },
      {
        path: '/timuResult',
        name: 'TimuResult',
        component: () => import('../views/admin/TimuResult'),
        meta:{requireAuth:true}
      },
      {
        path: '/report',
        name: 'Report',
        component: () => import('../views/admin/Report'),
        meta:{requireAuth:true}
      },
      {
        path: '/report1',
        name: 'Report1',
        component: () => import('../views/admin/Report1'),
        meta:{requireAuth:true}
      },
      {
        path: '/userinfo',
        name: 'Userinfo',
        component: () => import('../views/admin/Userinfo'),
        meta:{requireAuth:true}
      },
      {
        path: '/student',
        name: 'Student',
        component: () => import('../views/admin/Student'),
        meta:{requireAuth:true}
      },
      
      {
        path: '/kcinfo',
        name: 'Kcinfo',
        component: () => import('../views/admin/Kcinfo'),
        meta:{requireAuth:true}
      },

    


        
 
      {
        path: '/updateUinfo',
        name: 'UpdateUinfo',
        component: () => import('../views/admin/UpdateUinfo'),
        meta:{requireAuth:true}
      },

      {
        path: '/updateStudent',
        name: 'UpdateStudent',
        component: () => import('../views/admin/UpdateStudent'),
        meta:{requireAuth:true}
      },
     


 
    ]

  },
 
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
 
  {
    path: '/',
    redirect:"/login"
  },
 
]



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('currentUser');
   
  }
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
 
  if (to.meta.requireAuth) {
    if(to.path != '/login'){
       if(!currentUser ){
        
        next({ path: '/login' });
       }else{
          next();
       }
    }else{
      next();
    }
    
  } else {

    next();
  }
})

export default router

//路由