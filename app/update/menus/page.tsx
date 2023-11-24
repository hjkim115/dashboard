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
  const [addModalOpen, setAddModalOpen] = useState(false)

  const router = useRouter()

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCategories() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getAllCategories(store)
      setCategories(data)
    }

    async function fetchMenus() {
      if (typeof store !== 'string') {
        throw Error('Type of store should be string!')
      }
      const data = await getAllMenus(store)
      setMenus(data)
    }

    if (store) {
      fetchCategories()
      fetchMenus()
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
    setAddModalOpen(false)
  }

  function menuCategoryValid(menuCategory: string) {
    if (!categories) {
      throw Error('categories is not set!')
    }
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
              !menuCategoryValid(menu.category) ? { color: 'red' } : undefined
            }
            className={listStyles.name}
          >
            {menu.englishName}
          </p>
          <div className={listStyles.edit}>
            <button
              onClick={() =>
                router.push(
                  `/update/menus/${menu.id}?category=${menu.category}`
                )
              }
            >
              <FaPencilAlt size="0.7rem" style={{ color: 'white' }} /> Edit
            </button>
          </div>
        </div>
      ))}

      {/* Add Menu */}
      <AddItem handleClick={setAddModalOpen}>
        <FaPlus /> Add Menu
      </AddItem>

      {/* Add Modal */}
      {addModalOpen ? (
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
            <button onClick={() => setAddModalOpen(false)}>Close</button>
            <button>Add</button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
