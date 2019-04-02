<template>
  <div>
    <nav-header></nav-header>
    <nav-bread></nav-bread>
    <div class="accessory-result-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a href="javascript:void(0)" class="default cur">默认</a>
          <a href="javascript:void(0)" class="price">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
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
        sortFlag:1,
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
      getGoodsList(){
        var param={
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag
        }
        axios.get('http://192.168.0.117:3000/goods',{
          params:param
        }).then((result)=>{
            //console.log(result);
            this.goodsList = result.data.result.list;
          })
      },
      // 价格过滤
      setPriceFilter(index){
        this.priceChecked = index;
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

