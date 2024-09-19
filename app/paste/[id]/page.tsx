import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CopyButtons from "./copy-buttons"

async function getPaste(id: string) {
  const res = await fetch(`http://localhost:3000/api/paste/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function PastePage({
  params,
}: {
  params: { id: string }
}) {
  const paste = await getPaste(params.id)

  if (!paste) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paste</h1>
      <div className="mt-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Kode paste {paste.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="whitespace-pre-wrap">{paste.content}</CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center">
            <CopyButtons content={paste.content} id={paste.id} />
            <Button asChild>
              <Link href="/">Create New Paste</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}