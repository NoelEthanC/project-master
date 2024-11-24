<template>
  <div class="bg-background min-h-screen">
    <div class="container mx-auto py-12">
      <div v-if="loading" class="flex justify-center">
        <LoaderAlt />
      </div>
      <div v-else class="flex flex-col md:flex-row">
        
        <div class="md:w-2/3 pr-0 md:pr-8">
          <div class="bg-cardDark rounded-lg shadow-md p-8">
            <button
                  @click="$router.go(-1)"
                  class="bg-secondary text-tertiary mb-5 font-bold py-2 px-4 rounded-md"
                >
                <i class="fa fa-arrow-left"></i>
                  Back
                </button>
            <div class="flex justify-between items-center mb-8">
              <div class="flex items-center space-x-4">
                <h1 v-html="discussions.issue" class="text-2xl font-bold"></h1>
                <div class="text-sm text-gray-500">
                  Asked by {{ discussions.owner }} on
                  {{ formatDate(discussions.createdAt) }}
                </div>
              </div>
              <div class="flex items-center space-x-4 text-gray-600">
                <div
                  class="flex items-center space-x-1 hover:text-gray-800 cursor-pointer"
                >
                  <i class="fas fa-thumbs-up"></i>
                  <span></span>
                </div>
                <div
                  class="flex items-center space-x-1 hover:text-gray-800 cursor-pointer"
                >
                  <i class="fas fa-thumbs-down"></i>
                  <span></span>
                </div>
              </div>
            </div>
            <div class="mb-8">
              <p class="text-lg">{{ discussions.caption }}</p>
            </div>
            <div class="mb-4">
              <img :src="discussions.image" class="w-full h-[28rem]" />
            </div>
            <div class="bg-cardLight rounded-md p-6">
              <h2 class="text-xl font-bold mb-6">
                {{ discussions.comments.length }} Answers
              </h2>

              <div>
                <!-- Display comments if there are any -->
                <div
                  v-if="discussions.comments.length > 0"
                  class="space-y-4"
                >
                  <div
                    v-for="comment in discussions.comments"
                    :key="comment.id"
                    class="flex bg-cardDark rounded-lg mb-4 p-4"
                  >
                    <div class="mr-4">
                      <i class="fa fa-user-circle text-4xl"></i>
                    </div>
                    <div class="flex-grow">
                      <div class="flex items-center mb-2">
                        <span class="font-bold mr-2">{{
                         getValue(comment.author)
                        }}</span>
                        <span class="text-sm text-gray-500">{{
                          formatDate(comment.createdAt)
                        }}</span>
                      </div>
                      <p v-html="comment.comment" class="text-textDarker"></p>
                    </div>
                  </div>
                </div>

                <!-- Display a message if there are no comments -->
                <div v-else class="bg-cardLight rounded-lg p-4">
                  <p class="text-gray-500">
                    No answers yet. Be the first to answer...
                  </p>
                </div>
              </div>

              <dynamic-form
                :resource="commentResource"
                :initial-data="initData"
                :is-adding="true"
                redirect-to="current"
              />
            </div>
          </div>
        </div>
        <div class="md:w-1/4 mt-8 md:mt-0 fixed top-36 right-7 overflow-y-auto">
          <h2 class="text-2xl font-bold mb-6">Related Discussions</h2>
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="(discussion, index) in otherDiscussions"
              :key="index"
              class="bg-cardDark rounded-lg  text-wrap shadow-md p-6 hover:bg-cardLight cursor-pointer flex flex-col md:flex-row items-center"
              @click="navigateToDiscussion(discussion.id)"
            >
              <!-- Image -->
              <img
                :src="discussion.image"
                width="200"
                alt=""
                srcset=""
                class="mb-4 md:mb-0 md:mr-6"
              />

              <!-- Discussion Content -->
              <div class="flex-wrap">
                <h3
                  v-html="discussion.issue"
                  class="text-lg font-bold mb-2"
                ></h3>
                <div
                  class="flex items-center justify-between text-gray-600 text-sm"
                >
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-user"></i>
                    <span>{{ discussion.author }}</span>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div
                      class="flex items-center space-x-1 hover:text-gray-800 cursor-pointer"
                    >
                      <i class="fas fa-thumbs-up"></i>
                      <span></span>
                    </div>
                    <div
                      class="flex items-center space-x-1 hover:text-gray-800 cursor-pointer"
                    >
                      <i class="fas fa-thumbs-down"></i>
                      <span></span>
                    </div>
                    <div
                      class="flex items-center space-x-1 hover:text-gray-800 cursor-pointer"
                    >
                      <i class="fas fa-comment"></i>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoaderAlt from "../components/LoaderAlt.vue";
import DynamicForm from "./Admin/DynamicForm.vue";
import refOptionsService from "./Admin/refOptionsService";

export default {
  data() {
    return {
      id: "",
      loading: true,
      discussions: {
        comments: [],
      },
      newComment: "",
      initData: {},
      commentResource: {
        name: "discussion-comments",
        icon: "fa fa-message",
        label: "comments",
        menuGroup: "Forum",
        menuGroupIcon: "fa fa-users",
        schema: [
          {
            name: "author",
            title: "Author",
            type: "me",
          },
          {
            name: "discussion",
            title: "Discussion",
            type: "me",
          },
          {
            name: "comment",
            title: "Give Your Answer:",
            type: "richtext",
            required: true,
          },
        ],
      },
      otherDiscussions: [],
      refOptions:[],
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
    };
  },
  async mounted() {
    this.id = this.$route.params.id;
    this.fetchRefOptions("author", "farmers", "fullname");

    this.initData = {
      author: localStorage.getItem("userId"),
      discussion: this.id,
    };
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/discussions/${this.id}`
      );
      this.discussions = response.data;

      const commentResponse = await axios.get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/v1/discussion-comments/get-by-id?field=discussion&id=${this.id}`
      );
      this.discussions.comments = commentResponse.data.data;

      console.log(this.discussions.comments);

      // Fetch other discussions
      const otherResponse = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/discussions`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
      this.otherDiscussions = otherResponse.data.data.filter(
        (discussion) => discussion._id !== this.id
      ).slice(0, 3)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loading = false;
    }
  },
  components: { LoaderAlt, DynamicForm },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    async fetchRefOptions(field, resource, tuple) {
      this.refOptions = {};
      this.refOptions[field] = await refOptionsService.getRefOptions(
        resource,
        tuple
      );
    },
    getValue(resource, id) {
      const myValue = this.refOptions[resource];

      if (!Array.isArray(myValue)) {
        return null;
      }

      for (const obj of myValue) {
        if (obj.id === id) {
          return obj.name;
        }
      }

      return null;
    },
    getName(id) {
      return axios
        .get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/v1/users/get-by-id?field=_id&id=${id}`
        )
        .then((response) => {
          return response.data.data[0].fullname;
        })
        .catch((error) => {
          console.error("Error fetching name:", error);
          return null; // or throw error if you want
        });
    },
    async fetchName(id) {
      return await this.getName(id)
    },
    submitComment() {
      const newComment = {
        author: "Current User",
        content: this.newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
      };
      this.discussions.comments.push(newComment);
      this.newComment = "";
    },
    editComment(index) {
      // Add comment editing logic here
    },
    deleteComment(index) {
      this.discussions.comments.splice(index, 1);
    },
    goBack() {
      this.$router.go(-1);
    },
    async navigateToDiscussion(id) {
      await this.$router.push(`/dashboard/farmer/forum/${id}`);
      window.location.reload();
    },
  },
};
</script>
