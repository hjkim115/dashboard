'use client'

import { optionCategoryExists } from '@/app/utils/formUtils'
import modalFormStyles from '../styles/modalForm.module.css'
import { Options } from '@/app/utils/types'
import { useState } from 'react'
import {
  updateOptionCategory,
  getOptions,
  deleteOptionCategory,
} from '@/app/utils/firebase'

type EditOptionCategoryProps = {
  store: string
  id: string
  category: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  options: Options
  setOptions: (value: React.SetStateAction<Options | null>) => void
  editOptionCategory: string
}

export default function EditOptionCategoryForm({
  store,
  id,
  category,
  setOpen,
  options,
  setOptions,
  editOptionCategory,
}: EditOptionCategoryProps) {
  const [optionCategory, setOptionCategory] = useState(editOptionCategory)

  const disabled =
    !optionCategory ||
    editOptionCategory === optionCategory ||
    optionCategoryExists(optionCategory, options)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setOpen(false)

    if (options[editOptionCategory].length <= 0) {
      const newOptions = { ...options }
      delete newOptions[editOptionCategory]
      newOptions[optionCategory] = []

      setOptions(newOptions)
      return
    } else {
      await updateOptionCategory(
        store,
        category,
        id,
        editOptionCategory,
        optionCategory
      )

      const newOptions = await getOptions(store, category, id)
      setOptions(newOptions)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    setOpen(false)

    if (options[editOptionCategory].length <= 0) {
      const newOptions = { ...options }
      delete newOptions[editOptionCategory]

      setOptions(newOptions)
    } else {
      await deleteOptionCategory(store, category, id, editOptionCategory)

      const newOptions = await getOptions(store, category, id)
      setOptions(newOptions)
    }
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Edit Category</h1>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)} id="editOptionCategory">
        <p>Category*</p>
        <input
          style={
            editOptionCategory !== optionCategory ? { color: 'red' } : undefined
          }
          onChange={(e) => setOptionCategory(e.target.value.trim())}
          defaultValue={optionCategory}
          type="text"
        />
      </form>

      {/* Message */}
      {editOptionCategory !== optionCategory &&
      Object.keys(options).includes(optionCategory) ? (
        <p className={modalFormStyles.message}>
          Category {optionCategory} already exists!
        </p>
      ) : null}

      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        <button onClick={handleDelete}>Delete</button>
        <button type="submit" form="editOptionCategory" disabled={disabled}>
          Edit
        </button>
      </div>
    </div>
  )
}
