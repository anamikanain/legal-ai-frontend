export type AIModelAvailability = "readily" | "after-download" | "no"

export type SummarizeModal = {
  summarize: (text: string) => Promise<string>
  summarizeStreaming: (text: string) => Promise<string>
  destroy: () => Promise<void>
  ready: Promise<void>
  addEventListener: (type: string, listener: (event: any) => void) => void
}

export type SummarizerAPI = {
  create: () => Promise<SummarizeModal>
}

export type AIPromptModel = {
  prompt: (text: string) => Promise<string>
  promptStreaming: (text: string) => AsyncIterable<string>
  destroy: () => void
}

export type AiApi = {
  getAvailability: () => Promise<{ available: AIModelAvailability }>
  create: (options: { topK?: number; temperature?: number }) => Promise<AIPromptModel>
  summarizer?: unknown // Used cautiously with type guards and assertions
}

declare global {
  interface Window {
    ai?: AiApi
  }
}
