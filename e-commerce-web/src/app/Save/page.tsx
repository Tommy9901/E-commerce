"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
// import { HeartIcon } from "@radix-ui/react-icons";
import { HeartIconSvg } from "@/components/HeartIcon";
import { Context } from "@/components/Card";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type SavedProduct = {
  name: string;
  amount: number;
  ProductId: string;
  image: string;
  _id: string;
  heart: boolean;
};

export default function Save() {
  const value = useContext(Context);
  const router = useRouter();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:4000/Save`);
      if (!response.ok) {
        throw new Error('Failed to load saved products');
      }
      const data = await response.json();
      setSavedProducts(data);
    } catch (error) {
      setError('Failed to load saved products. Please try again later.');
      console.error('Error loading saved products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSavedProduct = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/Save/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      value?.setLike(!value.like);
      await loadSavedProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to remove product from saved items. Please try again.');
    }
  };

  const addToCart = async (product: SavedProduct) => {
    try {
      const basketProducts = JSON.parse(localStorage.getItem("basketProducts") || "[]");
      const existingProduct = basketProducts.find((item: any) => item.productId === product.ProductId);
      
      if (existingProduct) {
        existingProduct.productCount += 1;
      } else {
        basketProducts.push({
          productId: product.ProductId,
          productName: product.name,
          price: product.amount,
          productCount: 1,
          images: [product.image],
        });
      }
      
      localStorage.setItem("basketProducts", JSON.stringify(basketProducts));
      value?.setUpdateShoppingCart(basketProducts);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  useEffect(() => {
    if (!Cookies.get("token")) {
      router.push("/Login");
      return;
    }
    loadSavedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[622px] mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[622px] mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold mb-6">
          Хадгалсан бараа ({savedProducts.length})
        </h1>

        {savedProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Таны хадгалсан бараа байхгүй байна.</p>
            <Link href="/Category">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                Бараа үзэх
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {savedProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-between border-2 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6 p-4">
                  <Link href={`/ProductDetail?id=${product.ProductId}`}>
                    <div className="relative w-[100px] h-[100px]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col gap-2">
                    <Link 
                      href={`/ProductDetail?id=${product.ProductId}`}
                      className="text-lg font-medium hover:text-[#2563EB] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="font-bold text-lg">
                      {product.amount.toLocaleString('mn-MN')}₮
                    </p>
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-[#2563EB] hover:bg-[#1d4ed8] w-[81px] h-[28px] rounded-3xl text-sm text-white"
                    >
                      Сагслах
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => deleteSavedProduct(product._id)}
                  className="p-4 hover:text-red-500 transition-colors"
                  aria-label="Remove from saved items"
                >
                  <HeartIconSvg fill={product.heart} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* <HeartIconSvg fill={true} /> */
}
