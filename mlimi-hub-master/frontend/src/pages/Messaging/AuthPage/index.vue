<template>
    <div class="login-page flex justify-center items-center h-screen">
      <div class="card p-8 bg-white rounded-lg shadow-md">
        <div v-if="loading" class="flex justify-center">
          <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mb-4"></div>
        </div>
        <div v-else-if="errorMessage" class="text-red-500 text-center mb-4">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { loginRest, signupRest } from "./api";
  
  export default {
    data() {
      return {
        loading: false,
        errorMessage: "",
      };
    },
    mounted() {
      this.autoAuthenticate();
    },
    methods: {
      async autoAuthenticate() {
        this.loading = true;
        const userName = localStorage.getItem("userName")?.replace(/ /g, "") || "";
        const email = localStorage.getItem("email");
        const password = localStorage.getItem("userId");
        const firstName = localStorage.getItem("firstName");
        const lastName = localStorage.getItem("lastName");
  
        try {
          if (userName && email && password && firstName && lastName) {
            await this.registerUser(userName, email, password, firstName, lastName);
          } else if (email && password) {
            await this.loginUser(userName, password);
          } else {
            throw new Error("Failed to connect to chat.");
          }
        } catch (error) {
          this.errorMessage = error.message;
          this.loading = false;
        }
      },
      async registerUser(userName, email, password, firstName, lastName) {
        try {
          await signupRest(userName, password, email, firstName, lastName);
          this.$emit("onAuth", {
            userName,
            email,
            firstName,
            lastName,
            secret: password,
          });
        } catch (error) {
          if (error.response && error.response.status === 400) {
            await this.loginUser(userName, password);
          } else {
            throw new Error("Failed to connect to chat.");
          }
        }
      },
      async loginUser(userName, password) {
        try {
          const response = await loginRest(userName, password);
          this.$emit("onAuth", { ...response.data, secret: password });
        } catch (error) {
          throw new Error("Failed to connect to chat.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .loader {
    border-top-color: #3498db;
    animation: spin 1s ease infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>