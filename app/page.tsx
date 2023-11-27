'use client'

import { useState, useEffect, useContext } from 'react'
import homeStyles from './styles/home.module.css'
import {
  getAllCategories,
  getAllMenus,
  getAllTables,
  getCompanyName,
} from './utils/firebase'
import { useRouter } from 'next/navigation'
import LoadingPage from './components/LoadingPage'
import { AuthContext } from './context/AuthContext'
import LogIn from './components/LogIn'

export default function Home() {
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [counts, setCounts] = useState<number[] | null>(null)

  const router = useRouter()

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCompanyName(store: string) {
      const data = await getCompanyName(store)
      setCompanyName(data)
    }

    async function fetchCounts(store: string) {
      const categoryCount = (await getAllCategories(store)).length
      const menuCount = (await getAllMenus(store)).length
      const tableCount = (await getAllTables(store)).length

      setCounts([categoryCount, menuCount, tableCount])
    }

    if (store) {
      fetchCompanyName(store)
      fetchCounts(store)
    }
  }, [store])

  const links: {
    [key: string]: string
  } = {
    Categories: '/update/categories',
    Menus: '/update/menus',
    Tables: '/update/tables',
  }

  if (!user) {
    if (user === null) {
      return <LogIn />
    }

    return <LoadingPage />
  }

  if (!(companyName && counts)) {
    return <LoadingPage />
  }

  return (
    <div className={homeStyles.homeContainer}>
      <h1>
        Welcome <span className={homeStyles.companyName}>{companyName}!</span>
      </h1>

      {Object.keys(links).map((key, i) => (
        <div
          className={homeStyles.menu}
          onClick={() => router.push(links[key])}
        >
          <h2 className={homeStyles.name}>{key}</h2>
          <p className={homeStyles.count}>Total: {counts[i]}</p>
          <button>Update</button>
        </div>
      ))}

      <div className={homeStyles.footer}>
        <p>Powered by BS2</p>
      </div>
    </div>
  )
}
