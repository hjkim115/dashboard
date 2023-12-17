'use client'

import { useState, useEffect, useContext } from 'react'
import { Category, Menu } from '../../utils/types'
import { getAllCategories, getAllMenus } from '../../utils/firebase'
import menusStyles from '../../styles/menus.module.css'
import listStyles from '../../styles/list.module.css'
import { FaPencilAlt, FaPlus, FaArrowLeft } from 'react-icons/fa'
import Modal from '../../components/Modal'
import { useRouter } from 'next/navigation'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'
import AddMenuForm from '@/app/components/modalForms/AddMenuForm'
import { categoryIdExists } from '@/app/utils/formUtils'

export default function Menus() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [menus, setMenus] = useState<Menu[] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  const router = useRouter()

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  //Add
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    async function fetchCategories(store: string) {
      const data = await getAllCategories(store)
      setCategories(data)
    }

    async function fetchMenus(store: string) {
      const data = await getAllMenus(store)
      setMenus(data)
    }

    if (store) {
      fetchCategories(store)
      fetchMenus(store)
    }
  }, [store])

  function changeCategory(id: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedCategory(id)
  }

  function checkCategory(menu: Menu) {
    if (selectedCategory === '') {
      return true
    }

    return selectedCategory === menu.category
  }

  function getCategoryName(categories: Category[]) {
    let name
    for (const category of categories) {
      if (category.id === selectedCategory) {
        name = category.englishName
      }
    }

    return name
  }

  if (!(categories && menus && store)) {
    return <LoadingPage />
  }

  return (
    <div className={menusStyles.menusContainer}>
      {/* Filter */}
      <div className={menusStyles.filter}>
        <select onChange={(e) => changeCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map((category) => (
            <option value={category.id}>{category.englishName}</option>
          ))}
        </select>
      </div>

      <h1>{!selectedCategory ? 'All Menus' : getCategoryName(categories)}</h1>

      {/* Label */}
      <div className={listStyles.label}>
        <p className={listStyles.name}>Name</p>
      </div>

      {/* Menus */}
      {menus.filter(checkCategory).map((menu, i) => (
        <div className={listStyles.item}>
          <p
            style={
              !categoryIdExists(menu.category, categories)
                ? { color: 'red' }
                : undefined
            }
            className={listStyles.name}
          >
            {i + 1}. {menu.englishName}
          </p>
          <FaPencilAlt
            onClick={() =>
              router.push(
                `/update/editMenu?id=${menu.id}&category=${menu.category}`
              )
            }
          />
        </div>
      ))}

      {/* Add Menu */}
      <button className="addButton" onClick={() => setAddOpen(true)}>
        <FaPlus /> Add Menu
      </button>

      {/* Back To Home */}
      <button className="goBackButton" onClick={() => router.push('/')}>
        <FaArrowLeft /> Back To Home
      </button>

      {/* Add Modal */}
      <Modal handleClick={() => setAddOpen(false)} isOpen={addOpen}>
        <AddMenuForm
          store={store}
          setOpen={setAddOpen}
          menus={menus}
          setMenus={setMenus}
          categories={categories}
        />
      </Modal>
    </div>
  )
}
