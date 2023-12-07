export async function GET(request: any) {
  return Response.json('hello', { status: 200 })
}

export async function OPTIONS() {
  return Response.json({ status: 200 })
}
