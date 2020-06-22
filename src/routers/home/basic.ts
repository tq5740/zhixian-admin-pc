const landing = () => import("@/views/home/basic/landing/index.vue");
const index = () => import("@/views/index.vue");
import store from "@/store/index";
export default [
  {
    path: "/",
    redirect: store.state.init3rdMenu,
    component: index,
    children: [
      {
        path: store.state.init3rdMenu,
        component: landing
      }
    ]
  }
];
