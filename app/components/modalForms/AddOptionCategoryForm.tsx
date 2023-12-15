'use client'

import { Options } from '@/app/utils/types'
import { useState } from 'react'
import { optionCategoryExists } from '@/app/utils/formUtils'
import modalFormStyles from '../styles/modalForm.module.css'

type AddOptionCategoryProps = {
  setOpen: (value: React.SetStateAction<boolean>) => void
  options: Options
  setOptions: (value: React.SetStateAction<Options | null>) => void
}

export default function AddOptionCategoryForm({
  setOpen,
  options,
  setOptions,
}: AddOptionCategoryProps) {
  const [optionCategory, setOptionCategory] = useState('')

  const disabled =
    !optionCategory || optionCategoryExists(optionCategory, options)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setOpen(false)

    const newOptions: Options = { ...options }
    newOptions[optionCategory] = []
    setOptions(newOptions)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Add Category</h1>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)} id="addOptionCategory">
        <p>Category*</p>
        <input
          onChange={(e) => setOptionCategory(e.target.value.trim())}
          type="text"
          placeholder="Category"
        />
      </form>

      {/* Message */}
      {optionCategoryExists(optionCategory, options) ? (
        <p className={modalFormStyles.message}>
          Category {optionCategory} already exists!
        </p>
      ) : null}

      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        <button type="submit" form="addOptionCategory" disabled={disabled}>
          Add
        </button>
      </div>
    </div>
  )
}
