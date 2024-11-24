<!-- Container.vue -->

<template>
    <div :class="`mx-${xMargin} w-full max-w-screen-xl mx-auto`">
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      xMargin: {
        type: String,
        default: '4', // You can set a default margin value or leave it as per your requirements
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styling for the container if needed */
  </style>
  