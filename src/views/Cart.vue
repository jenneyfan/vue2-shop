<template>
    <div>
        <nav-header></nav-header>
        <nav-bread></nav-bread>
        <div class="container">
            <div class="cart">
                <div class="page-title-normal">
                    <h2 class="page-title-h2"><span>我的购物车</span></h2>
                </div>
                <div class="item-list-wrap">
                    <div class="cart-item">
                        <div class="cart-item-head">
                            <ul>
                                <li>商品</li>
                                <li>单价</li>
                                <li>数量</li>
                                <li>小计</li>
                                <li>操作</li>
                            </ul>
                        </div>
                        <ul class="cart-item-list">
                            <li v-for="item in cartList">
                                <div class="cart-tab-1">
                                    <div class="cart-item-check">
                                        <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check':item.checked == '1'}"  >
                                            <svg class="icon icon-ok">
                                                <use xlink:href="#icon-ok"></use>
                                            </svg>
                                        </a>
                                    </div>
                                    <div class="cart-item-pic">
                                        <img v-lazy="'/static/img/'+item.productImage" :alt="item.productName">
                                    </div>
                                    <div class="cart-item-title">
                                        <div class="item-name">{{item.productName}}</div>
                                    </div>
                                </div>
                                <div class="cart-tab-2">
                                    <div class="item-price">{{item.salePrice}}</div>
                                </div>
                                <div class="cart-tab-3">
                                    <div class="item-quantity">
                                        <div class="select-self select-self-open">
                                            <div class="select-self-area">
                                                <a class="input-sub">-</a>
                                                <span class="select-ipt">{{item.productNum}}</span>
                                                <a class="input-add">+</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="cart-tab-4">
                                    <div class="item-price-total">{{item.salePrice*item.productNum}}</div>
                                </div>
                                <div class="cart-tab-5">
                                    <div class="cart-item-opration">
                                        <a href="javascript:;" class="item-edit-btn">
                                            <svg class="icon icon-del">
                                                <use xlink:href="#icon-del"></use>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="cart-foot-wrap">
                    <div class="cart-foot-inner">
                        <div class="cart-foot-l">
                            <div class="item-all-check">
                                <a href="javascipt:;">
                           <span class="checkbox-btn item-check-btn">
                              <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                           </span>
                                    <span>全选</span>
                                </a>
                            </div>
                        </div>
                        <div class="cart-foot-r">
                            <div class="item-total">
                                总价: <span class="total-price">{{totalPrice}}</span>
                            </div>
                            <div class="btn-wrap">
                                <a class="btn btn--red">去结算</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import '../../static/css/base.css'
    import '../../static/css/checkout.css'
    import '../../static/css/login.css'
    import NavHeader from './../components/NavHeader.vue'
    import NavBread from './../components/NavBread.vue'
    import NavFooter from './../components/NavFooter.vue'
    import Modal from './../components/Modal.vue'
    import axios from 'axios'
    export default {
        name: 'HelloWorld',
        data() {
            return {
                cartList:[]
            }
        },
        components:{
            NavHeader,
            NavBread,
            NavFooter,
            Modal
        },
        mounted(){
            this.init();
        },
        computed:{
            totalPrice(){
                var money = 0;
                this.cartList.forEach((item)=>{
                    if(item.checked=='1'){
                        money += parseFloat(item.salePrice*item.productNum)
                    }
                })
                return money;
            }
        },
        methods:{
            init(){
                axios.get('http://192.168.0.117:3000/users/cartList').then((response)=>{
                    let res = response.data;
                    this.cartList = res.result;
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .cart-foot-r .btn-wrap .btn{
        min-width: 200px;
    }
    .input-sub,.input-add{
        min-width: 40px;
        height: 100%;
        border: 0;
        color: #605F5F;
        text-align: center;
        font-size: 16px;
        overflow: hidden;
        display: inline-block;
        background: #f0f0f0;
    }
    .item-quantity .select-self-area{
        background:none;
        border: 1px solid #f0f0f0;
    }
    .item-quantity .select-self-area .select-ipt{
        display: inline-block;
        padding:0 3px;
        width: 30px;
        min-width: 30px;
        text-align: center;
    }
</style>
