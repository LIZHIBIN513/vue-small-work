import Vue from 'vue';
import store from './vuex/store';
import VueRouter from 'vue-router';
import routes from './routers'; // 引入路由配置
import infiniteScroll from 'vue-infinite-scroll';  // 引入滑动模块
import VueLazyload from 'vue-lazyload';  // 引入图片懒加载模块
import {loadFromlLocal} from './common/js/store';  // 公共方法：本地缓存
import 'common/css/index.styl'; // 引入公共样式

// 注册组件
Vue.use(infiniteScroll);
Vue.use(VueRouter);

// error，loading是图片路径, 用require引入
Vue.use(VueLazyload, {
    error: require('./assets/404.png'),
    loading: require('./assets/loading.gif'),
    attempt: 1
  }
);

const scrollBehavior = (to, from, savedPosition) => {
  console.log(savedPosition);
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition;
  } else {
    const position = {};
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash;
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0;
      position.y = 0;
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    return position;
  }
};

const router = new VueRouter({
  mode: 'history',
  'linkActiveClass': 'active',
  routes, // （缩写）相当于 routes: routes
  scrollBehavior
});
/**
 * 创建和挂载根实例。
 * 记得要通过 router 配置参数注入路由，
 * 从而让整个应用都有路由功能
 */
const routerApp = new Vue({
  store,
  router
}).$mount('#app');

/**
 * loadFromlLocal()是读取本地缓存数据，具体common/js/store.js 查看
 *
 *
 */
if (!loadFromlLocal('gank', 'articles', false)) {
  router.push('/articles');
}
export default routerApp;
