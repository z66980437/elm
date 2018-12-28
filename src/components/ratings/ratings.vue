<template>
  <div class="ratings" ref="ratingsWrapper">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"
                    @foodSelectType-change="foodSelectType" @foodOnlyContent-change="foodOnlyContent"></ratingselect>
      <div class="ratings-wrapper">
        <ul>
          <li v-for="(rating, index) in ratings" class="rating-item" :key="'dd'+index"
              v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend">
                <span class="icon-thumb_up" v-show="rating.rateType===0"></span>
                <span class="icon-thumb_down" v-show="rating.rateType===1"></span>
                <span v-for="(item, index) in rating.recommend" :key="'ee'+index" class="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star'
  import split from 'components/split/split'
  import ratingselect from 'components/ratingselect/ratingselect'
  import BScroll from 'better-scroll'
  import {formatDate} from 'common/js/date'

  const ALL = 2
  const ERR_OK = 0
  export default {
    components: {
      star,
      split,
      ratingselect
    },
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    methods: {
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
    created () {
      // 发起ajax请求
      this.$http.get('/api/ratings').then((response) => {
        // 成功的回调
        // 获取obj对象
        response = response.body
        // console.log(response)
        if (response.errno === ERR_OK) {
          this.ratings = response.data
          // console.log(this.seller)
          this.$nextTick(() => {
            // 初始化better-scroll
            this.scroll = new BScroll(this.$refs.ratingsWrapper, {
              // 取消默认的，阻止原元素的默认行为
              click: true
            })
          })
        }
      })
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
  .ratings
    position: absolute
    top: 174px
    bottom: 46px
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        // 适应小屏幕，如iphone5
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
          margin-bottom: 8px
        .rank
          font-size: 10px
          line-height: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        // 适应小屏幕，如iphone5
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          line-height: 18px
          font-size: 0
          .title
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            // 适应小屏幕，如iphone5
            @media only screen and (max-width: 320px)
              margin: 0 6px
              vertical-align: top
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
            color: rgb(255, 153, 0)

        .delivery-wrapper
          font-size: 0
          .title
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            line-height: 18px
            color: rgb(147, 153, 159)

    .ratings-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            font-size: 10px
            line-height: 12px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
              line-height: 12px
              color: rgb(147, 153, 159)
          .text
            line-height: 18px
            font-size: 12px
            margin-bottom: 8px
            color: rgb(7, 17, 27)
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .item, .icon-thumb_down
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
              font-size: 12px
            .icon-thumb_down
              color: rgb(183, 187, 191)
              font-size: 12px
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)

          .time
            position: absolute
            top: 0
            right: 0
            font-size: 10px
            line-height: 12px
            color: rgb(147,153,159)
</style>
