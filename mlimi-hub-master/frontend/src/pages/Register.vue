<template>
  <div class="flex flex-col md:flex-row h-screen">
    <div class="relative w-full md:w-2/3 h-1/2 md:h-full p-4 flex flex-col items-center bg-cover bg-no-repeat" style="background-image: url('../assets/images/about.jpeg')">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="z-10 w-full flex justify-start h-24">
        <Logo />
      </div>
      <p class="z-10 text-center text-white text-4xl md:text-6xl tracking-wide mt-8 md:mt-28">Welcome to Mlimi Hub</p>
      <p class="z-10 text-center text-white mt-4 tracking-wide text-sm md:text-lg font-light w-4/5 md:w-3/5">
        Mlimi Hub is a vibrant platform designed for farmers to connect, trade products, and share insights. It serves as a dynamic marketplace where farmers can buy and sell goods, exchange valuable knowledge, and foster a community-driven approach to agriculture. Join Mlimi Hub to explore a world of agricultural opportunities and collaboration!
      </p>
    </div>
    <div class="w-full md:w-1/3 h-1/2 md:h-full p-4 md:p-8 flex flex-col items-center justify-evenly bg-white">
      <div class="w-full h-full flex flex-col justify-evenly">
        <h3 class="text-center text-2xl md:text-3xl font-extrabold text-tertiary-600">Create Your Account</h3>
        <form @submit.prevent="handleRegister" class="flex flex-col items-center">
          <div class="bg-accent rounded px-2 md:px-4 py-2 w-4/5 md:w-3/4 mb-4 md:mb-6 flex items-center">
            <img src="../assets/images/name.png" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" alt="fullname" />
            <input type="text" name="fullname" id="fullname" ref="fullname" placeholder="Fullname" class="bg-transparent outline-none w-full text-black" />
          </div>
          <div class="bg-accent rounded px-2 md:px-4 py-2 w-4/5 md:w-3/4 mb-4 md:mb-6 flex items-center">
            <img src="../assets/images/email.png" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" alt="email" />
            <input type="email" id="email" ref="email" name="email" placeholder="Email" class="bg-transparent outline-none w-full text-black" />
          </div>
          <div class="bg-accent rounded px-2 md:px-4 py-2 w-4/5 md:w-3/4 mb-4 md:mb-6 flex items-center">
            <img src="../assets/images/calendar.png" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" alt="email" />
            <input type="date" name="dob" id="dob" ref="dob" placeholder="date of birth" class="bg-transparent outline-none w-full text-black" />
          </div>
          <div class="bg-accent rounded px-2 md:px-4 py-2 w-4/5 md:w-3/4 mb-4 md:mb-6 flex items-center">
            <img src="../assets/images/lock.png" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" alt="password" />
            <input type="password" id="password" ref="password" name="password" placeholder="Password" class="bg-transparent outline-none w-full text-black" />
          </div>
          <button v-if="!sLoading" class="bg-secondary text-white font-bold px-4 py-2 w-2/5 md:w-2/5 rounded-full" type="submit">Sign up</button>
          <div v-else>
            <LoaderAlt />
          </div>
          <div class="w-4/5 md:w-3/4 mt-4 md:mt-6 flex justify-between items-center">
            <div class="flex-1 h-px bg-black"></div>
            <h5 class="text-tertiary-600 mx-2 md:mx-4">OR</h5>
            <div class="flex-1 h-px bg-black"></div>
          </div>
          <div class="w-4/5 md:w-3/4 mt-4 md:mt-6 flex justify-evenly">
            <img class="w-6 md:w-8 h-auto cursor-pointer" src="../assets/images/rectangle53.png" alt="google icon" />
            <img class="w-6 md:w-8 h-auto cursor-pointer" src="../assets/images/rectangle54.png" alt="facebook icon" />
            <img class="w-6 md:w-8 h-auto cursor-pointer" src="../assets/images/rectangle55.png" alt="linkedIn icon" />
          </div>
          <div class="mt-4 md:mt-8 flex flex-col items-center">
            <p>
              <span class="text-sm md:text-xl">Already have account?</span>
              <div class="mx-2 md:mx-3"></div>
              <a href="/login" class="text-sm md:text-xl underline text-blue-600">Login.</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import LoaderAlt from "../components/LoaderAlt.vue";
import Logo from "../components/Logo.vue";

export default {
  name: "Register",
  data() {
    return {
      sLoading: false,
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
    };
  },
  components: {
    LoaderAlt,
    Logo
  },
  methods: {
    async handleRegister() {
      try {
        // Get values from the form
        const fullname = this.$refs.fullname.value;
        const dateOfBirth = this.$refs.dob.value;
        const email = this.$refs.email.value;
        const password = this.$refs.password.value;

        // Validate form data (you can add more validation as needed)
        if (!fullname || !dateOfBirth || !email || !password) {
          this.$swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all fields!",
          });
          return;
        }

        this.sLoading = true;

        const data = JSON.stringify({ fullname, email, password, dateOfBirth });

        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/farmers/register`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );

        
        this.$swal.fire({
            icon: "success",
            title: "Success!",
            text: "Registration successful",
          });
        this.$router.push("/login");
      } catch (error) {
        console.error("Error submitting discussion:", error);

        toast.error("an error occurred !", {
          autoClose: 2000,
        });
      } finally {
        this.sLoading = false;
      }
    },
  },
};
</script>


