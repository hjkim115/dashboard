'use client'

import { useContext, useEffect, useState } from 'react'
import formStyles from '../../styles/form.module.css'
import optionsStyles from '../../styles/options.module.css'
import { Category, Menu, Option, Options } from '@/app/utils/types'
import { AuthContext } from '@/app/context/AuthContext'
import {
  deleteMenu,
  getAllCategories,
  getAllMenus,
  getMenu,
  getOptions,
  updateMenu,
} from '@/app/utils/firebase'
import { useSearchParams, useRouter } from 'next/navigation'
import LoadingPage from '@/app/components/LoadingPage'
import {
  FaPlus,
  FaAngleDown,
  FaAngleUp,
  FaPencilAlt,
  FaArrowLeft,
} from 'react-icons/fa'
import Modal from '@/app/components/Modal'
import EditImageForm from '@/app/components/modalForms/EditImageForm'
import AddOptionCategoryForm from '@/app/components/modalForms/AddOptionCategoryForm'
import EditOptionCategoryForm from '@/app/components/modalForms/EditOptionCategory'
import AddOptionForm from '@/app/components/modalForms/AddOptionForm'
import {
  categoryIdExists,
  isPriceValid,
  idPattern,
  menuExists,
  menuEquals,
} from '@/app/utils/formUtils'
import EditOptionForm from '@/app/components/modalForms/EditOptionForm'

