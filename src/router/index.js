import { createRouter, createWebHistory } from "vue-router";
// import HomeView from '../views/HomeView.vue'
import PaymentView from "../views/Payment/PaymentView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: PaymentView,
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: "/status",
      name: "status",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/StatusView.vue"),
    },
  ],
});

export default router;
