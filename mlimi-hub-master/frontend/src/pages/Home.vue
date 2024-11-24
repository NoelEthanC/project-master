<script setup>
import Container from "../components/Container.vue";
import { ref } from 'vue';
import NavMenu from "../components/NavMenu.vue";
import HeroSection from "../components/HeroSection.vue";
import AboutUsSection from "../components/AboutUsSection.vue";
import WhyUsSection from "../components/WhyUsSection.vue";
import OurFeaturesSection from "../components/OurFeaturesSection.vue";
import MobileAppPromoSection from "../components/MobileAppPromoSection.vue";
import Footer from "../components/Footer.vue";
import Contact from "../components/Contact.vue";
import Community from "../components/Community.vue";
import SlideShow from "../components/SlideShow.vue";
const showScrollButton = ref(false);

window.addEventListener('scroll', () => {
  showScrollButton.value = window.scrollY > 200; // Adjust the value as needed
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>

<template>
      
    <NavMenu/>


    <div class="mx-6">
      <HeroSection/>
      <AboutUsSection/>
      <WhyUsSection/>
      <Community/>
      <div class="flex justify-center"><OurFeaturesSection/></div>
      <div class="flex items-center justify-center "><MobileAppPromoSection/></div>
    </div>

  <Contact/>
  <Footer />
<div>
  <button
      v-show="showScrollButton"
      @click="scrollToTop"
      class="fixed bottom-48 right-24 w-20 h-20 flex items-center justify-center bg-secondary text-textLighter p-8 rounded-full shadow-md cursor-pointer transition duration-300 ease-in-out hover:bg-tertiary"
    >
      <img src="https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/arrow_top.png?alt=media&token=ae809f4f-2838-4cc3-91c0-a1683327a47e" alt="" srcset="">
    </button>
  </div>

</template>