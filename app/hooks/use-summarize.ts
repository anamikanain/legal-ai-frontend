"use client"

// import { checkSummarize } from "../lib/utils"
import { useCallback, useEffect, useState } from "react"

export type SummarizeModal = {
  summarize: (input: string) => Promise<string>
  summarizeStreaming: (input: string) => Promise<string>
  destroy: () => Promise<void>
  ready: Promise<void>
  addEventListener: (type: string, listener: (event: any) => void) => void
}

// Type for the Summarizer API
type SummarizerAPI = {
  create: () => Promise<SummarizeModal>
}

export const useSummarize = () => {
  const [checking, setChecking] = useState(true)
  const [canSummarize, setCanSummarize] = useState<null | boolean>(null)
  const [error, setError] = useState<null | string>(null)

  const summarize = useCallback(async (input: string) => {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error("Summarizer API not available")
    }

    const summarizer = window.ai.summarizer as SummarizerAPI
    const modal = await summarizer.create()
    const result = await modal.summarize(input)
    await modal.destroy()
    return result
  }, [])

  const summarizeStreaming = useCallback(async (input: string) => {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error("Summarizer API not available")
    }

    const summarizer = window.ai.summarizer as SummarizerAPI
    const modal = await summarizer.create()
    const result = await modal.summarizeStreaming(input)
    return result
  }, [])

  // const update = useCallback(async () => {
  //   try {
  //     await checkSummarize()
  //     setCanSummarize(true)
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       setError(e.message)
  //     }
  //   } finally {
  //     setChecking(false)
  //   }
  // }, [])

  // useEffect(() => {
  //   update()
  // }, [update])

  return { error, checking, summarize, canSummarize, summarizeStreaming }
}
