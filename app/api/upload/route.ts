import { type NextRequest, NextResponse } from "next/server"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { DocxLoader } from "langchain/document_loaders/fs/docx"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import * as fs from "node:fs/promises"

// In-memory storage for documents (in a real app, you'd use a database)
let vectorStore: MemoryVectorStore | null = null

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a temporary file path
    const tempFilePath = `/tmp/${file.name}`
    await fs.writeFile(tempFilePath, buffer)

    // Load document based on file type
    let docs
    if (file.name.endsWith(".pdf")) {
      const loader = new PDFLoader(tempFilePath)
      docs = await loader.load()
    } else if (file.name.endsWith(".docx")) {
      const loader = new DocxLoader(tempFilePath)
      docs = await loader.load()
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const splitDocs = await textSplitter.splitDocuments(docs)

    // Create vector store with embeddings
    const embeddings = new OpenAIEmbeddings()
    vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)

    return NextResponse.json({
      message: "File processed successfully",
      documentCount: splitDocs.length,
      fileName: file.name,
    })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

export async function GET() {
  if (!vectorStore) {
    return NextResponse.json({ documents: [] })
  }

  // This is a simplified example - in a real app you'd have proper document retrieval
  const results = await vectorStore.similaritySearch("", 5)

  return NextResponse.json({
    documents: results.map((doc) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
    })),
  })
}

