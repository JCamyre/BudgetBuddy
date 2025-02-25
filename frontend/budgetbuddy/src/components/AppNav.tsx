import Link from 'next/link'
import React from 'react'
import Image, {StaticImageData} from 'next/image'
import logo from '../../public/logo.png'

const AppNav = () => {
  return (

    <div>
      <div className= "text-green-700 flex gap-4 justify-items-stretch max-w-full p-4">
            <Link href={"/"} > <Image src={logo as StaticImageData} alt='logo' height={20}/> </Link>
            <Link href={'/'} > budget buddy </Link>
            <Link href={'/expenses'}> Expenses and Budget</Link>
            <Link href={'/goals'}> Financial Goals</Link>
            <Link href={'/insights'}> Personalized Insights</Link>
            <Link href={'/reports'}> Reports and Analytics</Link>
      </div>
    </div>

  )
}

export default AppNav