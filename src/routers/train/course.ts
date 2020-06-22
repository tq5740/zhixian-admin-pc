const course = () => import("@/views/train/course/course_list.vue");
const course_category = () => import("@/views/train/course/course_category.vue");
const course_config = () => import("@/views/train/course/course_config.vue");
const course_recycle = () => import("@/views/train/course/course_recycle.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/train",
    component: index,
    children: [
      {
        path: "course",
        component: course
      },
      {
        path: "course_category",
        component: course_category
      },
      {
        path: "course_config",
        component: course_config
      },
      {
        path: "course_recycle",
        component: course_recycle
      }
    ]
  }
];
