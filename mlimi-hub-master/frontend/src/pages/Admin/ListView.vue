<template>
    <div class="bg-cardLight rounded-lg shadow-md p-4">
      <div class="space-y-4">
        <div
          v-for="(item, itemIndex) in items"
          :key="itemIndex"
          class="bg-cardDark rounded-lg p-4"
        >
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="selectedRows.includes(item.id)"
              @change="toggleRowSelection(item.id, $event.target.checked)"
              class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div class="text-gray-600 font-bold">{{ item.title }}</div>
          </div>
          <div v-for="field in resource.schema" :key="field.name" class="mb-2">
            <div class="text-gray-500 font-bold">{{ field.title }}:</div>
            <div class="text-gray-600">
              {{ getValue(field.name, item[field.name]) }}
            </div>
          </div>
          <div class="mt-4">
            <select
              class="action-select w-full rounded-md bg-gray-200 px-3 py-2 text-text hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              v-model="selectedAction[itemIndex]"
              @change="handleAction(item, itemIndex)"
            >
              <option value="">Select Action</option>
              <option
                v-for="action in resource.actions"
                :key="Object.keys(action)[0]"
                :value="Object.keys(action)[0]"
              >
                {{ Object.keys(action)[0] }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import resourceFunctions from '../../utils/actions';
import refOptionsService from './refOptionsService';
import Swal from 'sweetalert2';

export default {
  props: {
    resource: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    selectedRows: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedAction: new Array(this.items.length).fill(''),
      refOptions: {},
    };
  },
  created() {
    this.fetchRefOptions();
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
    async fetchRefOptions() {
      this.refOptions = {};

      for (const field of this.resource.schema) {
        if (field.type === 'ref') {
          this.refOptions[field.name] = await refOptionsService.getRefOptions(
            field.resource,
            field.field
          );
        }
      }
    },
    async handleAction(item, index) {
      const action = this.selectedAction[index];
      if (action) {
        const actionConfig = this.resource.actions.find((a) => Object.keys(a)[0] === action);
        if (actionConfig) {
          const actionFunction = resourceFunctions.find((f) => f.key === actionConfig[action]);
          if (actionFunction) {
            try {
              await actionFunction.value({ resource: this.resource.name, id: item.id });
              this.$emit('action', item, action);
              this.selectedAction[index] = ''; // Reset the selected action
            } catch (error) {
              Swal.fire({
                title: 'Error',
                text: `Error performing '${action}' action: ${error.message}`,
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
              });
            }
          } else {
            console.warn(`'${actionConfig[action]}' function not found in resourceFunctions`);
          }
        } else {
          console.warn(`Unknown action '${action}' for resource '${this.resource.name}'`);
        }
      }
    },
    toggleRowSelection(id, checked) {
      const updatedRows = checked
        ? [...this.selectedRows, id]
        : this.selectedRows.filter((rowId) => rowId !== id);
      this.$emit('update:selectedRows', updatedRows);
    },
  },
};
</script>

<style scoped>
.action-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em;
}
</style>