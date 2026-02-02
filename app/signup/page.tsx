import Signup from '@/components/Signup'
import React from 'react'

export const metadata = {
  title: `Signup - Ecom`,
  description: 'Signup or register your new ecom account',
  keywords: "ecom signin, ecom login, ecom account login, ecom signup, ecom register, ecom new account",
  openGraph: {
    title: `Signup - Ecom`,
    description: 'Signup or register your new ecom account',
  url: `${process.env.SERVER}/signup`,
    siteName: "Ecom",
    images: [
      {
        url: "/images/logo.jpg", // replace with your image
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

const SignupRouter = () => {
  return (
    <Signup />
  )
}

export default SignupRouter