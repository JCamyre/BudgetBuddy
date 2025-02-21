import React from "react";
import Image from "next/image";

const Reports = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-4xl">
        {/* title */}
        <h1 className="text-[#004d40] text-2xl font-bold mb-4">
          Your 2024 Yearly Spending Report:
        </h1>

        {/* chart */}
        <div className="flex justify-center">
          <Image
            src="/chart.png"
            alt="Yearly Spending Report"
            width={800}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
