"use client";
import { DashboardAside } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { paymentType } from "../income/page";

const Order = () => {
  const orderStatus = [
    { name: "Бүгд", value: "all" },
    { name: "Хүлээгдэж байна", value: "pending" },
  ];
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [incomeFilter, setIncomeFilter] = useState("Өнөөдөр");
  const [uploadOrder, setUploadOrder] = useState<paymentType[]> ([])
  const [searchQuery, setSearchQuery] = useState("");

  const filterButtons = [
    { label: "Өнөөдөр", value: "Өнөөдөр" },
    { label: "7 хоног", value: "7хоног" },
    { label: "1 сар", value: "1сар" },
  ];

  const loadFiltIncome = async () => {
    try {
      const endTime = new Date();
      const startTime = new Date();
      
      switch (incomeFilter) {
        case "Өнөөдөр":
          startTime.setDate(endTime.getDate() - 1);
          break;
        case "7хоног":
          startTime.setDate(endTime.getDate() - 7);
          break;
        case "1сар":
          startTime.setDate(endTime.getDate() - 30);
          break;
        default:
          return;
      }

      const response = await fetch(
        `http://localhost:4000/order?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setUploadOrder(data);
      console.log(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const filteredOrders = uploadOrder.filter(order => {
    if (!order) return false;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "pending" && !order.paymentStatus);
    const matchesSearch = searchQuery === "" || 
      order.orderNumber?.toString().includes(searchQuery) ||
      order.userId?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    loadFiltIncome();
  }, [incomeFilter]);

  return (
    <div className="flex max-w-[1440px]">
      <div className="bg-[#FFFFFF] w-[222px]">
        <DashboardAside />
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex font-normal text-sm text-[#3F4145]">
          {orderStatus.map((item) => (
            <div 
              key={item.name} 
              className={`p-4 cursor-pointer ${selectedStatus === item.value ? 'text-[#18BA51] font-semibold' : ''}`}
              onClick={() => setSelectedStatus(item.value)}
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className="mx-[23.5px] mt-[34px] mb-6 flex justify-between ">
          <div className="flex  gap-2">
            {filterButtons.map((button) => (
              <Button
                key={button.value}
                onClick={() => {
                  setIncomeFilter(button.value);
                }}
                className={`${
                  incomeFilter === button.value
                    ? "bg-[#18BA51] text-white"
                    : "bg-white text-black"
                } w-[94px] border-[#ECEDF0] hover:bg-[#18BA51] hover:font-bold hover:text-white border-[1px] h-[36px] py-1.5 px-3 rounded-md text-[14px]`}
              >
                {button.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1 px-2 rounded-[8px] border-[#D6D8DB] border">
            <Search className="" />
            <Input
              className="w-[302px] h-9 outline-none resize-none border-none shadow-none text-sm font-normal focus-visible:ring-0"
              type="input"
              placeholder="Бүтээгдэхүүн хайх"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-[12px] shadow-xl border border-[#ECEDF0] ml-[23.5px] mr-6 pb-4">
          <div className="py-[20px] px-6 font-bold text-xl">Захиалга</div>
          <div className="">
            <Table className="bg-[##F7F7F8] border-b-[1px] w-[1218px] rounded-none">
              <TableHeader>
                <TableRow className="bg-[#D6D8DB]">
                  <TableHead className="max-w-[191px] text-xs font-semibold px-6 text-black py-[14px]">
                    Захиалгын ID дугаар
                  </TableHead>
                  <TableHead className="max-w-[209px] text-xs font-semibold px-6 text-black py-[14px]">
                    Үйлчлүүлэгч
                  </TableHead>
                  <TableHead className="max-w-[168px] text-xs font-semibold px-6 text-black py-[14px]">
                    Огноо
                  </TableHead>
                  <TableHead className="max-w-[129px] text-xs font-semibold px-6 text-black py-[14px]">
                    Цаг
                  </TableHead>
                  <TableHead className="max-w-[137px] text-xs font-semibold px-6 text-black py-[14px]">
                    Төлбөр
                  </TableHead>
                  <TableHead className="max-w-[214px] text-xs font-semibold px-6 text-black py-[14px] text-center">
                    Статус
                  </TableHead>
                  <TableHead className="max-w-[214px] text-xs font-semibold px-6 text-black py-[14px] text-center">
                    Дэлгэрэнгүй
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(
                  (order: paymentType) =>
                    order && (
                  <TableRow key={order._id}>
                    <TableCell className=" py-[26px] max-w-[156px]">
                      <p className="text-sm font-semibold px-6">
                        #{order.orderNumber}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4 max-w-[156px] flex flex-col text-left gap-2">
                      <p className="text-sm font-semibold">
                        {order.userId?.userName || 'N/A'}
                      </p>
                      <p className="text-sm font-normal text-[#3F4145]">{order.userId?.email || 'N/A'}</p>
                    </TableCell>
                    <TableCell className="px-6 max-w-[156px]">
                      {dayjs(order?.createAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="px-6 max-w-[156px]">
                    {dayjs(order?.createAt).format("HH:mm")}
                    </TableCell>
                    <TableCell className="px-6 py-4 max-w-[156px text-center]">
                      <div className="">
                        {order.paymentAmount}₮
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 max-w-[156px]">
                      <div className={`border px-[10px] py-[6px] text-center rounded-full ${
                        order.paymentStatus ? "bg-blue-100" : "bg-blue-100"
                      }`}>
                        {order.paymentStatus ? "Хүлээгдэж байна" : "Хүлээгдэж байна"}
                      </div>
                    </TableCell>

                    <TableCell className=" py-4 flex gap-4 items-center justify-center">
                      <Link href={`/OrderDetail?id=${order.userId?._id}`}>
                        <ChevronRight />
                      </Link>
                    </TableCell>
                  </TableRow>
                )
                )} 
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Order;
