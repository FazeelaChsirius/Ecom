'use client'
import { Card, Skeleton } from 'antd'
import Image from 'next/image'

const Users = () => {
  return (
    <div className='grid grid-cols-4 gap-8'>
      <Skeleton active className='col-span-4'/>
      {
        Array(16).fill(0).map((item, index) => (
          <Card key={index} hoverable>
            <div className='flex flex-col items-center gap-6'>
              <Image 
                src='/images/avatar.png'
                width={100}
                height={100}
                alt={`avatar-${index}`}
                className='rounded-full'
                objectFit='cover'
              />
              <Card.Meta 
                title="Rohan kumar"
                description="email@gmail.com"
              />
              <label className='text-gray-500 font-medium'>Jan 3, 2025</label>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Users