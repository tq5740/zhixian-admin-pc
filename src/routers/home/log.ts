const message = () => import("@/views/home/sendMessage.vue");
const logmsg = () => import("@/views/home/basic/logmsg/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/index",
    redirect: "/index/log",
    component: index,
    children: [
      {
        path: "index",
        component: logmsg
      },
      {
        path: "message",
        component: message
      }
    ]
  }
];
