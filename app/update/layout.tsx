'use client'

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import LoadingPage from '../components/LoadingPage'
import LogIn from '../components/LogIn'

export default function QrOrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useContext(AuthContext)

  return (
    <section>
      {user ? <>{children}</> : user === null ? <LogIn /> : <LoadingPage />}
    </section>
  )
}
