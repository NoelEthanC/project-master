<template>
  <div class="flex flex-col-reverse sm:flex-row sm:h-[40vh] mt-8 sm:mt-48 justify-center">
    <div class="flex flex-col items-center sm:items-start w-full sm:w-1/2 my-[7vh]">
      <img
        class="w-full sm:w-auto object-cover mt-4"
        src="../assets/images/empowerment.png"
        alt="Empowerment Image"
      />
      <div class="w-full sm:w-[750px] h-[10vh] sm:h-auto">
        <p class="text-justify text-black text-xl font-normal font-['Poppins'] my-10">
          Step into a world of agricultural excellence, where Malawian farmers unite to exchange
          knowledge, foster innovation, and collectively thrive
        </p>
      </div>
      <div class="flex items-center justify-center sm:justify-start mt-4">
        <SecondaryButton caption="learn more" />
        <div class="mx-5"></div>
        <PrimaryButton caption="get started" />
      </div>
    </div>
    <div class="flex items-center justify-center w-full sm:w-1/2">
      <img
        class="w-full sm:w-auto h-[56vh] object-contain"
        src="../assets/images/group90.png"
        alt=""
      />
    </div>
  </div>
</template>