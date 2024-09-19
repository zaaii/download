'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from '@/hooks/use-toast'

export default function Home() {
  const [content, setContent] = useState('')
  const [pasteCode, setPasteCode] = useState('')
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

    // if (!pasteCode.trim()) {
    //   toast({
    //     title: "Error",
    //     description: "Please enter a paste code",
    //     variant: "destructive",
    //   })
    //   return
    // }

    const response = await fetch('/api/paste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, pasteCode }),
    })

    if (response.ok) {
      const { id } = await response.json()
      router.push(`/paste/${id}`)
    } else {
      const errorData = await response.json()
      toast({
        title: "Error",
        description: errorData.error || "Failed to create paste",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className='w-full max-w-3xl p-4'>
      <h1 className="text-2xl font-bold mb-4 text-center">Create a New Paste</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pasteCode" className="block text-sm font-medium text-gray-700 mb-1">
            Paste Code (optional)
          </label>
          <Input
            id="pasteCode"
            value={pasteCode}
            onChange={(e) => setPasteCode(e.target.value)}
            placeholder="Enter a custom paste code (leave blank for auto-generated)"
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here..."
          className="min-h-[200px]"
        />
        <Button type="submit">Create Paste</Button>
      </form>
      </div>
    </div>
  )
}