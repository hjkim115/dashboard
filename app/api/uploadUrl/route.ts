import { getUploadUrl } from '../../utils/s3'

export async function GET(request: any) {
  const { searchParams } = new URL(request.url)
  const store = searchParams.get('store')
  const fileName = searchParams.get('fileName')

  if (!store) {
    return Response.json({ message: 'Store is not set!' })
  }
  if (!fileName) {
    return Response.json({ message: 'File name is not set!' })
  }

  try {
    const uploadUrl = await getUploadUrl(store, fileName)
    return Response.json(uploadUrl)
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message })
    }
  }
}
