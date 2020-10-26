// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import axios from 'axios';
import 'bootstrap';

import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import Datefilter from './filters/date';


Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

Vue.component('Loading', Loading);
axios.defaults.withCredentials = true;
Vue.filter('currency', currencyFilter);
Vue.filter('datetransform_from_timestamp', Datefilter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});

router.beforeEach((to, from, next) => {
  console.log('to', to, from,'next', next)
  // ...
  if (to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
      const vm = this;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      axios.post(api,).then((response) => {
        //axios.post(api,) 替換 this.$router.post(api,) 
        // 因為這邊是router 元件才能使用 this.$router.post
        console.log(response.data);
        if (response.data.success) {
            // vm.$router.push('/');
            next();
        } else {
          next({
            path: '/login',
          })
        }
      });
  } else {
    next();
  };
});
