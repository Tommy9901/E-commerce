"use client"; // usestate ashiglaj bolohgui bsn
import { Calendar, ChevronDown, Download, Slice } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardAside } from "@/components/Dashboard";
import { DateRange } from "react-day-picker";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import dayjs from "dayjs";
const mockData = [
  {
    _id: "1",
    userName: "John Doe",
    email: "john.doe@example.com",
  },
  {
    _id: "2",
    userName: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    _id: "3",
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
  },
  {
    _id: "4",
    userName: "Bob Brown",
    email: "bob.brown@example.com",
  },
  {
    _id: "5",
    userName: "Charlie Davis",
    email: "charlie.davis@example.com",
  },
  {
    _id: "6",
    userName: "David Wilson",
    email: "david.wilson@example.com",
  },
  {
    _id: "7",
    userName: "Eve White",
    email: "eve.white@example.com",
  },
  {
    _id: "8",
    userName: "Frank Green",
    email: "frank.green@example.com",
  },
  {
    _id: "9",
    userName: "George Blue",
    email: "george.blue@example.com",
  }
  
  
];

export type paymentType =
  | {
      _id: string;
      orderNumber: number;
      paymentStatus: boolean; 
      paymentType: string; 
      userId: {
        _id:string,
        userName:string,
        email:string,
        phoneNumber:number
      }
      paymentAmount: number;
      createAt:Date
    }
  | undefined;

const Income = () => {
  const [incomeFilter, setIncomeFilter] = useState("Өнөөдөр");

  const [takeIncome, setTakeIncome] = useState<paymentType[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
        throw new Error('Failed to fetch income data');
      }
      
      const data = await response.json();
      setTakeIncome(data);
    } catch (error) {
      console.error('Error loading income:', error);
    }
  };

  const calculateTotal = () => {
    return takeIncome.reduce((sum, income) => sum + (income?.paymentAmount || 0), 0);
  };

  useEffect(()=>{
    loadFiltIncome()
  },[incomeFilter])
  const handlePopOver = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };
  const mockDataUnderIndex = () => {
    for(let i = 0; i < mockData.length; i++){
      mockData.map((user, index) => index)
    }
  }
  return (
    <div className="flex max-w-[1440px]">
      <div className="bg-[#FFFFFF] w-[222px]">
        <DashboardAside />
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col w-full px-6">
          <div className="w-full bg-[#FFFFFF] rounded-xl border-[1px] border-[#ECEDF0] flex flex-col mt-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between p-6 gap-4">
              <div className="font-bold text-[20px]">Орлого (Нийт)</div>
              <Button className="w-full sm:w-[144px] h-[28px] bg-[#1C20240A] rounded-md flex gap-2 px-[6px] py-[2px] text-black hover:bg-slate-400">
                <Download className="h-[20px] w-[20px]" />
                <span className="text-[14px]">Хуулга татах</span>
              </Button>
            </div>
            <div className="border-t border-[#ECEDF0]" />
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="font-bold text-2xl md:text-[28px]">{calculateTotal().toLocaleString()}₮</div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => setIncomeFilter("Өнөөдөр")}
                  className={`${
                    incomeFilter === "Өнөөдөр"
                      ? "bg-[#18BA51] text-white"
                      : "bg-white text-black"
                  } w-[94px] border-[#ECEDF0] hover:bg-[#18BA51] hover:font-bold hover:text-white border-[1px] h-[36px] py-1.5 px-3 rounded-md text-[14px]`}
                >
                  Өнөөдөр
                </Button>
                <Button
                  onClick={() => setIncomeFilter("7хоног")}
                  className={`${
                    incomeFilter === "7хоног"
                      ? "bg-[#18BA51] text-white"
                      : "bg-white text-black"
                  } w-[94px] border-[#ECEDF0] hover:bg-[#18BA51] hover:font-bold hover:text-white border-[1px] h-[36px] py-1.5 px-3 rounded-md text-[14px]`}
                >
                  7 хоног
                </Button>
                <Button
                  onClick={() => setIncomeFilter("1сар")}
                  className={`${
                    incomeFilter === "1сар"
                      ? "bg-[#18BA51] text-white"
                      : "bg-white text-black"
                  } w-[94px] border-[#ECEDF0] hover:bg-[#18BA51] hover:font-bold hover:text-white border-[1px] h-[36px] py-1.5 px-3 rounded-md text-[14px]`}
                >
                  1 сар
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePopOver}
                  className="h-[36px] w-[36px]"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <DatePickerWithRange
              date={date}
              setDate={setDate}
              isDatePickerOpen={isDatePickerOpen}
            />
          </div>
        </div>
        <div className="w-full px-6">
          <div className="bg-white rounded-xl border border-[#ECEDF0] shadow-sm overflow-x-auto">
            <Table>
              <TableCaption className="text-base font-semibold py-4">Орлогын жагсаалт</TableCaption>
              <TableHeader>
                <TableRow className="bg-[#F7F7F8]">
                  <TableHead className="font-semibold whitespace-nowrap px-5 py-[14px]">Захиалгын ID дугаар</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap px-5 py-[14px]">Захиалагч</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap px-5 py-[14px]">Төлбөр</TableHead>
                  <TableHead className="font-semibold text-right whitespace-nowrap px-5 py-[14px]">Огноо</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {takeIncome.map((income) => (
                  <TableRow key={income?._id} className="hover:bg-slate-50">
                    <TableCell className="font-medium whitespace-nowrap px-5 py-4">#{income?.orderNumber}</TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col min-w-[200px]">
                        <span className="font-semibold truncate">{mockData.map((user, index) => index === 3 ? user.userName : null)}</span>
                        <span className="text-sm text-gray-500 truncate">{mockData.map((user, index) => index === 3 ? user.email : null)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap px-5 py-4">{income?.paymentAmount?.toLocaleString()}₮</TableCell>
                    <TableCell className="text-right whitespace-nowrap px-5 py-4">{dayjs(income?.createAt).format("YYYY-MM-DD")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-[#F7F7F8]">
                  <TableCell colSpan={3} className="font-semibold px-5 py-4">Нийт</TableCell>
                  <TableCell className="text-right font-semibold px-5 py-4">{calculateTotal().toLocaleString()}₮</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
