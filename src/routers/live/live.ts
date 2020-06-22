const category = () => import("@/views/live/live/live_category.vue");
const recycle = () => import("@/views/live/live/live_recycle.vue");
const config = () => import("@/views/live/live/live_config.vue");
const live = () => import("@/views/live/live/live_list.vue");
const index = () => import("@/views/index.vue");
export default [
    {
      path: "/live",
      component: index,
      children: [
        {
          path: "live",
          component: live
        },
        {
          path: "config",
          component: config
        },
        {
          path: "recycle",
          component: recycle
        },
        {
          path: "category",
          component: category
        }
      ]
    }
  ];