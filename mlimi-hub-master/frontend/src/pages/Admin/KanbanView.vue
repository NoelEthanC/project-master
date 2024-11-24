<template>
    <div class="kanban-board">
      <div
        v-for="(column, columnKey) in columnData"
        :key="columnKey"
        class="kanban-column"
      >
        <h3 class="column-title">{{ column.title }}</h3>
        <div class="column-items">
          <div
            v-for="(item, itemIndex) in column.items"
            :key="itemIndex"
            class="kanban-item"
          >
            <div class="item-header">
              <input
                type="checkbox"
                :checked="selectedRows.includes(item.id)"
                @change="toggleRowSelection(item.id, $event.target.checked)"
                class="item-checkbox"
              />
              <div class="item-title">{{ item.title }}</div>
            </div>
            <div class="item-details">
              <div v-for="field in resource.schema" :key="field.name" class="item-field">
                <div class="field-label">{{ field.title }}:</div>
                <div class="field-value">{{ getValue(field.name, item[field.name]) }}</div>
              </div>
            </div>
            <div class="item-actions">
              <select
                class="action-select"
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
      kanbanField: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        selectedAction: new Array(this.items.length).fill(''),
        refOptions: {},
      };
    },
    computed: {
      columnData() {
        const columnValues = new Set(this.items.map((item) => item[this.kanbanField]));
        return Array.from(columnValues).map((value) => ({
          title: this.getColumnTitle(value),
          items: this.items.filter((item) => item[this.kanbanField] === value),
        }));
      },
    },
    created() {
      this.fetchRefOptions();
    },
    methods: {
      getColumnTitle(value) {
        const field = this.resource.schema.find((f) => f.name === this.kanbanField);
        if (field && field.type === 'ref') {
          const options = this.refOptions[field.name];
          const option = options.find((o) => o.id === value);
          return option ? option.name : value;
        }
        return value;
      },
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
  .kanban-board {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 1rem;
  }
  
  .kanban-column {
    flex: 0 0 300px;
    margin-right: 1rem;
    background-color: #f5f5f5;
    border-radius: 0.5rem;
    padding: 1rem;
  }
  
  .column-title {
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .column-items {
    min-height: 10rem;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .kanban-item {
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  
  .item-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .item-checkbox {
    margin-right: 0.5rem;
  }
  
  .item-title {
    font-weight: bold;
  }
  
  .item-details {
    margin-bottom: 0.5rem;
  }
  
  .item-field {
    display: flex;
    margin-bottom: 0.25rem;
  }
  
  .field-label {
    font-weight: bold;
    margin-right: 0.5rem;
  }
  
  .item-actions {
    text-align: right;
  }
  
  .action-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.5em;
  }
  </style>