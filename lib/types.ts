// Collaborative input types
export interface GradeRange {
  id: string;
  country: string;
  minGrade: number;
  maxGrade: number;
  addedBy: string;
  addedDate: string;
  notes?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  text: string;
  createdAt: string;
  isEdited?: boolean;
}

export interface ReviewerVote {
  id: string;
  reviewer: string;
  reviewerInitials: string;
  suggestedLevel: string;
  hasApproved: boolean;
  reviewedAt: string;
  notes?: string;
}

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
  /** People Partner Lead (owner) – receives reminders and drives execution */
  owner?: string;
  /** People Partner Co-Lead – can receive reminders */
  ownerCoLead?: string;
  requestDate?: string;
  dueDate?: string;
  completedDate?: string;
  teamsLink?: string;
  countriesNeeded: string[];
  workdayJobCode?: string;
  notes?: string;
  justification?: string;
  urgency: 'Normal' | 'Urgent';
  // Collaborative fields
  gradeRanges?: GradeRange[];
  comments?: Comment[];
  reviewerVotes?: ReviewerVote[];
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

// Improved JD generation types
export interface ImproveJDRequest {
  title: string;
  description: string;
  department?: string;
  suggestedLevel: string;
  jdImprovements?: string[];
}

export interface ImproveJDResponse {
  improvedJD: string;
  changes: string[];
}

// People Partner structure (Lead = owner, receives reminders)
export interface PeoplePartner {
  lead: string;
  coLead: string;
}

/** People Partner by area. Owner (Lead) is responsible for execution and receives reminders. */
export const PEOPLE_PARTNER_BY_AREA: Record<string, PeoplePartner> = {
  'Welo Global': { lead: 'Fiona Casserly', coLead: 'Noemi Rodriguez' },
  'Life Sciences': { lead: 'Noemi Rodriguez', coLead: 'Cecilia Luraschi' },
  'ParkIP': { lead: 'Noemi Rodriguez', coLead: 'Cecilia Luraschi' },
  'Operations': { lead: 'Marina Liang', coLead: 'Sabrina Zhang' },
  'Welo Data': { lead: 'Andeen Riley', coLead: 'Farhat Safa' },
  'Technology': { lead: 'Mansi Goyal', coLead: 'Jordi Rofin' },
  'Finance': { lead: 'Farhat Safa', coLead: 'Fiona Casserly' },
  'Marketing': { lead: 'Farhat Safa', coLead: 'Fiona Casserly' },
};

/** Map department (form value) to People Partner area for owner assignment */
const DEPARTMENT_TO_PEOPLE_PARTNER_AREA: Record<string, string> = {
  'Life Sciences': 'Life Sciences',
  'ParkIP': 'ParkIP',
  'Legal': 'Welo Global',
  'TME': 'Technology',
  'Welo Data': 'Welo Data',
  'Adapt': 'Welo Global',
  'People Operations': 'Operations',
  'Operations': 'Operations',
  'Finance': 'Finance',
  'Technology': 'Technology',
  'Marketing': 'Marketing',
  'Sales': 'Welo Global',
  'Other': 'Welo Global',
};

/** Get owner (Lead) and Co-Lead for a department. Used when creating a Job Profile request. */
export function getPeoplePartnerForDepartment(department: string): PeoplePartner {
  const area = DEPARTMENT_TO_PEOPLE_PARTNER_AREA[department] || 'Welo Global';
  return PEOPLE_PARTNER_BY_AREA[area] || PEOPLE_PARTNER_BY_AREA['Welo Global'];
}

// Form field options
export const DEPARTMENTS = [
  'Life Sciences',
  'ParkIP',
  'Legal',
  'TME',
  'Welo Data',
  'Adapt',
  'People Operations',
  'Operations',
  'Finance',
  'Technology',
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
  'New': 'bg-blue-500/20 text-blue-400',
  'Awaiting Mgmt Level': 'bg-amber-500/20 text-amber-400',
  'Under Review': 'bg-purple-500/20 text-purple-400',
  'Grades Pending': 'bg-orange-500/20 text-orange-400',
  'Ready for Workday': 'bg-emerald-500/20 text-emerald-400',
  'In Progress': 'bg-indigo-500/20 text-indigo-400',
  'Completed': 'bg-muted text-muted-foreground',
};
