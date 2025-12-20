'use client'

import DataInterface from '@/interface/data.interface'
import { Card } from 'antd'
import Image from 'next/image'
import React, { FC } from 'react'

const Products: FC<DataInterface> = ({ data }) => {
  return (
    <div className='grid grid-cols-4 gap-8'>
        {
          data.data.map((item: any, index: number) => (
            <Card 
              key={index}
              hoverable
              cover={
                <div className='relative h-[250px]'>
                  <Image 
                    src={item.image}
                    alt={`product-${index}`} 
                    fill 
                    sizes='350px'
                    priority
                    className='rounded-t-lg shadow-lg object-cover'
                  />
                </div>
              }
            >
              <Card.Meta 
                title={item.title}
                description={
                  <div className='flex gap-2'>
                    <label>${item.price}</label>
                    <del>${item.price}</del>
                    <label>(${item.discount}% off)</label>
                  </div>
                }
              />
            </Card>
          ))
        }
      </div>
  )
}

export default Products