<template>
  <div class="bg-background min-h-screen">
    <div class="container mx-auto py-8 flex">
      <aside
        class="hidden md:block md:w-1/6 bg-cardLight rounded-lg shadow-md mr-8 fixed top-24 bottom-20 overflow-y-auto"
      >
        <!-- Header -->

        <h2 class="text-2xl px-5 font-bold my-8">
          <i class="fas fa-list-ul mr-2"></i>All Categories
        </h2>
        

        <!-- List -->
        <ul class="p-6 space-y-3">
          <Loader v-if="loading"/>
          <div
            v-else
            v-for="(category, index) in filteredCategories"
            :key="index"
            class="cursor-pointer hover:text-tertiary"
            @click="navigateToFilteredResources(category.categoryName)"
          >
          <div class="flex items-center">
              <img :src="category.icon" width="30" class="w-6 h-6 mr-2" />
              <span>{{ category.categoryName }}</span>
            </div>
        </div>
        </ul>
      </aside>

      <div class="w-full md:w-3/4 ml-0 md:ml-[25%] overflow-y-auto">
        <header
          class="bg-cardLight shadow-sm fixed py-2 border-background border-t-[1.6rem] top-[4.5rem] z-20 w-[1155px]"
        >
          <div class="relative">
            <i
              class="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400"
            ></i>
            <input
              type="text"
              placeholder="Search for courses..."
              class="mx-5 bg-background px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary pl-10"
              v-model="searchQuery"
              @keyup.enter="navigateToFilteredResources(searchQuery)"
            />
          </div>
        </header>
        <div class="mb-10"></div>
        <div class="mb-8 bg-menubg rounded-lg overflow-hidden">
          <div class="relative h-64 md:h-80">
            <div
              class="absolute inset-0 bg-gradient-to-r from-black via-black to-transparent"
            ></div>
            <SlideShow :slides="slides" :autoplayDelay="autoplayDelay" />
          </div>
        </div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-secondary rounded-full"></div>
            <h2 class="text-lg font-medium">
              <i class="fas fa-box-open mr-2"></i>Number of Available Courses
            </h2>
          </div>
        </div>
        <div v-if="loading" class="flex justify-center">
          <Loader />
        </div>
        <div v-else>
          <div
            v-if="filteredResources.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div
              v-for="(course, index) in filteredResources"
              :key="index"
              class="bg-cardLight rounded-lg shadow-md overflow-hidden"
            >
              <img
                :src="course.thumbnail"
                alt="Course Thumbnail"
                class="w-full h-32 object-cover"
              />
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">
                  {{ course.title }}
                </h3>
                <p
                  v-html="
                    course.description
                      ? course.description.length > 100
                        ? course.description.substring(0, 100) + '...'
                        : course.description
                      : ''
                  "
                  class="text-gray-600 mb-4"
                ></p>
                <div class="flex items-center text-gray-600 mb-4">
                  <div class="flex items-center">
                    <span class="mr-1">
                      <i class="fas fa-star text-yellow-400"></i>
                      <i class="fas fa-star text-yellow-400"></i>
                      <i class="fas fa-star text-yellow-400"></i>
                      <i class="fas fa-star text-yellow-400"></i>
                      <i class="far fa-star"></i>
                    </span>
                    <span>{{ course.ratings }}</span>
                  </div>
                  <span class="mx-2">•</span>
                </div>
                <button
                  class="w-auto bg-secondary px-5 hover:bg-tertiary h-12 rounded-md mt-4"
                  @click="() => $router.push(`educationhub/${course.id}`)"
                >
                  <i class="fas fa-book-open mr-2"></i>Start Learning
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-600">
            No courses available.
          </div>
        </div>
        <modal-component
          :showModal="showModal"
          :modalTitle="modalTitle"
          :selectedResource="selectedResource"
          @close="showModal = false"
        ></modal-component>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ModalComponent from "../components/HubModal.vue";
import Loader from "../components/Loader.vue";
import Icon1 from "@/assets/images/gene-gallin-3sYiQxSDEMg-unsplash.jpg";
import Icon2 from "@/assets/images/image-from-rawpixel-id-13821212-jpeg.jpg";
import Icon3 from "@/assets/images/lumin-osity-6DMht7wYt6g-unsplash.jpg";
import SlideShow from "../components/SlideShow.vue";

export default {
  data() {
    return {
      showModal: false,
      selectedResource: null,
      resources: [],
      modalTitle: "my modal title",
      courses: [],
      filteredResources: [],
      categories: [],
      filteredCategories: [],
      loading: true,
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
      searchQuery: "",
      slides: [
        {
          imageUrl: Icon1,
          title: "Welcome to Mlimi Education Hub",
          description: "Comprehensive guides to maximize farm productivity.",
        },
        {
          imageUrl: Icon2,
          title: "Master Your Tools",
          description:
            "Learn how to effectively use and maintain farm equipment.",
        },
        {
          imageUrl: Icon3,
          title: "Smart Farming Insights",
          description:
            "Discover innovative methods for efficient farming from home.",
        },
        // Add more slides as needed...
      ],

      autoplayDelay: 5000,
    };
  },
  components: {
    ModalComponent,
    Loader,
    SlideShow,
  },
  async mounted() {
    await this.fetchResources("courses");
    await this.fetchResources("course-categories");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
  methods: {
    async fetchResources(resource) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${resource}`,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );

        // Assign the data to new data properties
        if (resource === "courses") {
          this.courses = response.data.data;
          this.filteredResources = response.data.data;
        } else if (resource === "course-categories") {
          this.categories = response.data.data;
          this.filteredCategories = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    navigateToFilteredResources(query) {
      this.$router.push({ name: "FilteredResources", query: { q: query } });
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>
