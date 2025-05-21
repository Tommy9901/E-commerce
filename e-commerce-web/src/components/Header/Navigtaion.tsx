"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart, Search, ShoppingCart, User } from "lucide-react";

import { Input } from "../ui/input";
import { useContext, useEffect, useState, useCallback } from "react";
import { Context, ProductType } from "../Card";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Navigation = () => {
  const [savedProduct, setSavedProduct] = useState([]);
  const [searchValue, setSearchValue] = useState<ProductType[]>([]);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const value = useContext(Context);

  const loadSavedProduct = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/Save`);
      const data = await response.json();
      setSavedProduct(data);
    } catch (error) {
      console.error('Error loading saved products:', error);
    }
  }, []);

  const loadProduct = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/products`);
      const data = await response.json();
      setSearchValue(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, []);

  useEffect(() => {
    loadSavedProduct();
  }, [value?.like, value?.cookie, loadSavedProduct]);

  useEffect(() => {
    if (search) {
      loadProduct();
    }
  }, [search, loadProduct]);

  const handleLogout = () => {
    Cookies.remove("token");
    value?.setCookie(false);
    alert("амжилттай гарлаа");
    router.push("/");
  };

  const handleCartClick = () => {
    if (!Cookies.get("token")) {
      alert("худалдан авалт хийхээс өмнө нэвтэрнэ үү");
      router.push("/Login");
      return;
    }
    router.push("/Basket");
  };

  const filteredProducts = searchValue.filter(
    (item) => item?.productName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black">
      <div className="max-w-[1440px] mx-auto py-4 px-6  bg-[#000000] text-white">
        <div className="flex justify-between items-center">
          <div className="flex gap-8">
            <Link href="/" className="flex gap-2">
              <div className="w-8 h-[27px]">
                <Image
                  className="w-8 h-[27px]"
                  src={"/NavigationLogo.png"}
                  width={30}
                  height={30}
                  alt="logo"
                />
              </div>
              <p className="text-white">ECOMMERCEE</p>
            </Link>
            <div>
              <Link
                href={"/Category"}
                className="font-normal text-sm text-[#FFFFFF] hover:text-[#2563EB] transition-colors"
              >
                Ангилал
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-[#18181B] relative">
            <Search className="text-white" />
            <Input
              className="w-[200px] outline-none resize-none border-[#18181B] text-sm font-normal focus-visible:ring-0"
              type="input"
              placeholder="Бүтээгдэхүүн хайх"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {isSearchFocused && search && (
              <div className="absolute top-12 z-50 left-0 w-full max-h-[300px] overflow-y-auto bg-white rounded-lg shadow-lg">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <Link
                      href={`/ProductDetail?id=${item?._id}`}
                      key={item?._id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 relative">
                        <Image
                          src={item?.images[0] || "/placeholder.png"}
                          alt={item?.productName || ""}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-black">{item?.productName}</span>
                        <span className="text-sm text-gray-600">{item?.price}₮</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-black text-center">Бүтээгдэхүүн олдсонгүй</div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-6">
              <Link className="relative" href={"/Save"}>
                <Heart className="hover:text-[#2563EB] transition-colors" />
                {savedProduct.length > 0 && (
                  <div className="absolute flex items-center justify-center text-sm right-[-7px] top-[-5px] rounded-full bg-[#2563EB] w-4 h-4">
                    {savedProduct.length}
                  </div>
                )}
              </Link>

              <button
                onClick={handleCartClick}
                className="hover:text-[#2563EB] transition-colors"
              >
                <ShoppingCart />
              </button>
            </div>
            {value?.cookie ? (
              <div className="cursor-pointer">
                <div onClick={handleLogout}>
                  <Avatar>
                    <AvatarImage src={"https://github.com/shadcn.png"} />
                    <AvatarFallback className="bg-[#2563EB] text-white">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href={"/Register"}
                  className="py-2 px-3 bg-[black] rounded-[20px] text-white cursor-pointer hover:bg-[#2563EB] hover:transition-all hover:border-white border text-sm font-medium"
                >
                  Бүртгүүлэх
                </Link>

                <Link
                  href={"/Login"}
                  className="py-2 px-3 bg-[#2563EB] rounded-[20px] text-white cursor-pointer hover:bg-black hover:transition-all hover:border-white hover:border border text-sm font-medium"
                >
                  Нэвтрэх
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
