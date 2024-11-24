<script setup>
import Logo from "./Logo.vue";
</script>

<template>
  <div class="flex justify-center items-center bg-background h-screen top-0 z-40">

    <div v-if="menuOpen" class="h-screen w-screen md:w-80 ml-[100vw] rounded-md px-6 md:ml-2 md:h-[97vh] my-nav bg-menubg font-extrabold text-lg">
      <div class="text-textLighter mt-10 flex justify-between items-center mb-10">
        <div class="w-full mb-16 flex justify-center"><Logo/></div>
        <div class="text-textLighter font-extrabold" @click="toggleMenu">
          <i class="fa fa-times"></i>
        </div>
      </div>
      <div class="flex flex-col items-start justify-evenly h-[40vh] text-textLighter">
        <RouterLink
          v-for="(navLink, index) in navLinks"
          :key="index"
          class="flex items-center justify-start pl-6 pr-10 py-4 rounded-full"
          :to="navLink.to"
          :class="{ 'bg-secondary flex justify-center pl-6 pr-20 py-4 rounded-full text-black': activeLink === navLink.to }"
          @click="setActiveLink(navLink.to)"
        >
          <i :class="`fa fa-${navLink.icon} w-7`"></i>
    
          {{ navLink.label }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { English } from "@/data/locallization";

export default {
  props: {
    menuOpen: Boolean,
  },
  data() {
    return {
      navLinks: [
        { to: "/dashboard/farmer", label: English.dashBoardNavLinks[0], icon: "th-large" },
        { to: "/dashboard/farmer/marketplace", label: English.dashBoardNavLinks[1], icon: "shopping-cart" },
        { to: "/dashboard/farmer/purchases", label: English.dashBoardNavLinks[2], icon: "shopping-bag" },
        { to: "/dashboard/farmer/educationhub", label: English.dashBoardNavLinks[3], icon: "graduation-cap" },
        { to: "/dashboard/farmer/precisionfarming", label: English.dashBoardNavLinks[4], icon: "tractor" },
        { to: "/dashboard/farmer/forum", label: English.dashBoardNavLinks[5], icon: "people-group" },
        { to: "/dashboard/farmer/reports", label: English.dashBoardNavLinks[6], icon: "chart-line" },
        { to: "/dashboard/farmer/chat", label: English.dashBoardNavLinks[8], icon: "message" },
        { to: "/dashboard/farmer/profile", label: English.dashBoardNavLinks[9], icon: "user" },
      ],
    };
  },
  computed: {
    activeLink() {
      return this.$route.path;
    },
    isMobile() {
      return window.innerWidth <= 768;
    },
  },
  methods: {
    toggleMenu() {
      this.$emit("toggle-menu");
    },
    handleLinkClick(link) {
      this.$router.push(link);
      this.$emit("toggle-menu");
    },
    setActiveLink(link) {
      this.$router.push(link);
    },
  },
  components: {
    RouterLink,
  },
};
</script>

