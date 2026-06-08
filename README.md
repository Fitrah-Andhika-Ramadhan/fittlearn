# FitLearned - AI Document Summarizer

![FitLearned Logo](https://via.placeholder.com/200x80/2563eb/ffffff?text=FitLearned)

**FitLearned** adalah platform AI-powered untuk merangkum dokumen PDF dan Word, membantu mahasiswa dan profesional menghemat waktu belajar dengan menghasilkan ringkasan yang mudah dipahami dan poin-poin kunci.

## 🚀 Features

### ✨ Core Features
- **AI Document Summarization**: Ringkasan otomatis dokumen PDF dan Word
- **Multi-Format Support**: Support PDF, DOC, DOCX
- **Indonesian Language**: Summary dalam bahasa Indonesia
- **Key Points Extraction**: Ekstraksi poin-poin penting
- **Real-time Processing**: Proses dokumen dengan cepat

### 📊 Management Features
- **CRUD Operations**: Create, Read, Update, Delete summaries
- **File Management**: Upload, organize, dan manage study files
- **Search & Filter**: Pencarian dan filter berdasarkan subject, semester, category
- **Export Options**: Export summary ke JSON format
- **Dashboard Analytics**: Statistics dan overview data

### 🎨 UI/UX Features
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Modern Interface**: Clean dan user-friendly design
- **Dark/Light Theme**: Support untuk berbagai preferensi
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks + Custom Hooks

### Backend Simulation
- **Storage**: localStorage (browser storage)
- **Data Management**: Custom storage utilities
- **File Processing**: Client-side file handling

### Development Tools
- **Package Manager**: npm/yarn
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

## 📁 Project Structure

\`\`\`
fitlearned/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard page
│   ├── files/                   # File management page
│   ├── portfolio/               # Portfolio page (legacy)
│   ├── summarizer/              # Main summarizer page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage (Portfolio)
├── components/
│   └── ui/                      # shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── hooks/                       # Custom React hooks
│   ├── useFiles.ts             # File management hook
│   ├── useSummaries.ts         # Summary management hook
│   └── use-mobile.ts           # Mobile detection hook
├── lib/                        # Utility libraries
│   ├── storage.ts              # localStorage utilities
│   └── utils.ts                # General utilities
├── public/                     # Static assets
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore rules
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
\`\`\`

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/Fitrah-Andhika-Ramadhan/fitlearned.git
cd fitlearned
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# atau
yarn install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
# atau
yarn dev
\`\`\`

### 4. Open Browser
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📖 Usage Guide

### 1. Upload Document
1. Kunjungi halaman **Summarizer** (`/summarizer`)
2. Klik **Choose File** dan pilih dokumen PDF/Word
3. Klik **Generate Summary** untuk memproses

### 2. Edit Summary
1. Setelah summary dibuat, Anda bisa edit:
   - **Title**: Ubah judul dokumen
   - **Summary**: Edit ringkasan
   - **Key Points**: Tambah/edit/hapus poin kunci
2. Klik **Save Summary** untuk menyimpan

### 3. Manage Files
1. Kunjungi halaman **My Files** (`/files`)
2. **Upload**: Klik tombol upload untuk menambah file baru
3. **Filter**: Gunakan filter berdasarkan subject, semester, category
4. **Actions**: View, download, edit, atau delete file

### 4. Dashboard Overview
1. Kunjungi **Dashboard** (`/dashboard`)
2. Lihat statistics summary Anda
3. Search dan manage semua summary
4. Edit atau delete summary yang ada

## 🔧 Configuration

### Environment Variables
Tidak ada environment variables yang diperlukan untuk development. Semua data disimpan di localStorage browser.

### Customization
Anda bisa customize:

#### Colors (tailwind.config.ts)
\`\`\`typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
\`\`\`

#### AI Summary Logic (app/summarizer/page.tsx)
\`\`\`typescript
// Customize summary generation logic
const handleSummarize = async () => {
  // Add your custom AI integration here
  // Currently uses rule-based summarization
}
\`\`\`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Upload PDF file
- [ ] Upload Word file
- [ ] Generate summary
- [ ] Edit summary
- [ ] Save summary
- [ ] Delete summary
- [ ] Search summaries
- [ ] Filter files
- [ ] Export summary
- [ ] Responsive design

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly buttons
- Swipe gestures
- Optimized file upload
- Responsive navigation

## 🔒 Data Privacy

### Data Storage
- **Local Storage**: Semua data disimpan di browser user
- **No Server**: Tidak ada data yang dikirim ke server
- **Privacy First**: Data tidak dibagikan dengan pihak ketiga

### File Processing
- **Client-Side**: Semua processing dilakukan di browser
- **No Upload**: File tidak di-upload ke server
- **Secure**: File hanya diproses secara lokal

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Deploy otomatis

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Netlify
1. Build project: `npm run build`
2. Upload `out/` folder ke Netlify
3. Configure redirects untuk SPA

### Manual Deployment
\`\`\`bash
# Build static files
npm run build
npm run export

# Upload 'out' folder ke hosting
\`\`\`

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive commit messages

### Pull Request Guidelines
- Describe changes clearly
- Include screenshots for UI changes
- Test on multiple browsers
- Update documentation if needed

## 🐛 Troubleshooting

### Common Issues

#### 1. File Upload Not Working
\`\`\`bash
# Check file size (max 10MB)
# Check file format (PDF, DOC, DOCX only)
# Clear browser cache
\`\`\`

#### 2. Summary Not Generating
\`\`\`bash
# Check browser console for errors
# Try with different file
# Refresh page and try again
\`\`\`

#### 3. Data Not Persisting
\`\`\`bash
# Check if localStorage is enabled
# Clear browser data and try again
# Check browser storage quota
\`\`\`

#### 4. Responsive Issues
\`\`\`bash
# Clear browser cache
# Check viewport meta tag
# Test on different devices
\`\`\`

## 📊 Performance

### Optimization Tips
- **File Size**: Keep uploaded files under 5MB for best performance
- **Browser**: Use modern browsers for optimal experience
- **Storage**: Clear old data periodically to free up space

### Performance Metrics
- **First Load**: < 2 seconds
- **File Processing**: < 5 seconds
- **Navigation**: < 1 second
- **Search**: Real-time

## 🔄 Updates & Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ AI document summarization
- ✅ File management system
- ✅ CRUD operations
- ✅ Responsive design
- ✅ Indonesian language support

### Planned Features (v1.1.0)
- [ ] Real AI integration (OpenAI/Gemini)
- [ ] User authentication
- [ ] Cloud storage integration
- [ ] Collaboration features
- [ ] Mobile app

## 📞 Support

### Contact Information
- **Developer**: Fitrah Andhika Ramadhan
- **Email**: fitrah.andhika@email.com
- **Phone**: +62 877 6028 7039
- **GitHub**: [@Fitrah-Andhika-Ramadhan](https://github.com/Fitrah-Andhika-Ramadhan)
- **Location**: Bandung, Indonesia

### Getting Help
1. Check this documentation first
2. Search existing GitHub issues
3. Create new issue with detailed description
4. Contact developer directly for urgent issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Telkom University** - Educational support
- **Next.js Team** - Amazing framework
- **Vercel** - Hosting platform
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ by Fitrah Andhika Ramadhan**

*Mahasiswa S1 Sistem Informasi, Telkom University*
