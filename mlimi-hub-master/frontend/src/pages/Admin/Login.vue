<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <LoaderAlt v-if="loading" />
    <div v-else class="max-w-md w-full bg-cardLight rounded-lg shadow-md p-6">
      <div class="flex items-center justify-center mb-6">
        <img :src="config.logo" alt="" class="h-16" />
      </div>
      <h2 class="text-2xl text-text font-bold mb-6 text-center">{{ config.appName }}</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-text font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="shadow appearance-none  rounded w-full py-2 px-3 bg-cardDark text-text leading-tight focus:ring-secondary "
            id="email"
            type="email"
            placeholder="Enter your email"
            v-model="email"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-text font-bold mb-2" for="password">
            Password
          </label>
          <div class="relative">
            <input
              class="shadow appearance-none  rounded w-full py-2 px-3 bg-cardDark text-text leading-tight focus:ring-secondary "
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              v-model="password"
              required
            />
            <button
              class="absolute inset-y-0 right-0 px-4 flex items-center"
              type="button"
              @click="showPassword = !showPassword"
            >
              <svg
                v-if="showPassword"
                class="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0a3 3 0 105.14 5.14M7.72 7.72l3.59 3.59M6.34 6.34a3 3 0 004.24 4.24"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <Loader v-if="isLoggingIn" />
          <button
            v-else
            class="bg-secondary hover:bg-tertiary text-textLight font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
          <a
            class="inline-block align-baseline font-bold text-sm text-secondary hover:text-tertiary"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
      </form>
      <p class="text-center text-textDarker text-xs mt-4">
        &copy; {{ config.appVersion }} {{ config.appName }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoaderAlt from "../../components/LoaderAlt.vue";
import Loader from "../../components/Loader.vue";
import { RouterLink } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      loading: false,
      isLoggingIn: false,
      config: {},
      showPassword: false,
      email: "",
      password: "",
    };
  },
  components: { LoaderAlt, Loader, RouterLink },
  mounted() {
    this.fetchSystemConfig();
  },
  methods: {
    async fetchSystemConfig() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`
        );
        this.config = response.data.data[0];
        console.log(response.data.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async handleLogin() {
      this.isLoggingIn = true;
      try {
        const data = JSON.stringify({
          email: this.email,
          password: this.password,
        });

        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/users/login`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data);

        // Set authToken and userName in local storage
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("userName", response.data.user.fullname);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("systemlogo", this.config.logo);
        localStorage.setItem("systemname", this.config.name);

        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('password', response.data.user.password);
        const [firstName, lastName] = response.data.user.fullname.split(" ");
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);

        this.$swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message,
        });
        this.$router.push("/dashboard/admin");
      } catch (error) {
        console.error("Error logging in:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast.error(error.response.data.error, {
            autoClose: 2000,
          });
        } else {
          toast.error("An unknown error occurred while logging in.", {
            autoClose: 2000,
          });
        }
      } finally {
        this.isLoggingIn = false;
      }
    },
  },
};
</script>
