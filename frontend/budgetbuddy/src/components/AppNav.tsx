import Link from 'next/link'
import React from 'react'
import Image from "next/image";

const AppNav = () => {
    return (
      <nav className="p-4 bg-white shadow-md flex justify-between items-center">
        {/* Logo on the Left */}
        <Link href="/">
          <Image src="/logo.png" alt="Budget Buddy Logo" width={120} height={40} />
        </Link>
  
        {/* Navigation Links on the Right */}
        <div className="flex space-x-6 text-green-700 font-medium">
          <Link href="/expenses" className="text-[#629995] text-[18px] font-bold leading-normal">Expenses and Budget</Link>
          <Link href="/goals" className="text-[#629995] text-[18px] font-bold leading-normal">Financial Goals</Link>
          <Link href="/insights" className="text-[#629995] text-[18px] font-bold leading-normal">Personalized Insights</Link>
          <Link href="/reports" className="text-[#629995] text-[18px] font-bold leading-normal">Reports and Analytics</Link>
        </div>
      </nav>
    );
  };
  
  export default AppNav;