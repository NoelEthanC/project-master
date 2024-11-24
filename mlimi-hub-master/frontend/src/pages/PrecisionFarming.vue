<template>
  <div class="bg-background min-h-screen">
    <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-menubg">Precision Farming</h1>
        <p class="text-lg text-gray-600 mt-4">
          Upload an image for disease and pest diagnosis
        </p>
      </div>

      <div class="flex justify-center items-center mt-8">
        <div
          class="w-full md:w-2/3 lg:w-1/2 border-2 border-dashed border-gray-400 rounded-lg p-8 cursor-pointer"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="openFileInput"
        >
          <input
            type="file"
            @change="handleFileUpload"
            class="hidden"
            ref="fileInput"
          />
          <div class="w-full h-full flex flex-col justify-center items-center">
            <i
              class="fas fa-upload text-gray-500 text-4xl mb-4"
              aria-hidden="true"
            ></i>
            <p class="text-lg text-gray-600 mb-4">
              Drag and drop or click to upload an image
            </p>
            <button
              class="bg-secondary hover:bg-tertiary text-textLighter py-2 px-4 rounded-md"
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      <div v-if="results" class="mt-12 bg-textLighter rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-menubg mb-4">Diagnosis Results</h2>
        <p class="text-text">{{ results }}</p>
        <p class="text-text mt-4">Remedy Suggestions:</p>
        <ul class="list-disc pl-6 text-text">
          <li>Remedy 1</li>
          <li>Remedy 2</li>
          <li>Remedy 3</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      results: null,
      remedySuggestions: [],
    };
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      await this.processImage(file);
    },
    async handleDrop(event) {
      const file = event.dataTransfer.files[0];
      await this.processImage(file);
    },
    async processImage(file) {
      try {
        // Convert the image to a base64-encoded string
        const imageData = await this.convertImageToBase64(file);

        // Send the image data to the server for prediction
        const response = await axios.post('/predict', { imageData });
        this.results = response.data.prediction;

        // Fetch remedy suggestions based on the prediction
        this.remedySuggestions = await this.fetchRemedySuggestions(this.results);
      } catch (error) {
        console.error(error);
        this.results = 'An error occurred during the diagnosis.';
        this.remedySuggestions = [];
      }
    },
    async convertImageToBase64(file) {
      const buffer = await file.arrayBuffer();
      return Buffer.from(buffer).toString('base64');
    },
    async fetchRemedySuggestions(prediction) {
      // Implement your logic to fetch remedy suggestions based on the prediction
      return ['Remedy 1', 'Remedy 2', 'Remedy 3'];
    },
  },
};
</script>

<style scoped>
.fas {
  @apply text-gray-500;
}

</style>