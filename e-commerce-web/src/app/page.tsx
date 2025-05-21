"use client";

import Image from "next/image";
import { CardContent, CardShadcn } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useContext, useEffect, useState, useCallback } from "react";
import Card, { Context } from "@/components/Card";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

type ProductType = {
  _id: string;
  productName: string;
  color: string[];
  size: string[];
  price: number;
  productId: number;
  categoryId: string;
  qty: number;
  thumbnails: string;
  images: string[];
  coupon: string;
  salePercent: number;
  description: string;
  viewCount: number;
  createAt: Date;
  updateAt: Date;
  categoryType: string;
  productTag: string;
};

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const value = useContext(Context);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:4000/products?fromDate=undefined&toDate=undefined`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (emblaApi) {
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);

      return () => clearInterval(autoplay);
    }
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1040px] mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="max-w-[1040px] mx-auto p-4 text-center">
        <p className="text-gray-500">No products available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1040px] mx-auto pt-[52px] pb-[100px] px-4">
      <div className="w-full h-[300px] md:h-[446px] mb-[20px]">
        <Carousel 
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
          ref={emblaRef}
        >
          <CarouselContent>
            {products.slice(0, 5).map((product) => (
              <CarouselItem key={product._id}>
                <Link href={`/ProductDetail?id=${product._id}`}>
                  <CardShadcn className="overflow-hidden">
                    <CardContent className="p-0">
                      {product.images[0] && (
                        <div className="relative w-full h-[300px] md:h-[446px]">
                          <Image
                            className="rounded-lg object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 1040px"
                            src={product.images[0]}
                            alt={product.productName}
                            priority={true}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="flex flex-col gap-1 absolute bottom-[32px] left-[32px] text-white">
                            <div className="text-[18px] font-medium">
                              {product.productName}
                            </div>
                            <div className="font-bold text-[36px]">
                              {product.price.toLocaleString('mn-MN')}₮
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </CardShadcn>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      <div className="grid">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[21px] gap-y-12">
          {products.slice(0, 18).map((cardItems, index) => (
            <div
              key={`${cardItems._id}-${index}`}
              className={`
                ${index === 6 ? "lg:col-start-3 lg:col-span-2 lg:row-span-2" : ""}
                ${index === 7 ? "lg:col-start-1 lg:col-span-2 lg:row-span-2" : ""}
              `}
            >
              <Card index={index} cardItems={cardItems} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
