import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Upload,
  Sparkles,
  Database,
  Layers,
  CheckCircle2,
  Tag,
  Eye,
  ThumbsUp,
  Plus,
} from 'lucide-react';
import { mockKnowledgeArticles, mockRAGDocuments } from '../../data/knowledgeData';
import { KnowledgeArticle, RAGDocument } from '../../types';

export const KnowledgeBaseView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'articles' | 'rag' | 'upload'>('articles');
  const [articles] = useState<KnowledgeArticle[]>(mockKnowledgeArticles);
  const [documents, setDocuments] = useState<RAGDocument[]>(mockRAGDocuments);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(articles[0]);
  const [uploading, setUploading] = useState(false);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setTimeout(() => {
        const newDoc: RAGDocument = {
          id: `doc-${Date.now()}`,
          fileName: file.name,
          fileType: 'pdf',
          fileSizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(1)) || 1.2,
          uploadedBy: 'Current User',
          uploadedAt: 'Just now',
          chunkCount: 18,
          vectorIndexed: true,
          summary: 'Auto-chunked & indexed into vector database for enterprise RAG retrieval.',
          tags: ['Uploaded', 'RAG'],
        };
        setDocuments([newDoc, ...documents]);
        setUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Enterprise Knowledge & RAG
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Knowledge Base & RAG Index</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Centralized SOPs, sprint wikis, and vector database document indexing for AI RAG assistant.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
          <button
            onClick={() => setActiveSubTab('articles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              activeSubTab === 'articles' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Wiki Articles
          </button>
          <button
            onClick={() => setActiveSubTab('rag')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              activeSubTab === 'rag' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            RAG Documents ({documents.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">Knowledge Wiki</h2>
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedArticle?.id === art.id
                    ? 'bg-indigo-50 border-indigo-400 text-zinc-900 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
                }`}
              >
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-zinc-100 text-zinc-700 font-mono">
                  {art.category}
                </span>
                <h3 className="font-bold text-xs mt-1.5">{art.title}</h3>
                <div className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
                  <span>By {art.author}</span>
                  <span>{art.viewsCount} views</span>
                </div>
              </div>
            ))}
          </div>

          {selectedArticle && (
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-full uppercase">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl font-bold text-zinc-900 mt-1">{selectedArticle.title}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{selectedArticle.viewsCount}</span>
                  <ThumbsUp className="w-3.5 h-3.5 ml-2" />
                  <span>{selectedArticle.helpfulCount}</span>
                </div>
              </div>

              <div className="prose prose-sm text-zinc-700 font-sans leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'rag' && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="bg-white p-6 rounded-2xl border border-dashed border-zinc-300 text-center space-y-3">
            <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-900">Upload Documents for Vector Embedding & RAG</h3>
            <p className="text-xs text-zinc-500">Supports PDF, DOCX, Markdown, TXT. Automatic chunking & similarity indexing.</p>
            <label className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs">
              {uploading ? 'Processing & Chunking...' : 'Select File'}
              <input type="file" onChange={handleSimulateUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Document Name</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4">Chunk Count</th>
                  <th className="p-4">Vector Index Status</th>
                  <th className="p-4">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      {doc.fileName}
                    </td>
                    <td className="p-4">{doc.uploadedBy}</td>
                    <td className="p-4 font-mono">{doc.chunkCount} Chunks</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        Indexed
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500 max-w-xs truncate">{doc.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
