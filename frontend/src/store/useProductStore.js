import {create} from "zustand";
import toast from "react-hot-toast";
import axiosInstanse from "../lib/axios.js"


export const useProductStore = create((set) => ({
    products :[],
    loading : false,

    setProduct :(products) => set({products}),

    createProduct : async (productData) => {
        set({loading: true});
        try {
            const res = await axiosInstanse.post("/products", productData);
            set((prevState) => ({
                products : [...prevState.products, res.data],
                loading:false
            }));
        } catch (error) {   
            toast.error(error.response.data.error);
            set({loading: false});
        }
    },

    fetchAllProducts : async () => {
        set({loading:true});
        try {
            const response = await axiosInstanse.get("/products");
            set({products:response.data.products, loading: false});
        } catch (error) {
            toast.error("Failed to fetch products");
            set({loading: false});
        }
    },

    deleteProducts: async (id) =>{},

    toggleFeaturedProduct : async (id) => {}
}));    