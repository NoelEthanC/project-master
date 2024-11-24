<template>
    <div class="w-48 h-[70px]">
      <div class="w-48 h-[70px]  flex items-center justify-center  bg-primary rounded-[7px]">
          <div class="text-text text-xl font-normal font-['Poppins']">{{ caption }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      caption: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  