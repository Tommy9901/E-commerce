"use client";

import { filters, sizes } from "@/components/BasketCard";
import { Card, ProductType } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

export default function Home() {
  const [cardList, setCardList] = useState<ProductType[]>([]);
  const [categoryType, setCategoryType] = useState("");
  const [sizee, setSizee] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const reset = () => {
    setCategoryType("");
    setSizee("");
  };

  const productList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/products?fromDate=${""}&toDate=${""}`
      );
      const data = await response.json();
      setCardList(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setCardList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filtproduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/category?categoryType=${categoryType}&size=${sizee}`
      );
      const result = await response.json();
      
      if (result.success) {
        setCardList(result.data);
      } else {
        console.error('Filter error:', result.message);
        setCardList([]);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      setCardList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    productList();
  }, []);

  const typeFilter = (value: string) => {
    if (categoryType === value) {
      setCategoryType("");
    } else {
      setCategoryType(value);
    }
  };

  useEffect(() => {
    if (categoryType || sizee) {
      filtproduct();
    } else {
      productList();
    }
  }, [categoryType, sizee]);

  const sizeFilter = (value: string) => {
    if (sizee === value) {
      setSizee("");
    } else {
      setSizee(value);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        loading...
      </div>
    );
  }

  return (
    <div className="max-w-[1039px] mx-auto flex gap-[20px] pb-[100px] pt-[52px]">
      <div className="max-w-[245px] w-full flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="font-bold">Ангилал</div>
          {filters.map((filter) => (
            <label
              key={filter.filt}
              className="flex gap-2 items-center select-none"
            >
              <Checkbox
                checked={filter.value === categoryType}
                onClick={() => {
                  typeFilter(filter.value);
                }}
              />
              <div>{filter.filt}</div>
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold">Хэмжээ</div>
          {sizes.map((size) => (
            <label key={size} className="flex gap-2 items-center">
              <Checkbox
                onClick={() => {
                  sizeFilter(size);
                }}
                checked={size === sizee}
              />
              <div>{size}</div>
            </label>
          ))}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-x-[21px] gap-y-12">
        {cardList.map((cardItems, index) => (
          <Card key={cardItems?._id} cardItems={cardItems} index={index} />
        ))}
        {cardList.length === 0 && (
          <div className="flex justify-center items-center flex-col col-span-3 text-center">
            <p className="text-gray-500">
              Таны хайлтын үр дүнгүй байна.
            </p>
            <Button variant="outline" onClick={() => reset()}>
              Буцах
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
