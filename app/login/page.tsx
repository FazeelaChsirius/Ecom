import Login from '@/components/Login'
import React from 'react'

export const metadata = {
  title: `Login - Ecom`,
  description: 'Signin or login with your ecom account',
  keywords: "Ecom signin, ecom login, ecom account login",
  openGraph: {
    title: `Login - Ecom`,
    description: 'Signin or login with your ecom account',
  url: `${process.env.SERVER}/login`,
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

const LoginRouter = () => {
  return (
    <Login />
  )
}

export default LoginRouter