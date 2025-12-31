'use client'
import ChildrenInterface from '@/interface/children.interface'
import { CreditCardOutlined, LogoutOutlined, ReconciliationOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, Card, Layout, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import Link from 'next/link'
import React, { FC } from 'react'
import { getBreadcrumbs } from '../admin/AdminLayout'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const UserLayout: FC<ChildrenInterface> = ({ children }) => {
    const pathname = usePathname()
    
    const logout = async () => {
        await signOut()
    }

    // const session = useSession()
    // const router = useRouter()
    
    // if(!session.data) {
    //     router.push('/login')
    //     return null
    // }

    const menus = [
        {
            icon: <ShoppingOutlined />,
            label: <Link href='/user/carts'>Carts</Link>,
            key: "carts"
        },
        {
            icon: <ReconciliationOutlined />,
            label: <Link href='/user/orders'>Orders</Link>,
            key: "orders"
        },
        {
            icon: <CreditCardOutlined />,
            label: <Link href='/user/settings'>Settings</Link>,
            key: "settings"
        }
    ]

    return (
        <Layout className='min-h-screen'>
            <Sider width={300} className='border-r border-r-gray-100'>
                <Menu theme="light" mode="inline" items={menus} className='h-full'/>
                <div className='bg-indigo-600 p-4 fixed bottom-0 left-0 w-[300px] flex flex-col gap-4'>
                    <div className='flex gap-3 items-center'>
                        <Avatar className='!w-16 !h-16 !bg-orange-500 !text-2xl !font-medium'>
                            S
                        </Avatar>
                        <div className='flex flex-col'>
                            <h1 className='text-lg font-medium text-white'>Fazila</h1>
                            <p className='text-gray-300 mb-3'>email@gmail.com</p>
                        </div>
                    </div>
                    <Button onClick={logout} icon={<LogoutOutlined />} size='large'>Logout</Button>
                </div>
            </Sider>
            <Layout>
                <Layout.Content>
                    <div className='w-11/12 mx-auto py-8 min-h-screen'>
                    <Breadcrumb
                        items={getBreadcrumbs(pathname)}
                    />
                    <Card className='!mt-6'>
                        {children}
                    </Card>
                    </div>
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default UserLayout