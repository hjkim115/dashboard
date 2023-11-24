import loadingStyles from '../styles/loading.module.css'

export default function LoadingPage() {
  return (
    <div className={loadingStyles.loadingPageContainer}>
      <div className={loadingStyles.loading} />
    </div>
  )
}
