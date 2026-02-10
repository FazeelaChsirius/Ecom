import Products from "@/components/Products"
import { fetchProducts } from "@/controller/product.controller"

export const revalidate = 20

export const metadata = {
  title: `Ecom - ${process.env.DOMAIN}`,
  description: 'India`s best and affordable website',
  keywords: "ecom, ecom.com",
  openGraph: {
    title: `Ecom - ${process.env.DOMAIN}`,
    description: 'India`s best and affordable website',
    url: process.env.SERVER,
    siteName: "Ecom",
    images: [
      {
        url: "/images/logo.jpg", 
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

const HomeRouter = async () => {
  const data = await fetchProducts()
  return <Products data={data} />
}

export default HomeRouter 