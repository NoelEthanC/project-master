<template>
  <div class="bg-cardLight rounded-lg p-6 sm:p-8 lg:p-10">
    <form @submit.prevent="submitForm" class="space-y-6">
      <div v-for="field in resource.schema" :key="field.name" class="space-y-2">
        <div v-if="field.type === 'text' || field.type === 'richtext'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <div id="app" v-if="field.type === 'richtext'">
            <ckeditor
              :editor="editor"
              v-model="formData[field.name]"
              :required="field.required"
              :config="editorConfig"
              class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
            ></ckeditor>
          </div>
          <input
            v-else
            v-model="formData[field.name]"
            type="text"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'email'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="email"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'me'">
          <input
            v-model="formData[field.name]"
            type="text"
            :required="field.required"
            class="h-0 px-0 py-0  "
          />
        </div>
        <div v-else-if="field.type === 'password'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="password"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'phone'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="tel"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'number'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="number"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'decimal'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="number"
            step="0.01"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'date'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="date"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'datetime'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="datetime-local"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'time'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="time"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'ref'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <select
            v-model="formData[field.name]"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          >
            <option
              v-for="option in refOptions[field.name]"
              :key="option.id"
              :value="option.id"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
        <div v-else-if="field.type === 'select'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <select
            v-model="formData[field.name]"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div v-else-if="field.type === 'check'">
          <div class="flex items-center">
            <input
              v-model="formData[field.name]"
              type="checkbox"
              class="mr-2 focus:ring-2 focus:ring-secondary bg-cardDark"
            />
            <label class="font-medium text-text">{{ field.title }}</label>
          </div>
        </div>
        <div v-else-if="field.type === 'radio'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <div
            v-for="option in field.options"
            :key="option.value"
            class="flex items-center"
          >
            <input
              v-model="formData[field.name]"
              type="radio"
              :value="option.value"
              :required="field.required"
              class="mr-2 focus:ring-2 focus:ring-secondary bg-cardDark"
            />
            <label>{{ option.label }}</label>
          </div>
        </div>
        <div
          v-if="
            field.type === 'image' ||
            field.type === 'video' ||
            field.type === 'audio' ||
            field.type === 'document'
          "
        >
          <label class="block font-medium text-text">{{ field.title }}</label>
          <div v-if="!showFileInput[field.name]">
            <img
              v-if="field.type === 'image'"
              :src="getFilePreview(field.name)"
              alt="No file selected please press the button below to select"
              class="max-h-32 object-contain mb-2"
            />
            <video
              v-else-if="field.type === 'video'"
              :src="getFilePreview(field.name)"
              controls
              class="max-h-32 object-contain mb-2"
            ></video>
            <audio
              v-else-if="field.type === 'audio'"
              :src="getFilePreview(field.name)"
              controls
              class="mb-2"
            ></audio>
            <div v-else class="mb-2">{{ getFilePreview(field.name).name }}</div>
            <button
              type="button"
              @click="toggleFileInput(field.name)"
              class="bg-secondary text-text font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
            >
              Change File
            </button>
          </div>
          <div v-else>
            <input
              @change="handleFileUpload(field, $event)"
              type="file"
              :accept="getAcceptTypes(field.type)"
              :required="field.required"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:-0 file:text-sm file:font-semibold file:bg-secondary file:text-tertiary hover:file:bg-secondary-darker"
            />
          </div>
        </div>
        <div v-else-if="field.type === 'color'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="color"
            :required="field.required"
            class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
          />
        </div>
        <div v-else-if="field.type === 'range'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <input
            v-model="formData[field.name]"
            type="range"
            :min="field.min || 0"
            :max="field.max || 100"
            :step="field.step || 1"
            :required="field.required"
            class="w-full"
          />
        </div>
        <div v-else-if="field.type === 'tags'">
          <label class="block font-medium text-text">{{ field.title }}</label>
          <div class="flex flex-wrap flex-col gap-2">
            <input
              type="text"
              v-model="inputValue"
              placeholder="Add a tag"
              @keydown.enter="addTag(field.name)"
              class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark flex-1"
            />
            <div>
              <span
                v-for="(tag, index) in formData[field.name]"
                :key="index"
                class="bg-secondary text-tertiary rounded-full px-3 py-1 text-sm"
              >
                {{ tag }}
                <span
                  class="cursor-pointer"
                  @click="removeTag(field.name, index)"
                  >&times;</span
                >
              </span>
            </div>
          </div>
        </div>
        <div v-else-if="field.type === 'object'">
          <h3 class="text-xl font-bold mb-4">{{ field.title }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="subField in field.schema" :key="subField.name">
              <label class="block font-medium text-text">{{
                subField.title
              }}</label>
              <input
                v-model="formData[field.name][subField.name]"
                :type="subField.type"
                :required="subField.required"
                class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
              />
            </div>
          </div>
        </div>
        <div v-else-if="field.type === 'object array'">
          <h3 class="text-xl font-bold mb-4">{{ field.title }}</h3>
          <div
            v-for="(item, index) in formData[field.name]"
            :key="index"
            class="mb-4"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="subField in field.schema" :key="subField.name">
                <label class="block font-medium text-text">{{
                  subField.title
                }}</label>
                <input
                  v-if="subField.type !== 'ref'"
                  v-model="item[subField.name]"
                  :type="subField.type"
                  :required="subField.required"
                  class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
                />
                <select
                  v-else
                  v-model="item[subField.name]"
                  :required="subField.required"
                  class="rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-secondary bg-cardDark"
                >
                  <option
                    v-for="option in RefService.getRefOptions(
                      subField.resource
                    )"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <button
            type="button"
            @click="addArrayItem(field.name)"
            class="bg-secondary text-tertiary rounded-md px-4 py-2 hover:bg-secondary-darker"
          >
            Add Item
          </button>
        </div>
      </div>
      <button
        v-if="!isUploading || !actionLoading"
        type="submit"
        class="bg-secondary text-text font-bold rounded-md px-4 py-2 hover:bg-secondary-darker"
      >
        Submit
      </button>
      <div v-else>
        <Loader />
      </div>
    </form>
  </div>
