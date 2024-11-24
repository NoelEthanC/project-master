<template>
  <div class="min-h-screen py-8">
    <div v-if="loading" class="flex justify-center">
      <Loader />
    </div>
    <div v-else class="container flex flex-col mx-auto">
        <button
                @click="$router.go(-1)"
                class="bg-secondary text-tertiary font-bold py-2 px-4 w-28 float-left relative rounded-md"
              >
              <i class="fa fa-arrow-left"></i>
                Back
              </button>
      <div class="flex flex-col">
          <h1 class="text-3xl font-bold text-text mb-6">
            My Purchases
          </h1>
          <div
            v-if="payments.length > 0"
            class="bg-cardLight rounded-lg shadow-lg overflow-hidden"
          >
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-secondary text-cardLight">
                  <th class="px-4 py-2">Product Image</th>
                  <th class="px-4 py-2">Product Name</th>
                  <th class="px-4 py-2">Amount</th>
                  <th class="px-4 py-2">Status</th>
                  <th class="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(payment, i) in payments"
                  :key="i"
                  class="border-b border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                  <td class="px-4 py-2">
                    <img
                      :src="getImage('product', payment.product)"
                      :alt="getValue('product', payment.product)"
                      class="w-20 h-20 object-contain rounded-md"
                    />
                  </td>
                  <td class="px-4 py-2 text-gray-800">
                    {{ getValue("product", payment.product) }}
                  </td>
                  <td class="px-4 py-2 text-gray-800">{{ payment.amount }}</td>
                  <td class="px-4 py-2 text-gray-800">
                    <span
                      :class="{
                        'bg-green-100 text-green-800':
                          getStatus('status', payment.status) === 'Completed',
                        'bg-yellow-100 text-yellow-800':
                          getStatus('status', payment.status) === 'Pending',
                        'bg-red-100 text-red-800':
                          getStatus('status', payment.status) === 'Cancelled',
                      }"
                      class="px-2 py-1 rounded-full font-semibold"
                      >{{ getStatus("status", payment.status) }}</span
                    >
                  </td>
                  <td class="px-4 py-2">
                    <button
                      class="bg-secondary text-cardLight px-3 py-2 rounded-md hover:bg-secondary transition duration-300 ease-in-out"
                      @click="showModal(payment)"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="bg-cardLight rounded-lg p-4 text-gray-800 shadow-md">
            <h1 class="font-semibold text-center">No Purchases Found...</h1>
          </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showPaymentModal"
      class="fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-textDarker bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-cardLight rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-cardLight px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Payment Details
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-cardLight">
                    Here are the details of your payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div class="mt-3 sm:mt-0 sm:ml-4">
              <button
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-cardLight hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:ml-3 sm:w-auto sm:text-sm"
                @click="showPaymentModal = false"
              >
                Close
              </button>
            </div>
          </div>
          <div
            class="px-4 py-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            <div class="col-span-1">
              <img
                :src="getImage('product', selectedPayment?.product)"
                :alt="getValue('product', selectedPayment?.product)"
                class="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div class="col-span-1 sm:col-span-2 md:col-span-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Product Details
              </h3>
              <dl class="grid grid-cols-1 gap-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Product Name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ getValue("product", selectedPayment?.product) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Amount</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedPayment?.amount }}
                  </dd>
                </div>
              </dl>
            </div>
            <div class="col-span-1 sm:col-span-2 md:col-span-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Payment Details
              </h3>
              <dl class="grid grid-cols-1 gap-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span
                      :class="{
                        'bg-green-100 text-green-800':
                          getStatus('status', selectedPayment?.status) ===
                          'Completed',
                        'bg-yellow-100 text-yellow-800':
                          getStatus('status', selectedPayment?.status) ===
                          'Pending',
                        'bg-red-100 text-red-800':
                          getStatus('status', selectedPayment?.status) ===
                          'Cancelled',
                      }"
                      class="px-2 py-1 rounded-full font-semibold"
                      >{{ getStatus("status", selectedPayment?.status) }}</span
                    >
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Payment Date
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedPayment?.created_at }}
                  </dd>
                </div>
              </dl>
            </div>
            <div class="col-span-1 sm:col-span-2 md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                Additional Details
              </h3>
              <p class="text-sm text-gray-900">
                {{ selectedPayment?.additional_details }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../components/Loader.vue";
import refOptionsService from "./Admin/refOptionsService";
export default {
  components: { Loader },
  data() {
    return {
      payments: [],
      loading: false,
      refOptions: {},
      refOptionsB: {},
      refOptionsC: {},
      refOptionsName: {},
      showPaymentModal: false,
      selectedPayment: null,
    };
  },
  mounted() {
    this.fetchRefOptions("product", "products", "title");
    this.fetchRefOptionsB("product", "products", "image");
    this.fetchRefOptionsC("status", "payment-statuses", "status");
    this.FetchPayments();
  },
  methods: {
    getValue(resource, id) {
      const myValue = this.refOptions[resource];

      if (!Array.isArray(myValue)) {
        return null;
      }

      for (const obj of myValue) {
        if (obj.id === id) {
          return obj.name;
        }
      }

      return null;
    },
    getImage(resource, id) {
      const myValue = this.refOptionsB[resource];

      if (!Array.isArray(myValue)) {
        return null;
      }

      for (const obj of myValue) {
        if (obj.id === id) {
          return obj.name;
        }
      }

      return null;
    },
    getStatus(resource, id) {
      const myValue = this.refOptionsC[resource];

      if (!Array.isArray(myValue)) {
        return null;
      }

      for (const obj of myValue) {
        if (obj.id === id) {
          return obj.name;
        }
      }

      return null;
    },
    async FetchPayments() {
      this.loading = true;
      const id = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/v1/payments/get-by-id?field=farmer&id=${id}`
        );
        this.payments = response.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchRefOptions(field, resource, tuple) {
      this.refOptions = {};
      this.refOptions[field] = await refOptionsService.getRefOptions(
        resource,
        tuple
      );
    },

    async fetchRefOptionsB(field, resource, tuple) {
      this.refOptionsB = {};
      this.refOptionsB[field] = await refOptionsService.getRefOptions(
        resource,
        tuple
      );
    },

    async fetchRefOptionsC(field, resource, tuple) {
      this.refOptionsC = {};
      this.refOptionsC[field] = await refOptionsService.getRefOptions(
        resource,
        tuple
      );
    },

    showModal(payment) {
      this.selectedPayment = payment;
      this.showPaymentModal = true;
    },
  },
};
</script>
