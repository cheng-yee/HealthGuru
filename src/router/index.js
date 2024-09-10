import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Home from '/src/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: () => import('../views/Workouts.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/routines',
      name: 'routines',
      component: () => import('../views/Routines.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/meals',
      name: 'meals',
      component: () => import('../views/Meals.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calories',
      name: 'calories',
      component: () => import('../views/Calories.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../views/Social.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/About.vue')
    }
  ]
})


function checkAuthState() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      unsubscribe(); // Unsubscribe after getting the auth state to avoid memory leaks
      resolve(user);
    });
  });
}

router.beforeEach(async (to, from, next) => {
  const user = await checkAuthState();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !user) {
    next('/login');
  } else if (!requiresAuth && user) {
    next('/');
  } else {
    next();
  }
});
export default router
