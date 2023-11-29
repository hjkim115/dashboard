'use client'

import { useContext, useEffect, useState } from 'react'
import detailsStyles from '../../../styles/details.module.css'
import formStyles from '../../../styles/form.module.css'
import { Category, Menu, Option, Options } from '@/app/utils/types'
import { AuthContext } from '@/app/context/AuthContext'
import { getAllCategories, getMenu, getOptions } from '@/app/utils/firebase'
import { useParams, useSearchParams } from 'next/navigation'
import LoadingPage from '@/app/components/LoadingPage'
import { FaPlus, FaAngleDown, FaAngleUp, FaPencilAlt } from 'react-icons/fa'
import Modal from '@/app/components/Modal'

export default function menu() {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [options, setOptions] = useState<Options | null>(null)
  const [optionsOpens, setOptionsOpens] = useState<boolean[] | null>(null)

  const idPattern = /^[a-zA-Z0-9]+$/

  const [editMenuOpen, setEditMenuOpen] = useState(false)

  //Add Category
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [newOptionCategory, setNewOptionCategory] = useState('')
  const addOptionCategoryDisabled = newOptionCategory === ''

  function handleAddCategoryClose() {
    setAddCategoryOpen(false)
    setNewOptionCategory('')
  }

  function addOptionCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newOptions: Options = { ...options }
    newOptions[newOptionCategory] = []
    setOptions(newOptions)
    handleAddCategoryClose()
  }

  //Edit Category
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)

  //Add Option
  const [addOptionOpen, setAddOptionOpen] = useState(false)
  const [optionId, setOptionId] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [koreanName, setKoreanName] = useState('')
  const [price, setPrice] = useState('')

  function handleAddOptionClose() {
    setAddOptionOpen(false)
    setOptionId('')
    setEnglishName('')
    setKoreanName('')
    setPrice('')
  }

  function addOption(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newOptions: Options = { ...options }
    newOptions[newOptionCategory] = []
    setOptions(newOptions)
    handleAddCategoryClose()
  }

  //Edit Option
  const [editOptionOpen, setEditOptionOpen] = useState(false)

  const { id } = useParams()
  const category = useSearchParams().get('category')

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  useEffect(() => {
    async function fetchCategories(store: string) {
      const data = await getAllCategories(store)
      setCategories(data)
    }

    async function fetchMenu(store: string, category: string, id: string) {
      const data = await getMenu(store, category, id)
      setMenu(data)
    }

    async function fetchOptions(store: string, category: string, id: string) {
      const data = await getOptions(store, category, id)
      setOptions(data)
    }

    if (store && category && id) {
      if (typeof id === 'string') {
        fetchCategories(store)
        fetchMenu(store, category, id)
        fetchOptions(store, category, id)
      }
    }
  }, [store && category && id])

  useEffect(() => {
    if (options) {
      const opens = []
      for (let i = 0; i < Object.keys(options).length; i++) {
        opens.push(false)
      }

      setOptionsOpens(opens)
    }
  }, [options])

  function menuCategoryValid(categories: Category[], menuCategory: string) {
    for (const category of categories) {
      if (menuCategory === category.id) {
        return true
      }
    }

    return false
  }

  if (!(categories && menu && options && optionsOpens)) {
    return <LoadingPage />
  }

  return (
    <div className={detailsStyles.detailsContainer}>
      <h1>Edit Menu</h1>

      {!menuCategoryValid(categories, menu.category) ? (
        <p className={formStyles.message}>Current category has been deleted!</p>
      ) : null}

      <div className={detailsStyles.form}>
        <form className={formStyles.form}>
          <p>ID*</p>
          <input />
          <p>Category*</p>
          <select></select>
          <p>English Name*</p>
          <input />
          <p>Korean Name*</p>
          <input />
          <p>Price*</p>
          <input />
          <p>Description</p>
          <textarea rows={3} placeholder="Description" />
          <p>Image*</p>
          <input type="file" />
        </form>
      </div>

      <div className={detailsStyles.buttons}>
        <div className={formStyles.buttons}>
          <button>Delete</button>
          <button>Update</button>
        </div>
      </div>

      <h2 className={detailsStyles.options}>Options</h2>

      <div className={detailsStyles.categoriesLabel}>
        <p>Categories</p>
        <FaPlus onClick={() => setAddCategoryOpen(true)} />
      </div>

      {Object.keys(options).map((key, i) => (
        <div className={detailsStyles.optionsContainer}>
          <div className={detailsStyles.categoryLabel}>
            <p>{key}</p>
            <div className={detailsStyles.optionsButtons}>
              <FaPencilAlt
                onClick={() => setEditCategoryOpen(true)}
                className={detailsStyles.editCategory}
              />
              <FaPlus
                onClick={() => setAddOptionOpen(true)}
                className={detailsStyles.addOption}
              />
              {optionsOpens[i] === false ? (
                <FaAngleDown
                  onClick={() => {
                    const newOptionsOpens = [...optionsOpens]
                    newOptionsOpens[i] = true
                    setOptionsOpens(newOptionsOpens)
                  }}
                />
              ) : (
                <FaAngleUp
                  onClick={() => {
                    const newOptionsOpens = [...optionsOpens]
                    newOptionsOpens[i] = false
                    setOptionsOpens(newOptionsOpens)
                  }}
                />
              )}
            </div>
          </div>

          {optionsOpens[i] === true
            ? options[key].map((option: Option) => (
                <div className={detailsStyles.option}>
                  <p>{option.englishName}</p>
                  <FaPencilAlt onClick={() => setEditOptionOpen(true)} />
                </div>
              ))
            : null}
        </div>
      ))}

      {addCategoryOpen ? (
        <Modal handleClick={() => setAddCategoryOpen(false)}>
          <form
            onSubmit={(e) => addOptionCategory(e)}
            id="addOptionCategory"
            className={formStyles.form}
          >
            <h1>Add Category</h1>
            <p>Category *</p>
            <input
              onChange={(e) => setNewOptionCategory(e.target.value.trim())}
              type="text"
              placeholder="Category"
            />
          </form>
          <div className={formStyles.buttons}>
            <button onClick={() => handleAddCategoryClose()}>Close</button>
            <button
              type="submit"
              form="addOptionCategory"
              disabled={addOptionCategoryDisabled}
            >
              Add
            </button>
          </div>
        </Modal>
      ) : null}

      {editCategoryOpen ? (
        <Modal handleClick={() => setEditCategoryOpen(false)}>
          <div>
            <h2>Edit Category</h2>
          </div>
        </Modal>
      ) : null}

      {addOptionOpen ? (
        <Modal handleClick={() => setAddOptionOpen(false)}>
          <form className={formStyles.form}>
            <h1>Add Option</h1>
            <p>ID</p>
            <input
              placeholder="ID"
              onChange={(e) => setOptionId(e.target.value.trim())}
            />
            <p>English Name</p>
            <input
              placeholder="English Name"
              onChange={(e) => setEnglishName(e.target.value.trim())}
            />
            <p>Korean Name</p>
            <input
              placeholder="Korean Name"
              onChange={(e) => setKoreanName(e.target.value)}
            />
            <p>Price</p>
            <input
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value.trim())}
            />
          </form>
          <div className={formStyles.buttons}>
            <button onClick={() => handleAddCategoryClose()}>Close</button>
            <button
              type="submit"
              form="addOptionCategory"
              disabled={addOptionCategoryDisabled}
            >
              Add
            </button>
          </div>
        </Modal>
      ) : null}

      {editOptionOpen ? (
        <Modal handleClick={() => setEditOptionOpen(false)}>
          <div>
            <h2>Edit Option</h2>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
