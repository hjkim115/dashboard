import loadingStyles from '../styles/loading.module.css'

export default function Loading({ size }: { size: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={loadingStyles.loading}
    />
  )
}
