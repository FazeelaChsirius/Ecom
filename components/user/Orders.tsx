'use client'
import fetcher from '@/lib/fetcher'
import { Avatar, Card, Select, Skeleton, Table } from 'antd'
import moment from 'moment'
import useSWR from 'swr'
import ErrorMessage from '../shared/ErrorMessage'
import Image from 'next/image'

// const data = [
//   {
//     "orderId": "ORD1001",
//     "userId": "USR001",
//     "product": {
//       "productId": "P001",
//       "productName": "Wireless Mouse",
//       "quantity": 2,
//       "price": 29.99
//     },
//     "totalAmount": 59.98,
//     "status": "pending",
//     "createdAt": "2025-06-05T10:00:00Z"
//   },
//   {
//     "orderId": "ORD1002",
//     "userId": "USR002",
//     "product": {
//       "productId": "P003",
//       "productName": "Bluetooth Headphones",
//       "quantity": 1,
//       "price": 59.99
//     },
//     "totalAmount": 59.99,
//     "status": "success",
//     "createdAt": "2025-06-04T12:45:00Z"
//   },
//   {
//     "orderId": "ORD1003",
//     "userId": "USR003",
//     "product": {
//       "productId": "P002",
//       "productName": "USB-C Charger",
//       "quantity": 3,
//       "price": 29.99
//     },
//     "totalAmount": 89.97,
//     "status": "error",
//     "createdAt": "2025-06-03T14:30:00Z"
//   },
//   {
//     "orderId": "ORD1004",
//     "userId": "USR004",
//     "product": {
//       "productId": "P004",
//       "productName": "Laptop Stand",
//       "quantity": 1,
//       "price": 49.99
//     },
//     "totalAmount": 49.99,
//     "status": "warning",
//     "createdAt": "2025-06-02T16:00:00Z"
//   }
// ]

const Orders = () => {
  const {data, isLoading, error} = useSWR('/api/order', fetcher)
  console.log('order-data', data)

  if(isLoading) 
    return <Skeleton active />

  if(error)
    return <ErrorMessage message={error.message}/>

  return (
    <div className='space-y-8'>
      {
        data.map((item: any, index: number) => (
          <Card
            key={index}
            title={''}
            extra={
              <label>{moment(item.createdAt).format('MM DD YYYY hh:mm A')}</label>
            }
          >

          </Card>
        ))
      }
    </div>
  )
}

export default Orders