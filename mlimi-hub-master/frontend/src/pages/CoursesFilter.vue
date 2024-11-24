<template>
  <div class="bg-background min-h-screen">
    <div class="container mx-auto py-8">
      <div class="flex flex-col md:flex-row">
        <div
          class="w-full md:w-[100%] rounded-md mb-5 md:right-0 md:h-[92vh] md:overflow-y-scroll"
        >
          <h1 class="text-4xl">
            Showing results for
            <b class="text-tertiary">"{{ $route.query.q }}"</b>
          </h1>
          <div class="mt-4">
            <div class="flex justify-between items-center mb-4">
              <button
                @click="$router.go(-1)"
                class="bg-tertiary text-textLighter py-2 px-4 rounded-md"
              >
                Back
              </button>
              <input
                type="text"
                placeholder=" &#x1F50D; Search for courses..."
                class="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary pl-10"
                v-model="searchQuery"
                @input="filterCourses"
              />
            </div>
            <div v-if="loading" class="flex justify-center">
              <Loader />
            </div>
            <div v-else>
              <div
                v-if="filteredCourses.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-[97%] h-[85vh] m-2 scroll-smooth overflow-y-scroll"
              >
              <div v-for="(course, index) in filteredCourses" :key="index" class="bg-textLighter rounded-lg shadow-md overflow-hidden">
                <img :src="course.thumbnail" alt="Course Thumbnail" class="w-full h-44 object-cover" />
                <div class="p-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ course.title }}</h3>
                  <p class="text-gray-600 mb-4">{{ course.description }}</p>
                  <div class="flex items-center text-gray-600 mb-4">
                    <div class="flex items-center">
                      <span class="mr-1">★★★★☆</span>
                      <span>{{ course.ratings }}</span>
                    </div>
                    <span class="mx-2">•</span>
                    <div>{{ course.lessons.length }} lessons</div>
                  </div>
                  <button class="w-auto bg-secondary px-5 hover:bg-tertiary h-12 rounded-md mt-4" @click="() => $router.push(`educationhub/${course.id}`)">
                    Start Learning
                  </button>
                </div>
              </div>
              </div>
              <div
                v-else
                class="text-center text-4xl h-[60vh] w-full flex justify-center items-center text-gray-600"
              >
                <b class="text-tertiary">Oops!</b> No courses found.
              </div>
            </div>
            <modal-component
              :showModal="showModal"
              :modalTitle="modalTitle"
              :selectedCourse="selectedCourse"
              @close="showModal = false"
            ></modal-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ModalComponent from "../components/HubModal.vue";
import Loader from "../components/Loader.vue";

export default {
  data() {
    return {
      showModal: false,
      selectedCourse: null,
      modalTitle: "my modal title",
      courses: [],
      filteredCourses: [],
      loading: true,
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
      searchQuery: this.$route.query.q || "",
    };
  },
  components: {
    ModalComponent,
    Loader,
  },
  async mounted() {
    await this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/courses`,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );

        this.courses = response.data.data;
        this.filterCourses();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    filterCourses() {
      this.filteredCourses = this.courses.filter((course) =>
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    navigateToFilteredCourses(query) {
      this.$router.push({ name: "FilteredCourses", query: { q: query } });
    },
  },
};
</script>
