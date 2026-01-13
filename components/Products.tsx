'use client'

import DataInterface from '@/interface/data.interface'
import clientCatchError from '@/lib/client-catch-error'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import "@ant-design/v5-patch-for-react-19"
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Products: FC<DataInterface> = ({ data }) => {
  const [isBrowser, setIsBrowser] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsBrowser(true)
  })

  const addToCart = async (id: string) => {
    try {
      const session = await getSession()
      if(!session)
        return router.push("/login")
      
      const {data} = await axios.post('/api/cart', {product: id})
      console.log('cart-data', data)
      
    } catch (err) {
      clientCatchError(err)
    }
  }

  if(!isBrowser)
    return null
  
  return (
    <div className='grid grid-cols-4 gap-8'>
      {
        data.data.map((item: any, index: number) => (
          <Card 
            key={index}
            hoverable
            cover={
              <div className='relative w-full h-[250px]'>
                <Image 
                  src={item.image}
                  alt={`product-${item.title}`} 
                  fill 
                  sizes='350px'
                  priority
                  className='rounded-t-lg shadow-lg object-cover'
                />
              </div>
            }
          >
            <Card.Meta 
              title={
                <Link href={`/products/${item.title.toLowerCase().split(" ").join("-")}`} className='!text-inherit hover:!underline'>
                  {item.title}
                </Link>
              }
              description={
                <div className='flex gap-2'>
                  <label>${item.price}</label>
                  <del>${item.price}</del>
                  <label>(${item.discount}% off)</label>
                </div>
              }
            />
            <div className='space-y-3 mt-3'>
              <Button onClick={() => addToCart(item._id)} icon={<ShoppingCartOutlined />} type='primary' className='w-full'>Add to cart</Button>
              <Link href={`/products/${item.title.toLowerCase().split(" ").join("-")}`}>
                <Button type='primary' danger className='w-full'>Buy now</Button>
              </Link>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Products