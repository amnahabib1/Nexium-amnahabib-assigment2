'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {
  const [url, setUrl] = useState('')
  const [fullText, setFullText] = useState('')
  const [summary, setSummary] = useState('')
  const [urdu, setUrdu] = useState('')

  const handleSummarise = async () => {
    // 🟡 Fake scraped text from blog
    const fakeScrapedText = `This is dummy scraped content from the blog at ${url}. It contains a lot of valuable information about the topic.`
    setFullText(fakeScrapedText)

    // 🟢 Static logic: first 15 words
    const staticSummary = fakeScrapedText.split(' ').slice(0, 15).join(' ') + '...'
    setSummary(staticSummary)

    // 🔵 Urdu translation using dictionary
    const urduDictionary: Record<string, string> = {
      "This is dummy scraped content from the blog at": "یہ بلاگ سے حاصل کردہ فرضی مواد ہے",
      "It contains a lot of valuable information about the topic.": "اس میں موضوع کے بارے میں قیمتی معلومات شامل ہیں۔"
    }

    const translated = staticSummary
      .split('. ')
      .map((line) => urduDictionary[line.trim()] || 'ترجمہ دستیاب نہیں۔')
      .join(' ')
    setUrdu(translated)

    // 🔴 Save summary to Supabase
    await fetch('/api/save-summary', {
      method: 'POST',
      body: JSON.stringify({ url, summary: staticSummary, translated }),
    })

    // 🟠 Save full text to MongoDB
    await fetch('/api/save-fulltext', {
      method: 'POST',
      body: JSON.stringify({ url, fullText: fakeScrapedText }),
    })
  }

  return (
    <main className="max-w-xl mx-auto mt-10 space-y-4 p-4">
      <Input
        placeholder="Paste blog URL here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleSummarise}>Summarise Blog</Button>

      {summary && (
        <div className="space-y-3">
          <Textarea value={fullText} readOnly />
          <Textarea value={summary} readOnly />
          <Textarea value={urdu} readOnly />
        </div>
      )}
    </main>
  )
}
