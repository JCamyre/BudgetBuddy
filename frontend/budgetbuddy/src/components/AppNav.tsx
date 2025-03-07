import Link from 'next/link';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import logo from '../../public/logo.png';

const AppNav = () => {
  return (
    <nav className="bg-green-900 shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src={logo as StaticImageData}
                alt="logo"
                height={40}
                width={40}
                className="rounded-full cursor-pointer"
              />
            </Link>
            <div className="hidden md:flex space-x-4 ml-6">
              <Link
                href="/expenses"
                className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Expenses and Budget
              </Link>
              <Link
                href="/goals"
                className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Financial Goals
              </Link>
              <Link
                href="/insights"
                className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Personalized Insights
              </Link>
              <Link
                href="/reports"
                className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Reports and Analytics
              </Link>
            </div>
          </div>

          <div>
            <Link
              href="/login"
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 text-sm font-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNav;