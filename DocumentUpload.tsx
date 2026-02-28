import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface DocumentUploadProps {
  onUploadComplete: () => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'business' | 'citizen' | 'student'>('business');
  const [documentTitle, setDocumentTitle] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const uploadDocument = useMutation(api.documents.uploadDocument);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    if (!documentTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    setIsUploading(true);

    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await result.json();

      // Extract text from PDF (simplified - in real app would use PDF.js)
      const originalText = `[PDF Content] Document: ${documentTitle}\nCategory: ${selectedCategory}\nFile: ${file.name}\nSize: ${file.size} bytes\n\nThis is a placeholder for extracted PDF text. In a production app, you would use PDF.js or similar library to extract actual text content from the PDF file.`;

      // Save document to database
      await uploadDocument({
        title: documentTitle,
        category: selectedCategory,
        fileId: storageId,
        originalText,
      });

      toast.success('Document uploaded successfully! AI analysis starting...');
      setDocumentTitle('');
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Legal Document
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your PDF document for AI-powered legal analysis
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Document Category
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'business', label: 'Business', icon: '🏢', desc: 'Contracts, agreements, compliance' },
              { id: 'citizen', label: 'Citizen', icon: '👥', desc: 'Consumer rights, legal notices' },
              { id: 'student', label: 'Student', icon: '🎓', desc: 'Academic policies, housing' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white">{category.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{category.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Document Title */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Title
          </label>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Enter a descriptive title for your document"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* File Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            isDragging
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Uploading and analyzing document...
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This may take a few moments
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">📄</div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Supports PDF files up to 10MB
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
              >
                Choose File
              </button>
            </div>
          )}
        </div>

        {/* Upload Process Steps */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Upload PDF', desc: 'Secure file upload' },
            { step: 2, title: 'Extract Text', desc: 'AI text extraction' },
            { step: 3, title: 'Analyze Content', desc: 'Legal analysis' },
            { step: 4, title: 'Generate Summary', desc: 'Key insights' }
          ].map((item) => (
            <div key={item.step} className="text-center p-4">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                {item.step}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
