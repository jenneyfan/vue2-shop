<template>
  <div>
    <nav-header></nav-header>
    <nav-bread></nav-bread>
    <div class="accessory-result-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a href="javascript:void(0)" class="default cur" @click="defaultSort()">默认</a>
          <a href="javascript:void(0)" class="price" :class="{'sort-up':sortFlag}" @click="sortGoods()">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby" @click.stop="showFilterPop">筛选</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter" id="filter" :class = "{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>价格区间:</dt>
              <dd>
                <a href="javascript:;" @click="setPriceFilter('all')" :class="{'cur':priceChecked=='all'}">
                  选择价格
                </a>
              </dd>
              <dd v-for="(item,index) in priceFilter">
                  <a href="javascript:;" @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}">
                  ￥ {{item.startPrice}} - {{item.endPrice}} 元
                </a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/img/' + item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="view-more-normal"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="busy"
                 infinite-scroll-distance="20">
              <img src="./../../static/img/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import '../../static/css/base.css'
  import '../../static/css/goods-list.css'
  import NavHeader from './../components/NavHeader.vue'
  import NavBread from './../components/NavBread.vue'
  import NavFooter from './../components/NavFooter.vue'

  import axios from 'axios'
  export default {
    name: 'GoodsList',
    data () {
      return {
        goodsList:[],
        page:1,
        pageSize:8,
        sortFlag:true,  // 排序
        busy:true,      // 组件开关，默认不生效
        loading:false,  // 数据加载状态，默认不加载
        priceFilter:[
          {
            startPrice:'0.00',
            endPrice:'100.00'
          },
          {
            startPrice:'100.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },
          {
            startPrice:'1000.00',
            endPrice:'2000.00'
          },
          {
            startPrice:'2000.00',
            endPrice:'3000.00'
          },
          {
            startPrice:'3000.00',
            endPrice:'6000.00'
          }
        ],
        priceChecked:'all',
        filterBy:false,
        overLayFlag:false
      }
    },
    components:{
      NavHeader,
      NavBread,
      NavFooter
    },
    mounted(){
      this.getGoodsList();
    },
    methods:{
      getGoodsList(flag){
        var param={
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceChecked
        };
        this.loading = true;
        axios.get('http://192.168.0.117:3000/goods/list',{
          params:param
        }).then((result)=>{
            var res = result.data;
            //console.log(res);
            this.loading = false;
            if(res.status == '0'){
              if(flag){
                this.goodsList = this.goodsList.concat(res.result.list);
                if(res.result.count == 0){
                  this.busy = true;
                }else{
                  this.busy = false;
                }
              }else{
                this.goodsList = res.result.list;
                this.busy = false;
              }
            }else{
              this.goodsList = [];
            }
          })
      },
      // 滚动加载函数
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500)
      },
      // 商品排序
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      // 默认排序
      defaultSort(){
        this.sortFlag = true;
        this.page = 1;
        this.getGoodsList();
      },
      // 价格过滤
      setPriceFilter(index){
        console.log(index);
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();
      },
      // 加入购物车
      addCart(productId){
        axios.post('http://192.168.0.117:3000/goods/addCart',{
          productId:productId
        }).then((res)=>{
          var res = res.data;
          if(res.status == 0){
            alert('加入购物车成功')
          }else{
            alert('加入购物车失败：' + res.msg)
          }
        })
      },
      // 移动端过滤弹层
      showFilterPop(){
        this.filterBy = true;
        this.overLayFlag = true;
      },
      // 关闭弹层
      closePop(){
        this.filterBy = false;
        this.overLayFlag = false;
      }
    }
  }
</script>

