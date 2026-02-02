import Products from "@/components/Products"

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
        url: "/images/logo.jpg", // replace with your image
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

const HomeRouter = async () => {
  const productRes = await fetch(`${process.env.SERVER}/api/product`)
  const products = productRes.ok ? await productRes.json() : {data: [], total: 0}

  return <Products data={products}/>
}

export default HomeRouter 