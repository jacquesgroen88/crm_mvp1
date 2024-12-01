import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Clock, Image as ImageIcon, X, ZoomIn, Upload } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import { format, formatDistanceToNow } from 'date-fns';
import type { Deal } from '../../types/deal';

interface DealNotesProps {
  deal: Deal;
}

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div ref={modalRef} className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={imageUrl}
          alt="Full size preview"
          className="max-w-full max-h-[85vh] rounded-lg"
        />
      </div>
    </div>
  );
};

export const DealNotes: React.FC<DealNotesProps> = ({ deal }) => {
  const [newNote, setNewNote] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fullSizePreview, setFullSizePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notes, addNote, loading, error, uploadProgress, subscribeToNotes } = useNotesStore();

  useEffect(() => {
    const unsubscribe = subscribeToNotes(deal.id);
    return () => {
      unsubscribe();
      // Cleanup preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [deal.id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!newNote.trim() && selectedImages.length === 0) return;

    try {
      await addNote({
        dealId: deal.id,
        content: newNote.trim(),
        type: 'note',
      }, selectedImages);
      
      setNewNote('');
      setSelectedImages([]);
      setPreviewUrls(prev => {
        prev.forEach(url => URL.revokeObjectURL(url));
        return [];
      });
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const imageFiles: File[] = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...imageFiles]);
      const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  return (
    <div className="bg-navy-900/50 rounded-lg border border-navy-700">
      <div className="px-6 py-4 border-b border-navy-700">
        <h3 className="text-sm font-medium text-white">Notes & Activity</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Note Input */}
        <div className="bg-navy-900 rounded-lg border border-navy-600">
          <textarea
            rows={3}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onPaste={handlePaste}
            placeholder="Add a note... (Paste images directly or use the upload button)"
            className="block w-full px-4 py-3 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0 sm:text-sm"
          />

          {/* Image previews */}
          {previewUrls.length > 0 && (
            <div className="p-3 border-t border-navy-600">
              <div className="flex flex-wrap gap-2">
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload progress */}
          {uploadProgress.length > 0 && (
            <div className="p-3 border-t border-navy-600 space-y-2">
              {uploadProgress.map((progress) => (
                <div key={progress.id} className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-gray-300 flex-1 truncate">
                    {progress.fileName}
                  </span>
                  <span className="text-sm text-indigo-400 font-medium">
                    {Math.round(progress.progress)}%
                  </span>
                  <div className="w-24 h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center px-3 py-2 border-t border-navy-600">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || (!newNote.trim() && selectedImages.length === 0)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-navy-900 rounded-lg border border-navy-600 p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 whitespace-pre-wrap text-sm">
                    {note.content}
                  </p>
                  
                  {/* Display attached images */}
                  {note.images && note.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {note.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Attachment ${index + 1}`}
                            className="h-32 w-32 object-cover rounded-md cursor-pointer"
                            onClick={() => setFullSizePreview(imageUrl)}
                          />
                          <button
                            onClick={() => setFullSizePreview(imageUrl)}
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-md"
                          >
                            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <time
                      dateTime={note.createdAt}
                      title={format(new Date(note.createdAt), 'PPpp')}
                    >
                      {formatDistanceToNow(new Date(note.createdAt))} ago
                    </time>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-6 bg-navy-900/50 rounded-lg border border-navy-600">
              <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">
                No notes yet. Add your first note above.
              </p>
            </div>
          )}
        </div>
      </div>

      {fullSizePreview && (
        <ImagePreviewModal
          imageUrl={fullSizePreview}
          onClose={() => setFullSizePreview(null)}
        />
      )}
    </div>
  );
};