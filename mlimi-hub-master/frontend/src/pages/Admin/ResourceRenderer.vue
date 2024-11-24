<template>

    <Resource v-if="resource.renderMode=='crud'" :resource="resource"/>
    <Singleton v-else-if="resource.renderMode=='singleton'" :resource="resource"/>
    <Reports v-else-if="resource.renderMode=='report'" :resource="resource"/>
    <Chat v-else-if="resource.renderMode=='chat'"/>
    
    <h1 v-else>
        <h1>unknown renderMode</h1>
    </h1>

</template>

<script>
import Resource from "./Resource.vue";
import Singleton from "./Singleton.vue";
import Reports from "./Reports.vue";
import Chat from "../chat.vue";

export default {
  components: { Resource, Singleton, Reports, Chat },
  mounted(){
    console.log("mounted");
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
};
</script>
