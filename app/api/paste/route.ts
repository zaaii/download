import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const PASTES_DIR = path.join(process.cwd(), 'pastes')

export async function POST(request: Request) {
  const { content } = await request.json()
  const id = crypto.randomBytes(4).toString('hex')
  const filePath = path.join(PASTES_DIR, `${id}.txt`)

  await fs.mkdir(PASTES_DIR, { recursive: true })
  await fs.writeFile(filePath, content)

  return NextResponse.json({ id })
}