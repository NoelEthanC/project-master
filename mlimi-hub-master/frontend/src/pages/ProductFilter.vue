<template>
    <div class="bg-background min-h-screen">
      <div class="container mx-auto py-8">
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-[100%] rounded-md mb-5 md:right-0 md:h-[92vh] md:overflow-y-scroll">
            <h1 class="text-4xl">Showing results for <b class="text-tertiary">"{{ $route.query.q }}"</b></h1>
            <div class="mt-4">
              <div class="flex justify-between items-center mb-4">
                <button @click="$router.go(-1)" class="bg-tertiary text-textLighter py-2 px-4 rounded-md">
                  Back
                </button>
                <input
                  type="text"
                  placeholder=" &#x1F50D; Search for farm inputs..."
                  class="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary pl-10"
                  v-model="searchQuery"
                  @input="filterFarmInputs"
                />
              </div>
              <div v-if="filteredFarmInputs.length > 0">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-[97%] h-[85vh] m-2 scroll-smooth overflow-y-scroll">
                  <div
                    class="w-full h-[38vh] rounded-md overflow-hidden shadow-md border border-gray-200 bg-textLighter"
                    v-for="(input, index) in filteredFarmInputs"
                    :key="index"
                  >
                    <div class="h-[24vh] bg-tertiary">
                      <img
                        class="object-contain w-full h-full"
                        :src="input.image"
                        alt="Farm Input Image"
                      />
                    </div>
                    <div class="p-4">
                      <div class="flex justify-between items-center mb-2">
                        <h5 class="text-lg font-bold">MWK{{ input.price }}</h5>
                        <img
                          class="w-4 h-4"
                          src="../assets/images/ellipsisgreensmall.png"
                          alt="Options"
                        />
                      </div>
                      <p class="text-sm">{{ input.title }}</p>
                      <div class="flex justify-center mt-2">
                        <button
                          @click="
                            () => {
                              this.$router.push(`/marketplace/${input.id}`);
                            }
                          "
                          class="w-3/4 bg-tertiary text-textLighter py-1 px-2 rounded-md flex items-center justify-center"
                        >
                          <img
                            class="w-4 h-4 mr-1"
                            src="../assets/images/shoppingtrolley.png"
                            alt="Cart"
                          />
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-4xl h-[60vh] w-full flex justify-center items-center text-gray-600">
                <b class="text-tertiary">Oops!</b> No inputs found.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        searchQuery: this.$route.query.q || '',
        farmInputs: [],
        filteredFarmInputs: [],
        authToken:
          'eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU',
      };
    },
    mounted() {
      this.fetchFarmInputs();
    },
    methods: {
      async fetchFarmInputs() {
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/products`, {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          });
  
          this.farmInputs = response.data.data;
          this.filteredFarmInputs = response.data.data.filter((input) =>
            input.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      filterFarmInputs() {
        this.filteredFarmInputs = this.farmInputs.filter((input) =>
          input.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
    },
  };
  </script>