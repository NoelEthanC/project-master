<template>
  <div v-if="loading">
    <LoaderAlt />
  </div>
  <div v-else class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ resource.label }}</h1>
    <DynamicForm
      :resource="resource"
      :initial-data="object"
      :is-adding="isAdding"
      redirect-to="current"
      class="p-4 shadow-md rounded-md"
    />
  </div>
</template>

<script>
import DynamicForm from "./DynamicForm.vue";
import LoaderAlt from "../../components/LoaderAlt.vue";
import axios from "axios";

export default {
  components: { DynamicForm, LoaderAlt },
  data() {
    return {
      loading: false,
      object: null,
      isAdding: true,
    };
  },
  created() {
    this.fetchResource();
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  watch: {
    resource: {
      handler() {
        this.fetchResource();
      },
      deep: true,
    },

  },
  methods: {
    refreshWindow() {
      window.location.reload();
    },
    fetchResource() {
      this.loading = true;
      const id = localStorage.getItem("userId");

      if (this.resource.singletonType == "profile") {
        this.isAdding = false;
        axios
          .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/${id}`)
          .then((response) => {
            this.object = response.data;
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error fetching resource:", error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        axios
          .get(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}`
          )
          .then((response) => {
            if (response.data.data.length > 0) {
              this.isAdding = false;
              this.object = response.data.data[0];
            } else {
              this.isAdding = true;
              this.object = {};
            }
          })
          .catch((error) => {
            console.error("Error fetching resource:", error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
