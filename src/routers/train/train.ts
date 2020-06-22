const train = () => import("@/views/train/train/train_list.vue");
const train_category = () => import("@/views/train/train/train_category.vue");
const train_config = () => import("@/views/train/train/train_config.vue");
const train_recycle = () => import("@/views/train/train/train_recycle.vue");
const index = () => import("@/views/index.vue");
export default [
    {
      path: "/train",
      component: index,
      children: [
        {
          path: "train",
          component: train
        },
        {
          path: "train_category",
          component: train_category
        },
        {
          path: "train_config",
          component: train_config
        },
        {
          path: "train_recycle",
          component: train_recycle
        }
      ]
    }
  ];