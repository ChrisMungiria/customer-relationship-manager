import { createRouter, createWebHistory } from "vue-router";

// Views
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import AddCustomerView from "@/views/Customer/AddCustomerView.vue";
import EditCustomerView from "@/views/Customer/EditCustomerView.vue";

// Function to check authentication
function isAuthenticated() {
  return sessionStorage.getItem("access_token") !== null;
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    {
      path: "/customer/add",
      name: "addcustomer",
      component: AddCustomerView,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    {
      path: "/customer/edit/:id",
      name: "editCustomer",
      component: EditCustomerView,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
  ],
});

export default router;
