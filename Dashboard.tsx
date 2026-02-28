import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentList } from "./DocumentList";
import { DocumentViewer } from "./DocumentViewer";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface DashboardProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export function Dashboard({ isDarkMode, setIsDarkMode }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'upload'>('overview');
  const [selectedDocument, setSelectedDocument] = useState<Id<"documents"> | null>(null);
  
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const documents = useQuery(api.documents.getUserDocuments);
  const userProfile = useQuery(api.users.getUserProfile);

  const recentDocuments = documents?.slice(0, 5) || [];
  const completedDocuments = documents?.filter(doc => doc.status === 'completed') || [];
  const processingDocuments = documents?.filter(doc => doc.status === 'processing') || [];

  if (selectedDocument) {
    return (
      <DocumentViewer
        documentId={selectedDocument}
        onBack={() => setSelectedDocument(null)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LU</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Legal Uplifter
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {loggedInUser?.email?.split('@')[0]}
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'documents', label: 'Documents', icon: '📄' },
            { id: 'upload', label: 'Upload', icon: '⬆️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {documents?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📄</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed Analysis</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {completedDocuments.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {processingDocuments.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">⏳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Documents</h2>
              </div>
              <div className="p-6">
                {recentDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        onClick={() => setSelectedDocument(doc._id)}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.category === 'business' ? 'bg-blue-100 dark:bg-blue-900' :
                            doc.category === 'citizen' ? 'bg-green-100 dark:bg-green-900' :
                            'bg-purple-100 dark:bg-purple-900'
                          }`}>
                            <span className="text-lg">
                              {doc.category === 'business' ? '🏢' : 
                               doc.category === 'citizen' ? '👥' : '🎓'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{doc.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {doc.category} • {doc.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.riskLevel && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              doc.riskLevel === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              doc.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {doc.riskLevel} risk
                            </span>
                          )}
                          <span className="text-gray-400">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No documents yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Upload your first legal document to get started
                    </p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200"
                    >
                      Upload Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <DocumentList
            documents={documents || []}
            onSelectDocument={setSelectedDocument}
          />
        )}

        {activeTab === 'upload' && (
          <DocumentUpload onUploadComplete={() => setActiveTab('documents')} />
        )}
      </div>
    </div>
  );
}
