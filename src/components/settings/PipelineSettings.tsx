import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableStage } from './SortableStage';
import { Plus, Save } from 'lucide-react';
import { usePipelineStore } from '../../store/pipelineStore';

const generateRandomColor = () => {
  const colors = [
    '#818CF8', // Indigo
    '#60A5FA', // Blue
    '#34D399', // Emerald
    '#FBBF24', // Amber
    '#F87171', // Red
    '#A78BFA', // Purple
    '#4ADE80', // Green
    '#FB923C', // Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const PipelineSettings = () => {
  const { stages, updateStages, loading, error } = usePipelineStore();
  const [newStage, setNewStage] = useState('');
  const [localStages, setLocalStages] = useState(stages);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLocalStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newStages = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newStages;
      });
    }
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStage.trim()) return;

    const newStageObj = {
      id: Date.now().toString(),
      name: newStage.trim(),
      color: generateRandomColor(),
    };

    setLocalStages([...localStages, newStageObj]);
    setNewStage('');
    setHasChanges(true);
  };

  const handleDeleteStage = (stageId: string) => {
    if (localStages.length <= 2) {
      alert('You must have at least two stages in your pipeline.');
      return;
    }
    setLocalStages(localStages.filter(stage => stage.id !== stageId));
    setHasChanges(true);
  };

  const handleUpdateStage = (stageId: string, updates: Partial<Stage>) => {
    setLocalStages(stages => 
      stages.map(stage => 
        stage.id === stageId ? { ...stage, ...updates } : stage
      )
    );
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      await updateStages(localStages);
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving pipeline stages:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pipeline Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Customize your pipeline stages and their order
            </p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div className="p-6">
        <form onSubmit={handleAddStage} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              placeholder="Enter new stage name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            />
            <button
              type="submit"
              disabled={!newStage.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Stage
            </button>
          </div>
        </form>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localStages}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {localStages.map((stage) => (
                <SortableStage
                  key={stage.id}
                  stage={stage}
                  onDelete={() => handleDeleteStage(stage.id)}
                  onUpdate={handleUpdateStage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {localStages.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No stages defined. Add your first pipeline stage above.
          </p>
        )}
      </div>
    </div>
  );
};