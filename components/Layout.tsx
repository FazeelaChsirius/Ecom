'use client'
import ChildrenInterface from '@/interface/children.interface'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import React, { FC } from 'react'
import 'animate.css'
import Logo from './shared/Logo'
import Link from 'next/link'
import { Avatar, Badge, Dropdown, Tooltip } from 'antd'
import { LogoutOutlined, SettingOutlined, ShoppingCartOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { usePathname } from 'next/navigation'
import { SessionProvider, signOut, useSession } from 'next-auth/react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

const menus = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Products',
    href: '/products'
  }
]

const Layout: FC<ChildrenInterface> = ({children}) => {
  const pathname = usePathname()
  const session = useSession()

  const {data} = useSWR('/api/cart?count=true', fetcher)
  
  const blacklists = [
    "/admin",
    "/signup",
    "/login",
    "/user"
  ]

  const userMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: <Link href="/user/orders" className='capitalize'>{session.data?.user.name}</Link>,
        key: 'fullname'
      },
      {
        icon: <SettingOutlined />,
        label: <Link href="/user/settings">Settings</Link>,
        key: 'settings'
      },
      {
        icon: <LogoutOutlined />,
        label: <a onClick={() => signOut()}>Logout</a>,
        key: 'logout'
      }
    ]
  }

  const adminMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: <Link href="/admin/orders" className='capitalize'>{session.data?.user.name}</Link>,
        key: 'fullname'
      },
      {
        icon: <LogoutOutlined />,
        label: <a onClick={() => signOut()}>Logout</a>,
        key: 'logout'
      }
    ]
  }

  const getMenu = (role: string | null) => {
    if(role === "user")
      return userMenu

    if(role === "admin")
      return adminMenu

    signOut()
  }

  const isBlacklist = blacklists.some((path) => pathname.startsWith(path)) 

  if(isBlacklist) 
    return (
      <AntdRegistry>
        <SessionProvider>
          <div>{children}</div>
        </SessionProvider>
      </AntdRegistry>
    )

  return (
    <AntdRegistry>
      <SessionProvider>
        <nav className='bg-white shadow-lg px-12 sticky top-0 left-0 flex justify-between items-center z-10'>
          <Logo />
          <div className='flex items-center gap-6'>
            {
              menus.map((item, index) => (
                <Link key={index} href={item.href} className='py-6 px-6 hover:bg-blue-500 hover:text-white'>
                  {item.label}
                </Link>
              ))
            }
            {
              !session.data && 
                <div className='animate__animated animate__fadeIn flex gap-6'>
                  <Link href='/login' className='py-6 px-6 hover:bg-blue-500 hover:text-white'>
                    Login
                  </Link>

                  <Link href='/signup' className='flex py-6 px-6 hover:bg-blue-500 hover:text-white bg-rose-500 text-white font-medium gap-3'>
                    <UserAddOutlined />
                    Sign up
                  </Link>
                </div>
            }
          </div>

          {
            session.data && 
            <div className='flex items-center gap-8 animate__animated animate__fadeIn'>
              {
                session.data.user.role === "user" &&
                <Tooltip title="Your carts">
                  <Link href="/user/carts">
                    <Badge count={data && data.count}>
                      <ShoppingCartOutlined className='text-3xl !text-slate-400'/>
                    </Badge> 
                  </Link>
                </Tooltip>
              }

              <Dropdown menu={getMenu(session.data.user.role)}>
                <Avatar 
                  size="large"
                  src="/images/avatar.png"
                />
              </Dropdown>
            </div>
          }
        </nav>

        <div className='w-9/12 mx-auto py-24'>{children}</div>

        <footer className='bg-zinc-800 h-[450px] flex items-center justify-center'>
          <h1 className='text-5xl text-white'>My footer !</h1>
        </footer>
      </SessionProvider>
    </AntdRegistry>
  )
}

export default Layout