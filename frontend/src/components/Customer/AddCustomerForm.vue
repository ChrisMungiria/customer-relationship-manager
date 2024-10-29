<script setup>
import { onMounted, reactive, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();

const toast = useToast();

const state = reactive({
  form: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
  },
  addingCustomer: false,
  token: null,
  errors: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
  },
});

const isFormValid = computed(() => {
  const { firstName, lastName, email, phone } = state.form;
  let valid = true;

  // Reset errors
  Object.keys(state.errors).forEach((key) => (state.errors[key] = ""));

  // Validate firstName
  if (!firstName) {
    state.errors.firstName = "First name is required.";
    valid = false;
  }

  // Validate lastName
  if (!lastName) {
    state.errors.lastName = "Last name is required.";
    valid = false;
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    state.errors.email = "Email is required.";
    valid = false;
  } else if (!emailPattern.test(email)) {
    state.errors.email = "Please enter a valid email address.";
    valid = false;
  }

  // Validate phone (optional, but you can set rules as needed)
  if (state.form.phone && isNaN(state.form.phone)) {
    state.errors.phone = "Phone number must be numeric.";
    valid = false;
  }

  return valid;
});

async function handleSubmit() {
  if (!isFormValid.value) return; // Prevent submission if form is invalid

  try {
    state.addingCustomer = true;
    const data = {
      firstName: state.form.firstName,
      lastName: state.form.lastName,
      email: state.form.email,
      phone: state.form.phone,
      companyName: state.form.companyName,
    };
    const res = await axios.post("http://localhost:3000/customers", data, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    console.log("Res: ", res);
    toast.success("Customer added successfully!");

    router.push("/dashboard");
    state.form = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
    };
  } catch (error) {
    console.log("Error adding customer: ", error);
  } finally {
    state.addingCustomer = false;
  }
}

onMounted(() => {
  state.token = sessionStorage.getItem("access_token");
});
</script>

<template>
  <div class="space-y-2 w-11/12 max-w-xs">
    <h1 class="text-xl font-semibold text-center">Add a customer below</h1>
    <form @submit.prevent="handleSubmit" class="space-y-2">
      <input
        :disabled="state.addingCustomer"
        type="text"
        v-model="state.form.firstName"
        placeholder="Firstname"
        class="p-2 border rounded-md w-full focus:outline-none"
      />
      <span v-if="state.errors.firstName" class="text-red-500 text-sm">{{
        state.errors.firstName
      }}</span>

      <input
        :disabled="state.addingCustomer"
        type="text"
        v-model="state.form.lastName"
        placeholder="Lastname"
        class="p-2 border rounded-md w-full focus:outline-none"
      />
      <span v-if="state.errors.lastName" class="text-red-500 text-sm">{{
        state.errors.lastName
      }}</span>

      <input
        :disabled="state.addingCustomer"
        type="email"
        v-model="state.form.email"
        placeholder="Email"
        class="p-2 border rounded-md w-full focus:outline-none"
      />
      <span v-if="state.errors.email" class="text-red-500 text-sm">{{
        state.errors.email
      }}</span>

      <input
        :disabled="state.addingCustomer"
        type="text"
        v-model="state.form.phone"
        placeholder="Phone number"
        class="p-2 border rounded-md w-full focus:outline-none"
      />
      <span v-if="state.errors.phone" class="text-red-500 text-sm">{{
        state.errors.phone
      }}</span>

      <input
        :disabled="state.addingCustomer"
        type="text"
        v-model="state.form.companyName"
        placeholder="Company name"
        class="p-2 border rounded-md w-full focus:outline-none"
      />

      <button
        :class="`${
          state.addingCustomer ? 'bg-slate-400' : 'bg-slate-800'
        } w-full text-white py-2 rounded-md`"
      >
        {{ state.addingCustomer ? "Loading..." : "Add" }}
      </button>
    </form>
    <RouterLink to="/dashboard" class="underline mt-2">Back home </RouterLink>
  </div>
</template>
