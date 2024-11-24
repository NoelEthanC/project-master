<template>
  <div class="bg-gray-300 h-[95vh] w-full pt-20 flex flex-col md:flex-row justify-evenly" id="contact-section">
    <div class="em w-full md:w-[35%] h-[100%]" data-aos="fade-right" data-aos-delay="300"></div>

    <div class="flex flex-col w-full md:w-[47%] h-full mt-5 md:mt-0" data-aos="fade-left" data-aos-delay="400">
      <div class="flex items-center justify-center flex-col">
        <h2 class="text-4xl md:text-7xl w-full font-extrabold mb-6 text-black leading-tight">Send us a<br>  message <i class="text-5xl md:text-9xl text-tertiary">.</i></h2>
        <form class="w-full">
          <div class="mb-4">
            <input
              type="text"
              id="name"
              name="name"
              class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-tertiary px-6 py-4"
              placeholder="Your Name"
            />
          </div>
          <div class="mb-4">
            <input
              type="email"
              id="email"
              name="email"
              class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-tertiary px-6 py-4"
              placeholder="Your Email"
            />
          </div>
          <div class="mb-4">
            <textarea
              id="message"
              name="message"
              rows="4"
              class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none px-6 py-4 focus:border-tertiary"
              placeholder="Your Message"
            ></textarea>
          </div>
          <button
            type="submit"
            class="bg-tertiary text-textLighter py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-400 flex items-center justify-evenly"
          >
            Submit
            <div class="mx-1"></div>
            <img src="https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/paperplane.png?alt=media&token=6a663015-3f9e-4665-82d2-54344823080b" alt="" srcset="">
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.em {
  background-image: url("../assets/images/rectangle14.png");
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
