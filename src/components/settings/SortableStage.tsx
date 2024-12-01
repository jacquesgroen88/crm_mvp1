import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Stage } from '../../types/stage';

interface SortableStageProps {
  stage: Stage;
  onDelete: () => void;
  onUpdate: (id: string, updates: Partial<Stage>) => void;
}

export const SortableStage: React.FC<SortableStageProps> = ({ stage, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(stage.name);
  const [editedColor, setEditedColor] = useState(stage.color);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (editedName.trim()) {
      onUpdate(stage.id, {
        name: editedName.trim(),
        color: editedColor
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(stage.name);
    setEditedColor(stage.color);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="flex-1 flex items-center gap-3">
        {isEditing ? (
          <>
            <input
              type="color"
              value={editedColor}
              onChange={(e) => setEditedColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-colors"
                title="Save changes"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: stage.color }}
            />
            <span className="font-medium flex-1">{stage.name}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title="Edit stage"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete stage"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};