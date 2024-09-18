import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, uniqueFilename);

    // Write the file
    await writeFile(filePath, buffer);

    // Generate the download URL
    const downloadUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ downloadUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}