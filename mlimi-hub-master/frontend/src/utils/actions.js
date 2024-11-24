import axios from 'axios';
import Swal from 'sweetalert2';

const resourceFunctions = [
  {
    key: 'getResources',
    value: async (payload) => {
      const { resource, params } = payload;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${resource}`,
          { params }
        );

        console.log(response.data.data, 'my data');

        return {
          resources: response.data.data,
          totalCount: response.data.totalCount,
          totalPages: response.data.totalPages,
        };
      } catch (error) {
        console.error('Error fetching resource:', error);
        throw error;
      }
    },
  },
  {
    key: 'addResource',
    value: async (payload) => {
      const { resource, data } = payload;

      try {
        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${resource}`,
          data
        );
        return `added an item in ${resource}`;
      } catch (error) {
        console.error(`Error adding ${resource}:`, error.message);
        throw error;
      }
    },
  },
  {
    key: 'updateResource',
    value: async (payload) => {
      const { resource, data } = payload;
      const id = data._id || data.id;

      try {
        await axios.patch(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${resource}/${id}`,
          data
        );
        return `updated an item in ${resource}`;
      } catch (error) {
        console.error(`Error updating ${resource}:`, error.message);
        throw error;
      }
    },
  },
  {
    key: 'deleteResource',
    value: async (payload) => {
      const { resource, id, router } = payload;

      try {
        // Show a confirmation dialog using SweetAlert
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: `Do you want to delete this ${resource}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
        });

        // If the user confirms, delete the record
        if (result.isConfirmed) {
          await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/v1/${resource}/${id}`);
          await Swal.fire({
            title: 'Success',
            text: `Item deleted from ${resource} successfully`,
            icon: 'success',
            timer: 2000, // Timer in milliseconds (2 seconds)
            timerProgressBar: true,
            showConfirmButton: false // Optional: Hides the "OK" button
          });
          
          window.location.reload();
          return 
        } else {
          // If the user cancels, show a message that the record is safe
          await Swal.fire({
            title: 'Canceled',
            text: `The ${resource} is safe.`,
            icon: 'info'
          });
          return `Deletion canceled for ${resource}`;
        }
      } catch (error) {
        console.error(`Error deleting ${resource}:`, error.message);
        throw error;
      }
    }
  },
  {
    key: 'goToView',
    value: async (payload) => {
      const { resource, id, router } = payload;
      const url = `/dashboard/admin/${resource}/${id}/view`;
      window.location=url;
    },
  },
  {
    key: 'goToEdit',
    value: async (payload) => {
      const { resource, id, router } = payload;
      const url = `/dashboard/admin/${resource}/${id}/edit`;
      window.location=url;

    },
  },

];

export default resourceFunctions;



