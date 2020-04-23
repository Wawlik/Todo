import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '@/components/mainPage'
import note from '@/components/note'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Todo/',
      name: 'mainPage',
      component: mainPage
    },
    {
      path: '/Todo/note/:id',
      name: 'note',
      component: note
    }
  ],
  mode: 'history'
})
