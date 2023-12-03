import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  DocumentData,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { Category, Menu, Table, Option, Options } from './types'
import { getAuth } from 'firebase/auth'

//Firebase Setup
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
export const auth = getAuth(app)

//Categories Get All
export async function getAllCategories(store: string) {
  const categoriesRef = collection(doc(db, 'categories', store), 'categories')
  const categoriesQuery = query(categoriesRef, orderBy('id'))
  const snapshot = await getDocs(categoriesQuery)

  const categories: Category[] = []
  snapshot.forEach((document) => {
    categories.push(document.data() as Category)
  })

  return categories
}

//Categories Post
export async function postCategory(store: string, category: Category) {
  const categoriesRef = collection(doc(db, 'categories', store), 'categories')
  await addDoc(categoriesRef, category)
}

//Categories Put
export async function updateCategory(
  store: string,
  id: string,
  newCategory: Category
) {
  const categoriesRef = collection(doc(db, 'categories', store), 'categories')
  const categoriesQuery = query(categoriesRef, where('id', '==', id))
  const snapshot = await getDocs(categoriesQuery)

  let refId: string | undefined
  snapshot.forEach((document) => {
    refId = document.id
  })

  if (!refId) {
    throw Error(`Failed to find category with id ${id}!`)
  }

  const categoryRef = doc(doc(db, 'categories', store), 'categories', refId)
  await updateDoc(categoryRef, newCategory)
}

//Categories Delete
export async function deleteCategory(store: string, id: string) {
  const categoriesRef = collection(doc(db, 'categories', store), 'categories')
  const categoriesQuery = query(categoriesRef, where('id', '==', id))
  const snapshot = await getDocs(categoriesQuery)

  let refId: string | undefined
  snapshot.forEach((document) => {
    refId = document.id
  })

  if (!refId) {
    throw Error(`Failed to find category with id ${id}!`)
  }

  const categoryRef = doc(doc(db, 'categories', store), 'categories', refId)
  await deleteDoc(categoryRef)
}

//Company Name Get
export async function getCompanyName(store: string) {
  const settingsRef = doc(db, 'settings', store)
  const snapshot = await getDoc(settingsRef)
  const companyName = snapshot.data()?.name as string

  return companyName
}

//Company Name Put
export async function updateCompanyName(store: string, companyName: string) {
  const settingsRef = doc(db, 'settings', store)
  await setDoc(settingsRef, { name: companyName })
}

//Tables Get All
export async function getAllTables(store: string) {
  const tablesRef = collection(doc(db, 'tables', store), 'tables')
  const tablesQuery = query(tablesRef, orderBy('id'))
  const snapshot = await getDocs(tablesQuery)

  const tables: Table[] = []
  snapshot.forEach((table) => {
    tables.push(table.data() as Table)
  })

  return tables
}

//Tables Post
export async function postTable(store: string, table: Table) {
  const tablesRef = collection(doc(db, 'tables', store), 'tables')
  await addDoc(tablesRef, table)
}

//Tables Put
export async function updateTable(store: string, id: string, table: Table) {
  const tablesRef = collection(doc(db, 'tables', store), 'tables')
  const tablesQuery = query(tablesRef, where('id', '==', id))
  const snapshot = await getDocs(tablesQuery)

  let refId: string | undefined
  snapshot.forEach((document) => {
    refId = document.id
  })

  if (!refId) {
    throw Error(`Failed to find table with id ${id}!`)
  }

  const tableRef = doc(doc(db, 'tables', store), 'tables', refId)
  await updateDoc(tableRef, table)
}

//Tables Delete
export async function deleteTable(store: string, id: string) {
  const tablesRef = collection(doc(db, 'tables', store), 'tables')
  const tablesQuery = query(tablesRef, where('id', '==', id))
  const snapshot = await getDocs(tablesQuery)

  let refId: string | undefined
  snapshot.forEach((document) => {
    refId = document.id
  })

  if (!refId) {
    throw Error(`Failed to find table with id ${id}!`)
  }

  const tableRef = doc(doc(db, 'tables', store), 'tables', refId)
  await deleteDoc(tableRef)
}

//Menus Get All
export async function getAllMenus(store: string) {
  const menusRef = collection(doc(db, 'menus', store), 'menus')
  const snapshot = await getDocs(menusRef)

  const menus: Menu[] = []
  snapshot.forEach((table) => {
    menus.push(table.data() as Menu)
  })

  return menus
}

//Menu Get
export async function getMenu(store: string, category: string, id: string) {
  const menusRef = collection(doc(db, 'menus', store), 'menus')
  const menusQuery = query(
    menusRef,
    where('category', '==', category),
    where('id', '==', id)
  )
  const snapshot = await getDocs(menusQuery)

  const menus: Menu[] = []
  snapshot.forEach((document) => {
    menus.push(document.data() as Menu)
  })

  return menus[0]
}

//Menus Post
export async function postMenu(store: string, menu: Menu) {
  const menusRef = collection(doc(db, 'menus', store), 'menus')
  await addDoc(menusRef, menu)
}

