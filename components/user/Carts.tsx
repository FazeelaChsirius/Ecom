'use client'
import fetcher from '@/lib/fetcher'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Button, Card, Empty, Skeleton, Space } from 'antd'
import Image from 'next/image'
import priceCalculate from '@/lib/price-calculate'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import '@ant-design/v5-patch-for-react-19'
import clientCatchError from '@/lib/client-catch-error'
import axios from 'axios'
import ErrorMessage from '../shared/ErrorMessage'
import { useRouter } from 'next/navigation'
import {loadStripe} from '@stripe/stripe-js'
import { Elements } from "@stripe/react-stripe-js"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getSession } from 'next-auth/react'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import StripePayments from './StripePayments'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const Carts = () => {
  const [loading, setLoading] = useState({state: false, index: 0, buttonIndex: 0})
  const {data, error, isLoading} = useSWR('/api/cart', fetcher)
  const [clientSecret, setClientSecret] = useState<string | null>(null) 
  const session = getSession()
  const router = useRouter()

  if(isLoading) return <Skeleton active />

  if(error) return <ErrorMessage />

  const updateQnt = async (num: number, id: string, index: number, buttonIndex: number) => {
    try {
      setLoading({state: true, index, buttonIndex})
      await axios.put(`/api/cart/${id}`, {qnt: num})
      mutate('/api/cart')
      
    } catch (err) {
      return clientCatchError(err)
    }
    finally {
      setLoading({state: false, index: 0, buttonIndex: 0})
    }
  }

  const removeCart = async (id: string, index: number, buttonIndex: number) => {
    try {
      setLoading({state: true, index, buttonIndex})
      await axios.delete(`/api/cart/${id}`)
      mutate('/api/cart')
      
    } catch (err) {
      return clientCatchError(err)
    }
    finally {
      setLoading({state: false, index: 0, buttonIndex: 0})
    }
  }

  const getTotalAmount = () => {
    let sum = 0
    for(let item of data) {
      const amount = priceCalculate(item.product.price, item.product.discount)*item.qnt
      sum = sum + amount
    }
    return sum 
  }

  const getOrderPayload = () => {
    const products = []
    const prices = []
    const discounts = []
    for(let item of data) {
      products.push(item.product._id)
      prices.push(item.product.price)
      discounts.push(item.product.discount)
    }
    return {
      products,
      prices,
      discounts
    }
  }

  const payNow = async () => {
    try {
      const session = await getSession()
      const payload = {
        amount: getTotalAmount(),
        orders: getOrderPayload(),
        user: {
          id: session?.user.id,
          name: session?.user.name,
          email: session?.user.email
        }
      }
      console.log('amount-payload', payload)

      const {data} = await axios.post('/api/stripe/order', payload)
      router.replace(data.url)
      
    } catch (err) {
      return clientCatchError(err)
    }
  }

  if(data.length === 0) 
    return <Empty />

  return (
    <div className='flex flex-col gap-6'>
      {
        data.map((item: any, index: number) => (
          <Card key={index} hoverable>
            <div className='flex justify-between'>
              <div>
                <Image 
                  src={item.product.image}
                  width={150}
                  height={90}
                  alt='carts image'
                  priority
                  className="w-full h-auto"
                />
                <div>
                  <h1 className='text-xl font-medium capitalize'>{item.product.title}</h1>
                  <div className='flex items-center gap-3'>
                    <label className='font-medium text-base'>${priceCalculate(item.product.price, item.product.discount)}</label>
                    <del className='text-gray-500'>${item.product.price}</del>
                    <label>({item.product.discount}% Off)</label>
                  </div>
                </div>
              </div>

              <div>
                <Space.Compact block>
                  <Button 
                    loading={loading.state && loading.index === index && loading.buttonIndex === 0} 
                    icon={<PlusOutlined />} 
                    size='large' 
                    onClick={() => updateQnt(item.qnt + 1, item._id, index, 0)}
                  />
                  <Button size='large'>{item.qnt}</Button>
                  <Button 
                    loading={loading.state && loading.index === index && loading.buttonIndex === 1} 
                    icon={<MinusOutlined />} 
                    size='large' 
                    onClick={() => updateQnt(item.qnt - 1, item._id, index, 1)}
                  />
                  <Button 
                    type='primary'
                    danger
                    loading={loading.state && loading.index === index && loading.buttonIndex === 2} 
                    icon={<DeleteOutlined />} 
                    size='large' 
                    onClick={() => removeCart(item._id, index, 2)}
                  />
                </Space.Compact>
              </div>
            </div>
          </Card>
        ))
      }
      <div className='flex justify-end items-center gap-6'>
        <h1 className='text-2xl font-semibold'>Total payable amount - ${getTotalAmount().toLocaleString()}</h1>
        <Button onClick={payNow} size='large' type='primary'>Pay now</Button>
        
        {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <StripePayments />
        </Elements>
      )}
      </div>
    </div>
  )
}

export default Carts