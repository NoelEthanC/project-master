<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-textLighter p-8 rounded-md w-[64vw] h-[90vh]">
      <h2 class="text-2xl font-semibold mb-4">{{ modalTitle }}</h2>
      
      <!-- Product Details -->
      <div class="flex items-center mb-4">
        <img :src="selectedProduct.image" alt="Product Image" class="w-[30%] h-[30%] object-cover mr-4 rounded-md">
        <div>
          <p class="text-gray-600">Product: {{ selectedProduct.title }}</p>
          <p class="text-gray-600">Description: {{ selectedProduct.description }}</p>
          <p class="text-gray-600">Price: ${{ selectedProduct.price.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Checkout Options -->
      <div class="flex items-center space-x-4">
        <button class="bg-tertiary text-textLighter py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-400">
          Add to Cart
        </button>
        <button class="bg-primary text-textLighter py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400">
          Buy Now
        </button>
      </div>

      <!-- Close Modal Button -->
      <button @click="closeModal" class="mt-4 bg-gray-300 text-text py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500">
        Close Modal
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
    selectedProduct: {
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
