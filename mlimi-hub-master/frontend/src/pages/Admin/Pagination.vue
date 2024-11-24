<!-- Pagination.vue -->
<template>
    <div class="flex items-center justify-center space-x-4">
      <button
        :disabled="currentPage === 1"
        @click="$emit('prev-page')"
        class="bg-cardLight hover:bg-gray-300 text-text font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span class="text-text font-bold">{{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="$emit('next-page')"
        class="bg-cardLight hover:bg-gray-300 text-text font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true,
      },
      totalPages: {
        type: Number,
        required: true,
      },
    },
  };
  </script>