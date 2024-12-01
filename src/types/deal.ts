export interface DealStageChange {
  from: string;
  to: string;
  timestamp: string;
}

export interface DealContact {
  name: string;
  email: string;
  phone: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  company: string;
  contact: DealContact;
  stage: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  customFields: CustomFieldValue[];
  stageHistory: DealStageChange[];
  ownerId: string;
  ownerName?: string;
  ownerPhotoURL?: string;
  archived: boolean;
}