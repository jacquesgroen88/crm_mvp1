import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Tag, User, GripVertical } from 'lucide-react';
import type { Deal } from '../../types/deal';
import { useCustomFieldsStore } from '../../store/customFieldsStore';
import { DealDetailsModal } from '../deals/DealDetailsModal';

interface KanbanCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ deal, isDragging }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { fields } = useCustomFieldsStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: deal.id,
    data: { ...deal },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getInitialsColor = (name: string) => {
    if (!name) return 'bg-gray-500';
    
    const colors = [
      'bg-pink-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCardClick = () => {
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onTouchEnd={handleCardClick}
        onClick={(e) => {
          // Prevent click event on desktop drag
          if (window.innerWidth >= 768) {
            handleCardClick();
          }
        }}
        className={`group bg-navy-700 rounded-lg border border-navy-600 overflow-hidden
          ${isDragging ? 'opacity-50' : 'hover:border-indigo-500'} transition-all duration-200 cursor-pointer`}
      >
        {/* Drag Handle (Desktop Only) */}
        <div 
          {...attributes}
          {...listeners}
          className="hidden md:flex h-6 items-center justify-center bg-navy-800 cursor-grab active:cursor-grabbing border-b border-navy-600 opacity-0 group-hover:opacity-100 transition-opacity select-none"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="p-3 space-y-3">
          {/* Deal Title */}
          <div className="font-medium text-white line-clamp-2">
            {deal.title}
          </div>

          {/* Contact Info */}
          <div className="flex items-center space-x-2">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getInitialsColor(deal.contact.name)} flex items-center justify-center text-white text-sm font-medium`}>
              {getInitials(deal.contact.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {deal.contact.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {deal.company}
              </p>
            </div>
          </div>

          {/* Deal Value */}
          <div className="flex items-center text-sm text-gray-300">
            <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
            <span className="font-medium">{deal.value.toLocaleString()}</span>
          </div>

          {/* Owner */}
          <div className="flex items-center space-x-2">
            {deal.ownerPhotoURL ? (
              <img
                src={deal.ownerPhotoURL}
                alt={deal.ownerName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className={`w-6 h-6 rounded-full ${getInitialsColor(deal.ownerName || '')} flex items-center justify-center`}>
                <User className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="text-xs text-gray-400 truncate">
              {deal.ownerName}
            </span>
          </div>

          {/* Tags/Labels */}
          <div className="flex flex-wrap gap-1">
            {deal.customFields?.map((field, index) => {
              const fieldDef = fields.find(f => f.id === field.fieldId);
              if (!fieldDef || !field.value) return null;
              
              return (
                <span
                  key={field.fieldId}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy-600 text-gray-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {field.value}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <DealDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        deal={deal}
      />
    </>
  );
};