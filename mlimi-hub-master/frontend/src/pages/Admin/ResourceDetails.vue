<template>
  <div class="flex flex-col items-center justify-center h-full">

    <div
      class="w-full max-w-4xl px-8 py-12 h-[80vh] overflow-scroll bg-cardLight rounded-lg shadow-md relative"
    >

      <div v-if="loading" class="loader-container">
        <LoaderAlt />
      </div>

      <div v-else>
        <button
        @click="goBack"
        class="flex items-center left-[14vw] space-x-2 px-4 py-2 rounded-md bg-secondary text-text font-bold hover:bg-secondary-darker transition-colors duration-300 "
      >
      <i class="fa fa-arrow-left"></i>
        <span>Go Back</span>
      </button>
        <h1 class="text-2xl  font-bold mb-8">
          {{ mode === "edit" ? `Edit` : mode === "add" ? `Add` : `View` }}
        </h1>

        <div v-if="mode === 'add'">
          <DynamicForm
            :resource="resource"
            :initial-data="{}"
            :is-adding="true"
          />
        </div>

        <div v-else-if="mode === 'edit'">
          <DynamicForm
            :resource="resource"
            :initial-data="inventoryItem"
            :is-adding="false"
          />
        </div>

        <div v-else class="item-details">
          <DataViewer :resource="resource" :initial-data="inventoryItem" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Loader from "../../components/Loader.vue";
import LoaderAlt from "../../components/LoaderAlt.vue";
import DynamicForm from "./DynamicForm.vue";
import DataViewer from "./DataViewer.vue";
import { Resources } from "../../data/Resources";

export default {
  components: {
    Loader,
    LoaderAlt,
    DynamicForm,
    DataViewer,
  },
  data() {
    return {
      actionLoading: false,
      inventoryItem: {},
      loading: false,
      mode: "", //add or 'edit' or 'view'
      resourceName: "",
      resource:{},
    };
  },

  created() {
    const mode = this.$route.params.mode;
    const resourceName = this.$route.params.resourceName;
    this.resourceName = resourceName;
    this.resource = Resources.find((r) => r.name === resourceName);
    this.mode = mode;

    if (mode === "add") {
      this.inventoryItem = {
        itemName: "",
        quantity: null,
        unitOfMeasure: "",
      };
    } else {
      this.fetchInventoryItem();
    }
  },
  methods: {
    
    goBack() {
      this.$router.go(-1);
    },
    fetchInventoryItem() {
      this.loading = true;
      const itemId = this.$route.params.id;
      const mode = this.$route.params.mode;
      this.mode = mode;

      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resourceName}/${itemId}`)
        .then((response) => {
          this.inventoryItem = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching inventory item:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addInventory() {
      this.actionLoading = true;
      axios
        .post(`http://localhost:4000/${this.resourceName}`, this.inventoryItem)
        .then(() => {
          this.$swal.fire(
            "Success!",
            "Inventory item added successfully.",
            "success"
          );
          this.$router.push("/dashboard/inventory");
        })
        .catch((error) => {
          console.error("Error adding inventory item:", error);
          this.$swal.fire("Error!", "Failed to add inventory item", "error");
        })
        .finally(() => {
          this.actionLoading = false;
        });
    },
    updateInventory() {
      this.actionLoading = true;
      const itemId = this.$route.params.id;

      axios
        .put(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/v1/inventory-items/${itemId}`,
          this.inventoryItem
        )
        .then(() => {
          this.$swal.fire(
            "Success!",
            "Inventory item edited successfully.",
            "success"
          );
          this.$router.push("/dashboard/inventory");
        })
        .catch((error) => {
          console.error("Error updating inventory item:", error);
          this.$swal.fire("Error!", "Failed to update inventory item", "error");
        })
        .finally(() => {
          this.actionLoading = false;
        });
    },
  },
};
</script>
