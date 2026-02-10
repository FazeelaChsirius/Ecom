import Slug from '@/components/Slug'
import { fetchProductBySlug, fetchProductSlugs } from '@/controller/product.controller'
import SlugInterface from '@/interface/slug.interface'
import { Metadata } from 'next'
import React, { FC } from 'react'

export const revalidate = 20

export const generateMetadata = async (context: SlugInterface): Promise<Metadata> => {
  const { slug } = await context.params
  const data = await fetchProductBySlug(slug)

  return {
    title: data ? `Ecom - ${data.title}` : 'Ecom',
    description: data ? data.description : 'Ecom',
    keywords: "Ecom product",
    openGraph: {
      title: data ? `Ecom - ${data.title}` : 'Ecom',
      description: data ? data.description : 'Ecom',
      url: `${process.env.SERVER}/products/${slug}`,
      siteName: "Ecom",
      images: [
        {
          url: data ? data.image : "/images/logo.jpg",
        },
      ],
      locale: "en_US",
      type: "website",
    },
  }
}

const SlugRouter: FC<SlugInterface> = async ({params}) => {
  const {slug} = await params
  const data = await fetchProductBySlug(slug)
  return (
    <Slug data={data} title={slug}/>
  )
}

export default SlugRouter

export const generateStaticParams = async () => {
  const slugList = await fetchProductSlugs()
  return slugList.map((slug: string) => ({
    slug: slug
  }))
}