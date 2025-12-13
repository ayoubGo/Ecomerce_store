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
    }
}))


// todo : implement the axios interceptors for refreshing access token 