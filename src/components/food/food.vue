<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" v-if="food.count" @cart-add="addCart($event)"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text" v-show="food.info">{{food.info}}</p>
        </div>
        <split v-show="food.ratings"></split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings" @foodSelectType-change="foodSelectType"
                        @foodOnlyContent-change="foodOnlyContent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="(rating, index) in food.ratings" class="rating-item border-1px" :key="'cc'+index"
                  v-show="needShow(rating.rateType,rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span
                    :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings  || food.ratings.length === 0">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import Vue from 'vue'
  import split from 'components/split/split'
  import ratingselect from 'components/ratingselect/ratingselect'
  import {formatDate} from 'common/js/date'
  const ALL = 2
  export default {
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      show () {
        // console.log('show')
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = false
        // console.log(this.selectType, this.onlyContent)
        // 务必在$nextTick中执行bettet-scroll初始化
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
            this.scroll.refresh()
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      addFirst (event) {
        // console.log('addFirst')
        if (!event._constructed) {
          return
        }
        this.$emit('cart-add', event.target)
        Vue.set(this.food, 'count', 1)
      },
      addCart (target) {
        this.$emit('cart-add', target)
      },
      foodSelectType (type) {
        this.selectType = type
        // console.log('selectType', this.selectType)
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      foodOnlyContent (type) {
        this.onlyContent = type
        // console.log('onlyContent', this.onlyContent)
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    filters: {
      formatDate (time) {
        // 格式化时间戳
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    height: 100%
    background: #fff
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
      opacity: 0
    .image-header
      position: relative
      width: 100%
      height: 0
      // 造就宽高相等的容器
      padding-bottom: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0px
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 20px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        background: rgb(0, 160, 220)
        color: rgb(255, 255, 255)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
          opacity: 1
        &.fade-enter, &.fade-leave-to
          opacity: 0

    .info
      padding: 18px
      .title
        line-height: 14px
        margin-top: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
        font-weight: 700
      .text
        line-height: 24px
        font-size: 12px
        padding: 6px 8px 0 8px
        color: rgb(77, 85, 93)
    .ratings
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px 48px 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            font-size: 0
            line-height: 12px
            .name
              display: inline-block
              margin-right: 6px
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
              width: 12px
              height: 12px

          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)

          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
