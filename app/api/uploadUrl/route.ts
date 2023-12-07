import { getUploadUrl } from '../../utils/s3'

export async function GET(request: any) {
  const { searchParams } = new URL(request.url)
  const store = searchParams.get('store')
  const fileName = searchParams.get('fileName')

  if (!store) {
    return Response.json({ message: 'Store is not set!' }, { status: 400 })
  }
  if (!fileName) {
    return Response.json({ message: 'File name is not set!' }, { status: 400 })
  }

  try {
    const uploadUrl = await getUploadUrl(store, fileName)
    return Response.json(uploadUrl, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 })
    }
  }
}

export async function OPTIONS() {
  return Response.json({ status: 200 })
}
