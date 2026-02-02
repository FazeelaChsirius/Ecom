'use client'
import clientCatchError from '@/lib/client-catch-error'
import fetcher from '@/lib/fetcher'
import { Avatar, Card, message, Select, Skeleton, Table, Tag } from 'antd'
import axios from 'axios'
import moment from 'moment'
import useSWR, { mutate } from 'swr'
import "@ant-design/v5-patch-for-react-19"
import priceCalculate from '@/lib/price-calculate'
import Image from 'next/image'

const Orders = () => {
  const {data, error, isLoading} = useSWR('/api/order', fetcher)
  console.log('ordders-data', data)

  if(isLoading)
    return <Skeleton active />

  if(error)
    return <h1 className='text-rose-500 font-medium'>{error.message}</h1>

  const changeStatus = async (status: string, id: string) => {
    try {
      await axios.put(`/api/order/${id}`, {status})
      message.success(`Product status changed to ${status}`)
      mutate('/api/order')

    } catch (err) {
      clientCatchError(err)
    }
  }

  const getTotalSales = (item: any) => {
    let sum = 0
    for(let i=0; i<item.prices.length; i++) {
      const price = item.prices[i]
      const discount = item.discounts[i]
      const qnt = item.quantities[i]
      const total = priceCalculate(price, discount) * qnt
      sum = sum + total
    }
    return <label>${sum.toLocaleString()}</label>
  }

  const columns = [
    {
      title: "Order ID",
      key: "orderId",
      dataIndex: 'orderId',
      render: (item: any, index: any) => (
        <div className='flex gap-3' key={index}>
          <Avatar size="large" className='!bg-orange-400 capitalize font-bold'>{item.user.fullname[0]}</Avatar>
          <div className='flex flex-col'>
            <h1 className='font-medium capitalize'>{item.user.fullname}</h1>
            <label className='text-gray-500'>{item.user.email}</label>
          </div>
        </div>
      )
    },
    {
      title: "Customer",
      key: "customer",
      render: (item: any, index: any) => (
        <div className='flex gap-3'>
          <Avatar size="large" className='!bg-orange-400'>{}</Avatar>
          <div className='flex flex-col'>
            <h1 className='font-medium capitalize'>{item.user.name}</h1>
            <label className='text-gray-500 text-sm'>{item.user.email}</label>
          </div>
        </div>
      )
    }, 
    {
      title: "Total sales",
      key: "totalsales",
      render: getTotalSales
    },
    {
      title: "Total products",
      key: "totalproducts",
      render: (item: any) => item.products.length
    },
    {
      title: "Discount",
      key: "dicsount",
      render: (item: any, index: any) => (
        <label key={index}>{item.product.discount}%</label>
      )
    },
    {
      title: "Status",
      key: "status",
      render: (item: any, index: any) => (
        item.status === "processing" ?
        <Select placeholder="status" style={{width: 120}} defaultValue={item.status} onChange={(value) => changeStatus(value, item._id)}>
          <Select.Option value="processing">Processing</Select.Option>
          <Select.Option value="dispatched">Dispatched</Select.Option>
          <Select.Option value="returned">Returned</Select.Option>
        </Select>
        :
        <Tag color={item.status === "dispatched" ? "green-inverse" : "magenta-inverse"} className='capitalize'>{item.status}</Tag>
      )
    },
    {
      title: "Address",
      key: "address",
      render: (item: any, index: any) => (
        <label className='text-gray-600' key={index}>{item.user.address || "Address not found"}</label>
      )
    },
    {
      title: "Created",
      key: "created",
      render: (item: any) => (
        <label>{moment(item.createdAt).format('MMM DD, YYYY hh:mm A')}</label>
      )
    }
  ]

  const browseProducts = (item: any) => {
    return (
      <div className='grid grid-cols-4 gap-8'>
        {
          item.products.map((p: any, pIndex: any) => (
            <Card
              key={pIndex}
              cover={
                <div className='w-full h-[150px] relative'>
                  <Image 
                    src={p.image} 
                    alt={p.title} 
                    className='object-cover'
                    fill 
                  />
                </div>
              }
            >
              <Card.Meta 
                className='capitalize' 
                title={p.title}
                description={
                  <div>
                    <label>${priceCalculate(item.prices[pIndex], item.discounts[pIndex])}</label>
                    <del>${item.prices[pIndex]}</del>
                    <label>${item.discounts[pIndex]}% Off</label>
                    <label>${item.discounts[pIndex]}% Off</label>
                    <label>${item.quantities[pIndex]}PCS</label>
                  </div>
                }
              />
            </Card>
          ))
        }
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <Skeleton active />
      <Table 
        columns={columns}
        dataSource={data}
        rowKey="_id"
        expandable={{
          expandedRowRender: browseProducts,
          rowExpandable: (record: any) => record.name !== "Not Expandable"
        }}
      />
    </div>
  )
}

export default Orders