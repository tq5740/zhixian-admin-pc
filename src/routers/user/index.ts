import manage from "./manage";
import auth from "./auth";
import admin from "./admin";
import staff from "./staff";
export default [...manage, ...auth, ...admin, ...staff];
