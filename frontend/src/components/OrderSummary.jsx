    import {motion} from "framer-motion";
    import { useCartStore } from "../store/useCartStore";
    import { Link } from "react-router-dom";
    import { MoveRight } from "lucide-react";
    // import {loadStripe} from "@stripe/stripe-js";
    import axiosInstanse from "../lib/axios";


    // const stripePromise = loadStripe("pk_test_51SWiZxJOyMt6mIdeJSvEBu1cQpyNUU9RGqRitx1D0VOiDS0Eno97oYpIOD3cYghSspM5luDWE2TIrKormaioL8qR00uYi4bXtW");

    const OrderSummary = () => {
        const {total, subtotal ,isCouponApplied, coupon, cart} = useCartStore();

        const savings = subtotal - total;
        const formattedSubtotal = subtotal.toFixed(2);
        const formattedTotal = total.toFixed(2);
        const formatedSavings  = savings.toFixed(2);

        const handlePayment = async () => {
            try {
                const res = await axiosInstanse.post(
                    "/payments/create-checkout-session",
                    {
                        products: cart,
                        couponCode: coupon ? coupon.code : null,
                    }
                );

                // Redirect to Stripe Checkout
                window.location.href = res.data.url;

            } catch (error) {
                console.error(
                    "Payment error:",
                    error.response?.data || error.message
                );
            }
        };
        

        return (
            <motion.div 
                className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y: 0}}
                transition={{ duration: 0.5}}
                >
                    <p className="text-xl font-semibold text-emerald-400">Order summary </p>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-base font-normal text-gray-300">Original price</dt>
                                <dd className="text-base font-medium text-white">
                                    {formattedSubtotal}
                                </dd>
                            </dl>

                            {savings > 0 && (
                                <dl className="flex items-center justify-between gap-4">
                                    <dt className="text-base font-normal text-gray-300">Savings</dt>
                                    <dd className="text-base font-medium text-emerald-400">-${formatedSavings}</dd>
                                </dl>
                            )}

                            {coupon && isCouponApplied && (
                                <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                                    <dt className="text-base font-normal text-white">Coupon ({coupon.code})</dt>
                                    <dd className="text-base font-medium  text-emerald-400">-{coupon.discountPercentage}%</dd>
                                </dl>
                            )}

                            <dl  className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                                <dt className="text-base  font-bold text-white">Total</dt>
                                <dd className="text-base font-bold text-emerald-400">${formattedTotal}</dd>
                            </dl>
                        </div>

                        <motion.button
                        className="flex w-full  items-center justify-center rounded-lg  bg-emerald-600 px-5 py-2.5 
                        text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        whileHover={{ scale: 1.05}}
                        whileTap={{scale :0.95 }}
                        onClick={handlePayment}
                        >
                            Proceed to Checkout
                        </motion.button>


                        <div className="flex items-center justify-center gap-2">
                            <span className="text-sm font-normal text-gray-400">or</span>
                            <Link 
                                to="/" 
                                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline 
                                hover:text-emerald-300 hover:no-underline"
                            >
                                Continue Shopping
                                <MoveRight size={16}/>
                            </Link>
                        </div>

                    </div>
            </motion.div>
        )
    };
    export default OrderSummary;