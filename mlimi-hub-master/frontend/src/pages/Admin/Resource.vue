<template>
  <div v-if="loading">
    <LoaderAlt />
  </div>
  <div v-else class="container mx-auto py-8">
    <div class="space-y-4 mb-6">
      <h1 class="text-2xl font-bold">
        <i :class="resource.icon">&nbsp;</i>{{ resource.label }}
      </h1>
      <div class="bg-cardLight p-4 rounded-md shadow-md">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <!-- Add Button -->
          <button
            @click="addItemToResource"
            class="bg-secondary hover:bg-tertiary text-textLight font-bold py-2 px-4 rounded flex items-center space-x-2"
          >
            <i class="fas fa-plus-circle"></i>
            <span>Add &nbsp;{{ resource.label }}</span>
          </button>

          <!-- Search Input -->
          <div class="relative flex items-center">
            <i
              class="fas fa-search absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500"
            ></i>
            <input
              v-model="searchQuery"
              :placeholder="`Search ${resource.label}...`"
              class="bg-cardDark rounded-md px-4 pl-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <!-- Select All Checkbox -->
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="selectedRows.length === resources.length"
              @change="toggleSelectAll"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label for="selectAll" class="text-sm font-medium"
              >Select All</label
            >
          </div>

          <!-- Sort By -->
          <div class="flex items-center space-x-2">
            <i class="fas fa-sort-alpha-down"></i>
            <label for="sortBy" class="text-sm font-medium">Sort by:</label>
            <select
              v-model="sortBy"
              id="sortBy"
              class="action-select w-full rounded-md bg-cardLight px-3 py-2 text-text hover:bg-cardDark border-secondary border-2"
            >
              <option
                v-for="field in resource.schema"
                :key="field.name"
                :value="field.name"
              >
                {{ field.title }}
              </option>
            </select>
          </div>

          <!-- Sort Order -->
          <div class="flex items-center space-x-2">
            <i class="fas fa-sort-amount-up-alt"></i>
            <label for="sortOrder" class="text-sm font-medium">Order:</label>
            <select
              v-model="sortOrder"
              id="sortOrder"
              class="action-select w-full rounded-md bg-cardLight px-3 py-2 text-text hover:bg-cardDark border-secondary border-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <!-- Items Per Page -->
          <div class="flex items-center space-x-2">
            <i class="fas fa-th-list"></i>
            <label for="itemsPerPage" class="text-sm font-medium"
              >Items per page:</label
            >
            <select
              v-model="itemsPerPage"
              id="itemsPerPage"
              class="action-select w-full rounded-md bg-cardLight px-3 py-2 text-text hover:bg-cardDark border-secondary border-2"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <div class="flex items-center space-x-2">
            <i class="fas fa-eraser"></i>
            <button
              @click="clearFilters"
              class="text-secondary hover:text-tertiary font-medium"
            >
              Clear Filters
            </button>
          </div>

          <!-- Batch Actions -->
          <div
            class="flex items-center space-x-2"
            v-if="selectedRows.length > 0"
          >
            <i class="fas fa-tasks"></i>
            <select
              v-model="selectedBatchAction"
              class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Batch Actions</option>
              <option value="deleteAll">Delete All</option>
            </select>
            <button
              @click="performBatchAction"
              class="bg-red-500 hover:bg-red-600 text-textLighter font-bold py-2 px-4 rounded"
            >
              Apply
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <download-csv :data="resources">
              <i class="fas fa-download"></i>
              <button
                class="text-secondary hover:text-tertiary font-medium"
              >
                Export to CSV
              </button>
            </download-csv>
          </div>
          <!-- Refresh Button -->
          <div class="flex items-center space-x-2">
            <i class="fas fa-sync-alt"></i>
            <button
              @click="fetchResource"
              class="text-secondary hover:text-tertiary font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-lg font-bold">
          <h1>{{ totalCount }} results</h1>
        </div>
        <div>
          <Pagination
            :currentPage="Number($route.query.page) || 1"
            :totalPages="totalPages"
            @prev-page="prevPage"
            @next-page="nextPage"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-screen">
      <Loader />
    </div>
    <div v-else>
      <DynamicTable
        :resource="resource"
        :items="resources"
        :selectedRows.sync="selectedRows"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../../components/Loader.vue";
import LoaderAlt from "../../components/LoaderAlt.vue";
import DynamicTable from "./DynamicTable.vue";
import Pagination from "./Pagination.vue";
import { saveAs } from "file-saver";

