import { useState } from 'react'
import modalFormStyles from '../styles/modalForm.module.css'
import { Table } from '@/app/utils/types'
import { postTable, getAllTables } from '@/app/utils/firebase'
import { tableIdExists } from '@/app/utils/formUtils'

type AddTableProps = {
  store: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  tables: Table[]
  setTables: (value: React.SetStateAction<Table[] | null>) => void
}

export default function AddTableForm({
  store,
  setOpen,
  tables,
  setTables,
}: AddTableProps) {
  const [id, setId] = useState('')
  const [tableNumber, setTableNumber] = useState('')

  const disabled = !id || !tableNumber || tableIdExists(id, tables)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)

    const table: Table = {
      id: id,
      tableNumber: tableNumber,
    }
    await postTable(store, table)

    const newTables = await getAllTables(store)
    setTables(newTables)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Add Table</h1>

      {/* Form */}
      <form id="addTableForm" onSubmit={(e) => handleSubmit(e)}>
        <p>ID*</p>
        <input
          onChange={(e) => setId(e.target.value.trim())}
          type="text"
          placeholder="ID"
        />
        <p>Table Number*</p>
        <input
          onChange={(e) => setTableNumber(e.target.value.trim())}
          type="text"
          placeholder="Table Number"
        />
      </form>

      {/* Message */}
      {tableIdExists(id, tables) ? (
        <p className={modalFormStyles.message}>
          Table with id {id} already exists!
        </p>
      ) : null}

      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        <button type="submit" form="addTableForm" disabled={disabled}>
          Add
        </button>
      </div>
    </div>
  )
}
