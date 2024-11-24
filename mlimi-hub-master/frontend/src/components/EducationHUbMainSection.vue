<template>
      <div class="flex justify-between items-center mx-10 overflow-y-scroll">
        <div class="flex justify-between items-center">
          <div class="w-5 h-16 rounded-full bg-secondary"></div>
          <div class=""></div>
          <div class="text-xl font-bold">500 courses</div>
        </div>
        <div class="flex justify-around items-center">
          <div><img src="https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/filter.png?alt=media&token=41505921-f612-4fab-80ba-afa5b34b1828" alt="" srcset=""></div>
          <div class="text-xl">All Filters</div>
          <div><img src="https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/expandarrow.png?alt=media&token=2733d6ae-2a18-4449-a8ac-5df5a88a3f58" alt="" srcset=""></div>
        </div>
      </div>
      <div class="">
        <div class="grid grid-cols-2 gap-4">
            <HubCard/>
            <HubCard/>
            <HubCard/>
            <HubCard/>
        </div>
      </div>
</template>


<script>
  import HubCard from './HubCard.vue';
  export default {
  components: {
    HubCard
  },
};
</script>
