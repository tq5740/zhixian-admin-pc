const category = () => import("@/views/exam/exam/exam_category.vue");
const recycle = () => import("@/views/exam/exam/exam_recycle.vue");
const config = () => import("@/views/exam/exam/exam_config.vue");
const question = () => import("@/views/exam/question/question_list.vue");
const address = () => import("@/views/exam/address/address_list.vue");
const exam = () => import("@/views/exam/exam/exam_list.vue");
const bank = () => import("@/views/exam/bank/bank_list.vue");
const point = () => import("@/views/exam/bank/point_category.vue");
const index = () => import("@/views/index.vue");
export default [
    {
      path: "/exam",
      component: index,
      children: [
        {
          path: "exam",
          component: exam
        },
        {
          path: "bank",
          component: bank
        },
        {
          path: "point",
          component: point
        },
        {
          path: "address",
          component: address
        },
        {
          path: "temporary_question",
          component: question
        },
        {
          path: "config",
          component: config
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