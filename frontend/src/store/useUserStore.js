import toast from "react-hot-toast";
import {create} from "zustand";
import axiosInstanse from "../lib/axios.js";



export  const useUserStore = create((set, get) => ({

    user: null,
    loading: false,
    checkingAuth :true,

    signup : async ({name, email, password , confirmPassword}) =>{
        set({loading : true});

        if(password !== confirmPassword) {
            set({loading: false});
            return toast.error("Passwords do not match");
        }

        try {
            const res =  await axiosInstanse.post("/auth/signup", {name, email, password});
            set({user : res.data, loading: false});
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "An error occurred");
        }

    },

    login : async (email, password) => {
        set({loading: true});
        try {
            const res = await axiosInstanse.post("/auth/login",{email, password});
            set({user: res.data, loading:false});
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "An error accurred")
        }
    },


    logout : async () => {
        try {
            await axiosInstanse.post("auth/logout");
            set({user: null});
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout")
        }
    },

    checkAuth : async () => {
        set({checkingAuth :true});
        try {
            const response = await axiosInstanse.get("/auth/profile");
            set({user : response.data, checkingAuth:false});
        } catch (error) {
            set({checkingAuth : false, user: null});
        }
    },

    refreshToken : async () => {
        if(get().checkAuth()) return;

        set({checkingAuth :false});
        try {
            const response = await axiosInstanse.post("/auth/refresh-token");
            set({checkingAuth: false});
            return response.data;
        } catch (error) {
            set({user :null ,checkingAuth: false});
            throw error;
        }
    }
}))


// todo : implement the axios interceptors for refreshing access token 

// Axios interseptor for token refresh 

let refreshPromise = null;

axiosInstanse.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;


            try {

                // if a refresh is already in progress , wait for it to complete
                if(refreshPromise){
                    await refreshPromise;
                    return axiosInstanse(originalRequest);
                }

                // Start new refresh progress
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axiosInstanse(originalRequest);
                
            } catch (refreshError) {
                // if refresh fails , redirect to login or handle as needed 
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
