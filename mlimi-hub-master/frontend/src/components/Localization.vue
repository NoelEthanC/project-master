<template>
  <div class="relative flex" @click="toggleDropdown">
    <img src="../assets/images/globe.png" alt="">
    <div class="mx-2"></div>
    <span class="text-sm">English</span>
    <div class="mx-2"></div>
    <img src="../assets/images/expandarrow.png" alt="">
    
    <!-- Dropdown Menu -->
    <div v-if="isDropdownOpen" class="absolute top-0 mt-10 bg-textLighter border rounded shadow">
      <!-- Your language options go here -->
      <div @click="selectLanguage('French')">Chichewa</div>
      <div @click="selectLanguage('Spanish')">Tumbuka</div>
      <div @click="selectLanguage('German')">Yao</div>
      <div @click="selectLanguage('Italian')">Sena</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDropdownOpen: false,
      selectedLanguage: 'English'
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectLanguage(language) {
      this.selectedLanguage = language;
      this.isDropdownOpen = false;
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    window.addEventListener('click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    });
  },
  beforeDestroy() {
    // Remove event listener to prevent memory leaks
    window.removeEventListener('click', this.closeDropdown);
  }
};
</script>
