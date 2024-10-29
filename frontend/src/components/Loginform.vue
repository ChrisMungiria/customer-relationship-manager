<script setup>
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const state = reactive({
  isLoading: false,
  form: {
    email: "",
    password: "",
  },
  errors: {
    email: "",
    password: "",
  },
});

const router = useRouter();

const toast = useToast();

async function handleSubmit() {
  try {
    const creds = {
      username: state.form.email,
      password: state.form.password,
    };

    const response = await axios.post(
      "http://localhost:3000/auth/login",
      creds,
      {
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      // Store the access token and user information in session storage
      sessionStorage.setItem("access_token", response.data.access_token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }

    console.log("Resonse: ", response);
  } catch (error) {
    console.log("Error logging in");
  }
}
</script>

<template>
  <div class="space-y-2 w-11/12 max-w-xs">
    <h1 class="text-xl font-semibold text-center">Log in below</h1>
    <form @submit.prevent="handleSubmit" class="space-y-2">
      <input
        type="email"
        v-model="state.form.email"
        placeholder="Email address"
        class="p-2 border rounded-md w-full focus:outline-none"
      />
      <input
        type="password"
        v-model="state.form.password"
        placeholder="Password"
        class="p-2 border rounded-md w-full focus:outline-none"
      />
      <button
        :class="`${
          state.isLoading ? 'bg-slate-400' : 'bg-slate-800'
        } w-full text-white py-2 rounded-md`"
      >
        {{ state.isLoading ? "Loading..." : "Log in" }}
      </button>
    </form>
  </div>
</template>
