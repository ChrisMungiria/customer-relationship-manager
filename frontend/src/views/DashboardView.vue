<script setup>
import axios from "axios";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const state = reactive({
  user: null,
  token: null,
  customers: [],
  loadingCustomers: false,
  currentPage: 1,
  pageSize: 5,
});

const router = useRouter();

const toast = useToast();

async function fetchCustomers() {
  try {
    state.loadingCustomers = true;
    const response = await axios.get("http://localhost:3000/customers", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    state.customers = response.data;
  } catch (error) {
    console.log("Failed fetching customers: ", error);
  } finally {
    state.loadingCustomers = false;
  }
}

async function deleteCustomer(id) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/customers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );
    toast.success("Customer deleted successfully");
    fetchCustomers();
  } catch (error) {
    console.log("Error: ", error);
  }
}

function logout() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("user");
  router.push("/");
}

onMounted(() => {
  state.user = JSON.parse(sessionStorage.getItem("user"));
  if (!state.user) {
    router.push("/");
  }

  state.token = sessionStorage.getItem("access_token");
  if (state.token) {
    // Do some fetching
    fetchCustomers();
  }
});
</script>

<template>
  <section class="p-4 max-w-4xl mx-auto space-y-3">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <div class="flex items-center justify-between">
      <h3>Hi there {{ state.user ? state.user.firstname : "" }}</h3>
      <button
        @click="logout"
        class="px-4 p-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
      >
        Logout
      </button>
    </div>

    <RouterLink
      to="/customer/add"
      class="px-4 p-2 bg-slate-800 text-white rounded"
    >
      Add Customer
    </RouterLink>

    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th class="px-4 py-2">First Name</th>
          <th class="px-4 py-2 hidden md:block">Last Name</th>
          <th class="px-4 py-2 hidden md:block">Email</th>
          <th class="px-4 py-2 hidden md:block">Phone</th>
          <th class="px-4 py-2 hidden md:block">Company</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="customer in state.customers" :key="customer.id">
          <td class="px-4 py-2">{{ customer.firstName }}</td>
          <td class="px-4 py-2 hidden md:block">{{ customer.lastName }}</td>
          <td class="px-4 py-2 hidden md:block">{{ customer.email }}</td>
          <td class="px-4 py-2 hidden md:block">{{ customer.phone }}</td>
          <td class="px-4 py-2 hidden md:block">{{ customer.companyName }}</td>
          <td class="px-4 py-2 flex space-x-2">
            <RouterLink
              :to="`/customer/edit/${customer.id}`"
              class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400"
            >
              Edit
            </RouterLink>
            <button
              @click="deleteCustomer(customer.id)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="state.loadingCustomers" class="text-center">
      <p>Loading customers...</p>
    </div>
  </section>
</template>
