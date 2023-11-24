import listStyles from '../styles/list.module.css'

type AddItemProps = {
  children: React.ReactNode
  handleClick: (value: boolean) => void
}

export default function AddItem({ children, handleClick }: AddItemProps) {
  return (
    <button onClick={() => handleClick(true)} className={listStyles.addItem}>
      {children}
    </button>
  )
}
