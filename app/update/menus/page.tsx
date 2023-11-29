'use client'

import { useState, useEffect, useContext } from 'react'
import { Category, Menu } from '../../utils/types'
import { getAllCategories, getAllMenus, postMenu } from '../../utils/firebase'
import menusStyles from '../../styles/menus.module.css'
import listStyles from '../../styles/list.module.css'
import formStyles from '../../styles/form.module.css'
import { FaPencilAlt, FaPlus } from 'react-icons/fa'
import Label from '../../components/Label'
import AddItem from '../../components/AddItem'
import Modal from '../../components/Modal'
import { useRouter } from 'next/navigation'
import LoadingPage from '../../components/LoadingPage'
import { AuthContext } from '@/app/context/AuthContext'
import { server } from '../../utils/config'

export default function Menus() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [menus, setMenus] = useState<Menu[] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  //Add
  const [addOpen, setAddOpen] = useState(false)
  const [id, setId] = useState('')
  const [category, setCategory] = useState('')
  const [koreanName, setKoreanName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const [addLoading, setAddLoading] = useState(false)

  const router = useRouter()

  const { user } = useContext(AuthContext)
  const store = user?.displayName

  const idPattern = /^[a-zA-Z0-9]+$/

  //disabled
  const addDisabled = getIsDisabled()

  function getIsDisabled() {
    if (!menus) {
      return true
    }

    if (
      id === '' ||
      category === '' ||
      koreanName === '' ||
      englishName === '' ||
      price === '' ||
      image == null
    ) {
      return true
    }

    if (!isPriceValid(price)) {
      return true
    }

    if (idCategoryExists(menus, id, category)) {
      return true
    }

    if (!idPattern.test(id)) {
      return true
    }

    return false
  }

  function idCategoryExists(menus: Menu[], id: string, category: string) {
    for (const menu of menus) {
      if (menu.id === id && menu.category === category) {
        return true
      }
    }

    return false
  }

  function isPriceValid(price: string) {
    const pricePattern = /^[0-9.]+$/

    if (!pricePattern.test(price)) {
      return false
    }

    if (price.includes('.')) {
      let pointCount = 0
      for (let i = 0; i < price.length; i++) {
        if (price[i] === '.') {
          pointCount++
        }
      }

      if (pointCount > 1) {
        return false
      }

      const priceSplit = price.split('.')

      const integer = priceSplit[0]
      const decimal = priceSplit[1]

      if (integer.length <= 0) {
        return false
      }

      if (decimal.length > 2 || decimal.length <= 0) {
        return false
      }
    }

    return true
  }

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

  function handleAddClose() {
    setAddOpen(false)
    setId('')
    setCategory('')
    setEnglishName('')
    setKoreanName('')
    setPrice('')
    setDescription('')
    setImage(null)
  }

  function menuCategoryValid(categories: Category[], menuCategory: string) {
    for (const category of categories) {
      if (menuCategory === category.id) {
        return true
      }
    }

    return false
  }

  async function add(e: React.FormEvent<HTMLFormElement>, store: string) {
    e.preventDefault()

    if (!image) {
      return
    }

    setAddLoading(true)

    //Get Presigned Upload url
    const uploadUrlRes = await fetch(
      `${server}/api/uploadUrl?fileName=${category}-${id}.png&store=${store}`
    )
    const uploadUrl = await uploadUrlRes.json()

    //Upload Image
    await fetch(uploadUrl, {
      method: 'PUT',
      body: image,
      headers: {
        'Content-Type': image?.type,
        'Content-Length': image?.size.toString(),
      },
    })

    //Add Menu
    const menu: Menu = {
      id: id,
      category: category,
      koreanName: koreanName,
      englishName: englishName,
      price: Number(price),
      imageName: `${category}-${id}.png`,
    }

    if (description !== '') {
      menu.description = description
    }

    await postMenu(store, menu)

    const newMenus = await getAllMenus(store)
    setMenus(newMenus)

    setAddLoading(false)
    handleAddClose()
  }

  if (!(categories && menus && store)) {
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
        <Modal handleClick={handleAddClose}>
          {/* Form */}
          {!addLoading ? (
            <>
              <form
                id="addMenuForm"
                onSubmit={(e) => add(e, store)}
                className={formStyles.form}
              >
                <h1>Add Menu</h1>
                <p>ID *</p>
                <input
                  onChange={(e) => setId(e.target.value.trim())}
                  type="text"
                  placeholder="ID"
                />
                <p>Category *</p>
                <select onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category!</option>
                  {categories.map((category) => (
                    <option value={category.id}>{category.englishName}</option>
                  ))}
                </select>
                <p>Korean Name *</p>
                <input
                  onChange={(e) => setKoreanName(e.target.value.trim())}
                  type="text"
                  placeholder="Korean Name"
                />
                <p>English Name *</p>
                <input
                  onChange={(e) => setEnglishName(e.target.value.trim())}
                  type="text"
                  placeholder="English Name"
                />
                <p>Price *</p>
                <input
                  onChange={(e) => setPrice(e.target.value.trim())}
                  type="text"
                  placeholder="Price"
                />
                <p>Description</p>
                <textarea
                  onChange={(e) => setDescription(e.target.value.trim())}
                  rows={3}
                  placeholder="Description"
                />
                <p>Image*</p>
                <input
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage(e.target.files[0])
                    }
                  }}
                  type="file"
                />

                {idCategoryExists(menus, id, category) ? (
                  <p className={formStyles.message}>
                    Menu with category {category}, id {id} already exists!
                  </p>
                ) : null}

                {id.length > 0 && !idPattern.test(id) ? (
                  <p className={formStyles.message}>
                    id should be alphanumeric{'('}a-z, A-Z, 0-9{')'}!
                  </p>
                ) : null}

                {price.length > 0 && !isPriceValid(price) ? (
                  <p className={formStyles.message}>
                    Price should be a number with a maximum of 2 decimal places!
                  </p>
                ) : null}
              </form>

              {/* Buttons */}
              <div className={formStyles.buttons}>
                <button onClick={handleAddClose}>Close</button>
                <button type="submit" form="addMenuForm" disabled={addDisabled}>
                  Add
                </button>
              </div>
            </>
          ) : (
            <LoadingPage />
          )}
        </Modal>
      ) : null}
    </div>
  )
}