</template>

<script>
import DynamicTable from "./DynamicTable.vue";
import { Resources } from "../../data/Resources";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic/build/ckeditor";
import CKEditor from "@ckeditor/ckeditor5-vue";
import Loader from "../../components/Loader.vue";
import axios from "axios";
import firebase from "firebase/compat/app";
import refOptionsService from "./refOptionsService";
import "firebase/compat/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDUZNzlJpQJpO52-8OSjuveW4HbXLIhB8",
  authDomain: "server-services-50a49.firebaseapp.com",
  projectId: "server-services-50a49",
  storageBucket: "server-services-50a49.appspot.com",
  messagingSenderId: "484734300353",
  appId: "1:484734300353:web:e114a73b06c46823c72440",
  measurementId: "G-SJVFBE0VY0",
};

firebase.initializeApp(firebaseConfig);

export default {
  name: "app",
  props: {
    resource: {
      type: Object,
      required: true,
    },
    initialData: {
      type: Object,
      required: false,
    },
    isAdding: {
      type: Boolean,
      required: true,
    },
    redirectTo: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      me: localStorage.getItem("userId"),
      actionLoading: false,
      isUploading: false,
      refOptions: [],
      formData: {},
      showFileInput: {},
      editorConfig: {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
        ],
      },
    };
  },
  components: { ckeditor: CKEditor.component, DynamicTable, Loader },
  async created() {
    console.log("Created hook called");
    this.initFormData();
    await this.fetchRefOptions();

    for (const field of this.resource.schema) {
      if (
        field.type === "image" ||
        field.type === "video" ||
        field.type === "audio" ||
        field.type === "document"
      ) {
        //  this.$set(this.showFileInput, field.name, this.isAdding);
      }
    }
  },
  methods: {
    getFilePreview(fieldName) {
      const file = this.formData[fieldName];
      if (file instanceof File) {
        return URL.createObjectURL(file);
      } else if (typeof file === "string") {
        return file;
      } else {
        return "";
      }
    },

    toggleFileInput(fieldName) {
      this.showFileInput[fieldName] = !this.showFileInput[fieldName];
    },
    async fetchRefOptions() {
      this.refOptions = {};

      for (const field of this.resource.schema) {
        if (field.type === "ref") {
          this.refOptions[field.name] = await refOptionsService.getRefOptions(
            field.resource,
            field.field
          );
        }
      }
    },

    getAcceptTypes(type) {
      switch (type) {
        case "image":
          return "image/*";
        case "video":
          return "video/*";
        case "audio":
          return "audio/*";
        case "document":
          return ".doc,.docx,.pdf";
        default:
          return "";
      }
    },

    addTag(fieldName) {
      if (this.inputValue.trim()) {
        this.formData[fieldName] = [
          ...this.formData[fieldName],
          this.inputValue.trim(),
        ];
        this.inputValue = "";
      }
    },
    removeTag(fieldName, index) {
      this.formData[fieldName] = [
        ...this.formData[fieldName].slice(0, index),
        ...this.formData[fieldName].slice(index + 1),
      ];
    },

    initFormData() {
      if (this.isAdding) {
        this.formData = {};
        for (const field of this.resource.schema) {
          if (typeof this.initialData[field.name] !== "undefined") {
            this.formData[field.name] = this.initialData[field.name];
          } else {
            // Initialize the field based on its type
            switch (field.type) {
              case "text":
              case "richtext":
              case "email":
              case "password":
              case "phone":
              case "number":
              case "decimal":
              case "date":
              case "datetime":
              case "time":
              case "color":
              case "range":
                this.formData[field.name] = "";
                break;
              case "boolean":
              case "check":
                this.formData[field.name] = false;
                break;
              case "radio":
              case "select":
                this.formData[field.name] = field.options[0].value;
                break;
              case "ref":
                this.formData[field.name] = "";
                break;
              case "tags":
                this.formData[field.name] = [];
                break;
              case "object":
                this.formData[field.name] = {};
                for (const subField of field.schema) {
                  this.formData[field.name][subField.name] = "";
                }
                break;
              case "object array":
                this.formData[field.name] = [{}];
                for (const subField of field.schema) {
                  this.formData[field.name][0][subField.name] = "";
                }
                break;
            }
          }
        }
      } else {
        this.formData = { ...this.initialData };
        for (const field of this.resource.schema) {
          if (field.type === "object array") {
            if (!this.formData[field.name]) {
              this.formData[field.name] = [{}];
              for (const subField of field.schema) {
                this.formData[field.name][0][subField.name] = "";
              }
            } else {
              for (const item of this.formData[field.name]) {
                for (const subField of field.schema) {
                  if (typeof item[subField.name] === "undefined") {
                    item[subField.name] = "";
                  }
                }
              }
            }
          } else if (typeof this.formData[field.name] === "undefined") {
            // Initialize the field based on its type
            switch (field.type) {
              case "text":
              case "richtext":
              case "email":
              case "password":
              case "phone":
              case "number":
              case "decimal":
              case "date":
              case "datetime":
              case "time":
              case "color":
              case "range":
                this.formData[field.name] = "";
                break;
              case "check":
                this.formData[field.name] = false;
                break;
              case "radio":
              case "select":
                this.formData[field.name] = field.options[0].value;
                break;
              case "ref":
                this.formData[field.name] = "";
                break;
              case "tags":
                this.formData[field.name] = [];
                break;
              case "object":
                this.formData[field.name] = {};
                for (const subField of field.schema) {
                  this.formData[field.name][subField.name] = "";
                }
                break;
            }
          }
        }
      }
    },
    addArrayItem(fieldName) {
      const field = this.resource.schema.find((f) => f.name === fieldName);
      const newItem = {};
      for (const subField of field.schema) {
        newItem[subField.name] = "";
      }
      this.formData[fieldName].push(newItem);
    },

    handleFileUpload(field, event) {
      this.formData[field.name] = event.target.files[0];
      this.showFileInput[field.name] = false;
    },

    async submitForm() {
      const fileFields = this.resource.schema.filter(
        (field) =>
          field.type === "image" ||
          field.type === "video" ||
          field.type === "audio" ||
          field.type === "document"
      );

      if (fileFields.length > 0) {
        this.isUploading = true;
        this.actionLoading = true;

        try {
          // Upload files one by one
          for (const field of fileFields) {
            const file = this.formData[field.name];
            if (file instanceof File) {
              // A new file has been selected
              const storageRef = firebase.storage().ref();
              const fileRef = storageRef.child(`${field.name}/${file.name}`);
              await fileRef.put(file);
              this.formData[field.name] = await fileRef.getDownloadURL();
            } else {
              // No new file has been selected, keep the existing value
              console.log(`No new file selected for field: ${field.name}`);
            }
          }
        } catch (error) {
          console.error(`Error uploading file: ${error.message}`);
          this.$swal.fire(
            "Error!",
            `Error uploading file: ${error.message}`,
            "error"
          );
          this.isUploading = false;
          return;
        }

        this.isUploading = false;
        this.actionLoading = false;
      }

      // Form submission logic
      if (this.isAdding) {
        await this.add();
      } else {
        await this.edit();
      }
    },

    add() {
      this.actionLoading = true;
      axios
        .post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}`,
          this.formData
        )
        .then(() => {
          this.$swal.fire("Success!", "item added successfully.", "success");
          if (this.redirectTo==="prev") {
            this.$router.go(-1);
          }
          else if (this.redirectTo==="current") {
            this.$router.go();
          }
          else {
            this.$router.push(`/dashboard/admin/${this.resource.name}`);
          }
        })
        .catch((error) => {
          console.error(`Error adding  ${this.resource.name}:`, error.message);
          this.$swal.fire(
            "Error!",
            `Error adding  ${this.resource.name}:`,
            "error"
          );
        })
        .finally(() => {
          this.actionLoading = false;
        });
    },

    edit() {
      this.actionLoading = true;
      axios
        .patch(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}/${
            this.formData._id || this.formData.id
          }`,
          this.formData
        )
        .then(() => {
          this.$swal.fire("Success!", "Item updated successfully.", "success");
          this.$router.push(`/dashboard/admin/${this.resource.name}`);
        })
        .catch((error) => {
          console.error(
            `Error updating  ${this.resource.name}:`,
            error.message
          );
          this.$swal.fire(
            "Error!",
            `Error updating  ${this.resource.name}:`,
            "error"
          );
        })
        .finally(() => {
          this.actionLoading = false;
        });
    },
  },
};
</script>
