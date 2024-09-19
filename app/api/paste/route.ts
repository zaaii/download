import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const PASTES_DIR = path.join(process.cwd(), 'pastes')

export async function POST(request: Request) {
  const { content, pasteCode } = await request.json()
  
  let id = pasteCode.trim()
  if (!id) {
    id = crypto.randomBytes(4).toString('hex')
  } else {
    // Check if the custom paste code already exists
    const existingFilePath = path.join(PASTES_DIR, `${id}.txt`)
    try {
      await fs.access(existingFilePath)
      return NextResponse.json({ error: 'Paste code already exists' }, { status: 400 })
    } catch (error) {
      // File doesn't exist, so we can use this paste code
    }
  }

  const filePath = path.join(PASTES_DIR, `${id}.txt`)

  await fs.mkdir(PASTES_DIR, { recursive: true })
  await fs.writeFile(filePath, content)

  return NextResponse.json({ id })
}