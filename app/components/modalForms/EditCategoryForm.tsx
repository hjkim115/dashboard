'use client'

import { Category } from '@/app/utils/types'
import { useState } from 'react'
import {
  updateCategory,
  getAllCategories,
  deleteCategory,
} from '@/app/utils/firebase'
import modalFormStyles from '../styles/modalForm.module.css'
import {
  categoryEquals,
  categoryIdExists,
  idPattern,
} from '@/app/utils/formUtils'

type EditCategoryProps = {
  store: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  categories: Category[]
  setCategories: (value: React.SetStateAction<Category[] | null>) => void
  editCategory: Category
}

export default function EditCategoryForm({
  store,
  setOpen,
  categories,
  setCategories,
  editCategory,
}: EditCategoryProps) {
  const [id, setId] = useState(editCategory.id)
  const [englishName, setEnglishName] = useState(editCategory.englishName)
  const [koreanName, setKoreanName] = useState(editCategory.koreanName)

  const newCategory: Category = {
    id: id,
    englishName: englishName,
    koreanName: koreanName,
  }

  const disabled =
    !id ||
    !englishName ||
    !koreanName ||
    categoryEquals(editCategory, newCategory) ||
    categoryIdExists(id, categories) ||
    !idPattern.test(id)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setOpen(false)

    await updateCategory(store, editCategory.id, newCategory)

    const newCategories = await getAllCategories(store)
    setCategories(newCategories)
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this category?')) {
      return
    }

    setOpen(false)

    await deleteCategory(store, editCategory.id)

    const newCategories = await getAllCategories(store)
    setCategories(newCategories)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Edit Category</h1>

      {/* Form */}
      <form id="editCategoryForm" onSubmit={(e) => handleSubmit(e)}>
        <p>ID*</p>
        <input
          style={editCategory.id !== id ? { color: 'red' } : undefined}
          onChange={(e) => setId(e.target.value.trim())}
          defaultValue={id}
          type="text"
        />
        <p>English Name*</p>
        <input
          style={
            editCategory.englishName !== englishName
              ? { color: 'red' }
              : undefined
          }
          onChange={(e) => setEnglishName(e.target.value.trim())}
          defaultValue={englishName}
          type="text"
        />
        <p>Korean Name*</p>
        <input
          style={
            editCategory.koreanName !== koreanName
              ? { color: 'red' }
              : undefined
          }
          onChange={(e) => setKoreanName(e.target.value.trim())}
          defaultValue={koreanName}
          type="text"
        />
      </form>

      {/* Message */}
      {editCategory.id !== id && categoryIdExists(id, categories) ? (
        <p className={modalFormStyles.message}>
          Category with id {id} already exists!
        </p>
      ) : null}

      {id.length > 0 && !idPattern.test(id) ? (
        <p className={modalFormStyles.message}>
          id should be alphanumeric{'('}a-z, A-Z, 0-9{')'}!
        </p>
      ) : null}

      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        {editCategory ? <button onClick={handleDelete}>Delete</button> : null}
        <button type="submit" form="editCategoryForm" disabled={disabled}>
          Edit
        </button>
      </div>
    </div>
  )
}