//Menu Update
export async function updateMenu(
  store: string,
  id: string,
  category: string,
  values: any
) {
  const menusRef = collection(doc(db, 'menus', store), 'menus')
  const menusQuery = query(
    menusRef,
    where('id', '==', id),
    where('category', '==', category)
  )

  const menusSnapshot = await getDocs(menusQuery)
  const menuRefIds: string[] = []
  menusSnapshot.forEach((document) => {
    menuRefIds.push(document.id)
  })

  updateDoc(doc(doc(db, 'menus', store), 'menus', menuRefIds[0]), values)

  if (values.id || values.category) {
    const optionsRef = collection(doc(db, 'options', store), 'options')
    const optionsQuery = query(
      optionsRef,
      where('menuId', '==', id),
      where('menuCategory', '==', category)
    )

    const optionsSnapshot = await getDocs(optionsQuery)
    const optionRefIds: string[] = []
    optionsSnapshot.forEach((document) => {
      optionRefIds.push(document.id)
    })

    const batch = writeBatch(db)
    for (let optionRefId of optionRefIds) {
      batch.update(doc(doc(db, 'options', store), 'options', optionRefId), {
        menuId: values.id,
        menuCategory: values.category,
      })
    }
    await batch.commit()
  }
}

export async function deleteMenu(store: string, id: string, category: string) {
  const menusRef = collection(doc(db, 'menus', store), 'menus')
  const menusQuery = query(
    menusRef,
    where('id', '==', id),
    where('category', '==', category)
  )

  const menusSnapshot = await getDocs(menusQuery)
  const menuRefIds: string[] = []
  menusSnapshot.forEach((document) => {
    menuRefIds.push(document.id)
  })

  deleteDoc(doc(doc(db, 'menus', store), 'menus', menuRefIds[0]))

  const optionsRef = collection(doc(db, 'options', store), 'options')
  const optionsQuery = query(
    optionsRef,
    where('menuId', '==', id),
    where('menuCategory', '==', category)
  )

  const optionsSnapshot = await getDocs(optionsQuery)
  const optionRefIds: string[] = []
  optionsSnapshot.forEach((document) => {
    optionRefIds.push(document.id)
  })

  const batch = writeBatch(db)
  for (let optionRefId of optionRefIds) {
    batch.delete(doc(doc(db, 'options', store), 'options', optionRefId))
  }
  await batch.commit()
}

//Options Get
export async function getOptions(store: string, category: string, id: string) {
  const optionsRef = collection(doc(db, 'options', store), 'options')
  const optionsQuery = query(
    optionsRef,
    where('menuCategory', '==', category),
    where('menuId', '==', id)
  )
  const snapshot = await getDocs(optionsQuery)

  const documents: DocumentData[] = []
  snapshot.forEach((document) => {
    documents.push(document.data())
  })

  const options: Options = {}
  for (const d of documents) {
    if (d.category in options) {
      options[d.category].push(d as Option)
    } else {
      options[d.category] = [d as Option]
    }
  }

  return options
}

//Option Post
export async function postOption(store: string, option: Option) {
  const optionsRef = collection(doc(db, 'options', store), 'options')
  await addDoc(optionsRef, option)
}

//Update Option Category
export async function updateOptionCategory(
  store: string,
  category: string,
  id: string,
  optionCategory: string,
  newCategory: string
) {
  const optionsRef = collection(doc(db, 'options', store), 'options')
  const optionsQuery = query(
    optionsRef,
    where('menuCategory', '==', category),
    where('menuId', '==', id),
    where('category', '==', optionCategory)
  )
  const snapshot = await getDocs(optionsQuery)
  const refIds: string[] = []
  snapshot.forEach((document) => {
    refIds.push(document.id)
  })

  const batch = writeBatch(db)

  for (const refId of refIds) {
    const optionRef = doc(doc(db, 'options', store), 'options', refId)
    batch.update(optionRef, { category: newCategory })
  }

  await batch.commit()
}

//Delete Option Category
export async function deleteOptionCategory(
  store: string,
  category: string,
  id: string,
  optionCategory: string
) {
  const optionsRef = collection(doc(db, 'options', store), 'options')
  const optionsQuery = query(
    optionsRef,
    where('menuCategory', '==', category),
    where('menuId', '==', id),
    where('category', '==', optionCategory)
  )
  const snapshot = await getDocs(optionsQuery)
  const refIds: string[] = []
  snapshot.forEach((document) => {
    refIds.push(document.id)
  })

  const batch = writeBatch(db)

  for (const refId of refIds) {
    const optionRef = doc(doc(db, 'options', store), 'options', refId)
    batch.delete(optionRef)
  }

  await batch.commit()
}

//Update Option
export async function updateOption(
  store: string,
  optionCategory: string,
  optionId: string,
  newOption: Option
) {
  const optionsRef = collection(doc(db, 'options', store), 'options')
  const optionsQuery = query(
    optionsRef,
    where('category', '==', optionCategory),
    where('id', '==', optionId)
  )

  const snapshot = await getDocs(optionsQuery)
  const refIds: string[] = []
  snapshot.forEach((document) => {
    refIds.push(document.id)
  })

  await updateDoc(
    doc(doc(db, 'options', store), 'options', refIds[0]),
    newOption
  )
}

//Delete Option
export async function deleteOption(
  store: string,
  optionCategory: string,
  optionId: string
) {
  const optionsRef = collection(doc(db, 'options', store), 'options')
  const optionsQuery = query(
    optionsRef,
    where('category', '==', optionCategory),
    where('id', '==', optionId)
  )

  const snapshot = await getDocs(optionsQuery)
  const refIds: string[] = []
  snapshot.forEach((document) => {
    refIds.push(document.id)
  })

  await deleteDoc(doc(doc(db, 'options', store), 'options', refIds[0]))
}
