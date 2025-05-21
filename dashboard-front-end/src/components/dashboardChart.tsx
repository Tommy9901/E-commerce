"use client";

import { ArrowRight } from "lucide-react";

const data = {
  date: ["01/06", "01/07", "01/08", "01/09", "01/10", "01/11", "01/12"],
  sales: [400000, 300000, 200000, 100000, 0],
};

export function DashboardChart() {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between py-2">
        <div className="text-lg font-semibold text-gray-800">Борлуулалт</div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex flex-col gap-[14px] relative min-h-[300px]">
        <div className="flex flex-col gap-9">
          {data.sales.map((amount) => (
            <div key={amount} className="flex gap-[14px] items-center">
              <div className="w-[38px] text-sm text-gray-600 font-medium">
                {amount / 1000}K
              </div>
              <div className="flex-1 border-dashed border-gray-200 border-[1px] h-[1px]"></div>
            </div>
          ))}
        </div>
        <div className="absolute flex gap-[62px] items-end top-3 left-20">
          {data.sales.map((dataChar) => (
            <div
              key={dataChar}
              className="w-3 bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600 cursor-pointer group relative"
              style={{ height: `${(240 * dataChar) / 400000}px` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {dataChar.toLocaleString()}₮
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-[33px] ml-[60px] items-center mt-4">
          {data.date.map((date) => (
            <div key={date} className="text-sm text-gray-600">{date}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
