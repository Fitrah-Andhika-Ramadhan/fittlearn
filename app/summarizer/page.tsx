"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Brain, Download, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useSummaries } from "@/hooks/useSummaries"
import { useRouter } from "next/navigation"

export default function SummarizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState("")
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const { createSummary } = useSummaries()
  const router = useRouter()
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    if (localeCookie) {
      setLang(localeCookie.split('=')[1]);
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleSummarize = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name })
      });

      if (!res.ok) throw new Error("Failed to fetch summary");

      const data = await res.json();
      setSummary(data.summary || "No summary generated.");
      setKeyPoints(data.keyPoints || []);
    } catch (error) {
      console.error(error);
      alert("Failed to generate summary with AI.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!summary || !title) {
      alert("Please generate a summary first!")
      return
    }

    setIsSaving(true)

    try {
      const newSummary = createSummary({
        title,
        summary,
        keyPoints,
        fileType: file?.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        fileName: file?.name || "Unknown file",
        fileSize: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "0 MB",
      })

      alert("Summary saved successfully!")

      // Reset form
      setFile(null)
      setSummary("")
      setKeyPoints([])
      setTitle("")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      alert("Error saving summary. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    if (!summary) return

    const exportData = {
      title,
      summary,
      keyPoints,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_summary.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full text-white">
      {/* Header removed as it is now in layout.tsx */}
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">{lang === 'id' ? 'Ringkasan Dokumen' : 'Document Summarizer'}</h1>
            <p className="text-purple-200">{lang === 'id' ? 'Unggah dokumen PDF atau Word Anda untuk mendapatkan ringkasan cerdas' : 'Upload your PDF or Word document to get an intelligent summary'}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  {lang === 'id' ? 'Unggah Dokumen' : 'Upload Document'}
                </CardTitle>
                <CardDescription>{lang === 'id' ? 'Pilih dokumen PDF atau Word untuk diringkas' : 'Select a PDF or Word document to summarize'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file">{lang === 'id' ? 'Pilih File' : 'Choose File'}</Label>
                  <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="mt-1" />
                </div>

                {file && (
                  <div className="flex items-center p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-400 mr-2" />
                    <div className="flex-1">
                      <span className="text-sm text-purple-200 font-medium">{file.name}</span>
                      <p className="text-xs text-purple-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                )}

                <Button onClick={handleSummarize} disabled={!file || isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {lang === 'id' ? 'Memproses Dokumen...' : 'Processing Document...'}
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      {lang === 'id' ? 'Buat Ringkasan' : 'Generate Summary'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Summary Results */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl text-white">
              <CardHeader>
                <CardTitle>{lang === 'id' ? 'Hasil Ringkasan' : 'Summary Results'}</CardTitle>
                <CardDescription>{lang === 'id' ? 'Ringkasan dan poin penting buatan AI' : 'AI-generated summary and key points'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary ? (
                  <>
                    <div>
                      <Label htmlFor="title">{lang === 'id' ? 'Judul Dokumen' : 'Document Title'}</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={lang === 'id' ? 'Masukkan judul dokumen' : 'Enter document title'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="summary">{lang === 'id' ? 'Ringkasan' : 'Summary'}</Label>
                      <Textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>{lang === 'id' ? 'Poin Penting' : 'Key Points'}</Label>
                      <div className="mt-2 space-y-2">
                        {keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <Input
                              value={point}
                              onChange={(e) => {
                                const newPoints = [...keyPoints]
                                newPoints[index] = e.target.value
                                setKeyPoints(newPoints)
                              }}
                              className="text-sm border-none p-0 h-auto bg-transparent focus-visible:ring-0 text-white"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setKeyPoints([...keyPoints, ""])}
                          className="mt-2"
                        >
                          {lang === 'id' ? 'Tambah Poin Penting' : 'Add Key Point'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {lang === 'id' ? 'Menyimpan...' : 'Saving...'}
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {lang === 'id' ? 'Simpan Ringkasan' : 'Save Summary'}
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        {lang === 'id' ? 'Ekspor' : 'Export'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-white/20" />
                    <p>{lang === 'id' ? 'Unggah dokumen untuk melihat ringkasan di sini' : 'Upload a document to see the summary here'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
