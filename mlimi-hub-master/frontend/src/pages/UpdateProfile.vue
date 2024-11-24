<template>
    <LoaderAlt v-if="loading" />
    <div v-else class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-center">Update Profile</h1>
  
      <form @submit.prevent="updateProfile" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="fullname">
            Full Name
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fullname"
            v-model="form.fullname"
            type="text"
            required
            :class="{ 'border-red-500': errors.fullname }"
          />
          <div v-if="errors.fullname" class="text-red-500 text-sm mt-1">
            Full name is required.
          </div>
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            v-model="form.email"
            type="email"
            required
            :class="{ 'border-red-500': errors.email }"
          />
          <div v-if="errors.email" class="text-red-500 text-sm mt-1">
            Please enter a valid email address.
          </div>
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="password">
            Enter Current Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            v-model="form.password"
            type="password"
            required
            :class="{ 'border-red-500': errors.password }"
          />
          <div v-if="errors.password" class="text-red-500 text-sm mt-1">
            Current password is required.
          </div>
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="newPassword">
            Enter New Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newPassword"
            v-model="form.newPassword"
            type="password"
            :class="{ 'border-red-500': errors.newPassword }"
          />
          <div v-if="errors.newPassword" class="text-red-500 text-sm mt-1">
            New password is required if you want to change your password.
          </div>
        </div>
  
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
            type="submit"
            :disabled="hasErrors"
          >
            <loader-alt v-if="loading" class="inline-block" />
            <span v-else>Update Profile</span>
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import LoaderAlt from '../components/LoaderAlt.vue';
  
  export default {
    name: 'UpdateProfile',
    components: {
      LoaderAlt,
    },
    data() {
      return {
        loading: false,
        id: localStorage.getItem('userId'),
        form: {
          fullname: localStorage.getItem('userName'),
          email: localStorage.getItem('email'),
          password: '',
          newPassword: '',
        },
        errors: {
          fullname: false,
          email: false,
          password: false,
          newPassword: false,
        },
      };
    },
    computed: {
      hasErrors() {
        return (
          this.errors.fullname ||
          this.errors.email ||
          this.errors.password ||
          (this.form.newPassword && this.errors.newPassword)
        );
      },
    },
    methods: {
      validateForm() {
        this.errors.fullname = !this.form.fullname;
        this.errors.email = !this.form.email || !/\S+@\S+\.\S+/.test(this.form.email);
        this.errors.password = !this.form.password;
        this.errors.newPassword = this.form.newPassword && !this.form.newPassword.length;
      },
      async updateProfile() {
        this.validateForm();
  
        if (this.hasErrors) {
          return;
        }
  
        this.loading = true;
  
        try {
          const response = await axios.patch(`${import.meta.env.VITE_APP_API_URL}/api/v1/farmers/update-profile/${this.id}`, this.form);
          console.log(response.data.message);
  
          // Update localStorage variables
          localStorage.setItem('userName', response.data.user.fullname);
          localStorage.setItem('email', response.data.user.email);
  
          await this.$swal({
            title: 'Success',
            text: 'Profile updated successfully',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
  
          // Refresh the window
          window.location.reload();
        } catch (error) {
          console.error(error);
          await this.$swal({
            title: 'Failed',
            text: error.response.data.message || 'Something went wrong',
            icon: 'error',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>