export default {
  components: { Loader, DynamicTable, Pagination, LoaderAlt },
  data() {
    return {
      loading: false,
      resources: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
      totalPages: 0,
      totalCount: 0,
      sortBy: "",
      sortOrder: "asc",
      status: "",
      selectedRows: [],
      selectedBatchAction: "",
    };
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  watch: {
    "resource.name": {
      handler() {
        this.fetchResource();
      },
    },
    searchQuery() {
      this.currentPage = 1;
      this.fetchResource();
    },
    sortBy() {
      this.currentPage = 1;
      this.fetchResource();
    },
    sortOrder() {
      this.currentPage = 1;
      this.fetchResource();
    },
    status() {
      this.currentPage = 1;
      this.fetchResource();
    },
    startDate() {
      this.currentPage = 1;
      this.fetchResource();
    },
    endDate() {
      this.currentPage = 1;
      this.fetchResource();
    },
    type() {
      this.currentPage = 1;
      this.fetchResource();
    },
    itemsPerPage() {
      this.currentPage = 1;
      this.fetchResource();
    },
  },
  mounted() {
    this.updateStateFromURL();
    this.$watch(
      () => this.$route.query,
      () => {
        this.updateStateFromURL();
      },
      { deep: true }
    );
    this.fetchResource();
  },
  methods: {
    updateStateFromURL() {
      this.currentPage = Number(this.$route.query.page) || 1;
      this.itemsPerPage = Number(this.$route.query.limit) || 5;
      this.searchQuery = this.$route.query.search || "";
      this.sortBy = this.$route.query.sortBy || "";
      this.sortOrder = this.$route.query.order || "asc";
      this.status = this.$route.query.status || "";
    },

    fetchResource() {
      this.loading = true;
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}`,
          {
            params: {
              page: this.currentPage,
              limit: this.itemsPerPage,
              search: this.searchQuery,
              sortBy: this.sortBy,
              order: this.sortOrder,
              status: this.status,
            },
          }
        )
        .then((response) => {
          this.resources = response.data.data.reverse();
          this.totalCount = response.data.pagination.totalCount;
          this.totalPages = response.data.pagination.totalPages;
        })
        .catch((error) => {
          console.error("Error fetching resource:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async prevPage() {
      if (this.currentPage > 1) {
        await this.$router.push({
          query: {
            ...this.$route.query,
            page: this.currentPage - 1,
          },
        });
      }
      this.fetchResource();
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.$router.push({
          query: {
            ...this.$route.query,
            page: this.currentPage + 1,
          },
        });
      }
      this.fetchResource();
    },
    handleAction(resource, action) {
      if (action === "view") {
        this.$router.push(`/${this.resource.name}/${resource.id}/view`);
      } else if (action === "edit") {
        this.$router.push(`/${this.resource.name}/${resource.id}/edit`);
      } else if (action === "delete") {
        this.deleteResource(resource.id);
      }
    },
    addItemToResource() {
      if (this.resource && this.resource.name) {
        const resourceName = this.resource.name;
        this.$router.push(`/dashboard/admin/${resourceName}/item/add`);
      } else {
        console.warn("Resource is undefined or does not have a name property");
      }
    },
    async deleteResource(id) {
      const confirmDelete = await this.$swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this record!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });

      if (confirmDelete.isConfirmed) {
        this.loading = true;
        axios
          .delete(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/${
              this.resource.name
            }/${id}`
          )
          .then(() => {
            this.loading = false;
            this.$swal.fire(
              "Deleted!",
              "Your record has been deleted.",
              "success"
            );
            this.fetchResource();
          })
          .catch((error) => {
            console.error("Error deleting resource item:", error);
            this.$swal.fire(
              "Error!",
              "Failed to delete the record. Please try again later.",
              "error"
            );
            this.loading = false;
          });
      } else if (confirmDelete.dismiss === this.$swal.DismissReason.cancel) {
        console.log("User cancelled delete action");
      }
    },
    clearFilters() {
      this.searchQuery = "";
      this.sortBy = "";
      this.sortOrder = "asc";
      this.status = "";
      this.startDate = "";
      this.endDate = "";
      this.type = "";
      this.currentPage = 1;
      this.fetchResource();
    },
    toggleSelectAll(value) {
      this.selectedRows = value ? this.resources.map((item) => item.id) : [];
    },
    performBatchAction() {
      if (this.selectedBatchAction === "deleteAll") {
        this.deleteSelectedRows();
      }
      this.selectedBatchAction = "";
    },
    async deleteSelectedRows() {
      const confirmDelete = await this.$swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover these records!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete them!",
        cancelButtonText: "No, keep them",
      });

      if (confirmDelete.isConfirmed) {
        this.loading = true;
        axios
          .delete(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}`,
            {
              data: { ids: this.selectedRows },
            }
          )
          .then(() => {
            this.loading = false;
            this.$swal.fire(
              "Deleted!",
              "The selected records have been deleted.",
              "success"
            );
            this.selectedRows = [];
            this.fetchResource();
          })
          .catch((error) => {
            console.error("Error deleting selected resources:", error);
            this.$swal.fire(
              "Error!",
              "Failed to delete the selected records. Please try again later.",
              "error"
            );
            this.loading = false;
          });
      } else if (confirmDelete.dismiss === this.$swal.DismissReason.cancel) {
        console.log("User cancelled delete action");
      }
    },
    async exportToCSV() {
      this.loading = true;

      await saveAs(this.resources, `${this.resource.name}.csv`);

      this.loading = false;
    },
    toggleSelectAll(event) {
      this.selectedRows = event.target.checked
        ? this.resources.map((item) => item.id)
        : [];
    },
  },
};
</script>
