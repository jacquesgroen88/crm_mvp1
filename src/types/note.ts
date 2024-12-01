export interface Note {
  id: string;
  dealId: string;
  content: string;
  type: 'note' | 'activity';
  createdBy: string;
  createdAt: string;
  organizationId: string;
  images?: string[]; // Array of image URLs
}