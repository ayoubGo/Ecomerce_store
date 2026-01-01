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

    deleteProducts: async (productId) =>{
        set({loading : true});
        try {
            const res = await axiosInstanse.delete(`/products/${productId}`);
            set((prevProduct) => ({
                products:prevProduct.products.filter((product) => product._id != productId),
                loading: false
            }));
        } catch (error) {
            set({loading :false});
            toast.error(error.response.data.error || "Failed to delete Product");
        }
    },

    toggleFeaturedProduct : async (productId) => {
        set({loading: true});
        try {
            const response = await axiosInstanse.get(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.map((product) => 
                    product._id === productId ? {...product, isFeatured: response.data.isFeatured} : product
            ),
            loading : false,
            }));
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.error || "Failed to update product");
        }
    },

    fetchProductsByCategory : async (category) => {
        set({loading: true});
        try {
            const response = await axiosInstanse.get(`/products/category/${category}`);
            set({products: response.data.products, loading:false});

        } catch (error) {
            set({error: "Failed to fetch products", loading:false});
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    }
}));    