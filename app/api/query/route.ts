import { type NextRequest, NextResponse } from "next/server"
import { OpenAI } from "langchain/llms/openai"
import { RetrievalQAChain } from "langchain/chains"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"

// In-memory storage for documents (in a real app, you'd use a database)
let vectorStore: MemoryVectorStore | null = null

export async function POST(request: NextRequest) {
  try {
    const { query, documents } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 })
    }

    // If we don't have a vector store yet but have documents, create one
    if (!vectorStore && documents && documents.length > 0) {
      const embeddings = new OpenAIEmbeddings()
      vectorStore = await MemoryVectorStore.fromTexts(
        documents.map((doc: any) => doc.content),
        documents.map((doc: any, i: number) => ({ id: i, ...doc.metadata })),
        embeddings,
      )
    }

    if (!vectorStore) {
      return NextResponse.json(
        {
          error: "No documents have been uploaded yet",
        },
        { status: 400 },
      )
    }

    // Create a retrieval chain
    const model = new OpenAI()
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever())

    // Query the documents
    const response = await chain.call({
      query: query,
    })

    return NextResponse.json({
      answer: response.text,
      sources: response.sourceDocuments || [],
    })
  } catch (error) {
    console.error("Error querying documents:", error)
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 })
  }
}

