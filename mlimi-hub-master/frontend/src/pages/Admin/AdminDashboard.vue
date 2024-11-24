<script setup>
import Logo from "../../components/Logo.vue";
</script>
<template>
  <div class="flex h-screen text-text">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-menubg w-80 text-textLighter h-screen flex flex-col overflow-y-scroll transition-transform duration-300 shadow-2xl',
        'fixed lg:static',
        'w-64 z-10',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Sidebar Header -->
      <div class="p-4 flex items-center justify-between">
        <div class="w-full mb-16 flex justify-center"><Logo /></div>
        <!-- Button to toggle sidebar -->
        <button
          @click="toggleSidebar"
          class="text-textLighter focus:outline-none hover:text-gray-400 transition duration-300 lg:hidden"
        >
          <i :class="sidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>
      </div>

      <!-- Sidebar Links -->
      <nav class="flex-1 p-4 text-lg">
        <ul>
          <RouterLink :to="`/dashboard/admin`" class="block">
            <li
              :class="[
                'flex items-center p-2 rounded-md hover:bg-secondary hover:text-textLight transition duration-300',
                {
                  'bg-backgroundHover text-textLight':
                    isActive(`/dashboard/admin`),
                },
              ]"
            >
              <i class="fa fa-home mr-2"></i>Home
            </li>
          </RouterLink>

          <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
            <li
              @click="toggleMenuGroup(menuGroup.name)"
              :class="[
                'flex items-center p-2 rounded-md  hover:text-textLight cursor-pointer transition duration-300',
                { ' text-textLight': isMenuGroupOpen(menuGroup.name) },
              ]"
            >
              <i :class="`${menuGroup.icon} mr-2`"></i>{{ menuGroup.label }}
              <i
                :class="[
                  'fas ml-auto',
                  isMenuGroupOpen(menuGroup.name)
                    ? 'fa-chevron-up'
                    : 'fa-chevron-down',
                ]"
              ></i>
            </li>
            <ul v-if="isMenuGroupOpen(menuGroup.name)">
              <template
                v-for="resource in menuGroup.resources"
                :key="resource.name"
              >
                <RouterLink
                  :to="{
                    name: resource.name,
                    query: {
                      page: 1,
                      limit: 5,
                      search: '',
                      sortBy: '',
                      order: 'asc',
                    },
                  }"
                  class="block"
                >
                  <li
                    :class="[
                      'flex items-center p-2 pl-8 rounded-md hover:bg-secondary hover:text-textLight transition duration-300',
                      {
                        'bg-backgroundHover text-textLight': isActive(
                          `/dashboard/admin/${resource.name}`
                        ),
                      },
                    ]"
                  >
                    <i :class="resource.icon"></i>&nbsp;{{ resource.label }}
                  </li>
                </RouterLink>
              </template>
            </ul>
          </template>

          <!-- Render resources without a menuGroup -->
          <template
            v-for="resource in resourcesWithoutMenuGroup"
            :key="resource.name"
          >
            <RouterLink
              :to="{
                name: resource.name,
                query: {
                  page: 1,
                  limit: 5,
                  search: '',
                  sortBy: '',
                  order: 'asc',
                },
              }"
              class="block"
            >
              <li
                :class="[
                  'flex items-center p-2 rounded-md hover:bg-secondary hover:text-textLight transition duration-300',
                  {
                    'bg-primary text-textLight': isActive(
                      `/dashboard/admin/${resource.name}`
                    ),
                  },
                ]"
              >
                <i :class="resource.icon"></i>&nbsp;{{ resource.label }}
              </li>
            </RouterLink>
          </template>
        </ul>
      </nav>
    </div>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col w-[100vw]">
      <!-- Top Bar -->
      <div
        class="bg-secondary text-black p-4 flex items-center justify-between shadow-md"
      >
        <!-- Toggle button for large screens -->
        <button
          @click="toggleSidebar"
          class="lg:block text-black focus:outline-none hover:text-gray-400 transition duration-300"
        >
          <i class="fas fa-bars text-textLight"></i>
        </button>
        <div class="flex items-center">
          <!-- Profile section -->
          <div class="ml-4 relative">
            <button
              class="flex items-center text-black focus:outline-none hover:text-gray-400 transition duration-300"
              @click="profileDropdownOpen = !profileDropdownOpen"
            >
              <img
                :src="`https://via.placeholder.com/40`"
                alt="Profile"
                class="rounded-full w-8 h-8 mr-2 shadow-md"
              />
              <span class="text-textLight font-bold">{{ userName }}</span>
              <i class="fas fa-chevron-down ml-2"></i>
            </button>
            <div
              v-if="profileDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-textLighter rounded-md shadow-lg z-10"
            >
              <div
                class="px-4 py-2 hover:bg-background cursor-pointer transition duration-300"
              >
                Profile
              </div>
              <div
                class="px-4 py-2 hover:bg-background cursor-pointer transition duration-300"
              >
                Settings
              </div>
              <div
                @click="logout"
                class="px-4 py-2 hover:bg-background cursor-pointer transition duration-300"
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div
        class="p-4 flex-1 shadow-inner bg-background overflow-y-scroll transition-all duration-300"
      >
        <!-- Your main content goes here -->
        <transition name="slide-fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { Resources } from "../../data/Resources";

