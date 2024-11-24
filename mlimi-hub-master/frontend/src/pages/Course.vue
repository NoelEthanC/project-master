<template>
  <div v-if="loading">
    <LoaderAlt />
  </div>
  <div v-else>
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div class="space-y-4">
            <div
            v-for="(lesson, index) in paginatedLessons"
            :key="lesson._id"
            class="bg-cardLight shadow-md rounded-lg p-4"
            >
            <button
              @click="$router.go(-1)"
              class="bg-secondary text-tertiary font-bold py-2 px-4 rounded-md mb-3"
            >
              <i class="fa fa-arrow-left"></i>
              Back
            </button>
              <h3 class="text-xl font-bold mb-2">{{ lesson.name }}</h3>
              <div class="mb-4">
                <video
                  :src="lesson.content"
                  class="w-full h-[40vh] object-cover rounded-lg shadow-md"
                  controls
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div class="my-4 w-[600px]">
                <p
                  class="truncate"
                  v-html="lesson.description"
                  v-if="!showFullLessonDescription[index]"
                ></p>
                <p v-else v-html="lesson.description"></p>
                <i
                  class="text-secondary font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
                  @click="toggleLessonDescription(index)"
                >
                  {{
                    showFullLessonDescription[index]
                      ? "Show Less"
                      : "See More..."
                  }}
                </i>
              </div>


              <div class="flex justify-center">
                <button
                  class="bg-secondary mr-2 text-text font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
                  :disabled="currentPage <= 1"
                  @click="prevPage"
                >
                  <i class="fa fa-arrow-left"></i>Previous
                </button>
                <button
                  class="bg-secondary text-text font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
                  :disabled="currentPage >= totalPages"
                  @click="nextPage"
                >
                  Next <i class="fa fa-arrow-right"></i>
                </button>
              </div>

              <div class="mt-4">
                <h3 class="text-lg font-bold mb-2">Comments</h3>
                <div class="bg-cardLight p-4 rounded-md">
                  <div v-if="!lesson.comments || lesson.comments.length === 0">
                    No comments yet.
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="(comment, commentIndex) in lesson.comments"
                      :key="commentIndex"
                      class="bg-cardDark p-2 rounded-md"
                    >
                      <p>{{ comment.text }}</p>
                      <div class="text-gray-500 text-sm">
                        by {{ comment.author }} at
                        {{ new Date(comment.createdAt).toLocaleString() }}
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <textarea
                      v-model="newComment"
                      class="w-full mb-3 p-2 border rounded-md"
                      placeholder="Add a comment..."
                    ></textarea>
                    <button
                      class="bg-secondary text-text font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
                      @click="addComment(lesson._id)"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="bg-gray-100 py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-2xl font-bold mb-6">Play List</h2>

              <div class="">
                <div
                  v-for="(lesson, index) in lessons"
                  :key="lesson._id"
                  class="bg-cardLight mb-3 rounded-lg shadow-md overflow-hidden cursor-pointer"
                  @click="navigateToLesson(lesson)"
                >
                  <div class="relative pb-56">
                    <div
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="w-16 h-16 text-gray-400 bg-gray-100 rounded-lg p-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <path d="M15.5 12l-5-3.5v7l5-3.5z" fill="#6B7280" />
                      </svg>
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="text-lg font-bold mb-2">{{ lesson.name }}</h3>
                    <p
                      v-html="lesson.description.substring(0, 40) + '...'"
                      class="text-gray-600 truncate"
                    ></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 class="text-2xl font-bold mb-4 mt-8">Related Courses</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="course in relatedCourses"
              :key="course._id"
              class="bg-cardLight shadow-md rounded-lg p-4 cursor-pointer"
              @click="navigateToCourse(course.id)"
            >
              <img
                :src="course.thumbnail"
                class="w-full h-48 object-cover rounded-lg"
              />
              <h3 class="text-xl font-bold mb-2 mt-2">{{ course.title }}</h3>
              <p class="text-gray-600 truncate">{{ course.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <div class="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
          <div v-if="selectedLesson.quizz">
            <div
              v-for="(question, index) in selectedLesson.quizz.questions"
              :key="index"
              class="mb-4"
            >
              <h3 class="text-lg font-bold">{{ question.caption }}</h3>
              <div class="space-y-2">
                <div
                  v-for="(option, optionIndex) in question.options"
                  :key="optionIndex"
                  class="flex items-center"
                >
                  <input
                    type="radio"
                    :value="option"
                    v-model="answers[index]"
                    class="mr-2"
                  />
                  <span>{{ option }}</span>
                </div>
              </div>
            </div>
            <button
              class="bg-secondary text-text font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
              @click="submitQuiz"
            >
              Submit
            </button>
          </div>
          <button
            class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mt-4"
            @click="showModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoaderAlt from "../components/LoaderAlt.vue";

export default {
  components: { LoaderAlt },
  data() {
    return {
      loading: false,
      selectedCourse: {},
      lessons: [],
      relatedCourses: [],
      currentPage: 1,
      lessonsPerPage: 1,
      showModal: false,
      selectedLesson: null,
      answers: [],
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
      showFullDescription: false,
      showFullLessonDescription: [],
      newComment: "",
    };
  },
  async mounted() {
    this.loading = true;
    const courseId = this.$route.params.id;
    try {
      const [courseResponse, lessonsResponse] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        ),
        axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/v1/lessons/get-by-id?field=course&id=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        ),
      ]);
      this.selectedCourse = courseResponse.data;
      this.lessons = lessonsResponse.data.data;
      this.showFullLessonDescription = Array(this.lessons.length).fill(false);
      this.relatedCourses = await this.getRelatedCourses();
      this.loading = false;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    totalPages() {
      return this.lessons
        ? Math.ceil(this.lessons.length / this.lessonsPerPage)
        : 0;
    },
    paginatedLessons() {
      if (!this.lessons) {
        return [];
      }
      const startIndex = (this.currentPage - 1) * this.lessonsPerPage;
      const endIndex = startIndex + this.lessonsPerPage;
      return this.lessons.reverse().slice(startIndex, endIndex);
    },
    nextLessons() {
      if (!this.lessons || !this.selectedLesson) {
        return [];
      }
      const currentLessonIndex = this.lessons
        .reverse()
        .findIndex((lesson) => lesson._id === this.selectedLesson._id);
      if (currentLessonIndex === -1) {
        return [];
      }
      return this.lessons.reverse().slice(currentLessonIndex + 1);
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    navigateToLesson(lesson) {
      this.selectedLesson = lesson;
    },
    navigateToCourse(id) {
      this.$router.push(`/dashboard/farmer/educationhub/${id}`);
    },
    prevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1);
    },
    nextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
    },
    showQuiz(lesson) {
      this.selectedLesson = lesson;
      this.answers = Array(lesson.quizz.questions.length).fill("");
      this.showModal = true;
    },
    async submitQuiz() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/courses/${
            this.selectedCourse._id
          }/lessons/${this.selectedLesson._id}/quiz`,
          {
            answers: this.answers,
          },
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );
        this.selectedLesson.quizz.score = response.data.score;
        this.showModal = false;
      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
    },
    toggleLessonDescription(index) {
      this.showFullLessonDescription[index] =
        !this.showFullLessonDescription[index];
    },
    async getRelatedCourses() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/courses`,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );
        return response.data.data.filter(
          (course) => course._id !== this.selectedCourse._id
        );
      } catch (error) {
        console.error("Error fetching related courses:", error);
        return [];
      }
    },
    addComment(lessonId) {
      if (this.newComment.trim() === "") {
        return;
      }

      const newComment = {
        text: this.newComment.trim(),
        author: "You",
        createdAt: new Date().toISOString(),
      };

      const lesson = this.lessons.find((l) => l._id === lessonId);
      if (lesson) {
        if (!lesson.comments) {
          lesson.comments = [];
        }
        lesson.comments.push(newComment);
      }

      this.newComment = "";
    },
  },
};
</script>
