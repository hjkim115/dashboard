'use client'

import { useState, useEffect, useContext } from 'react'
import { Category } from '../../utils/types'
import { getAllCategories } from '../../utils/firebase'
import listStyles from '../../styles/list.module.css'
import { FaPencilAlt, FaPlus, FaArrowLeft } from 'react-icons/fa'
import Modal from '../../components/Modal'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'
import AddCategoryForm from '@/app/components/modalForms/AddCategoryForm'
import EditCategoryForm from '@/app/components/modalForms/EditCategoryForm'
import { useRouter } from 'next/navigation'

export default function Categories() {
  const [categories, setCategories] = useState<Category[] | null>(null)

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  const router = useRouter()

  //Edit
  const [editOpen, setEditOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category>({} as Category)

  //Add
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    async function fetchCategories(store: string) {
      const data = await getAllCategories(store)
      setCategories(data)
    }

    if (store) {
      fetchCategories(store)
    }
  }, [store])

  function handleEditOpen(category: Category) {
    setEditCategory(category)
    setEditOpen(true)
  }

  if (!(categories && store)) {
    return <LoadingPage />
  }

  return (
    <div className={listStyles.listContainer}>
      <h1>Categories</h1>

      {/* Label */}
      <div className={listStyles.label}>
        <p className={listStyles.name}>Name</p>
      </div>

      {/* Categories */}
      {categories.map((category, i) => (
        <div className={listStyles.item}>
          <p className={listStyles.name}>
            {i + 1}. {category.englishName}
          </p>
          <FaPencilAlt onClick={() => handleEditOpen(category)} />
        </div>
      ))}

      {/* Add Category */}
      <button className="addButton" onClick={() => setAddOpen(true)}>
        <FaPlus /> Add Category
      </button>

      {/* Back To Home */}
      <button className="goBackButton" onClick={() => router.push('/')}>
        <FaArrowLeft /> Back To Home
      </button>

      {/* Modals */}
      {/* Edit */}
      <Modal handleClick={() => setEditOpen(false)} isOpen={editOpen}>
        <EditCategoryForm
          store={store}
          setOpen={setEditOpen}
          categories={categories}
          setCategories={setCategories}
          editCategory={editCategory}
        />
      </Modal>
      {/* Add */}
      <Modal handleClick={() => setAddOpen(false)} isOpen={addOpen}>
        <AddCategoryForm
          store={store}
          setOpen={setAddOpen}
          categories={categories}
          setCategories={setCategories}
        />
      </Modal>
    </div>
  )
}
