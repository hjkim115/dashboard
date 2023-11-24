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
import { server } from './utils/config'
import { FaCog } from 'react-icons/fa'
import LoadingPage from './components/LoadingPage'
import { AuthContext } from './context/AuthContext'
import LogIn from './components/LogIn'

export default function Home() {
  const [companyName, setCompanyName] = useState<string | null>(null)

  const [categoryCount, setCategoryCount] = useState<number | null>(null)
  const [menuCount, setMenuCount] = useState<number | null>(null)
  const [tableCount, setTableCount] = useState<number | null>(null)
  const [imageCount, setImageCount] = useState<number | null>(null)

  const router = useRouter()

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCompanyName() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getCompanyName(store)
      setCompanyName(data)
    }

    async function fetchCategoryCount() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getAllCategories(store)
      setCategoryCount(data.length)
    }

    async function fetchMenuCount() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getAllMenus(store)
      setMenuCount(data.length)
    }

    async function fetchTableCount() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getAllTables(store)
      setTableCount(data.length)
    }

    async function fetchImageCount() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }

      const res = await fetch(`${server}/api/imageNames?store=${store}`)
      const data = await res.json()

      setImageCount(data.length)
    }

    if (store) {
      fetchCompanyName()
      fetchCategoryCount()
      fetchMenuCount()
      fetchTableCount()
      fetchImageCount()
    }
  }, [store])

  if (!user) {
    if (user === null) {
      return <LogIn />
    }

    return <LoadingPage />
  }

  if (
    !(companyName && categoryCount && menuCount && tableCount && imageCount)
  ) {
    return <LoadingPage />
  }

  return (
    <div className={homeStyles.homeContainer}>
      <h1>
        Welcome <span className={homeStyles.companyName}>{companyName}!</span>
      </h1>
      <div className={homeStyles.buttons}>
        <div onClick={() => router.push('/update/categories')}>
          <p>Categories</p>
          <p className={homeStyles.count}>Total: {categoryCount}</p>
          <button>Update</button>
        </div>
        <div onClick={() => router.push('/update/menus')}>
          <p>Menus</p>
          <p className={homeStyles.count}>Total: {menuCount}</p>
          <button>Update</button>
        </div>
        <div onClick={() => router.push('/update/tables')}>
          <p>Tables</p>
          <p className={homeStyles.count}>Total: {tableCount}</p>
          <button>Update</button>
        </div>
        <div onClick={() => router.push('/update/images')}>
          <p>Images</p>
          <p className={homeStyles.count}>Total: {imageCount}</p>
          <button>Update</button>
        </div>
        <div onClick={() => router.push('/update/settings')}>
          <p>Settings</p>
          <FaCog size="4rem" style={{ color: 'gray' }} />
          <button>Update</button>
        </div>
      </div>
    </div>
  )
}
