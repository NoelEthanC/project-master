<template>
  <div class="bg-background">
    <div class="container mx-auto py-8 flex">
      <aside
        class="hidden md:block px-5 mt-6 md:w-1/6 bg-cardLight rounded-lg shadow-md mr-8 fixed top-20 bottom-20 overflow-y-auto"
      >
        <h2 class="text-2xl font-bold my-8">
          <i class="fas fa-list-ul mr-2"></i>All Categories
        </h2>
        <div class="space-y-2">
          <Loader v-if="loading" />
          <div
            v-else
            v-for="(category, index) in categories"
            :key="index"
            class="cursor-pointer hover:text-tertiary"
            @click="navigateToFilteredPage(category.categoryName)"
          >
            <div class="flex items-center">
              <img :src="category.icon" class="w-6 h-6 mr-2" />
              <span>{{ category.categoryName }}</span>
            </div>
          </div>
        </div>
        <h2 class="text-2xl font-bold mt-8 my-8">
          <i class="fas fa-store mr-2"></i>Merchants
        </h2>
        <div class="space-y-2">
          <Loader v-if="loading" />
          <div
            v-else
            v-for="(vendor, index) in vendors"
            :key="index"
            class="cursor-pointer hover:text-tertiary"
            @click="navigateToFilteredPage(vendor.merchantName)"
          >
            <div class="flex items-center">
              <img :src="vendor.logo" class="w-6 h-6 mr-2" />
              <span>{{ vendor.merchantName }}</span>
            </div>
          </div>
        </div>
      </aside>

      <div class="w-full md:w-3/4 ml-0 md:ml-[25%] overflow-y-auto">
        <header
        class="bg-cardLight shadow-sm fixed py-2 border-background border-t-[1.6rem] top-[4.5rem] z-20 w-[1155px]"
        >
          <div class="container mx-auto py-4 flex justify-between items-center">
            <div class="flex items-center">
              <input
                type="text"
                placeholder="Search for farm inputs..."
                class="bg-gray-200 mx-5 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary"
                v-model="searchQuery"
                @keyup.enter="navigateToFilteredPage(searchQuery)"
              />
              <button
                class="bg-tertiary text-textLighter px-4 py-2 rounded-md ml-4 hover:bg-tertiary-dark"
                @click="navigateToFilteredPage(searchQuery)"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>
            <div class="flex mx-6 items-center">
              <RouterLink to="/dashboard/farmer/purchases" class="text-gray-600 hover:text-gray-800 mr-4">
                <button class="bg-secondary font-bold p-6 rounded-md shadow-md text-textLight">
                  <i class="fas fa-shopping-cart"></i>
                  <span class="ml-2">My purchases </span>
                </button>
              </RouterLink>
            </div>
          </div>
        </header>
        <div class="mb-10"></div>
        <div class="mb-8 bg-menubg rounded-lg overflow-hidden">
          <div class="relative h-64 md:h-80">
            <div
              class="absolute inset-0 bg-gradient-to-r from-black via-black to-transparent"
            ></div>
            <SlideShow :slides="slides" :autoplayDelay="autoplayDelay" />
          </div>
        </div>
        <div class="">
          <div v-if="loading" class="flex justify-center">
            <Loader />
          </div>
          <div v-else>
            <div
              v-if="farmInputs.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <div
                v-for="(input, index) in farmInputs"
                :key="index"
                class="bg-cardLight rounded-md shadow-md overflow-hidden"
              >
                <div class="h-40 overflow-hidden">
                  <img
                    class="w-full h-full object-contain"
                    :src="input.image"
                    alt="Farm Input Image"
                  />
                </div>
                <div class="p-4">
                  <div class="flex justify-between items-center mb-2">
                    <h5 class="text-lg font-bold">
                      <i class="fas fa-money-bill-alt mr-2"></i>MWK{{
                        input.price
                      }}
                    </h5>
                    <button
                      @click="openModal(input)"
                      class="text-tertiary hover:text-tertiary-dark"
                    >
                      <i class="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                  <p class="text-sm">{{ input.title }}</p>
                  <div class="flex justify-center mt-2">
                    <button
                      @click="
                        () => {
                          this.$router.push(`marketplace/${input.id}`);
                        }
                      "
                      class="w-3/4 bg-tertiary text-textLighter py-1 px-2 rounded-md flex items-center justify-center hover:bg-tertiary-dark"
                    >
                      <i class="fas fa-shopping-cart mr-2"></i>Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-600">
              No inputs available.
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <div
            class="w-auto h-auto mx-auto text-center rounded-md cursor-pointer p-2 flex flex-col items-center justify-center hover:shadow-md hover:text-105%"
          >
            <p>Load more</p>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
        <modal-component
          :showModal="showModal"
          :modalTitle="modalTitle"
          :selectedProduct="selectedProduct"
          @close="showModal = false"
        ></modal-component>
      </div>
    </div>
  </div>
</template>

<script>
import ModalComponent from "../components/ProductModal.vue";
import axios from "axios";
import Loader from "../components/Loader.vue";
import { useRouter } from "vue-router";
import SlideShow from "../components/SlideShow.vue";
import Icon1 from "@/assets/images/gene-gallin-3sYiQxSDEMg-unsplash.jpg";
import Icon2 from "@/assets/images/image-from-rawpixel-id-13821212-jpeg.jpg";
import Icon3 from "@/assets/images/lumin-osity-6DMht7wYt6g-unsplash.jpg";

export default {
  data() {
    return {
      loading: true,
      showModal: false,
      selectedProduct: null,
      modalTitle: "Product Details",
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
      farmInputs: [],
      categories: [],
      vendors: [],
      searchQuery: "",
      slides: [
        {
          imageUrl: Icon1,
          title: "Mlimi Hub Market",
          description: "High quality farm inputs in one place",
        },
        {
          imageUrl: Icon2,
          title: "Know Your Equipment",
          description: "catalog of top quality farm inputs",
        },
        {
          imageUrl: Icon3,
          title: "Affordable",
          description: "Order Farm inputs in the comfort of your home",
        },
        // Add more slides as needed...
      ],
      autoplayDelay: 5000,
    };
  },

  components: {
    ModalComponent,
    Loader,
    SlideShow,
  },
  methods: {
    openModal(product) {
      this.selectedProduct = product;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    toggleDropdown() {
      this.$refs.myDropdown.classList.toggle("show");
    },
    async checkOut(name, image, price) {
      try {
        const data = JSON.stringify({
          name: name,
          image: image,
          amount: price,
        });

        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${import.meta.env.VITE_APP_API_URL}/api/v1/pay`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`,
          },
          data: data,
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));

        const checkOutUrl = response.data.checkout_url;

        // Navigate to the checkout page
        window.location.href = checkOutUrl;
      } catch (error) {
        console.error(error);
      }
    },
    closeDropdowns(event) {},
    navigateToFilteredPage(query) {
      this.$router.push({ name: "FilteredFarmInputs", query: { q: query } });
    },
  },
  async mounted() {
    window.addEventListener("click", this.closeDropdowns);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/products`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      const categoryResponse = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/product-categories`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      const vendorResponse = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/merchants`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      this.farmInputs = response.data.data;
      this.categories = categoryResponse.data.data;
      this.vendors = vendorResponse.data.data;
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loading = false;
    }
  },
  beforeDestroy() {
    window.removeEventListener("click", this.closeDropdowns);
  },
};
</script>
