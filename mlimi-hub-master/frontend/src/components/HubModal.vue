<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-textLighter p-4 sm:p-8 rounded-md w-full sm:w-[64vw] max-w-2xl h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl sm:text-3xl font-semibold"></h2>
        <button @click="closeModal" class="text-gray-500 hover:text-text focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <p class="text-gray-600 mb-4">Course: {{ selectedCourse.title }}</p>
      <!-- Add more modal content as needed -->
      <button @click="closeModal"
        class="w-full bg-tertiary text-textLighter py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-400">
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    modalTitle: {
      type: String,
      required: true,
    },
    selectedCourse: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeModal() {
      // Add any logic you need when closing the modal
      this.$emit('close');
    },
  },
};
</script>
