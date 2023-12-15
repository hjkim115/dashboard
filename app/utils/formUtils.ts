import { Category, Table, Menu, Options, Option } from './types'
import { server } from '../utils/config'

//ID
export const idPattern = /^[a-zA-Z0-9]+$/

//Price
export function isPriceValid(price: string) {
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

//Upload Image
export async function uploadImage(
  store: string,
  fileName: string,
  image: File
) {
  //Get Presigned Upload url
  const uploadUrlRes = await fetch(
    `${server}/api/uploadUrl?fileName=${fileName}
    &store=${store}`
  )
  const uploadUrl = await uploadUrlRes.json()

  //Upload Image
  await fetch(uploadUrl, {
    method: 'PUT',
    body: image,
    headers: {
      'Content-Type': image.type,
      'Content-Length': image.size.toString(),
    },
  })
}

//Tables
export function tableIdExists(id: string, tables: Table[]) {
  for (const table of tables) {
    if (table.id === id) {
      return true
    }
  }
  return false
}

export function tableEquals(table1: Table, table2: Table) {
  if (table1.id === table2.id && table1.tableNumber === table2.tableNumber) {
    return true
  }

  return false
}

//Categoires
export function categoryIdExists(id: string, categories: Category[]) {
  for (const category of categories) {
    if (category.id === id) {
      return true
    }
  }
  return false
}

export function categoryEquals(category1: Category, category2: Category) {
  if (
    category1.id === category2.id &&
    category1.englishName === category2.englishName &&
    category1.koreanName === category2.koreanName
  ) {
    return true
  }

  return false
}

//Menus
export function menuExists(id: string, category: string, menus: Menu[]) {
  for (const menu of menus) {
    if (menu.id === id && menu.category === category) {
      return true
    }
  }

  return false
}

export function menuEquals(menu1: Menu, menu2: Menu) {
  const keys = Object.keys(menu1)

  for (const key of keys) {
    if (menu1[key as keyof Menu] !== menu2[key as keyof Menu]) {
      return false
    }
  }

  return true
}

export const typeToExtensions: { [id: string]: string } = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
}

//Options
export function optionCategoryExists(optionCategory: string, options: Options) {
  return Object.keys(options).includes(optionCategory)
}

export function optionExists(
  optionCategory: string,
  optionId: string,
  options: Options
) {
  for (const option of options[optionCategory]) {
    if (option.id === optionId) {
      return true
    }
  }

  return false
}

export function optionEquals(option1: Option, option2: Option) {
  const keys = Object.keys(option1)

  for (const key of keys) {
    if (option1[key as keyof Option] !== option2[key as keyof Option]) {
      return false
    }
  }

  return true
}
