<template>
  <div class="flex bg-background text-text items-center justify-evenly">
    <DashboardNavue :menu-open="isMenuOpen" @toggle-menu="toggleMenu" />
    <div
      class="h-[97vh] mx-3 bg-background w-[100vw] m-0 flex items-center justify-between flex-col"
    >
      <div
        class="flex w-screen items-center justify-between md:w-full h-16 border-secondary border-b-4 my-4 z-50"
      >
        <i @click="toggleMenu" class="fa-solid fa-bars ml-4 cursor-pointer"></i>
        <div class="relative mx-5 flex items-center">
          <span class="invisible md:visible">{{ userName }}</span>
          &nbsp;
          <i
            class="fa fa-user-circle text-2xl rounded-full text-secondary cursor-pointer"
            @click="showProfileModal = true"
          ></i>
        </div>
      </div>
      <div class="w-full h-screen bg-background overflow-y-scroll">
        <transition name="slide-fade" mode="out-in">
          <router-view @clicked-link="handleLinkClick" />
        </transition>
      </div>
    </div>

    <!-- Profile Modal -->
    <teleport to="body">
  <div v-if="showProfileModal" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="bg-background rounded-lg p-8 shadow-lg relative max-w-xl w-full">
      <h2 class="text-2xl font-bold mb-6">Profile Details</h2>
      <div class="mb-4">
        <label class="block font-bold mb-2">Name:</label>
        <span>{{ userName }}</span>
      </div>
      <div class="mb-4">
        <label class="block font-bold mb-2">Email:</label>
        <span>{{  userEmail  }}</span>
      </div>


      <div class="flex justify-end">
        <button class="bg-secondary text-text rounded-md py-2 px-4 mr-4" @click="showProfileModal = false">
          <i class="fas fa-times"></i> Close
        </button>
        <button @click="logout" class="bg-red-500 text-white rounded-md py-2 px-4">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  </div>
</teleport>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import DashboardNavue from "../components/DashboardNav.vue";
import Swal from "sweetalert2";

const userName = ref("");
const userEmail = ref("");
const router = useRouter();
const route = useRoute();

let isMenuOpen = ref(true);
const showProfileModal = ref(false);

onMounted(() => {
  userName.value = localStorage.getItem("userName") || "";
  userEmail.value = localStorage.getItem("email") ||"";

  if (!localStorage.getItem("authToken")) {
    router.push("/login");
  }
});

const logout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Do you want to Logout?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, Log me out!",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("password");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userId");
    localStorage.removeItem("gCode");
    localStorage.removeItem("role");
    localStorage.removeItem("avatar");

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "logged out!",
    });

    router.push("/login");
  } else {
    await Swal.fire({
      title: "Canceled",
      text: `You are still logged in.`,
      icon: "info",
    });
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLinkClick = () => {
  if (window.innerWidth <= 768) {
    isMenuOpen.value = false;
  }
};

const breadcrumbs = computed(() => {
  const paths = route.path.split("/").filter((path) => path !== "");
  return paths.map((path, index) => ({
    label: path,
    to: "/" + paths.slice(0, index + 1).join("/"),
  }));
});
</script>
<style>
.slide-fade-enter-active {
  animation: slideFadeEnter 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.slide-fade-leave-active {
  animation: slideFadeLeave 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slideFadeEnter {
  0% {
    opacity: 0;
    transform: rotate(-180deg) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
}

@keyframes slideFadeLeave {
  0% {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: rotate(180deg) scale(0.5);
  }
}
</style>
