'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from '@/hooks/use-toast'

export default function Home() {
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content",
        variant: "destructive",
      })
      return
    }

    const response = await fetch('/api/paste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })

    if (response.ok) {
      const { id } = await response.json()
      router.push(`/paste/${id}`)
    } else {
      toast({
        title: "Error",
        description: "Failed to create paste",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Paste</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here..."
          className="min-h-[200px]"
        />
        <Button type="submit">Create Paste</Button>
      </form>
    </div>
  )
}