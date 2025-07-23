'use client'
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, InputNumber, message, Modal, Pagination, Result, Skeleton, Tag, Upload } from 'antd'
import Image from 'next/image'
import { useState } from 'react'
import '@ant-design/v5-patch-for-react-19';
import clientCatchError from '@/lib/client-catch-error'
import axios from 'axios'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

const Products = () => {
  const [productForm] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(16)
  
  const { data, error, isLoading } = useSWR(`/api/product?page=${page}&limit=${limit}`, fetcher)

  const onSearch = (values: any) => {
    console.log(values)
  }

  const handleClose = () => {
    setOpen(false)
    productForm.resetFields()
  }

  const createProduct = async (values: any) => {
    try {
      values.image = values.image.file.originFileObj
      const formData = new FormData()
      for(let key in values) {
        formData.append(key, values[key])
      }
      const {data} = await axios.post('/api/product', formData)
      message.success('Product addd successfully !')
      handleClose()
      
    } catch (err) {
      clientCatchError(err )
      
    }
  }

  const onPaginate = (page: number) => {
    setPage(page)
  }

  if(isLoading)
  return <Skeleton active />

  if(error)
    return (
      <Result
        status="error"
        title={error.message}
      />
    )

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex justify-between items-center'>
        <Form onFinish={onSearch}>
          <Form.Item name="search" rules={[{required: true}]} className='!mb-0'>
            <Input  
              placeholder='Search this site' 
              suffix={<Button htmlType='submit' type="text" icon={<SearchOutlined />} />}
              className='!w-[350px]'
            />
          </Form.Item>
        </Form>
        <Button onClick={() => setOpen(true)} type='primary' size='large' icon={<PlusOutlined />} className='!bg-indigo-500'>Add Product</Button>
      </div>

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
                    alt={`product-${index}`} 
                    fill 
                    className='rounded-t-lg shadow-lg object-cover'
                  />
                </div>
              }
              actions={[
                <EditOutlined key="edit" className='!text-green-400'/>,
                <DeleteOutlined key="delete" className='!text-rose-400'/>
              ]}
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
              <Tag className='!mt-5' color='cyan'>${item.quantity} PCS</Tag>
              <Tag className='!mt-5' color='cyan'>Out of stocks</Tag>
            </Card>
          ))
        }
      </div>
      <div className='flex justify-end w-full'>
        <Pagination 
          total={data.total}
          current={page}
          onChange={onPaginate}
          pageSizeOptions={[16, 32, 64, 100]}
          defaultPageSize={limit}
        />
      </div>
      <Modal open={open} onCancel={handleClose} width={720} centered footer={null} maskClosable={false}>
        <h1 className='text-lg font-medium'>Add a new product</h1>
        <Divider />
        <Form layout='vertical' onFinish={createProduct} form={productForm}>
          <Form.Item
            label="Product name"
            name="title"
            rules={[{required: true}]}
          >
            <Input 
              size='large'
              placeholder='Enter product name'
            />
          </Form.Item>

          <div className='grid grid-cols-3 gap-6'>
            <Form.Item
              label="Price"
              name="price"
              rules={[{required: true, type: "number"}]}
            >
            <InputNumber
              size='large'
              className='!w-full'
              placeholder='00.00'
            />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{required: true, type: "number"}]}
            >
            <InputNumber
              size='large'
              className='!w-full'
              placeholder='20'
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{required: true, type: "number"}]}
            >
            <InputNumber
              size='large'
              className='!w-full'
              placeholder='20'
            />
          </Form.Item>
          </div>

          <Form.Item label="Description" rules={[{required: true}]} name="description">
            <Input.TextArea rows={4} placeholder='Description'/>
          </Form.Item>

          <Form.Item name='image' rules={[{required: true}]}>
            <Upload fileList={[]}>
              <Button size='large' icon={<UploadOutlined />}>Upload a product image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' size='large' type='primary' icon={<ArrowRightOutlined />}>Add now</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Products