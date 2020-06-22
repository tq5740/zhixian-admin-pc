const print = () => import("@/views/trainClass/train_class/print_class_list.vue");
const apply = () => import("@/views/trainClass/train_class/apply_class_list.vue");
const index = () => import("@/views/index.vue");
export default [
    {
      path: "/trainClass",
      component: index,
      children: [
        {
          path: "apply",
          component: apply
        },
        {
          path: "print",
          component: print
        }
      ]
    }
  ];