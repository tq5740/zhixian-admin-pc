const advert_list = () => import("@/views/advert/advert_list.vue");
const category = () => import("@/views/advert/advert_category.vue");
const recycle = () => import("@/views/advert/advert_recycle.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/advert",
    component: index,
    children: [
      {
        path: "advert",
        component: advert_list
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
