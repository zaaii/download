'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Copy, Link as LinkIcon, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CopyButtonsProps {
  content: string
  id: string
}

export default function CopyButtons({ content, id }: CopyButtonsProps) {
  const [copiedContent, setCopiedContent] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)

  const copyToClipboard = async (text: string, type: 'content' | 'link') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'content') {
        setCopiedContent(true)
        setTimeout(() => setCopiedContent(false), 2000)
      } else {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      }
      toast({
        title: "Copied!",
        description: `${type === 'content' ? 'Paste content' : 'Paste link'} copied to clipboard.`,
      })
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(content, 'content')}
      >
        {copiedContent ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <Copy className="h-4 w-4 mr-2" />
        )}
        Copy Content
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/paste/${id}`, 'link')}
      >
        {copiedLink ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <LinkIcon className="h-4 w-4 mr-2" />
        )}
        Copy Link
      </Button>
    </div>
  )
}