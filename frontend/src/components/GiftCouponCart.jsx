import {motion} from "framer-motion";
import { useEffect, useState } from "react";
import {useCartStore} from "../store/useCartStore.js"

const GiftCouponCart = () => {

    const [userInputcode, setUserIputCode] = useState("");
    const {coupon , getCoupon, applyCoupon, removeCoupon,isCouponApplied} = useCartStore();

    
    
    
    useEffect(() => {
        getCoupon();
    },[getCoupon]);
    
    useEffect(()=> {
        if (coupon) setUserIputCode(coupon.code);
        console.log(`coupon code is ${coupon}`)
    },[coupon])
    
    const handleApplyCoupon = () => {
        if(!userInputcode) return;
        applyCoupon(userInputcode);
    };
    
    const handleDeleteCoupon = async () => {
        await removeCoupon();
        setUserIputCode("");
    }
    console.log(userInputcode);
    return (
        <motion.div className="space-y-4 border rounded-lg border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
            initial={{opacity: 0, y:20}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 0.5 , delay:0.2}}>
                <div className="space-y-2">
                    <label htmlFor="vocher"
                            className="block mb-2 text-sm font-medium text-gray-300">
                        Do you have a vocher or gift card?
                    </label>
                    <input 
                        type="text"
                        id="vocher"
                        className="block w-full rounded-lg border border-gray-600  bg-gray-700 p-2.5 
                        text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500" 
                        placeholder="Enter your code here"
                        value={userInputcode}
                        onChange={(e) => setUserIputCode(e.target.value)} 
                    />

                    <motion.button
                        type="button"
                        className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm 
                        font-medium hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        whileHover={{scale:1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleApplyCoupon}>
                            Apply Code
                    </motion.button>
                </div>

                {isCouponApplied && coupon && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-400">
                            Applied coupon
                        </h3>

                        <p className="mt-2 text-sm text-gray-400">
                            {coupon.code} - {coupon.discountPercentage}% off
                        </p>

                        <motion.button
                            className="flex mt-2 w-full item-center justify-center bg-red-600
                            px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none 
                            focus:ring-4 focus:ring-red-300"
                            whileHover={{scale:1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={handleDeleteCoupon}
                            >
                                Remove coupon
                        </motion.button>
                    </div>

                )}

                {coupon && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-300">
                            Your Available Coupon:
                        </h3>
                        <p className="mt-2 text-sm text-gray-400">
                            {coupon.code} - {coupon.discountPercentage}% off
                        </p>
                    </div>
                )}
        </motion.div>
    )
};
export default GiftCouponCart;