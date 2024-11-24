<template>
  <div class="bg-background min-h-screen">
    <div class="container mx-auto py-12">
      <div class="text-center mb-12">
        <h1 class="font-bold text-4xl md:text-5xl">
          Welcome to
          <span class="text-tertiary">Mlimi Hub</span> Forum
        </h1>
        <p class="mt-4 text-2xl md:w-2/3 mx-auto md:text-lg">
          Engage with fellow farmers, share knowledge, and explore new opportunities.
        </p>
        <div class="mt-8 flex justify-center">
          <div class="relative w-full md:w-1/2">
            <i class="fas fa-search absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400"></i>
            <input
              class="w-full bg-textLighter text-text py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-tertiary pl-10"
              type="text"
              placeholder="Search for discussions..."
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center md:flex-row md:justify-between">
        <div class="flex w-full items-center justify-between my-8 space-x-4">
          <div class="flex items-center">
            <div class="w-3 h-8 bg-secondary rounded-md"></div>
            <h1 class="text-3xl font-bold">&nbsp; {{ discussions.length }} discussions</h1>
          </div>
          <div class="flex justify-between">

            <div class="mx-4"></div>
            <button
              @click="() => this.$router.push(`forum/new-discussion`)"
              class="bg-tertiary hover:bg-tertiary-dark text-textLighter font-medium py-3 px-6 rounded-md shadow-md"
            >
              <i class="fas fa-plus mr-2"></i>Open a new discussion
            </button>
          </div>
        </div>
      </div>
      <div class="mt-12 h-full">
        <div v-if="loading" class="flex justify-center">
          <Loader />
        </div>
        <div v-else>
          <div
            v-if="discussions.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div
              v-for="(discussion, index) in discussions"
              :key="index"
              class="bg-cardDark p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
            <img :src="discussion.image" class="w-96 h-64">
              <h2 v-html="discussion.issue.substring(0, 60)+'...'" class="text-xl font-bold text-text mb-2">
   
              </h2>
              <p class="text-gray-600 mb-4">
                <i class="fas fa-user mr-2"></i>{{ discussion.author }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center text-text">
                    <i class="fas fa-thumbs-up mr-2"></i>

                  </div>
                  <div class="flex items-center text-text">
                    <i class="fas fa-thumbs-down mr-2"></i>
  
                  </div>
                  <div class="flex items-center text-text">
                    <i class="fas fa-comment mr-2"></i>

                  </div>
                </div>
                <button
                  class="bg-secondary hover:bg-tertiary hover:text-secondary text-tertiary font-medium py-2 px-4 rounded-md"
                  @click="() => $router.push(`forum/${discussion.id}`)"
                >
                  See More <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-600 font-medium">
            No discussions available.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../components/Loader.vue";

export default {
  data() {
    return {
      loading: true,
      discussions: [],
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
    };
  },
  async mounted() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/discussions`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      this.discussions = response.data.data;
      console.log("API Response:", response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loading = false;
    }
  },
  components: { Loader },
};
</script>