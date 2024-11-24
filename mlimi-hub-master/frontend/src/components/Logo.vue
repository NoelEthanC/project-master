<script setup>
import { RouterLink } from "vue-router";
import Loader from "./Loader.vue";
import axios from "axios";
</script>

<template>
  <Loader v-if="loading"/>
  <RouterLink v-else to="/">
    <div>
      <img class="w-[108px] h-[100px]" :src="logo" />
    </div>
  </RouterLink>
</template>



<script>

export default {
  data(){
    return {
      loading:false,
      logo:""
    }
  },
  mounted(){
    this.fetchSystemConfig();
  },
  methods:{
    async fetchSystemConfig() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`
        );
        this.logo = response.data.data[0].logo;
        console.log(response.data.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  }
}


</script>
