<template>
  <div class="w-[122px] h-[66px]">
    <div
      class="w-[122px] h-[66px] flex items-center justify-center bg-stone-950 rounded-[7px] transition duration-400 hover:bg-stone-800"
    >
      <div class="text-textLighter text-base font-semibold font-['Poppins']">
        {{ caption }}
      </div>
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
