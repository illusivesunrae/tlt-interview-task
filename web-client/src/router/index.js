import { useFirebase } from '@/core/composables/useFirebase'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { createRouter, createWebHistory } from 'vue-router'

import TheDashboard from '@/core/views/TheDashboard.vue'
import AuthPage from '@/modules/auth/views/AuthPage.vue'
import QuizPage from '@/modules/quiz/views/QuizPage.vue'

const offline = import.meta.env.VITE_demo_mode === 'true'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landingPage', component: TheDashboard, meta: { requiresAuth: true } },
    {
      path: '/classes/:classId/assignment-:assignmentId',
      name: 'quizPage',
      component: QuizPage,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name: 'login',
      component: AuthPage,
      meta: { requiresNotAuth: true, color: '#eaeaea' },
    },
  ],
  scrollBehavior(_, _2, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to, from) => {
  if (to.meta.requiresNotAuth && !document.body.classList.contains('tlt-auth')) {
    document.body.classList.add('tlt-auth')
  } else if (to.meta.requiresAuth && document.body.classList.contains('tlt-auth')) {
    document.body.classList.remove('tlt-auth')
  }
  return
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject,
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (!offline) {
    const store = useFirebase()

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (await getCurrentUser()) {
        next()
      } else {
        next('/auth')
      }
    } else if (to.matched.some((record) => record.meta.requiresNotAuth)) {
      if ((await getCurrentUser()) && to.path === '/auth') {
        next('/')
      } else {
        next()
      }
    } else {
      next('/')
    }
  } else {
    localStorage.setItem('username', 'racmocon')

    if (to.path === '/auth') {
      next('/')
    }

    next()
  }
})

export default router
