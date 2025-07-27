"use client"

import type React from "react"

import { useState } from "react"
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleSummarize = async () => {
    if (!file) return

    setIsProcessing(true)

    // Simulate AI processing with realistic delay
    setTimeout(
      () => {
        // Generate Indonesian summaries based on file name and type
        const fileName = file.name.toLowerCase()

        let generatedSummary = ""
        let generatedKeyPoints: string[] = []

        // Algoritma dan Struktur Data
        if (fileName.includes("algoritma") || fileName.includes("struktur data") || fileName.includes("algorithm")) {
          generatedSummary = `Dokumen ini membahas konsep fundamental algoritma dan struktur data dalam pemrograman. Materi mencakup berbagai jenis algoritma sorting seperti bubble sort, merge sort, dan quick sort, serta struktur data dasar seperti array, linked list, stack, dan queue. Dokumen juga menjelaskan kompleksitas waktu dan ruang dari setiap algoritma, disertai dengan contoh implementasi dalam bahasa pemrograman. Pembahasan dilengkapi dengan analisis performa dan kapan sebaiknya menggunakan algoritma tertentu dalam kasus nyata.`

          generatedKeyPoints = [
            "Algoritma sorting: bubble sort, merge sort, quick sort dengan kompleksitas O(n²) hingga O(n log n)",
            "Struktur data linear: array, linked list, stack (LIFO), queue (FIFO)",
            "Struktur data non-linear: tree, graph, dan hash table",
            "Analisis kompleksitas waktu (time complexity) dan ruang (space complexity)",
            "Implementasi praktis dalam bahasa pemrograman C++/Java",
            "Pemilihan algoritma yang tepat berdasarkan ukuran data dan kebutuhan performa",
          ]
        }
        // Database/Basis Data
        else if (
          fileName.includes("database") ||
          fileName.includes("basis data") ||
          fileName.includes("sql") ||
          fileName.includes("mysql")
        ) {
          generatedSummary = `Materi ini menguraikan konsep dasar sistem basis data relasional dan desain database. Pembahasan meliputi model Entity-Relationship (ER), normalisasi database untuk mengurangi redundansi data, dan teknik optimasi query SQL. Dokumen menjelaskan berbagai jenis relasi antar tabel (one-to-one, one-to-many, many-to-many) serta implementasi foreign key dan primary key. Materi juga mencakup transaksi database, ACID properties, dan teknik indexing untuk meningkatkan performa query.`

          generatedKeyPoints = [
            "Model ER (Entity-Relationship) untuk desain database yang efektif",
            "Normalisasi database: 1NF, 2NF, 3NF untuk mengurangi redundansi",
            "SQL query optimization dan penggunaan index untuk performa",
            "Jenis relasi: one-to-one, one-to-many, many-to-many",
            "ACID properties: Atomicity, Consistency, Isolation, Durability",
            "Implementasi primary key, foreign key, dan constraint database",
          ]
        }
        // Machine Learning/AI
        else if (
          fileName.includes("machine learning") ||
          fileName.includes("ml") ||
          fileName.includes("artificial intelligence") ||
          fileName.includes("ai")
        ) {
          generatedSummary = `Dokumen ini memberikan pengantar komprehensif tentang machine learning dan kecerdasan buatan. Materi mencakup perbedaan antara supervised learning, unsupervised learning, dan reinforcement learning. Pembahasan meliputi algoritma klasik seperti linear regression, decision tree, dan neural networks. Dokumen juga menjelaskan pentingnya preprocessing data, feature selection, dan evaluasi model menggunakan metrik seperti accuracy, precision, dan recall. Dilengkapi dengan studi kasus implementasi ML dalam berbagai industri.`

          generatedKeyPoints = [
            "Supervised learning: classification dan regression dengan labeled data",
            "Unsupervised learning: clustering dan dimensionality reduction",
            "Algoritma populer: linear regression, decision tree, random forest, SVM",
            "Data preprocessing: cleaning, normalization, feature engineering",
            "Model evaluation: accuracy, precision, recall, F1-score, confusion matrix",
            "Neural networks dan deep learning untuk pattern recognition",
          ]
        }
        // Pemrograman Web
        else if (
          fileName.includes("web") ||
          fileName.includes("html") ||
          fileName.includes("css") ||
          fileName.includes("javascript") ||
          fileName.includes("php") ||
          fileName.includes("laravel")
        ) {
          generatedSummary = `Materi pemrograman web ini membahas teknologi frontend dan backend untuk pengembangan aplikasi web modern. Pembahasan frontend mencakup HTML5 semantik, CSS3 dengan flexbox dan grid, serta JavaScript ES6+ untuk interaktivitas. Bagian backend menjelaskan penggunaan PHP dan framework Laravel untuk membangun API dan sistem manajemen database. Dokumen juga membahas konsep responsive design, web security, dan best practices dalam pengembangan web yang SEO-friendly.`

          generatedKeyPoints = [
            "HTML5 semantik dan struktur dokumen yang proper",
            "CSS3 advanced: flexbox, grid, animations, dan responsive design",
            "JavaScript ES6+: arrow functions, promises, async/await",
            "PHP dan Laravel framework untuk backend development",
            "RESTful API design dan implementasi CRUD operations",
            "Web security: SQL injection prevention, XSS protection, CSRF tokens",
          ]
        }
        // Jaringan Komputer
        else if (
          fileName.includes("jaringan") ||
          fileName.includes("network") ||
          fileName.includes("cisco") ||
          fileName.includes("routing")
        ) {
          generatedSummary = `Dokumen ini menjelaskan konsep fundamental jaringan komputer dan protokol komunikasi. Materi mencakup model OSI 7 layer dan TCP/IP stack, routing dan switching, serta konfigurasi perangkat jaringan. Pembahasan meliputi protokol seperti HTTP/HTTPS, FTP, DNS, dan DHCP. Dokumen juga membahas keamanan jaringan, firewall, VPN, dan troubleshooting masalah konektivitas jaringan. Dilengkapi dengan praktik konfigurasi router dan switch Cisco.`

          generatedKeyPoints = [
            "Model OSI 7 layer dan TCP/IP protocol stack",
            "Routing protocols: RIP, OSPF, BGP untuk network communication",
            "Switching concepts: VLAN, STP, port security",
            "Network protocols: HTTP/HTTPS, DNS, DHCP, FTP",
            "Network security: firewall, VPN, access control lists (ACL)",
            "Troubleshooting tools: ping, traceroute, netstat, wireshark",
          ]
        }
        // Sistem Operasi
        else if (
          fileName.includes("sistem operasi") ||
          fileName.includes("operating system") ||
          fileName.includes("linux") ||
          fileName.includes("windows")
        ) {
          generatedSummary = `Materi sistem operasi ini membahas konsep dasar pengelolaan sumber daya komputer oleh OS. Pembahasan meliputi manajemen proses, thread, dan scheduling algorithm. Dokumen menjelaskan manajemen memori virtual, paging, dan segmentasi. Materi juga mencakup sistem file, I/O management, dan sinkronisasi proses. Dilengkapi dengan praktik administrasi sistem Linux dan Windows, termasuk shell scripting dan command line interface.`

          generatedKeyPoints = [
            "Process management: creation, scheduling, synchronization",
            "Memory management: virtual memory, paging, segmentation",
            "File system: FAT, NTFS, ext4, file permissions dan access control",
            "I/O management dan device drivers",
            "Linux administration: shell commands, scripting, cron jobs",
            "Windows administration: registry, services, group policy",
          ]
        }
        // Matematika/Kalkulus
        else if (
          fileName.includes("matematika") ||
          fileName.includes("kalkulus") ||
          fileName.includes("calculus") ||
          fileName.includes("aljabar")
        ) {
          generatedSummary = `Dokumen matematika ini membahas konsep fundamental kalkulus diferensial dan integral. Materi mencakup limit fungsi, turunan (derivative), dan aplikasinya dalam optimasi. Pembahasan integral meliputi teknik integrasi substitusi, parsial, dan aplikasi dalam menghitung luas dan volume. Dokumen juga menjelaskan deret tak hingga, konvergensi, dan aplikasi kalkulus dalam pemecahan masalah fisika dan engineering. Dilengkapi dengan contoh soal dan penyelesaian step-by-step.`

          generatedKeyPoints = [
            "Limit fungsi dan kontinuitas untuk analisis perilaku fungsi",
            "Turunan (derivative): aturan rantai, produk, dan quotient rule",
            "Aplikasi turunan: optimasi, analisis grafik, related rates",
            "Integral: substitusi, parsial, trigonometri substitution",
            "Aplikasi integral: luas area, volume benda putar",
            "Deret tak hingga: konvergensi, Taylor series, Fourier series",
          ]
        }
        // Fisika
        else if (
          fileName.includes("fisika") ||
          fileName.includes("physics") ||
          fileName.includes("mekanika") ||
          fileName.includes("elektromagnetik")
        ) {
          generatedSummary = `Materi fisika ini membahas konsep fundamental mekanika klasik dan elektromagnetisme. Pembahasan mekanika meliputi kinematika, dinamika, hukum Newton, dan konservasi energi. Bagian elektromagnetisme menjelaskan medan listrik, medan magnet, hukum Gauss, dan persamaan Maxwell. Dokumen juga membahas gelombang elektromagnetik, optik, dan aplikasi fisika dalam teknologi modern. Dilengkapi dengan eksperimen laboratorium dan analisis data.`

          generatedKeyPoints = [
            "Kinematika: gerak lurus, gerak parabola, gerak melingkar",
            "Dinamika: hukum Newton, gaya, momentum, impuls",
            "Energi dan konservasi: energi kinetik, potensial, mekanik",
            "Elektrostatik: medan listrik, potensial listrik, kapasitor",
            "Magnetisme: medan magnet, induksi elektromagnetik, transformator",
            "Gelombang: interferensi, difraksi, polarisasi cahaya",
          ]
        }
        // Default untuk file lainnya
        else {
          generatedSummary = `Dokumen ini berisi materi akademik yang membahas konsep-konsep penting dalam bidang studi terkait. Pembahasan disusun secara sistematis mulai dari pengenalan dasar hingga aplikasi praktis. Materi dilengkapi dengan contoh-contoh konkret dan studi kasus yang relevan dengan kondisi di Indonesia. Dokumen juga menyertakan latihan soal dan pembahasan untuk memperdalam pemahaman. Referensi yang digunakan berasal dari sumber-sumber terpercaya baik domestik maupun internasional.`

          generatedKeyPoints = [
            "Konsep dasar dan fundamental yang mudah dipahami",
            "Aplikasi praktis dalam konteks Indonesia",
            "Contoh kasus nyata dan implementasi",
            "Latihan soal dengan pembahasan lengkap",
            "Referensi terpercaya untuk studi lanjutan",
            "Metodologi yang sesuai dengan kurikulum nasional",
          ]
        }

        setSummary(generatedSummary)
        setKeyPoints(generatedKeyPoints)
        setIsProcessing(false)
      },
      2000 + Math.random() * 2000,
    ) // Random delay between 2-4 seconds
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FitLearned</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/portfolio">
                <Button variant="outline">Portfolio</Button>
              </Link>
              <Link href="/files">
                <Button variant="outline">My Files</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">FitLearned - Document Summarizer</h1>
            <p className="text-gray-600">Upload your PDF or Word document to get an intelligent summary</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Document
                </CardTitle>
                <CardDescription>Select a PDF or Word document to summarize</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file">Choose File</Label>
                  <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="mt-1" />
                </div>

                {file && (
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="flex-1">
                      <span className="text-sm text-blue-800 font-medium">{file.name}</span>
                      <p className="text-xs text-blue-600">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                )}

                <Button onClick={handleSummarize} disabled={!file || isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Document...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Summary Results */}
            <Card>
              <CardHeader>
                <CardTitle>Summary Results</CardTitle>
                <CardDescription>AI-generated summary and key points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary ? (
                  <>
                    <div>
                      <Label htmlFor="title">Document Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter document title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Key Points</Label>
                      <div className="mt-2 space-y-2">
                        {keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <Input
                              value={point}
                              onChange={(e) => {
                                const newPoints = [...keyPoints]
                                newPoints[index] = e.target.value
                                setKeyPoints(newPoints)
                              }}
                              className="text-sm border-none p-0 h-auto bg-transparent"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setKeyPoints([...keyPoints, ""])}
                          className="mt-2"
                        >
                          Add Key Point
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Summary
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Upload a document to see the summary here</p>
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
