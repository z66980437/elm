<template>
    <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease" v-show="food.count" @click.stop.prevent="decreaseCart($event)">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
      <transition name="move">
        <div class="cart-count"  v-show="food.count">{{food.count}}</div>
      </transition>
      <div class="cart-increase icon-add_circle" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        // 消除由pc端点击产生的两次事件的问题，不过现在版本好像已经适应了，不加也行
        if (!event._constructed) {
          return
        }
        // console.log('click')
        if (!this.food.count) {
          // 在给原本不存在的字段赋值时，需要引入接口，不能使用直赋值的方式
          // this.food.count = 1
          // 需要使用Vue的方式
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        // 找到购物车小球动画的起始位置
        // console.log(event.target)
        this.$emit('cart-add', event.target)
      },
      decreaseCart (event) {
        // 消除由pc端点击产生的两次事件的问题，不过现在版本好像已经适应了，不加也行
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      // 不改变图标大小，增加点击区域
      padding: 6px
      // linear 线性传动
      transition: all 0.4s linear
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0,160,220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        opacity: 1
        // 开启硬件加速
        transform: translate3d(0,0,0)
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3d(24px,0,0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      font-size: 10px
      line-height: 24px
      text-align: center
      color: rgb(147,153,159)
      &.move-enter-active, &.move-leave-active
        transition: opacity 0.5s
      &.move-enter, &.move-leave-to
        opacity: 0
    .cart-increase
      display: inline-block
      // 不改变图标大小，增加点击区域
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)

</style>
