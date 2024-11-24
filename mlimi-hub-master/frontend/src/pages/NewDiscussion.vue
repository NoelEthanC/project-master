<template>
  <button
    @click="$router.go(-1)"
    class="bg-secondary text-tertiary font-bold py-2 px-4 rounded-md"
  >
    <i class="fa fa-arrow-left"></i>
    Back
  </button>
  <DynamicForm :resource="resource" :initial-data="init" :is-adding="true" redirect-to="prev"/>
</template>

<script>
import DynamicForm from "./Admin/DynamicForm.vue";

export default {
  components: { DynamicForm },
  data() {
    return {
      resource: {
        name: "discussions",
        icon: "fa fa-bookmark",
        schema: [
          {
            name: "author",
            title: "Author",
            type: "me",

          },
          {
            name: "category",
            title: "Category ",
            type: "ref",
            resource: "discussion-categories",
            field: "categoryName",
          },
          {
            name: "image",
            title: "Image",
            type: "image",
          },
          {
            name: "issue",
            title: "Description",
            type: "richtext",
            required: true,
          },
        ],
        renderMode: "crud",
      },
      init:{
        author:localStorage.getItem("userId"),
      }
    };
  },
};
</script>
