import { Button } from "@/components/ui/button"
import { Brain, Upload, Lock } from "lucide-react"
import Link from "next/link"
import { CMSPortfolioContent } from "@/components/cms-portfolio-content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FitLearned</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="#skills" className="text-gray-600 hover:text-blue-600 transition-colors">
                Skills
              </Link>
              <Link href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors">
                Projects
              </Link>
              <Link href="#experience" className="text-gray-600 hover:text-blue-600 transition-colors">
                Experience
              </Link>
              <Link href="/summarizer" className="text-gray-600 hover:text-blue-600 transition-colors">
                Summarizer
              </Link>
              <Link href="/files" className="text-gray-600 hover:text-blue-600 transition-colors">
                My Files
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Lock className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
              <Link href="/summarizer">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Try FitLearned
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* CMS-Driven Content */}
      <CMSPortfolioContent />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">FitLearned</span>
              </div>
              <p className="text-gray-400">Making document summarization accessible and efficient for everyone.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Document Upload</li>
                <li>AI Summarization</li>
                <li>Key Points Extraction</li>
                <li>Export Options</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li>PDF Summarizer</li>
                <li>Word Processor</li>
                <li>Dashboard</li>
                <li>User Management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: fitrah.andhika@email.com</li>
                <li>Phone: +62 877 6028 7039</li>
                <li>GitHub: Fitrah-Andhika-Ramadhan</li>
                <li>Location: Bandung, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FitLearned. Built with Next.js and AI technology by Fitrah Andhika Ramadhan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
