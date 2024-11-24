<template>
    <div class="overflow-x-auto rounded-lg bg-cardLight shadow-md">
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-secondary font-extrabold text-xl text-textLight">
            <th class="px-4 py-3 text-left ">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="selectedRows.length === items.length"
                  @change="toggleSelectAll"
                  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </th>
            <th class="px-4 py-3 text-left ">
              <div class="w-16 text-center">#</div>
            </th>
            <th
              class="px-4 py-3 text-left "
              v-for="field in resource.schema"
              :key="field.name"
            >
              {{ field.title }}
            </th>
            <th class="px-4 py-3 text-left " v-if="resource.actions">Actions</th>
          </tr>
        </thead>
        <tbody
          class="overflow-y-scroll min-h-[20vh] divide-y divide-gray-200"
          v-if="items.length > 0"
        >
          <tr
            v-for="(item, index) in items"
            :key="index"
            class="hover:bg-background transition-colors duration-300"
          >
            <td class="px-4 py-3 text-left">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="selectedRows.includes(item.id)"
                  @change="toggleRowSelection(item.id, $event.target.checked)"
                  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </td>
            <td class="px-4 py-3 text-left ">
              <div class="w-16 text-center">{{ index + 1 }}</div>
            </td>
            <td
              v-for="field in resource.schema"
              :key="field.name"
              class="px-4 py-3 text-left "
            >
              <div v-if="field.type === 'object'">
                <div v-for="subField in field.schema" :key="subField.name">
                  {{ truncateText(item[field.name][subField.name]) }}
                </div>
              </div>
              <div v-else-if="field.type === 'ref'">
                {{ getValue(field.name, item[field.name]) }}
              </div>
              <div v-else-if="field.type === 'object array'">
                <div
                  v-for="(subItem, subIndex) in item[field.name]"
                  :key="subIndex"
                >
                  <div v-for="subField in field.schema" :key="subField.name">
                    {{ truncateText(subItem[subField.name]) }}
                  </div>
                </div>
              </div>
              <div v-else-if="field.type === 'image'">
                <img :src="item[field.name]" width="50" alt="Image" />
              </div>
              <div v-else-if="field.type === 'video'">
                <video :src="item[field.name]" width="100" controls>
                  Your browser does not support the video tag.
                </video>
              </div>
              <div v-else-if="field.type === 'richtext'">
                <div
                  v-html="
                    item[field.name] ? truncateText(item[field.name], 30) : ''
                  "
                ></div>
              </div>
              <div v-else>{{ truncateText(item[field.name], 14) }}</div>
            </td>
            <td class="px-4 py-3 text-left" v-if="resource.actions">
              <select
                class="action-select w-full rounded-md bg-cardLight px-3 py-2 text-text hover:bg-cardDark border-secondary border-2"
                v-model="selectedAction[index]"
                @change="handleAction(item, index)"
              >
                <option value="" disabled >Select Action</option>
                <option
                  v-for="action in resource.actions"
                  :key="Object.keys(action)[0]"
                  :value="Object.keys(action)[0]"
                >
                  {{ Object.keys(action)[0] }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
  
        <tfoot v-else>
          <tr>
            <td colspan="100%" class="px-4 py-3 text-center ">
              No records to display.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </template>
  
  <script>
  import resourceFunctions from '../../utils/actions';
  import refOptionsService from './refOptionsService';
  
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
        refOptions: [],
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
                await actionFunction.value({ resource: this.resource.name, id: item.id, router:this.$router });
                this.$emit('action', item, action);
                this.selectedAction[index] = ''; // Reset the selected action
              } catch (error) {
                this.$swal.fire({
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
      toggleSelectAll(event) {
        const isChecked = event.target.checked;
        const allIds = isChecked ? this.items.map((item) => item.id) : [];
        this.$emit('update:selectedRows', allIds);
      },
      toggleRowSelection(id, checked) {
        const updatedRows = checked
          ? [...this.selectedRows, id]
          : this.selectedRows.filter((rowId) => rowId !== id);
        this.$emit('update:selectedRows', updatedRows);
      },
      truncateText(text, maxLength = 100) {
        if (!text) return '';
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
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