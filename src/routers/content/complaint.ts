const complaint = () =>
  import("@/views/content/complaint/complaintlist/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/content",
    component: index,
    children: [
      {
        path: "complaint",
        component: complaint
      }
    ]
  }
];
