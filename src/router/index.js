import Vue from 'vue'
import Router from 'vue-router'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    // 首页重定向
    {
      path: '/',
      redirect: 'goods'
    },
    // 商品
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    // 评论
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    // 商家
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
})
