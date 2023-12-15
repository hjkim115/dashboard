'use client'

import { Option, Options } from '@/app/utils/types'
import { useState } from 'react'
import modalFormStyles from '../styles/modalForm.module.css'
import { isPriceValid, optionExists, optionEquals } from '@/app/utils/formUtils'
import { updateOption, getOptions, deleteOption } from '@/app/utils/firebase'

type EditOptionProps = {
  store: string
  id: string
  category: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  options: Options
  setOptions: (value: React.SetStateAction<Options | null>) => void
  editOption: Option
}

export default function EditOptionForm({
  store,
  id,
  category,
  setOpen,
  options,
  setOptions,
  editOption,
}: EditOptionProps) {
  const [optionId, setOptionId] = useState(editOption.id)
  const [englishName, setNewOptionEnglishName] = useState(
    editOption.englishName
  )
  const [koreanName, setKoreanName] = useState(editOption.koreanName)
  const [price, setPrice] = useState(editOption.price.toString())

  const newOption: Option = {
    id: optionId,
    category: editOption.category,
    menuId: id,
    menuCategory: category,
    englishName: englishName,
    koreanName: koreanName,
    price: Number(price),
  }

  const disabled =
    !optionId ||
    !englishName ||
    !koreanName ||
    !price ||
    !isPriceValid(price) ||
    optionExists(editOption.category, optionId, options) ||
    optionEquals(editOption, newOption)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setOpen(false)

    await updateOption(store, editOption.category, editOption.id, newOption)

    const newOptions = await getOptions(store, category, id)
    setOptions(newOptions)
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this option?')) {
      return
    }
    setOpen(false)

    await deleteOption(store, editOption.category, editOption.id)

    const newOptions = await getOptions(store, category, id)
    setOptions(newOptions)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Edit Option</h1>
      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)} id="editOptionForm">
        <p>ID*</p>
        <input
          style={editOption.id !== optionId ? { color: 'red' } : undefined}
          defaultValue={optionId}
          onChange={(e) => setOptionId(e.target.value.trim())}
        />
        <p>English Name*</p>
        <input
          style={
            editOption.englishName !== englishName
              ? { color: 'red' }
              : undefined
          }
          defaultValue={englishName}
          onChange={(e) => setNewOptionEnglishName(e.target.value.trim())}
        />
        <p>Korean Name*</p>
        <input
          style={
            editOption.koreanName !== koreanName ? { color: 'red' } : undefined
          }
          defaultValue={koreanName}
          onChange={(e) => setKoreanName(e.target.value.trim())}
        />
        <p>Price*</p>
        <input
          style={
            editOption.price.toString() !== price ? { color: 'red' } : undefined
          }
          defaultValue={price}
          onChange={(e) => setPrice(e.target.value.trim())}
        />
      </form>
      {/* Message */}
      {price.length > 0 && !isPriceValid(price) ? (
        <p className={modalFormStyles.message}>
          Price should be a number with a maximum of 2 decimal places!
        </p>
      ) : null}

      {editOption.id !== optionId &&
      optionExists(editOption.category, optionId, options) ? (
        <p className={modalFormStyles.message}>
          {editOption.category} with id {optionId} already exists!
        </p>
      ) : null}
      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        <button onClick={handleDelete}>Delete</button>
        <button type="submit" form="editOptionForm" disabled={disabled}>
          Edit
        </button>
      </div>
    </div>
  )
}