export default {
  name: "AdminDashboardNav",
  data() {
    return {
      sidebarOpen: window.innerWidth >= 1024,
      profileDropdownOpen: false,
      currentPath: this.$route.path,
      systemLogo: null,
      openMenuGroups: [],
      userName: null,
      avatarUrl: null,
    };
  },

  computed: {
    breadcrumbs() {
      const paths = this.currentPath.split("/").filter((path) => path !== "");
      return paths.map((path, index) => ({
        label: path,
        to: "/" + paths.slice(0, index + 1).join("/"),
      }));
    },
    menuGroups() {
      const menuGroups = {};
      for (const resource of Resources) {
        if (resource.menuGroup) {
          if (!menuGroups[resource.menuGroup]) {
            menuGroups[resource.menuGroup] = {
              name: resource.menuGroup,
              label: resource.menuGroup,
              icon: resource.menuGroupIcon,
              resources: [],
            };
          }
          menuGroups[resource.menuGroup].resources.push(resource);
        }
      }
      return Object.values(menuGroups);
    },
    resourcesWithoutMenuGroup() {
      return Resources.filter((resource) => !resource.menuGroup);
    },
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    handleResize() {
      // Open sidebar by default on large screens and close on small screens
      this.sidebarOpen = window.innerWidth >= 1024;
    },
    isActive(route) {
      return this.$route.path === route;
    },
    toggleMenuGroup(name) {
      const index = this.openMenuGroups.indexOf(name);
      if (index === -1) {
        this.openMenuGroups.push(name);
      } else {
        this.openMenuGroups.splice(index, 1);
      }
    },
    isMenuGroupOpen(name) {
      return this.openMenuGroups.includes(name);
    },
    async logout() {
      const result = await this.$swal.fire({
        title: "Are you sure?",
        text: `Do you want to Logout?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Log me out!",
      });

      // If the user confirms, delete the record
      if (result.isConfirmed) {
        // Clear local storage variables
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("systemname");
        localStorage.removeItem("systemlogo");
        localStorage.removeItem("user");

        // Redirect to /login
        this.$router.push("/login/admin");
        this.$swal.fire({
          icon: "success",
          title: "Success!",
          text: "logged out!",
        });
      } else {
        // If the user cancels, show a message that the record is safe
        await this.$swal.fire({
          title: "Canceled",
          text: `You are still logged in.`,
          icon: "info",
        });
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.userName = localStorage.getItem("userName");
    this.systemLogo = localStorage.getItem("systemlogo");
    if (!localStorage.getItem("userName")) {
      this.$router.push("/login/admin");
    }
    this.$watch(
      () => this.$route.path,
      (path) => {
        this.currentPath = path;
        // Close the sidebar on mobile devices when a link is clicked
        if (window.innerWidth < 1024) {
          this.sidebarOpen = false;
        }
      }
    );
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style>
.slide-fade-enter-active {
  animation: slideFadeEnter 0.5s ease both;
}

.slide-fade-leave-active {
  animation: slideFadeLeave 0.5s ease both;
}

@keyframes slideFadeEnter {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFadeLeave {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
  }
}
</style>
