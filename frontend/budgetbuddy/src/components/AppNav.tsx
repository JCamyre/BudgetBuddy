import Link from 'next/link'
import React from 'react'

const AppNav = () => {
  return (
    <div className="p-4 text-green-700 flex gap-4 justify-center">
        <Link href={"/"}> Logo</Link>
        <Link href={'/expenses'}> Expenses and Budget</Link>
        <Link href={'/goals'}> Financial Goals</Link>
        <Link href={'/insights'}> Personalized Insights</Link>
        <Link href={'/reports'}> Reports and Analytics</Link>
    </div>
  )
}

export default AppNav