export default function menu() {
  const [menus, setMenus] = useState<Menu[] | null>(null)
  const [menu, setMenu] = useState<Menu | null>(null)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [options, setOptions] = useState<Options | null>(null)
  const [optionsOpens, setOptionsOpens] = useState<boolean[] | null>(null)

  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const id = searchParams.get('id')

  const router = useRouter()

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

    async function fetchMenus(store: string) {
      const data = await getAllMenus(store)
      setMenus(data)
    }

    async function fetchOptions(store: string, category: string, id: string) {
      const data = await getOptions(store, category, id)
      setOptions(data)
    }

    if (store && category && id) {
      if (typeof id === 'string') {
        fetchCategories(store)
        fetchMenu(store, category, id)
        fetchMenus(store)
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

  useEffect(() => {
    if (menu) {
      setNewId(menu.id)
      setNewCategory(menu.category)
      setNewEnglishName(menu.englishName)
      setNewKoreanName(menu.koreanName)
      setNewPrice(menu.price.toString())
      if (menu.description) {
        setNewDescription(menu.description)
      }
    }
  }, [menu])

  //Edit Menu
  const [newId, setNewId] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newEnglishName, setNewEnglishName] = useState('')
  const [newKoreanName, setNewKoreanName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newDescription, setNewDescription] = useState('')

  let newMenu: Menu
  let editMenuDisabled
  if (menu && menus) {
    //New Menu
    newMenu = {
      id: newId,
      category: newCategory,
      koreanName: newKoreanName,
      englishName: newEnglishName,
      price: Number(newPrice),
      description: newDescription,
      imageName: menu.imageName,
    }

    //Edit Menu Disabled
    editMenuDisabled =
      !newId ||
      !newCategory ||
      !newEnglishName ||
      !newKoreanName ||
      !newPrice ||
      !isPriceValid(newPrice) ||
      !idPattern.test(newId) ||
      menuEquals(menu, newMenu) ||
      ((menu.id !== newId || menu.category !== newCategory) &&
        menuExists(newId, newCategory, menus))
  }

  async function handleMenuEdit(
    e: React.FormEvent<HTMLFormElement>,
    store: string,
    id: string,
    category: string
  ) {
    e.preventDefault()
    editMenuDisabled = true

    await updateMenu(store, id, category, newMenu)

    if (newId !== id || newCategory !== category) {
      router.push('/update/menus')
    } else {
      const newMenu = await getMenu(store, category, id)
      setMenu(newMenu)
    }
  }

  async function handleMenuDelete(store: string, id: string, category: string) {
    if (!confirm('Are you sure you want to delete this Menu?')) {
      return
    }

    await deleteMenu(store, id, category)
    router.push('/update/menus')
  }

  // Modals
  //Edit Image
  const [editImageOpen, setEditImageOpen] = useState(false)
  //Add Category
  const [addOptionCategoryOpen, setAddOptionCategoryOpen] = useState(false)
  //Edit Category
  const [editOptionCategoryOpen, setEditOptionCategoryOpen] = useState(false)
  const [editOptionCategory, setEditOptionCategory] = useState('')
  //Add Option
  const [addOptionOpen, setAddOptionOpen] = useState(false)
  const [optionCategory, setOptionCategory] = useState('')
  //Edit Option
  const [editOptionOpen, setEditOptionOpen] = useState(false)
  const [editOption, setEditOption] = useState({} as Option)

  if (
    !(
      categories &&
      menu &&
      menus &&
      options &&
      optionsOpens &&
      store &&
      id &&
      category
    )
  ) {
    return <LoadingPage />
  }

  return (
    <div className={formStyles.formContainer}>
      {/* Title */}
      <h1>Edit Menu</h1>

      {/* Menu Cateogory Exists */}
      {!categoryIdExists(category, categories) ? (
        <p className={formStyles.message}>Current category has been deleted!</p>
      ) : null}

      {/* Form */}
      <form
        onSubmit={(e) => handleMenuEdit(e, store, id, category)}
        id="editMenuForm"
        className={formStyles.form}
      >
        <p>ID*</p>
        <input
          style={menu.id !== newId ? { color: 'red' } : undefined}
          defaultValue={newId}
          onChange={(e) => setNewId(e.target.value.trim())}
        />
        <p>Category*</p>
        <select
          style={menu.category !== newCategory ? { color: 'red' } : undefined}
          defaultValue={newCategory}
          onChange={(e) => setNewCategory(e.target.value.trim())}
        >
          <option value="">Select Category!</option>
          {categories.map((category) => (
            <option value={category.id}>{category.englishName}</option>
          ))}
        </select>
        <p>English Name*</p>
        <input
          style={
            menu.englishName !== newEnglishName ? { color: 'red' } : undefined
          }
          defaultValue={newEnglishName}
          onChange={(e) => setNewEnglishName(e.target.value.trim())}
        />
        <p>Korean Name*</p>
        <input
          style={
            menu.koreanName !== newKoreanName ? { color: 'red' } : undefined
          }
          defaultValue={newKoreanName}
          onChange={(e) => setNewKoreanName(e.target.value.trim())}
        />
        <p>Price*</p>
        <input
          style={
            menu.price.toString() !== newPrice ? { color: 'red' } : undefined
          }
          defaultValue={newPrice}
          onChange={(e) => setNewPrice(e.target.value.trim())}
        />
        <p>Description</p>
        <textarea
          style={
            menu.description !== newDescription ? { color: 'red' } : undefined
          }
          defaultValue={newDescription}
          onChange={(e) => setNewDescription(e.target.value.trim())}
          rows={3}
        />

        {(menu.id !== newId || menu.category !== newCategory) &&
        menuExists(newId, newCategory, menus) ? (
          <p className={formStyles.message}>
            Menu with category {newCategory}, id {newId} already exists!
          </p>
        ) : null}
        {newId.length > 0 && !idPattern.test(newId) ? (
          <p className={formStyles.message}>
            id should be alphanumeric{'('}a-z, A-Z, 0-9{')'}!
          </p>
        ) : null}
        {newPrice.length > 0 && !isPriceValid(newPrice) ? (
          <p className={formStyles.message}>
            Price should be a number with a maximum of 2 decimal places!
          </p>
        ) : null}
      </form>

      {/* Buttons */}
      <div className={formStyles.buttons}>
        <button onClick={() => handleMenuDelete(store, id, category)}>
          Delete
        </button>
        <button onClick={() => setEditImageOpen(true)}>Edit Image</button>
        <button type="submit" form="editMenuForm" disabled={editMenuDisabled}>
          Edit
        </button>
      </div>

      {/* Option */}
      <h2 className={optionsStyles.title}>Options</h2>

      <div className={optionsStyles.categoriesLabel}>
        <p>Categories</p>
        <FaPlus onClick={() => setAddOptionCategoryOpen(true)} />
      </div>

      {Object.keys(options).map((key, i) => (
        <div className={optionsStyles.optionsContainer}>
          <div className={optionsStyles.categoryLabel}>
            <p>{key}</p>
            <div className={optionsStyles.optionsButtons}>
              <FaPencilAlt
                onClick={() => {
                  setEditOptionCategoryOpen(true)
                  setEditOptionCategory(key)
                }}
                className={optionsStyles.editCategory}
              />
              <FaPlus
                onClick={() => {
                  setAddOptionOpen(true)
                  setOptionCategory(key)
                }}
                className={optionsStyles.addOption}
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
                <div className={optionsStyles.option}>
                  <p>{option.englishName}</p>
                  <FaPencilAlt
                    onClick={() => {
                      setEditOption(option)
                      setEditOptionOpen(true)
                    }}
                  />
                </div>
              ))
            : null}
        </div>
      ))}

      {/* Go Back */}
      <button className="goBackButton" onClick={() => router.back()}>
        <FaArrowLeft /> Go Back
      </button>

      {/* Modals */}
      {/* Edit Image */}
      <Modal handleClick={() => setEditImageOpen(false)} isOpen={editImageOpen}>
        <EditImageForm
          store={store}
          setOpen={setEditImageOpen}
          menu={menu}
          setMenu={setMenu}
          type="menu"
        />
      </Modal>

      {/* Add Option Category */}
      <Modal
        handleClick={() => setAddOptionCategoryOpen(false)}
        isOpen={addOptionCategoryOpen}
      >
        <AddOptionCategoryForm
          setOpen={setAddOptionCategoryOpen}
          options={options}
          setOptions={setOptions}
        />
      </Modal>

      {/* Edit Option Category */}
      <Modal
        handleClick={() => setEditOptionCategoryOpen(false)}
        isOpen={editOptionCategoryOpen}
      >
        <EditOptionCategoryForm
          store={store}
          id={id}
          category={category}
          setOpen={setEditOptionCategoryOpen}
          options={options}
          setOptions={setOptions}
          editOptionCategory={editOptionCategory}
        />
      </Modal>

      {/* Add Option */}
      <Modal handleClick={() => setAddOptionOpen(false)} isOpen={addOptionOpen}>
        <AddOptionForm
          store={store}
          id={id}
          category={category}
          setOpen={setAddOptionOpen}
          options={options}
          setOptions={setOptions}
          optionCategory={optionCategory}
        />
      </Modal>

      {/* Edit Option */}
      <Modal
        handleClick={() => setEditOptionOpen(false)}
        isOpen={editOptionOpen}
      >
        <EditOptionForm
          store={store}
          id={id}
          category={category}
          setOpen={setEditOptionOpen}
          options={options}
          setOptions={setOptions}
          editOption={editOption}
        />
      </Modal>
    </div>
  )
}
