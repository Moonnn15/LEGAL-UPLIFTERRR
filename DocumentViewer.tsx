import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentViewerProps {
  documentId: Id<"documents">;
  onBack: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export function DocumentViewer({ documentId, onBack, isDarkMode, setIsDarkMode }: DocumentViewerProps) {
  const document = useQuery(api.documents.getDocument, { documentId });
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis' | 'notes'>('summary');
  
  const updateNotes = useMutation(api.documents.updateDocumentNotes);

  const handleSaveNotes = async () => {
    try {
      await updateNotes({ documentId, notes });
      toast.success('Notes saved successfully');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                ←
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {document.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {document.category} Document
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {document.riskLevel && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(document.riskLevel)}`}>
                  {document.riskLevel} risk
                </span>
              )}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            {document.status === 'processing' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                      AI Analysis in Progress
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Your document is being analyzed. This usually takes 1-2 minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {[
                { id: 'summary', label: 'Summary', icon: '📋' },
                { id: 'analysis', label: 'Analysis', icon: '🔍' },
                { id: 'notes', label: 'Notes', icon: '📝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Document Summary
                    </h3>
                    {document.summary ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {document.summary}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        Summary will appear here once AI analysis is complete.
                      </p>
                    )}
                  </div>

                  {document.keyPoints && document.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {document.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Legal Analysis
                    </h3>
                    
                    {document.glossaryTerms && document.glossaryTerms.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Legal Terms & Definitions
                        </h4>
                        <div className="grid gap-4">
                          {document.glossaryTerms.map((term, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                                {term.term}
                              </h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {term.definition}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        Legal analysis will appear here once AI processing is complete.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Notes
                    </h3>
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>
                  <textarea
                    value={notes || document.notes || ''}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes about this document..."
                    className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Document Info
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {document.category}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {document.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(document._creationTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {document.fileUrl && (
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>📄</span>
                    <span>View Original PDF</span>
                  </a>
                )}
                <button className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <span>💬</span>
                  <span>Chat About Document</span>
                </button>
                <button className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <span>📊</span>
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
