<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>购物车</span>
        </nav-bread>
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
                                        <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check':item.checked == '1'}" @click="editCart('chk',item)">
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
                                                <a class="input-sub" @click="editCart('sub',item)">-</a>
                                                <span class="select-ipt">{{item.productNum}}</span>
                                                <a class="input-add" @click="editCart('add',item)">+</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="cart-tab-4">
                                    <div class="item-price-total">{{item.salePrice*item.productNum}}</div>
                                </div>
                                <div class="cart-tab-5">
                                    <div class="cart-item-opration">
                                        <span class="item-edit-btn" @click="delCartConfirm(item)">删除</span>
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
        <modal :mdShow="mdConfirm" @close="closeModal()">
            <p slot="message">确认要删除吗？</p>
            <div slot="btnGroup">
                <span class="btn btn--m" @click="delCart(item)">确认</span>
                <span class="btn btn--m" @click="closeModal()">关闭</span>
            </div>
        </modal>
        <modal :mdShow="mdTipOk" @close="closeModal()">
            <p slot="message">删除成功</p>
            <div slot="btnGroup">
                <span class="btn btn--m" @click="closeModal()">关闭</span>
            </div>
        </modal>
        <modal :mdShow="mdTipError" @close="closeModal()">
            <p slot="message">删除失败</p>
            <div slot="btnGroup">
                <span class="btn btn--m" @click="closeModal()">关闭</span>
            </div>
        </modal>
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
                cartList:[],
                item:{},
                mdConfirm:false,
                mdTipOk:false,
                mdTipError:false
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
            // 初始化列表数据
            init(){
                axios.get('http://192.168.0.117:3000/users/cartList').then((response)=>{
                    let res = response.data;
                    this.cartList = res.result;
                })
            },
            // 改变数量
            editCart(flag, item){
                if(flag == 'add'){
                    item.productNum++;
                }else if(flag == 'sub'){
                    if(item.productNum <= 1){
                        return;
                    }else{
                        item.productNum--
                    }
                }else{
                    item.checked = item.checked == '1' ? '0' : '1';
                }
                axios.post('http://192.168.0.117:3000/users/cartEdit',{
                    productId:item.productId,
                    productNum:item.productNum,
                    checked:item.checked
                }).then((response) => {
                    let res = response.data;
                    if(res.status == '0'){
                        console.log('更新成功');
                    }
                })
            },
            // 删除确认框
            delCartConfirm(item){
                this.mdConfirm = true;
                this.item = item;
            },
            // 删除购物车商品
            delCart(item){
                this.closeModal();
                axios.post('http://192.168.0.117:3000/users/cartDel',
                    {productId:item.productId}
                ).then((response)=>{
                    let res = response.data;
                    let _this = this;
                    if(res.status == '1'){
                        this.mdTipError = true;
                        setTimeout(function () {
                            _this.mdTipError = false;
                        },1000);
                    }else{
                        this.mdTipOk = true;
                        setTimeout(function () {
                            _this.mdTipOk = false;
                        },1000);
                        this.init();
                    }
                })
            },
            // 关闭模态框
            closeModal(){
                this.mdConfirm = false;
                this.mdTipOk = false;
                this.mdTipError = false;
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
