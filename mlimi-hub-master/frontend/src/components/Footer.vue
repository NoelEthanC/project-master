<script setup>
import Logo from './Logo.vue';
</script>

<template>
  <div class="bg-black text-textLighter p-8 lg:flex lg:items-center lg:justify-evenly">
    <div class="lg:mr-16">
      <Logo/>
      <div class="text-center lg:text-justify my-5 leading-10">Empowering Malawian<br> Farmers for<br> Sustainable Growth</div>
      <div class="flex items-center justify-center lg:justify-start space-x-4">
        <div>
          <img src="https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/facebook.png?alt=media&token=fb648065-a2bf-4ebd-914d-4b7779eb85f3" />
        </div>
        <div>
          <img src="https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/youtube.png?alt=media&token=d149397d-b061-47af-87bd-0ebfc9825780" />
        </div>
        <div>
          <img src="https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/twitter.png?alt=media&token=167ca01d-8510-49a8-8a0e-0fb1acd9cc55" />
        </div>
      </div>
    </div>
    <div class="leading-loose mt-8 lg:mt-0">
      <div class="font-bold mb-2">Explore</div>
      <div>home</div>
      <div>about us</div>
      <div>contact</div>
    </div>
    <div class="leading-loose mt-8 lg:mt-0">
      <div class="font-bold mb-2">Contact</div>
      <div>+265 0999 777 1245</div>
      <div class="font-bold mb-2">Postal Address</div>
      <div>P/bag 5672 Luwinga Mzuzu</div>
      <div class="font-bold mb-2">Email</div>
      <div>mlimuhub@example.com</div>
      <div>
        <RouterLink to="/login/admin" class="px-4 py-2 font-bold text-textLight bg-secondary">Log in as administrator</RouterLink>
      </div>
    </div>
  </div>
</template>
