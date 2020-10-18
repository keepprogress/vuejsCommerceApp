import Vue from 'vue';
import VueRouter from 'vue-router';
//官方元件

// import Home from '@/components/HelloWorld';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Pages/Login';
import Products from '@/components/Pages/Products';
import CoustmerOrders from '@/components/Pages/CustomerOrders';

//自訂的元件

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '*',
            redirect: 'login',
        },
        // {
        //     name: '首頁',
        //     path: '/',
        //     component: Home,
        //     meta: { requiresAuth: true },
        // },
        {
            name: 'Login',
            path: '/login',
            component: Login,
        },
        {
            name: '首頁',
            path: '/admin',
            component: Dashboard,
            
            children: [
                {
                    path: 'products',
                    name: 'Products',
                    component: Products,
                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            name: 'Dashboard',
            path: '/',
            component: Dashboard,
            
            children: [
                {
                    path: 'customer_order',
                    name: 'CoustmerOrder',
                    component: CoustmerOrders,
                },
            ],
        },

    ],

});
