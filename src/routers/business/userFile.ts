const booking = () => import("@/views/business/userFile/fileList/index.vue");
const interview = () => import("@/views/business/userFile/interview/index.vue");
const person = () =>
  import("@/views/business/userFile/searchFile/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/work",
    component: index,
    children: [
      {
        path: "booking",
        component: booking
      },
      {
        path: "interview",
        component: interview
      },
      {
        path: "person",
        component: person
      }
    ]
  }
];
