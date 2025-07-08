import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <Image 
        src='/images/logo.jpg'
        width={100}
        height={0}
        alt='logo'
        priority
        style={{width: 'auto', height: 'auto'}}
    />
  )
}

export default Logo