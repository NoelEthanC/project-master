<template>
  <div
    class="mt-10 sticky top-0 px-4 md:px-60 bg-textLighter z-50 py-2"
    :class="{ 'border-b-2 border-stone-300': scrollPosition > 0 }"
  >
    <!-- Hamburger Icon for Mobile -->
    <div class="sm:hidden flex justify-between items-center">
      <div class="flex items-center">
        <Logo />
      </div>
      <div class="cursor-pointer z-40" @click="toggleMobileMenu">
        <i
     
          :class="isMobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"
        ></i>
      </div>
    </div>

    <!-- Navigation Links for Desktop -->
    <div class="hidden sm:flex items-center justify-between bg-textLighter">
      <!-- Logo -->
      <div class="flex items-center">
        <Logo />
      </div>

      <!-- Navigation Links -->
      <div class="justify-start items-end gap-8 text-lg inline-flex">
        <a
          :to="'/home'"
          @click="scrollToTop()"
          :class="{ 'active-menu': activeMenuItem === '/home' }"
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          home
        </a>
        <a
          :to="'#about-section'"
          @click="
            setActiveMenuItem('/about');
            scrollToTarget('about-section');
          "
          :class="{ 'active-menu': activeMenuItem === '/about' }"
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          about us
        </a>
        <a
          :to="'#why-section'"
          @click="
            setActiveMenuItem('/why');
            scrollToTarget('why-section');
          "
          :class="{ 'active-menu': activeMenuItem === '/why' }"
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          why us
        </a>
        <a
          :to="'#contact-section'"
          @click="
            setActiveMenuItem('/contact');
            scrollToTarget('contact-section');
          "
          :class="{ 'active-menu': activeMenuItem === '/contact' }"
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          contact us
        </a>
      </div>

      <!-- Localization and Login/Dashboard -->
      <div class="flex items-center gap-4">
        <Localization />
        <div v-if="userName" class="flex items-center">
          <RouterLink to="/dashboard/farmer">
            <TertiaryButton caption="dashboard">
              <font-awesome-icon
                icon="fa-solid fa-tachometer-alt"
                class="mr-2"
              />
            </TertiaryButton>
          </RouterLink>
        </div>
        <div v-else>
          <RouterLink to="/login">
            <TertiaryButton caption="login">
              <font-awesome-icon icon="fa-solid fa-sign-in-alt" class="mr-2" />
            </TertiaryButton>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="sm:hidden">
      <div
        class="left-0 absolute flex flex-col bg-textLighter w-full p-6 h-[30vh] justify-evenly z-40"
      >
        <a
          :to="'/home'"
          @click="scrollToTop()"
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          home
        </a>
        <a
          :to="'#about-section'"
          @click="
            setActiveMenuItem('/about');
            scrollToTarget('about-section');
          "
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          about us
        </a>
        <a
          :to="'#why-section'"
          @click="scrollToTarget('why-section')"
          :class="{ 'active-menu': activeMenuItem === '/why' }"
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          why us
        </a>
        <a
          :to="'#contact-section'"
          @click="scrollToTarget('contact-section')"
          :class="{ 'active-menu': activeMenuItem === '/contact' }"
          class="text-stone-950 text-base font-normal font-['Poppins']"
        >
          contact us
        </a>
        <div v-if="userName" class="flex items-center">
          <RouterLink to="/dashboard/farmer">
            <TertiaryButton caption="dashboard">
              <font-awesome-icon
                icon="fa-solid fa-tachometer-alt"
                class="mr-2"
              />
            </TertiaryButton>
          </RouterLink>
        </div>
        <div v-else>
          <RouterLink to="/login">
            <TertiaryButton caption="login">
              <font-awesome-icon icon="fa-solid fa-sign-in-alt" class="mr-2" />
            </TertiaryButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import Logo from "./Logo.vue";
import Localization from "./Localization.vue";
import TertiaryButton from "./Buttons/TertiaryButton.vue";

const activeMenuItem = ref("/home");
const isMobileMenuOpen = ref(false);
const userName = ref(null);

onMounted(() => {
  const storedUserName = localStorage.getItem("userName");
  userName.value = storedUserName;
});

function setActiveMenuItem(item) {
  activeMenuItem.value = item;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function scrollToTarget(sectionId) {
  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth" });
  }
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

const scrollPosition = ref(0);

window.addEventListener("scroll", () => {
  scrollPosition.value = window.scrollY;
});
</script>

<style scoped>
.active-menu {
  position: relative;
}

.active-menu::after {
  content: "";
  display: block;
  position: absolute;
  bottom: -9px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: #608609;
  border-radius: 4px;
  transition: transform 0.3s ease;
  transform-origin: center;
}

.active-menu:focus::after {
  transform: scaleX(0);
}

button {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
}
</style>