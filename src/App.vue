<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller" :goods="goods" @cart="drop"></router-view>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFoods="selectFoods" ref="shopcart"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header'
  import shopcart from 'components/shopcart/shopcart'
  // 定义请求结果状态
  const ERR_OK = 0
  export default {
    data () {
      return {
        seller: {},
        goods: []
      }
    },
    created () {
      // 发起ajax请求
      this.$http.get('/api/seller').then((response) => {
        // 成功的回调
        // 获取obj对象
        response = response.body
        // console.log(response)
        if (response.errno === ERR_OK) {
          this.seller = response.data
          // console.log(this.seller)
        }
      })
      this.$http.get('/api/goods').then((response) => {
        // 成功的回调
        // 获取obj对象
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
        }
      })
    },
    components: {
      'v-header': header,
      shopcart
    },
    methods: {
      drop (target) {
        // console.log('_drop')
        // 优化体验，异步执行下落动画
        this.$nextTick(() => {
          // 调用子组件方法，传递dom
          this.$refs.shopcart.drop(target)
        })
      }
    },
    computed: {
      // 选择的商品
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
