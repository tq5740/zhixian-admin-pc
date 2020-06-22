const config = () =>
  import("@/views/system/configuration/configbasic/index.vue");
const reg = () => import("@/views/system/configuration/regcfg/index.vue");
const mail = () => import("@/views/system/configuration/mailcfg/index.vue");
const sms = () =>
  import("@/views/system/configuration/messagecfg/index.vue");
// const message = () =>
//   import("@/views/system/configuration/informationcfg/index.vue");
const photo = () =>
  import("@/views/system/configuration/photocfg/index.vue");
const storage = () =>
  import("@/views/system/configuration/storagecfg/index.vue");
const video = () =>
  import("@/views/system/configuration/videocfg/index.vue");
const filter = () =>
  import("@/views/system/configuration/filtercfg/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/system",
    component: index,
    children: [
      {
        path: "config",
        component: config
      },
      {
        path: "reg",
        component: reg
      },
      {
        path: "mail",
        component: mail
      },
      {
        path: "sms",
        component: sms
      },
      // {
      //   path: "message",
      //   component: message
      // },
      {
        path: "photo",
        component: photo
      },
      {
        path: "storage",
        component: storage
      },
      {
        path: "video",
        component: video
      },
      {
        path: "filter",
        component: filter
      }
    ]
  }
];
