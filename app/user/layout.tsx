import UserLayout from '@/components/user/UserLayout'
import ChildrenInterface from '@/interface/children.interface'
import { getServerSession } from 'next-auth'
import React, { FC } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const UserLayoutRouter: FC<ChildrenInterface> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  
  if(!session) {
    redirect('/login')
  }

  return (
    <UserLayout>
        {children}
    </UserLayout>
  )
}

export default UserLayoutRouter