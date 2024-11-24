<template>
  <div class="carousel relative w-full h-80 md:h-96 lg:h-100 overflow-hidden">
    <!-- Carousel Inner -->
    <div
      class="carousel-inner flex w-full h-full transition-transform duration-500"
      :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }"
    >
      <!-- Carousel Items -->
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="carousel-item flex-shrink-0 w-full h-full"
        :class="{ 'active': currentSlideIndex === index }"
      >
        <div class="carousel-image-container relative w-full h-full">
          <!-- Image -->
          <img :src="slide.imageUrl" :alt="slide.title" class="w-full h-full object-cover" />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black opacity-50"></div>
          
          <!-- Text Content -->
          <div class="absolute inset-0 flex flex-col justify-center items-center text-textLighter px-4">
            <h3 class="carousel-title text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              {{ slide.title }}
            </h3>
            <p v-if="slide.description" class="carousel-description text-lg md:text-xl lg:text-2xl">
              {{ slide.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel Controls -->
    <div class="carousel-controls absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between z-10">
      <button @click="previousSlide" class="carousel-control bg-tertiary  hover:bg-opacity-80 text-gray-800 m-3 px-4 py-2 rounded-full focus:outline-none">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button @click="nextSlide" class="carousel-control bg-tertiary hover:bg-opacity-80 text-gray-800 m-3 px-4 py-2 rounded-full focus:outline-none">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  props: {
    slides: {
      type: Array,
      required: true,
    },
    autoplayDelay: {
      type: Number,
      default: 5000,
    },
  },
  data() {
    return {
      currentSlideIndex: 0,
      intervalId: null,
    };
  },
  mounted() {
    this.startAutoplay();
  },
  beforeUnmount() {
    this.stopAutoplay();
  },
  methods: {
    startAutoplay() {
      this.intervalId = setInterval(this.nextSlide, this.autoplayDelay);
    },
    stopAutoplay() {
      clearInterval(this.intervalId);
    },
    nextSlide() {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    },
    previousSlide() {
      this.currentSlideIndex =
        (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
    },
  },
};
</script>
