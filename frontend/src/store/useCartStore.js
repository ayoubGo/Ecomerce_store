import {create} from "zustand";
import axiosInstanse from "../lib/axios.js"
import {toast} from "react-hot-toast"

export const useCartStore = create((set, get) => ({

    cart :[],
    coupon : null,
    total:0,
    subtotal :0,
    isCouponApplied:false,


    getCartItems : async () => {

        try {
            const res = await axiosInstanse.get("/cart");
            set({cart: res.data});
            get().calculateTotals();
        } catch (error) {
            set({cart: []});
            toast.error(error.response.data.message || "An Error occured ");
        }
    },


    getCoupon : async () => {
        try {
            const res = await axiosInstanse.get("/coupons");
            set({coupon: res.data});
        } catch (error) {  
            console.error("Error fetching coupon : ", error);
        }
    },

    applyCoupon: async (code) => {
        try {
            const res = await axiosInstanse.post("/coupons/validate", {code});
            set({coupon:res.data, isCouponApplied:true});
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon");
        }
    },

    removeCoupon : async () => {
      try {
        set({coupon: null, isCouponApplied:false});
        get().calculateTotals();
        toast.success("Coupon removed")
      } catch (error) {
        console.log("Error in removing coupon")
      }  
    },

    clearCart: async () => {
        try {
            await axiosInstanse.delete("/payments/clear"); // call the new endpoint
            set({
            cart: [],
            coupon: null,
            total: 0,
            subtotal: 0,
            isCouponApplied: false,
            });
            toast.success("Cart cleared");
        } catch (error) {
            toast.error("Failed to clear cart");
        }
    },

    addToCart : async (product) => {
        try {
            await axiosInstanse.post("/cart", {productId:product._id});
            toast.success("Product added to cart");


            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem 
                    ? prevState.cart.map(((item) => 
                    item._id === product._id ? {...item , quantity : item.quantity + 1} : item )
                    )
                    : [...prevState.cart, {...product, quantity: 1}];
                return {cart : newCart};
            });
            get().calculateTotals();

        } catch (error) {
            toast.error(error.response.data.message || "An error occured");
        }
    },

    removeFromCart : async (productId) => {
        try {
            await axiosInstanse.delete("/cart",{data:{productId}});
            set((prevState) => ({cart : prevState.cart.filter((item) => item._id !== productId)}));
            get().calculateTotals();      
        } catch (error) {
            toast.error("Product is deleted successfully");
        }
    },

    updateQuantity : async (productId, quantity) => {

        if(quantity === 0){
            get().removeFromCart(productId);
            return;
        }

        await axiosInstanse.put(`/cart/${productId}`,{quantity});
        set((prevState) => ({
            cart: prevState.cart.map((item) => (item._id === productId ? {...item, quantity} : item)),
        }));
        get().calculateTotals();
    },

    calculateTotals : () => {

        const {cart, coupon} = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if(coupon){
            const discount = subtotal * (coupon.discountPercentage / 100 );
            total = subtotal - discount;
        }

        set({subtotal, total})
    }
}))