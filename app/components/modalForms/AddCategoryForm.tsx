'use client'

import { useState } from 'react'
import modalFormStyles from '../styles/modalForm.module.css'
import { Category } from '@/app/utils/types'
import { categoryIdExists, idPattern } from '@/app/utils/formUtils'
import { postCategory, getAllCategories } from '@/app/utils/firebase'

type AddCategoryProps = {
  store: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  categories: Category[]
  setCategories: (value: React.SetStateAction<Category[] | null>) => void
}

export default function AddCategoryForm({
  store,
  setOpen,
  categories,
  setCategories,
}: AddCategoryProps) {
  const [id, setId] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [koreanName, setKoreanName] = useState('')

  const disabled =
    id === '' ||
    englishName === '' ||
    koreanName === '' ||
    categoryIdExists(id, categories) ||
    !idPattern.test(id)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setOpen(false)

    const category: Category = {
      id: id,
      englishName: englishName,
      koreanName: koreanName,
    }
    await postCategory(store, category)

    const newCategories = await getAllCategories(store)
    setCategories(newCategories)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Add Category</h1>

      {/* Form */}
      <form id="addCategoryForm" onSubmit={(e) => handleSubmit(e)}>
        <p>ID*</p>
        <input
          onChange={(e) => setId(e.target.value.trim())}
          type="text"
          placeholder="ID"
        />
        <p>English Name*</p>
        <input
          onChange={(e) => setEnglishName(e.target.value.trim())}
          type="text"
          placeholder="English Name"
        />
        <p>Korean Name*</p>
        <input
          onChange={(e) => setKoreanName(e.target.value.trim())}
          type="text"
          placeholder="Korean Name"
        />
      </form>

      {/* Message */}
      {categoryIdExists(id, categories) ? (
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
        <button type="submit" form="addCategoryForm" disabled={disabled}>
          Add
        </button>
      </div>
    </div>
  )
}
