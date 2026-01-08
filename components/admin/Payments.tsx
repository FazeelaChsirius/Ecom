'use client'
import fetcher from '@/lib/fetcher'
import { Avatar, Skeleton, Table, Tag } from 'antd'
import moment from 'moment'
import useSWR from 'swr'

const Payments = () => {
  const {data, error, isLoading} = useSWR('/api/payment', fetcher)
  console.log('payment-data', data)

  if(isLoading)
    return <Skeleton active />

  if(error)
    return <h1 className='text-rose-500'>{error.message}</h1>

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (item: any, index: any) => (
        <div className='flex gap-3' key={index}>
          <Avatar size="large" className='!bg-orange-400'>M</Avatar>
          <div className='flex flex-col'>
            <h1 className='font-medium capitalize'>{item.user.fullname}</h1>
            <label className='text-gray-500'>{item.user.email}</label>
          </div>
        </div>
      )
    },
    {
      title: "Product",
      key: "product",
      render: (item: any, index: any) => (
        <label key={index} className='capitalize'>{item.order.product.title}</label>
      )
    },
    {
      title: "Payment ID",
      key: "paymentId",
      render: (item: any, index: any) => (
        <label key={index} className='capitalize'>{item.paymentId}</label>
      )
    },
    {
      title: "Amount",
      key: "amount",
      render: (item: any) => (
        <label>${item.order.price}</label>
      )
    },
    {
      title: 'Vendor',
      key: 'vendor',
      render: (item: any, index: any) => (
        <Tag className='capitalize'>{item.vendor}</Tag>
      )
    },
    {
      title: "Date",
      key: "date",
      render: (item: any) => (
        <label>{moment(item.createdAt).format('MMM DD, YYYY hh:mm A')}</label>
      )
    }
  ]

  return (
    <div className='space-y-8'>
      <Skeleton active />
      <Table 
        columns={columns}
        dataSource={data}
        rowKey="_id"
      />
    </div>
  )
}

export default Payments