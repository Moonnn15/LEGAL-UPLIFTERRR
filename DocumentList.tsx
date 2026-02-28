import { Id } from "../../convex/_generated/dataModel";

interface Document {
  _id: Id<"documents">;
  title: string;
  category: "business" | "citizen" | "student";
  status: "uploaded" | "processing" | "completed";
  riskLevel?: "low" | "medium" | "high";
  _creationTime: number;
  summary?: string;
  keyPoints?: string[];
}

interface DocumentListProps {
  documents: Document[];
  onSelectDocument: (id: Id<"documents">) => void;
}

export function DocumentList({ documents, onSelectDocument }: DocumentListProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return '🏢';
      case 'citizen': return '👥';
      case 'student': return '🎓';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'uploaded': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No documents uploaded yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your first legal document to get started with AI analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Documents ({documents.length})
        </h2>
      </div>

      <div className="grid gap-6">
        {documents.map((doc) => (
          <div
            key={doc._id}
            onClick={() => onSelectDocument(doc._id)}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  doc.category === 'business' ? 'bg-blue-100 dark:bg-blue-900' :
                  doc.category === 'citizen' ? 'bg-green-100 dark:bg-green-900' :
                  'bg-purple-100 dark:bg-purple-900'
                }`}>
                  {getCategoryIcon(doc.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {doc.title}
                  </h3>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {doc.category}
                    </span>
                    {doc.riskLevel && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(doc.riskLevel)}`}>
                        {doc.riskLevel} risk
                      </span>
                    )}
                  </div>

                  {doc.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {doc.summary}
                    </p>
                  )}

                  {doc.keyPoints && doc.keyPoints.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {doc.keyPoints.slice(0, 3).map((point, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {point.length > 30 ? `${point.substring(0, 30)}...` : point}
                        </span>
                      ))}
                      {doc.keyPoints.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          +{doc.keyPoints.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(doc._creationTime).toLocaleDateString()}
                </span>
                <div className="flex items-center text-teal-600 dark:text-teal-400">
                  <span className="text-sm font-medium">View Details</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
