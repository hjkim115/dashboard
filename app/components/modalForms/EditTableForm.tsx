'use client'

import { useState } from 'react'
import { Table } from '@/app/utils/types'
import modalFormStyles from '../styles/modalForm.module.css'
import { tableEquals, tableIdExists } from '@/app/utils/formUtils'
import { updateTable, getAllTables, deleteTable } from '@/app/utils/firebase'

type EditTableProps = {
  store: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  tables: Table[]
  setTables: (value: React.SetStateAction<Table[] | null>) => void
  editTable: Table
}

export default function EditTableForm({
  store,
  setOpen,
  tables,
  setTables,
  editTable,
}: EditTableProps) {
  const [id, setId] = useState(editTable.id)
  const [tableNumber, setTableNumber] = useState(editTable.tableNumber)

  const newTable: Table = {
    id: id,
    tableNumber: tableNumber,
  }

  const disabled =
    !id ||
    !tableNumber ||
    tableEquals(editTable, { id: id, tableNumber: tableNumber }) ||
    (editTable.id !== id && tableIdExists(id, tables))

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)

    await updateTable(store, editTable.id, newTable)

    const newTables = await getAllTables(store)
    setTables(newTables)
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this table?')) {
      return
    }
    setOpen(false)

    await deleteTable(store, editTable.id)

    const newTables = await getAllTables(store)
    setTables(newTables)
  }

  return (
    <div className={modalFormStyles.formContainer}>
      {/* Title */}
      <h1>Edit Table</h1>

      {/* Form */}
      <form id="editTableForm" onSubmit={(e) => handleSubmit(e)}>
        <p>ID*</p>
        <input
          style={editTable.id !== id ? { color: 'red' } : undefined}
          onChange={(e) => setId(e.target.value.trim())}
          defaultValue={id}
          type="text"
        />
        <p>Table Number*</p>
        <input
          style={
            editTable.tableNumber !== tableNumber ? { color: 'red' } : undefined
          }
          onChange={(e) => setTableNumber(e.target.value.trim())}
          defaultValue={tableNumber}
          type="text"
        />
      </form>

      {/* Message */}
      {editTable.id !== id && tableIdExists(id, tables) ? (
        <p className={modalFormStyles.message}>
          Table with id {id} already exists!
        </p>
      ) : null}

      {/* Buttons */}
      <div className={modalFormStyles.buttons}>
        <button onClick={() => setOpen(false)}>Close</button>
        <button onClick={handleDelete}>Delete</button>
        <button type="submit" form="editTableForm" disabled={disabled}>
          Edit
        </button>
      </div>
    </div>
  )
}
