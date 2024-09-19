import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const PASTES_DIR = path.join(process.cwd(), 'pastes')

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const filePath = path.join(PASTES_DIR, `${params.id}.txt`)

  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json({ error: 'Paste not found' }, { status: 404 })
  }
}