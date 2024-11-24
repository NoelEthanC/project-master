<template>
  <div class="bg-cardLight py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-cardLight rounded-lg overflow-hidden">
      <div class="px-6 py-8">
        <div>
          <div v-for="field in resource.schema" :key="field.name" class="mb-6">
            <div v-if="field.type === 'text' || field.type === 'richtext'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <div v-if="field.type === 'richtext'" class="prose prose-sm">
                <div v-html="formData[field.name]"></div>
              </div>
              <p v-else class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'email'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'password'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">*****</p>
            </div>
            <div v-else-if="field.type === 'phone'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'number'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'decimal'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'date'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'datetime'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'time'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'ref'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">   {{ getValue(field.name, formData[field.name]) }}</p>
            </div>
            <div v-else-if="field.type === 'select'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ getSelectLabel(field.options, formData[field.name]) }}</p>
            </div>
            <div v-else-if="field.type === 'check'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] ? 'Yes' : 'No' }}</p>
            </div>
            <div v-else-if="field.type === 'radio'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ getRadioLabel(field.options, formData[field.name]) }}</p>
            </div>
            <div
              v-else-if="
                field.type === 'image' ||
                field.type === 'video' ||
                field.type === 'audio' ||
                field.type === 'document'
              "
            >
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <div v-if="field.type === 'image'">
                <img :src="formData[field.name]" class="w-[400px] h-[400px] object-cover rounded-lg shadow-md" alt="Image" />
              </div>
              <div v-else-if="field.type === 'video'">
                <video :src="formData[field.name]" class="w-full h-[48vh] object-cover rounded-lg shadow-md" controls>
                  Your browser does not support the video tag.
                </video>
              </div>
              <div v-else-if="field.type === 'audio'">
                <audio :src="formData[field.name]" class="w-full" controls>
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div v-else-if="field.type === 'document'">
                <a
                  :href="formData[field.name]"
                  download
                  :title="`Download ${field.title}`"
                  class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-textLighter text-sm font-medium rounded-md shadow-sm"
                >
                  Download {{ field.title }}
                </a>
              </div>
            </div>

            <div v-else-if="field.type === 'color'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <div
                :style="{ backgroundColor: formData[field.name] }"
                class="w-12 h-12 rounded-full shadow-lg ring-2 ring-white"
              ></div>
            </div>
            <div v-else-if="field.type === 'range'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <p class="text-gray-600 text-sm">{{ formData[field.name] }}</p>
            </div>
            <div v-else-if="field.type === 'tags'">
              <label class="block font-medium text-text mb-2">{{ field.title }}</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData[field.name]"
                  :key="index"
                  class="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div v-else-if="field.type === 'object'">
              <h3 class="text-lg font-medium text-gray-800 mb-4">{{ field.title }}</h3>
              <div v-for="subField in field.schema" :key="subField.name" class="mb-4">
                <label class="block font-medium text-text mb-2">{{ subField.title }}</label>
                <p class="text-gray-600 text-sm">{{ formData[field.name][subField.name] }}</p>
              </div>
            </div>
            <div v-else-if="field.type === 'object array'">
              <h3 class="text-lg font-medium text-gray-800 mb-4">{{ field.title }}</h3>
              <div
                v-for="(item, index) in formData[field.name]"
                :key="index"
                class="border-b border-gray-200 pb-4 mb-4"
              >
                <div v-for="subField in field.schema" :key="subField.name">
                  <label class="block font-medium text-text mb-2">{{ subField.title }}</label>
                  <p v-if="subField.type !== 'ref'" class="text-gray-600 text-sm">
                    {{ item[subField.name] }}
                  </p>
                  <p v-else class="text-gray-600 text-sm">
                    {{ getRefLabel(subField.resource, item[subField.name]) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Resources } from "../../data/Resources";
import refOptionsService from "./refOptionsService";

export default {
  name: "app",
  props: {
    resource: {
      type: Object,
      required: true,
    },
    initialData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {},
      refOptions: [],
    };
  },
  created() {
    this.formData = this.initialData;
    this.fetchRefOptions()
  },
  methods: {
    getValue(resource, id) {
      const myValue = this.refOptions[resource];

      if (!Array.isArray(myValue)) {
        // Ensure that myValue is an array before proceeding
        return null;
      }

      for (const obj of myValue) {
        // Check if the id of the current object matches the provided id
        if (obj.id === id) {
          // If a match is found, return the name of the object
          return obj.name;
        }
      }

      // If no match is found, return null (or handle the case as per your requirement)
      return null;
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
    getRefLabel(resourceName, refId) {
      const resource = Resources.find((r) => r.name === resourceName);
      const field = resource.schema.find((f) => f.name === refId);
      return field ? field.title : "";
    },
    getSelectLabel(options, value) {
      const option = options.find((o) => o.value === value);
      return option ? option.label : "";
    },
    getRadioLabel(options, value) {
      const option = options.find((o) => o.value === value);
      return option ? option.label : "";
    },
  },
};
</script>