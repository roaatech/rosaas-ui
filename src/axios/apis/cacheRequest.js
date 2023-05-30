import axios from "axios";

const cacheRequest = () => {
  let axiosObject = {
    baseURL: "http://localhost:5000/api/",
    withCredentials: true,
    headers: {
      "Access-Control-Expose-Headers": "token1",
    },
  };

  const mainInstance = axios.create(axiosObject);

  return mainInstance;
};

export default cacheRequest;
