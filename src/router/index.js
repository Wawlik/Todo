import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '@/components/mainPage'
import note from '@/components/note'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: mainPage
    },
    {
      path: '/note/:id',
      name: 'note',
      component: note
    }
  ],
  mode: 'history'
})
