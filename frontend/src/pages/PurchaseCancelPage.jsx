import {motion} from "framer-motion";
import { ArrowLeft, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{opacity: 0, y:20}}
                animate={{opacity : 1, y:0}}
                transition={{ duration:0.5}}
                className="max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10" >
                    <div className="p-6 sm:p-8">
                        <div className="flex justify-center">
                            <XCircle className="w-16 h-16 text-red-500 mb-4"/>
                        </div>
                        <h1 className="text-red-500 font-bold text-2xl  sm:text-3xl text-center mb-2">Purchase canceled </h1>
                        <p className="text-center text-gray-300 mb-6">Your order has been cancelled. No charges have been made.</p>
                        <div className="w-full bg-gray-700 p-6 rounded-lg mb-4">
                            <p className="text-gray-300 text-center"> 
                                If you encountered any issues during the checkout process, please don&apos;t hesitate to
							    contact our support team.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Link
                                to={"/"}
                                className="w-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center rounded-lg px-4 py-2 font-bold transition duration-300 text-gray-300"
                                >
                                    <ArrowLeft className="mr-2" size={18}/>
                                    Return to shop
                            </Link>
                        </div>
                    </div>
            </motion.div>
        </div>
    )
};
export default PurchaseCancelPage;