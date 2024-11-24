import axios from 'axios';
import { Resources } from "../../data/Resources";

const refOptionsService = {
  async getRefOptions(resourceName, fieldName) {
    try {
      const resource = Resources.find((r) => r.name === resourceName);
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${resource.name}`);
      const options = response.data;
      const processedOptions = options.data.map((option) => ({
        id: option.id,
        name: option[fieldName],
      }));
      console.log(processedOptions)
      return processedOptions;

    } catch (error) {
      console.error(`Error fetching ref options for ${resourceName}.${fieldName}:`, error);
      throw error;
    }
  },
};

export default refOptionsService;



