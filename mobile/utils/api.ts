import { useAuth } from "@clerk/clerk-expo";
import axios, {AxiosInstance} from "axios"
import { getBaseUrl } from "./apiBaseUrl";

const API_BASE_URL="https://social-media-zeta-sandy.vercel.app/api"
// const API_BASE_URL = "http://localhost:3001/api";
// const API_BASE_URL=getBaseUrl()



// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
  
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/user/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/user/me"),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/user/profile", data),
  // searchUser: (api: AxiosInstance,query:any) => api.get(`/user/search?q=${query}`),
};