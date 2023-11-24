import { getImageNames } from '../../utils/s3'

export async function GET(request: any) {
  const { searchParams } = new URL(request.url)
  const store = searchParams.get('store')

  if (!store) {
    return Response.json({ message: 'Store is not set!' })
  }

  try {
    const imageNames = await getImageNames(store)
    return Response.json(imageNames)
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message })
    }
  }
}
