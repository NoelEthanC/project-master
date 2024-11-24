<!-- Products.vue -->
<template>
    <div>
      <h1>Product List</h1>
  
      <!-- Show loading spinner when data is loading -->
      <div v-if="loading" class="loading-spinner">
        <Loader/>
      </div>
  
      <!-- Show product cards when data is available -->
      <div v-else>
        <div v-if="products.length > 0">
          
        </div>
        <!-- Show a message when no products are available -->
        <div v-else>
          <p>No products available.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import Loader from "../components/Loader.vue"
  
  export default {
    data() {
      return {
        products: [],
        loading: true,
        authToken: "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
      };
    },
    components:{Loader},
    async mounted() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/products`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        });
  
        this.products = response.data;
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
  };
  </script>
  
  <style scoped>
  .loading-spinner {
    text-align: center;
    font-size: 20px;
    margin-top: 20px;
  }
  
  .product-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px;
    width: 300px;
    display: inline-block;
  }
  </style>
  