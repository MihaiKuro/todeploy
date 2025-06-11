import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCartStore();
    const { user } = useUserStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add products to cart");
            return;
        }
        if (product.stock <= 0) {
            toast.error("This product is out of stock");
            return;
        }
        addToCart(product);
    };

    if (loading) return <LoadingSpinner />;
    if (!product) return <div className="text-center py-8">Product not found</div>;

    return (
        <div className="px-4 pt-16">
            <motion.div
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Product Image */}
                    <div className="relative aspect-square">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
                        
                        <div className="mb-6">
                            <p className="text-2xl font-bold text-[#2B4EE6]">{product.price} ron</p>
                            <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                            <p className="text-gray-300">{product.description}</p>
                        </div>

                        <button
                            className="flex items-center justify-center rounded-lg bg-[#2B4EE6] px-5 py-2.5 text-center text-sm font-medium
                                text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 
                                disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            <ShoppingCart size={22} className="mr-2" />
                            {product.stock <= 0 ? 'Out of Stock' : 'Add to cart'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetailPage; 