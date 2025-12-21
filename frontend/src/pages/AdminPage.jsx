import {ShoppingBasket, BarChart, PlusCircle} from "lucide-react";
import { useEffect, useState } from "react";
import {motion} from "framer-motion";
import CreateProductForm from "../components/CreateProductForm.jsx";
import ProductsList from "../components/ProductsList.jsx";
import AnaliticsTab from "../components/AnaliticsTab.jsx";
import { useProductStore } from "../store/useProductStore.js";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {


    const [activeTab , setIsActive] = useState("create");

    const {fetchAllProducts} = useProductStore();

    useEffect(() => {
        fetchAllProducts();
    },[fetchAllProducts]);
    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 countainer mx-auto px-4 py-16">
                <motion.h1 
                    className="text-4xl font-bold mb-8 text-emerald-400 text-center"
                    initial={{opacity:0, y:-20}}
                    animate={{opacity:1, y:0}}
                    transition={{duration:0.8}}>
                    Admin Dashbord
                </motion.h1>
            </div>

            <div className="flex justify-center mb-8">
                {tabs.map((tab) => (
                    <button 
                    key={tab.key}
                    id={tab.id}
                    onClick={() => setIsActive(tab.id)}
                    className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 
                        ${activeTab === tab.id ? 
                            "bg-emerald-600 text-white" 
                            :
                             "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}>
                        <tab.icon className="mr-2 h-5 w-5"/>
                        {tab.id}
                    </button>
                ))}
            </div>

            {activeTab === "create" && <CreateProductForm/>}
            {activeTab === "products" && <ProductsList/>}
            {activeTab === "analitics" && <AnaliticsTab/>}
        </div>
    )
};
export default AdminPage;