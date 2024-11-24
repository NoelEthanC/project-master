<template>
  <div class="mt-[25vh]">
    <div class="flex flex-col justify-between items-center" id="why-section">
      <div class="font-bold text-3xl mb-10">Why Us</div>
      <div class="flex flex-col md:flex-row w-full justify-between items-center">
        <div
          v-for="section in sections"
          :key="section.id"
          :class="section.containerClasses"
          class="flex flex-col items-center"
        >
          <img
            :src="section.imageSrc"
            :alt="section.imageAlt"
            class="my-[12%] w-[20%]"
          />
          <div class="font-bold text-3xl mb-5">{{ section.title }}</div>
          <p class="mx-4 md:mx-12 text-xl description">
            {{ section.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sections: [
        {
          id: 1,
          containerClasses:
            "w-full md:w-[20vw] h-[65vh] bg-secondary rounded-md my-8 md:my-0 md:mr-4 flex items-center justify-center flex-col text-textLight text-center",
          imageSrc:
            "https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/brainstormskill.png?alt=media&token=b4ed9c8e-3d4e-427e-89cf-bc082378d768",
          imageAlt: "",
          title: "Innovative",
          description:
            "Crafted by agricultural experts deeply rooted in Malawi's farming practices.",
        },
        {
          id: 2,
          containerClasses:
            "w-full md:w-[20vw] h-[65vh] bg-secondary rounded-md my-8 md:my-0 md:mx-4 flex items-center justify-center flex-col text-textLight text-center",
          imageSrc:
            "https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/decentralizednetwork.png?alt=media&token=52371ac1-f140-4860-9352-8986652e9158",
          imageAlt: "",
          title: "Resourceful",
          description:
            "Resources and tools to enhance your farming journey. From modern agricultural techniques to the latest market trends.",
        },
        {
          id: 3,
          containerClasses:
            "w-full md:w-[20vw] h-[65vh] bg-secondary rounded-md my-8 md:my-0 md:ml-4 flex items-center justify-center flex-col text-textLight text-center",
          imageSrc:
            "https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/users.png?alt=media&token=508f5c4a-5613-4623-bdd9-30f361b92fe7",
          imageAlt: "",
          title: "Collaborative",
          description:
            "Connect with fellow farmers, share experiences, and collectively tackle challenges.",
        },
      ],
    };
  },
};
</script>
