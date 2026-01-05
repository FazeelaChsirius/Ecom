'use client'
import ChildrenInterface from '@/interface/children.interface'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import React, { FC } from 'react'
import 'animate.css'
import Logo from './shared/Logo'
import Link from 'next/link'
import { Avatar, Button, Dropdown } from 'antd'
import { LogoutOutlined, ProfileOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons'
import { usePathname } from 'next/navigation'
import { SessionProvider, useSession } from 'next-auth/react'

const menus = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Products',
    href: '/products'
  },
  {
    label: 'Carts',
    href: '/carts'
  },
  {
    label: 'Sign in',
    href: '/login'
  }
]

const Layout: FC<ChildrenInterface> = ({children}) => {
  const pathname = usePathname()
  const session = useSession()
  
  const blacklists = [
    "/admin",
    "/signup",
    "/login",
    "/user"
  ]

  const accountMenu = {
    items: [
      {
        icon: <ProfileOutlined />,
        label: <a>Er Saurav</a>,
        key: 'fullname'
      },
      {
        icon: <LogoutOutlined />,
        label: <a>Logout</a>,
        key: 'logout'
      },
      {
        icon: <SettingOutlined />,
        label: <a>Settings</a>,
        key: 'settings'
      }
    ]
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
          <div className='flex items-center'>
            {
              menus.map((item, index) => (
                <Link key={index} href={item.href} className='py-6 px-6 hover:bg-blue-500 hover:text-white'>
                  {item.label}
                </Link>
              ))
            }
          </div>
          <Link href='/signup' className='py-6 px-6 hover:bg-blue-500 hover:text-white bg-rose-500 text-white font-medium'>
            <UserAddOutlined className='mr-3'/>
            Sign up
          </Link>
          <Dropdown
            menu={accountMenu}
          >
            <Avatar 
              size="large"
              src="/images/avatar.png"
            />
          </Dropdown>
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