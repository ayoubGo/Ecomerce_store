import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axiosInstanse from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";



const PeopleAlsoBought = () => {

    const [recomendation , setRecomendation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    console.log(recomendation);



    useEffect(() => {
     const fetchRecommendation = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstanse.get("/products/recommended");
            setRecomendation(res.data);
        } catch (error) {
            toast.error(error.response.data.message || "An error occured while fetching")
        }finally{
            setIsLoading(false);
        }

    }   
    fetchRecommendation();
    },[]);

    if(isLoading) return <LoadingSpinner/>
    return (
        <div className="mt-8 ">
            <h3 className="text-2xl font-semibold text-emerald-400">People also bought</h3>
            <div className="mt-6 grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recomendation.map((product) => (
                    <ProductCard key={product._id} product={product}/>
                ))}
            </div>
        </div>
    )
};
export default PeopleAlsoBought;