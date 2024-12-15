import axios from 'axios';
import Cookies from 'js-cookie';
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:1203/api', // Replace with your API's base URL
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // timeout: 10000, // Set a default timeout (optional)
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify request before sending it (e.g., add Authorization token)
    const token = Cookies.get('X_AUTH_TOKEN'); // Example of getting token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // You can add other custom logic here (e.g., logging)
   // console.log('Request Interceptor:', config);

    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Process the response data before passing it to the calling function
    //console.log('Response Interceptor:', response);
    return response;
  },
  (error) => {
    // Handle response error
    if (error.response && error.response.status === 401) {
      // Example: Handle unauthorized errors, redirect to login
      Cookies.remove('X_AUTH_TOKEN');
      // Programmatically redirect to login page
      window.location.href = '/'; // Redirect to login page
      //console.error('Unauthorized, logging out...');
      // Add your logout or redirect logic here (e.g., redirect to login page)
    } else if (error.response && error.response.status === 500) {
      // Example: Handle server errors
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// Export the configured Axios instance
export default axiosInstance;
