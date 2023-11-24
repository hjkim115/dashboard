import modalStyles from '../styles/modal.module.css'

type ModalProps = {
  children: React.ReactNode
  handleClick: () => void
}

export default function Modal({ children, handleClick }: ModalProps) {
  return (
    <div className={modalStyles.modalContainer}>
      <div onClick={handleClick} className={modalStyles.overlay} />
      <div className={modalStyles.content}>{children}</div>
    </div>
  )
}
