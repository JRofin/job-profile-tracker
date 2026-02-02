// Job Profile Request types
export interface JobProfileRequest {
  id?: string;
  title: string;
  description: string;
  department: string;
  proposedMgmtLevel: string;
  aiSuggestedMgmtLevel?: string;
  aiSuggestedRationale?: string;
  aiSuggestedDate?: string;
  aiCareerStep?: string;
  aiStage?: number;
  aiConfidence?: number;
  aiWhyNotHigher?: string;
  aiWhyNotLower?: string;
  aiJdImprovements?: string[];
  agreedMgmtLevel?: string;
  status: JobProfileStatus;
  requestedBy?: string;
  assignedTo?: string;
  requestDate?: string;
  dueDate?: string;
  completedDate?: string;
  teamsLink?: string;
  countriesNeeded: string[];
  workdayJobCode?: string;
  notes?: string;
  justification?: string;
  urgency: 'Normal' | 'Urgent';
}

export type JobProfileStatus = 
  | 'New'
  | 'Awaiting Mgmt Level'
  | 'Under Review'
  | 'Grades Pending'
  | 'Ready for Workday'
  | 'In Progress'
  | 'Completed';

// Leveling API types
export interface LevelingRequest {
  title: string;
  description: string;
  department?: string;
}

export interface LevelingResponse {
  suggestedLevel: string;
  careerStep: string;
  stage: number;
  rationale: string;
  whyNotHigher?: string;
  whyNotLower?: string;
  confidence?: number;
  jdImprovements?: string[];
}

// Form field options
export const DEPARTMENTS = [
  'Life Sciences',
  'Legal',
  'TME',
  'Welo Data',
  'Adapt',
  'People Operations',
  'Finance',
  'IT',
  'Marketing',
  'Sales',
  'Other'
];

export const MANAGEMENT_LEVELS = [
  'C1', 'C2', 'C3',
  'P1', 'P2', 'P3',
  'SS1', 'SS2', 'SS3',
  'AP1', 'AP2', 'AP3',
  'L1', 'L2', 'L3',
  'SL1', 'SL2',
  'EL1', 'EL3', 'EL4',
  'I don\'t know / Let the team decide'
];

export const COUNTRIES = [
  'Spain',
  'Mexico',
  'Romania',
  'Greece',
  'India',
  'USA',
  'UK',
  'Germany',
  'France',
  'Japan',
  'China',
  'Brazil',
  'Other'
];

export const STATUS_OPTIONS: JobProfileStatus[] = [
  'New',
  'Awaiting Mgmt Level',
  'Under Review',
  'Grades Pending',
  'Ready for Workday',
  'In Progress',
  'Completed'
];

export const STATUS_COLORS: Record<JobProfileStatus, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Awaiting Mgmt Level': 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-purple-100 text-purple-800',
  'Grades Pending': 'bg-orange-100 text-orange-800',
  'Ready for Workday': 'bg-green-100 text-green-800',
  'In Progress': 'bg-indigo-100 text-indigo-800',
  'Completed': 'bg-gray-100 text-gray-800',
};
