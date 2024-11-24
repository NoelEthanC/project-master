<template>
  <LoaderAlt v-if="loading"/>
  <div v-else>
    <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <div class="md:w-1/2 bg-cardLight p-5 flex flex-col items-center justify-center w-full">
        <button
                @click="$router.go(-1)"
                class="bg-secondary text-tertiary font-bold py-2 px-4 float-left relative rounded-md"
              >
              <i class="fa fa-arrow-left"></i>
                Back
              </button>
        <img
          :src="selectedProduct.image"
          alt="Product Image"
          class="w-72 h-auto rounded-md mt-3"
        />
      </div>

      <div class="md:w-1/2 w-full">
        <h1 class="text-2xl font-bold text-textLight mb-4">
          {{ selectedProduct.title }}
        </h1>

        <p v-html=" selectedProduct.description " class="text-gray-600 mb-4"></p>

        <div class="flex items-center mb-4">
          <span class="text-xl font-bold text-yellow-600 mr-2"
            >MWK{{ selectedProduct.price }}</span
          >
        </div>

        <div class="flex flex-wrap items-center gap-4">


          <div v-if="isCheckingOut">
            <Loader />
          </div>

          <button
            v-else
            class="bg-green-500 hover:bg-green-600 text-textLighter px-4 py-2 rounded-md"
            @click="
              checkOut(
                selectedProduct.title,
                selectedProduct.image,
                selectedProduct.price
              )
            "
          >
            Buy
          </button>
        </div>

        <div class="flex items-center mt-4">
          <span class="text-gray-500">Rating:</span>
          <span class="text-yellow-500 ml-2"
            >{{ selectedProduct.rating }} / 5</span
          >
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">

      <div class="w-full">
        <h2 class="text-2xl font-bold mb-4">Related Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="product in relatedProducts"
            :key="product._id"
            class="bg-cardLight shadow-md rounded-lg p-4 cursor-pointer"
            @click="navigateToProduct(product.id)"
          >
            <div class="h-[24vh] py-5">
              <img
                class="object-contain w-full h-full"
                :src="product.image"
                alt="Farm Input Image"
              />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ product.title }}</h3>
            <p v-html=" product.description " class="text-gray-600 mb-4"></p>
            <div class="flex justify-between items-center">
              <span class="text-yellow-500 font-bold"
                >MWK{{ product.price }}</span
              >
              <button
              class="bg-secondary text-text font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoaderAlt from "../components/LoaderAlt.vue";
import Loader from "../components/Loader.vue";
export default {
  components: { LoaderAlt, Loader },
  data() {
    return {
      isCheckingOut: false,
      loading: false,
      selectedProduct: {},
      relatedProducts: [],
      comments: [],
      newComment: "",
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
    };
  },
  async mounted() {
    const productId = this.$route.params.id;
    this.loading = true;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
      this.selectedProduct = response.data;
      this.relatedProducts = await this.getRelatedProducts(
        this.selectedProduct.title
      );
      this.comments = await this.getComments(this.selectedProduct._id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      this.loading = false;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async navigateToProduct(id) {
      await this.$router.push(`/dashboard/farmer/marketplace/${id}`);
      window.location.reload();

    },
    async getRelatedProducts(title) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/products`,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );
        return response.data.data.filter(
          (product) => product._id !== this.selectedProduct._id
        );
      } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
      }
    },
    async getComments(productId) {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/v1/comments?productId=${productId}`,
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    },
    async checkOut(name, image, price) {
      this.isCheckingOut=true;
      try {
        const data = JSON.stringify({
          name: name,
          image: image,
          amount: price,
          farmer:localStorage.getItem("userId"),
          productId:this.selectedProduct._id
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
      }finally {this.isCheckingOut = false}
    },
    async submitComment() {
      try {
        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/comments`,
          {
            productId: this.selectedProduct._id,
            content: this.newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );
        this.comments.push({
          id: Math.random().toString(36).substring(7),
          user: {
            name: "John Doe",
            avatar: "https://via.placeholder.com/40",
          },
          content: this.newComment,
        });
        this.newComment = "";
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    },
  },
};
</script>
