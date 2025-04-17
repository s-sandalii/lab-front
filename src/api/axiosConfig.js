// This file normally configures axios with your backend base URL
// For mock purposes, we'll create a simple wrapper function

const mockAxios = {
    get: (url) => {
      console.log(`Mock GET request to: ${url}`);
      return Promise.resolve({ status: 200 });
    },
    post: (url, data) => {
      console.log(`Mock POST request to: ${url} with data:`, data);
      return Promise.resolve({ status: 201 });
    },
    put: (url, data) => {
      console.log(`Mock PUT request to: ${url} with data:`, data);
      return Promise.resolve({ status: 200 });
    },
    delete: (url) => {
      console.log(`Mock DELETE request to: ${url}`);
      return Promise.resolve({ status: 204 });
    }
  };
  
  export default mockAxios;
  