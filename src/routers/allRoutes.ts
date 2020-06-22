import home from "./home";
import user from "./user";
import org from "./org";
import business from "./business";
import content from "./content";
import system from "./system";
import data from "./data";
import train from "./train";
import trainClass from "./trainClass";
import exam from "./exam";
import advert from "./advert";
import evaluation from "./eval";
import live from "./live";
import otherAll from "./otherAll";

const login = () => import("@/views/login.vue");
const notFound = () => import("@/views/notFound.vue");
const showPage = () => import("@/views/showPage.vue");
const _login = [
  {
    path: "/login",
    component: login
  }
];
const _notFound = [
  {
    path: "*",
    component: notFound
  }
];
const _showPage = [
  {
    path: "/showPage",
    component: showPage
  }
];
export default [
  ...system,
  ...home,
  ...user,
  ...org,
  ...business,
  ...content,
  ..._login,
  ...data,
  ...train,
  ...trainClass,
  ...exam,
  ...advert,
  ...live,
  ...evaluation,
  ...otherAll,
  ..._showPage,
  ..._notFound
];
