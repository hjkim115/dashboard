import listStyles from '../styles/list.module.css'

export default function Label() {
  return (
    <div className={listStyles.label}>
      <p className={listStyles.name}>Name</p>
    </div>
  )
}
