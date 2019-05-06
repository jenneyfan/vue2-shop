// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import axios from 'axios';
axios.defaults.withCredentials = true;
import Vuex from 'vuex';

Vue.use(infiniteScroll);
Vue.use(Vuex);
Vue.config.productionTip = false;

const store = new Vuex.Store({
   state:{
       nickName:'',
       cartCount:0
   },
   mutations:{
       // 更新用户信息
       updateUserInfo(state,nickName){
           state.nickName = nickName
       },
       // 更新购物车信息
       updateCartCount(state,cartCount){
            state.cartCount += cartCount;
       }
   }
});

Vue.use(VueLazyLoad,{
    loading:'/static/img/loading-svg/loading-bars.svg'
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    mounted(){
        this.checkLogin();
        this.getCartCount();
    },
    methods:{
        checkLogin(){
            axios.get('http://192.168.0.117:3000/users/checkLogin').then((response)=>{
                var res = response.data;
                if(res.status == '0'){
                    this.$store.commit('updateUserInfo',res.result);
                }else{
                    if(this.$route.path!='/goods'){
                        this.$router.push('/goods');
                    }
                }
            })
        },
        getCartCount(){
            axios.get('http://192.168.0.117:3000/users/getCartCount').then((response)=>{
                var res = response.data;
                if(res.status == '0'){
                    this.$store.commit('updateCartCount',res.result);
                }
            })
        }
    },
    components: { App },
    template: '<App/>'
})


