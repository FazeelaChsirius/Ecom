'use client'
import React, { FC, useState } from 'react'
import { Button, Card, Skeleton, Space } from 'antd'
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
import { getSession, useSession } from 'next-auth/react'
import StripePayments from '../user/StripePayments'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface PayInterface {
    data: any
    onSuccess?: () => void
    onFailed?: () => void
}

const Pay: FC<PayInterface> = ({data, onSuccess, onFailed}) => {
    const [loading, setLoading] = useState({state: false, index: 0, buttonIndex: 0})
    const [clientSecret, setClientSecret] = useState<string | null>(null) 
    const session = useSession()
    const router = useRouter()

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
    return (
        <Button onClick={payNow} size='large' type='primary' className='!px-10 !py-4 !font-medium !bg-green-500'>Pay now</Button>
    )
}

export default Pay