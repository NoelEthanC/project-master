<template>
  <div class="flex flex-col md:flex-row h-screen">
    <div class="relative w-full md:w-2/3 h-1/2 md:h-full p-4 flex flex-col items-center bg-cover bg-no-repeat" style="background-image: url('../assets/images/mlimi.jpeg')">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="z-10 w-full flex justify-start h-24">
        <Logo />
      </div>
      <p class="z-10 text-center text-white text-4xl md:text-6xl tracking-wide mt-8 md:mt-28">Welcome Back!</p>
      <p class="z-10 text-center text-white mt-4 tracking-wide text-sm md:text-lg font-light">To keep connected with us please login <br /> with your personal information</p>
    </div>
    <div class="w-full md:w-1/3 h-1/2 md:h-full p-4 md:p-8 flex flex-col items-center justify-evenly bg-white">
      <div class="w-full h-full flex flex-col justify-evenly">
        <h2 class="text-center text-2xl md:text-3xl font-bold text-tertiary">Log Into Your Account</h2>
        <form @submit.prevent="handleLogin" class="flex flex-col items-center">
          <p class="text-center text-sm md:text-base font-light mb-2 md:mb-4">use your email & password to login</p>
          <div class="bg-accent rounded px-2 md:px-4 py-2 w-4/5 md:w-3/4 mb-2 flex items-center">
            <img src="../assets/images/email.png" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" alt="email" />
            <input type="email" name="email" id="email" ref="email" placeholder="Email" class="bg-transparent outline-none w-full" />
          </div>
          <div class="bg-accent rounded px-2 md:px-4 py-2 w-4/5 md:w-3/4 mb-4 md:mb-6 flex items-center">
            <img src="../assets/images/lock.png" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" alt="password" />
            <input type="password" id="password" name="password" ref="password" placeholder="password" class="bg-transparent outline-none w-full" />
          </div>
          <button v-if="!lLoading" class="bg-secondary text-white font-bold px-4 py-2 w-2/5 md:w-2/5 rounded-full" type="submit">Sign in</button>
          <div v-else>
            <Loader />
          </div>
          <div class="w-4/5 md:w-3/4 mt-4 md:mt-6 flex justify-between items-center">
            <div class="flex-1 h-px bg-black"></div>
            <h5 class="text-accent mx-2 md:mx-4">OR</h5>
            <div class="flex-1 h-px bg-black"></div>
          </div>
          <div class="w-4/5 md:w-3/4 mt-4 md:mt-6 flex justify-evenly">
            <img class="w-6 md:w-8 h-auto cursor-pointer" src="../assets/images/rectangle53.png" alt="google icon" />
            <img class="w-6 md:w-8 h-auto cursor-pointer" src="../assets/images/rectangle54.png" alt="facebook icon" />
            <img class="w-6 md:w-8 h-auto cursor-pointer" src="../assets/images/rectangle55.png" alt="linkedIn icon" />
          </div>
          <div class="mt-4 md:mt-8 flex flex-col items-center">
            <p>
              <span class="text-sm md:text-xl">Don't have account?</span>
              <div class="mx-2 md:mx-3"></div>
              <a href="/register" class="text-sm md:text-xl underline text-blue-600">Register.</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { RouterLink } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import axios from "axios";
import HubCard from "../components/HubCard.vue";
import Logo from "../components/Logo.vue";
import Loader from "../components/Loader.vue";

export default {
  data() {
    return {
      lLoading: false,
    };
  },
  components: {
    HubCard,
    Logo,
    RouterLink,
    Loader,
  },
  methods: {
    async handleLogin() {
      try {
        const email = this.$refs.email.value;
        const password = this.$refs.password.value;

        if (!email || !password) {
          this.$swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all fields!",
          });
          return;
        }

        this.lLoading = true;

        const data = JSON.stringify({ email, password });

        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/farmers/login`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data)
        // Set authToken and userName in local storage
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem('userName', response.data.user.fullname);
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

        this.$router.push("/dashboard/farmer");
      
      } catch (error) {
        console.error("Error logging in:", error);

        toast.error("invalid cridentials", {
          autoClose: 2000,
        });
      } finally {
        this.lLoading = false;
      }
    },
  },
};
</script>




