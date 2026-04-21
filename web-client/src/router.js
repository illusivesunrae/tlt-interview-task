import { useFirebaseStore } from './core/modules/firebase/store/firebaseStore';
import { createRouter, createWebHistory } from 'vue-router';

import TheDashboard from '@/core/views/TheDashboard.vue';
import AuthPage from '@/core/modules/auth/views/AuthPage.vue';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import QuizPage from './core/modules/quiz/views/QuizPage.vue';
import QuizResultsPage from './core/modules/quiz/views/QuizResultsPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'landingPage', component: TheDashboard, meta: { requiresAuth: true } },
        { path: '/classes/:classId/assignment-:assignmentId', name: 'quizPage', component: QuizPage, props: true, meta: { requiresAuth: true } },
        { path: '/classes/:classId/assignment-:assignmentId/review', name: 'quizResultsPage', component: QuizResultsPage, props: true, meta: { requiresAuth: true } },
        { path: '/auth', name: 'login', component: AuthPage, meta: { requiresNotAuth: true, color: '#eaeaea' } }
    ],
    scrollBehavior(_, _2, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { left: 0, top: 0 };
    }
})

router.beforeEach((to, from) => {
    if (to.meta.requiresNotAuth && !document.body.classList.contains('tlt-auth')) {
        document.body.classList.add('tlt-auth');
    } else if (to.meta.requiresAuth && document.body.classList.contains('tlt-auth')) {
        document.body.classList.remove('tlt-auth');
    }
    return
})

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(), 
            (user) => {
                removeListener(); resolve(user)
            },
            reject
        )
    })
}

router.beforeEach(async (to, from) => {
    const store = useFirebaseStore();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await getCurrentUser()) {
            return
        } else {
            return '/auth';
        }
    } else if (to.matched.some((record) => record.meta.requiresNotAuth)) {
        if (await getCurrentUser() && to.path === '/auth') {
            return '/';
        } else {
            return
        }
    } else {
        return
    }
})

export default router;