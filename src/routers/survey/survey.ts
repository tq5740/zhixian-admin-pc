const survey_recycle = () => import("@/views/survey/survey/survey_recycle.vue");
const survey_list = () => import("@/views/survey/survey/survey_list.vue");
const index = () => import("@/views/index.vue");
export default [
    {
      path: "/other",
      component: index,
      children: [
        {
          path: "survey_list",
          component: survey_list
        },
        {
          path: "survey_recycle",
          component: survey_recycle
        }
      ]
    }
  ];