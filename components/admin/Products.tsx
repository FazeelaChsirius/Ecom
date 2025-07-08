'use client'
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, InputNumber, Modal, Skeleton, Tag, Upload } from 'antd'
import Image from 'next/image'
import { useState } from 'react'

const Products = () => {
  const [open, setOpen] = useState(false)
  const onSearch = (values: any) => {
    console.log(values)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const createProduct = (values: any) => {
    console.log(values)
  }

  return (
    <div className='flex flex-col gap-8'>
      <Skeleton active />
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
          Array(20).fill(0).map((item, index) => (
            <Card 
              key={index}
              hoverable
              cover={
                <div className='relative w-full h-[250px]'>
                  <Image 
                    src="/images/pro.jpeg" 
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
                title="Women shoes"
                description={
                  <div>
                    <label>$2000</label>
                    <del>$2000</del>
                    <label>(50% off)</label>
                  </div>
                }
              />
              <Tag className='!mt-5' color='cyan'>20 PCS</Tag>
              <Tag className='!mt-5' color='cyan'>Out of stocks</Tag>
            </Card>
          ))
        }
      </div>
      <Modal open={open} onCancel={handleClose} width={720} centered footer={null} maskClosable={false}>
        <h1 className='text-lg font-medium'>Add a new product</h1>
        <Divider />
        <Form layout='vertical' onFinish={createProduct}>
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
            <Upload>
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