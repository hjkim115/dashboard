'use client'

import { useState, useEffect, useContext } from 'react'
import { Category, Menu } from '../../utils/types'
import { getAllCategories, getAllMenus } from '../../utils/firebase'
import menusStyles from '../../styles/menus.module.css'
import listStyles from '../../styles/list.module.css'
import modalStyles from '../../styles/modal.module.css'
import { FaPencilAlt, FaPlus } from 'react-icons/fa'
import Label from '../../components/Label'
import AddItem from '../../components/AddItem'
import Modal from '../../components/Modal'
import { useRouter } from 'next/navigation'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'

export default function Menus() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [menus, setMenus] = useState<Menu[] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const router = useRouter()

  const { user } = useContext(AuthContext)
  const store = user?.displayName

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

  function handleAddModalClose() {
    setAddOpen(false)
  }

  function menuCategoryValid(categories: Category[], menuCategory: string) {
    for (const category of categories) {
      if (menuCategory === category.id) {
        return true
      }
    }

    return false
  }

  if (!(categories && menus)) {
    return <LoadingPage />
  }

  return (
    <div className={menusStyles.menusContainer}>
      <div className={menusStyles.filter}>
        <select onChange={(e) => changeCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map((category) => (
            <option value={category.id}>{category.englishName}</option>
          ))}
        </select>
      </div>

      <h1>Menus</h1>
      {/* Menus */}
      <Label />

      {menus.filter(checkCategory).map((menu) => (
        <div className={listStyles.item}>
          <p
            style={
              !menuCategoryValid(categories, menu.category)
                ? { color: 'red' }
                : undefined
            }
            className={listStyles.name}
          >
            {menu.englishName}
          </p>
          <FaPencilAlt
            onClick={() =>
              router.push(`/update/menus/${menu.id}?category=${menu.category}`)
            }
          />
        </div>
      ))}

      {/* Add Menu */}
      <AddItem handleClick={setAddOpen}>
        <FaPlus /> Add Menu
      </AddItem>

      {/* Add Modal */}
      {addOpen ? (
        <Modal handleClick={handleAddModalClose}>
          {/* Form */}
          <div className={modalStyles.form}>
            <h1>Add Menu</h1>
            <p>ID *</p>
            <input type="text" placeholder="ID" />
            <p>Category *</p>
            <select onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option value={category.id}>{category.englishName}</option>
              ))}
            </select>
            <p>Korean Name *</p>
            <input type="text" placeholder="Korean Name" />
            <p>English Name *</p>
            <input type="text" placeholder="English Name" />
            <p>Price *</p>
            <input type="text" placeholder="Price" />
            <p>Description</p>
            <textarea rows={3} placeholder="Description" />
            <p>Image Name *</p>
            <input type="text" placeholder="Image Name" />
          </div>

          {/* Buttons */}
          <div className={modalStyles.buttons}>
            <button onClick={() => setAddOpen(false)}>Close</button>
            <button>Add</button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
