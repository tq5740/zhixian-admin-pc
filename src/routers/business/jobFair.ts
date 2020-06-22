const venue = () => import("@/views/business/jobFair/fairList/index.vue");
const myvenue = () => import("@/views/business/jobFair/myFair/index.vue");
const venueorg = () =>
  import("@/views/business/jobFair/companyreg/index.vue");
const id = () => import("@/views/org/organization/address/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/work",
    component: index,
    children: [
      {
        path: "venue",
        component: venue
      },
      {
        path: "myvenue",
        component: myvenue
      },
      {
        path: "venueorg",
        component: venueorg
      },
      {
        path: "id",
        component: id
      }
    ]
  }
];
