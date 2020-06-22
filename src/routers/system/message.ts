const sample = () => import("@/views/system/message/sample.vue");
const record = () => import("@/views/system/message/record.vue");
const message = () => import("@/views/system/message/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/system",
    component: index,
    children: [
      {
        path: "sample",
        component: sample
      },
      {
        path: "record",
        component: record
      },
      {
        path: "message",
        component: message
      }
    ]
  }
];
