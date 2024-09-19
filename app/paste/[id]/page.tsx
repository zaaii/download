import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

async function getPaste(id: string) {
  const res = await fetch(`http://localhost:3000/api/paste/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function PastePage({ params }: { params: { id: string } }) {
  const paste = await getPaste(params.id)

  if (!paste) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paste {params.id}</h1>
      <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">{paste.content}</pre>
      <div className="mt-4">
        <Button asChild>
          <Link href="/">Create New Paste</Link>
        </Button>
      </div>
    </div>
  )
}