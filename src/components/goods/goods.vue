<template>
  <div class="goods">
    <!--左侧菜单-->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!--分类-->
        <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--分类列表-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!--分类-->
        <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
            <!--商品列表-->
          <ul>
            <!--商品-->
            <li v-for="(food, food_index) in item.foods" :key="food_index" class="food-item" @click="select_Food(food,$event)">
              <!--图标-->
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cart-add="_drop"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <food :food="selectFood" ref="foodShow" @cart-add="_drop"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import food from 'components/food/food'

  export default {
    props: {
      seller: {
        type: Object
      },
      goods: {
        type: Array
      }
    },
    data () {
      return {
        // 高度的数组
        listHeight: [],
        // 定义实时位置变量
        scrollY: 0,
        selectFood: {}
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      this.$nextTick(() => {
                this._initScroll()
                // 商品列表和分类列表联动
                this._calculateHeight()
              })
    },
    computed: {
      // 左侧导航高亮应在的位置
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      }
    },
    methods: {
      _initScroll () {
        // 初始化better-scroll
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          // 取消默认的，阻止原元素的默认行为
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // 必须添加，不然会导致商品这侧没有点击事件
          click: true,
          // 希望scroll在滚动的时候能实时监测位置
          probeType: 3

        })
        // 返回实时位置
        this.foodsScroll.on('scroll', (position) => {
          // position.y是个小数负值需要取整和转化成正值
          this.scrollY = Math.abs(Math.round(position.y))
        })
      },
      _calculateHeight () {
        // 商品列表和分类列表联动，计算每个分类的高度
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          // clientHeight元素的高度
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 点击导航栏跳转
      selectMenu (index, event) {
        // 消除由pc端点击产生的两次事件的问题，不过现在版本好像已经适应了，不加也行
        if (!event._constructed) {
          return
        }
        // console.log(index, event)
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      // 接收事件调用，接收小球起始元素dom信息
      _drop (target) {
        // 传递事件
        // 加入购物车事件
        this.$emit('cart', target)
      },
      select_Food (food, event) {
        if (!event._constructed) {
          return
        }
        this.selectFood = food
        this.$refs.foodShow.show()
      }
    },
    components: {
      cartcontrol,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    width: 100%
    top: 174px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        // 垂直居中
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        // 水平居中
        padding: 0 12px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-img('decrease_3')
          &.discount
            bg-img('discount_3')
          &.guarantee
            bg-img('guarantee_3')
          &.invoice
            bg-img('invoice_3')
          &.special
            bg-img('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        // 底部不能有margin
        padding-bottom: 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7,17,27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240,20,20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147,153,159)

          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 0
</style>
