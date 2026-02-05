'use client';

import { useState, useMemo } from 'react';
import { RequestCard } from '@/components/RequestCard';
import { JobProfileDetailModal } from '@/components/JobProfileDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobProfileRequest, STATUS_OPTIONS, JobProfileStatus } from '@/lib/types';
import { Search, Filter, Plus, FileText, Clock, AlertTriangle, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

// Demo data - in production this would come from SharePoint
const DEMO_REQUESTS: JobProfileRequest[] = [
  {
    id: '1',
    title: 'Cloud Platform Engineer II',
    description: 'Responsible for designing and implementing cloud infrastructure solutions. Works independently on complex technical problems. Participates in architecture reviews and provides technical guidance to team members.',
    department: 'IT',
    proposedMgmtLevel: 'P2',
    aiSuggestedMgmtLevel: 'P2',
    aiCareerStep: 'Professional',
    aiStage: 2,
    aiConfidence: 0.85,
    aiSuggestedRationale: 'The role requires independent work on moderately complex technical problems with team-level influence. The mention of participating in architecture reviews and providing guidance indicates P2-level autonomy and impact.',
    aiWhyNotHigher: 'P3 would require leading complex projects or being a recognized SME with cross-functional influence. The description focuses on execution rather than strategic leadership.',
    aiWhyNotLower: 'P1 would be too low given the independent work requirement and the expectation to provide technical guidance. This role clearly operates beyond entry-level professional responsibilities.',
    aiJdImprovements: [
      'Clarify the scope of "complex technical problems" - specify if these are novel or precedented challenges',
      'Add detail on decision-making authority - what technical decisions can this role make independently?',
      'Specify the impact scope - is influence limited to immediate team or extends to other functions?',
      'Consider adding metrics or KPIs to make the role expectations more measurable'
    ],
    status: 'Under Review',
    countriesNeeded: ['Spain', 'Mexico', 'Romania'],
    urgency: 'Normal',
    owner: 'Mansi Goyal',
    ownerCoLead: 'Jordi Rofin',
    requestDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'AI Data Specialist',
    description: 'Manages AI data collection and annotation projects. Coordinates with global teams to ensure data quality.',
    department: 'Welo Data',
    proposedMgmtLevel: '',
    aiSuggestedMgmtLevel: 'P2',
    aiCareerStep: 'Professional',
    aiStage: 2,
    aiConfidence: 0.72,
    aiSuggestedRationale: 'Managing projects and coordinating across global teams indicates professional-level autonomy. The role appears to have moderate complexity and cross-team coordination responsibilities.',
    aiWhyNotHigher: 'Without evidence of strategic influence, SME recognition, or people management, P3 or AP1 would be too high.',
    aiWhyNotLower: 'The project management and global coordination aspects exceed routine execution expected at C3 or P1 levels.',
    aiJdImprovements: [
      'Define "manages" more clearly - does this role have budget/resource authority or is it coordination only?',
      'Specify the scale of projects managed (team size, duration, complexity)',
      'Clarify decision-making scope for data quality standards',
      'Add information about stakeholder interactions and influence level'
    ],
    status: 'Awaiting Mgmt Level',
    countriesNeeded: ['India', 'USA'],
    urgency: 'Urgent',
    owner: 'Andeen Riley',
    ownerCoLead: 'Farhat Safa',
    requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Senior Language Solutions Architect',
    description: 'Strategic design authority for language technology solutions. Influences multiple functions with company-wide impact. Drives innovation and sets technical direction for the language technology stack.',
    department: 'TME',
    proposedMgmtLevel: 'AP1',
    aiSuggestedMgmtLevel: 'AP2',
    aiCareerStep: 'Advanced Professional',
    aiStage: 2,
    aiConfidence: 0.78,
    aiSuggestedRationale: 'The role is positioned as a strategic design authority with company-wide impact and cross-functional influence. This indicates Advanced Professional level with significant SME responsibilities.',
    aiWhyNotHigher: 'AP3 would require evidence of industry recognition or influence beyond the organization. The description focuses on internal company impact.',
    aiWhyNotLower: 'AP1 would undervalue the strategic authority and company-wide impact described. The role clearly influences multiple functions and sets technical direction.',
    aiJdImprovements: [
      'Quantify the scope of "company-wide impact" with examples',
      'Clarify if this role has any people leadership responsibilities (dotted or direct)',
      'Add detail on the innovation aspects - R&D budget, external partnerships?'
    ],
    agreedMgmtLevel: 'AP1',
    status: 'Ready for Workday',
    countriesNeeded: ['Spain', 'Germany', 'UK'],
    urgency: 'Normal',
    owner: 'Mansi Goyal',
    ownerCoLead: 'Jordi Rofin',
    assignedTo: 'Maria Garcia',
    requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    // Collaborative data
    gradeRanges: [
      { id: 'gr-1', country: 'Spain', minGrade: 8, maxGrade: 10, addedBy: 'Ana Martinez', addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'gr-2', country: 'Germany', minGrade: 9, maxGrade: 11, addedBy: 'Klaus Weber', addedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    comments: [
      { id: 'c-1', author: 'Ana Martinez', authorInitials: 'AM', text: 'I agree with AP1. The company-wide impact is clear but we don\'t have evidence of external industry influence.', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'c-2', author: 'Klaus Weber', authorInitials: 'KW', text: 'For Germany, I\'d suggest Grade 9-11 based on comparable roles in our market.', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'c-3', author: 'Maria Garcia', authorInitials: 'MG', text: 'Still waiting for UK grade range. @John can you add it?', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    reviewerVotes: [
      { id: 'v-1', reviewer: 'Ana Martinez', reviewerInitials: 'AM', suggestedLevel: 'AP1', hasApproved: true, reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Align with manager feedback' },
      { id: 'v-2', reviewer: 'Klaus Weber', reviewerInitials: 'KW', suggestedLevel: 'AP1', hasApproved: true, reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'v-3', reviewer: 'Jordi Rofin', reviewerInitials: 'JR', suggestedLevel: 'AP2', hasApproved: true, reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), notes: 'AI suggests AP2, worth considering' },
    ],
  },
  {
    id: '4',
    title: 'Project Coordinator',
    description: 'Coordinates project activities and communications. Supports project managers with routine tasks. Maintains project documentation and schedules meetings.',
    department: 'Life Sciences',
    proposedMgmtLevel: 'C3',
    aiSuggestedMgmtLevel: 'C3',
    aiCareerStep: 'Core',
    aiStage: 3,
    aiConfidence: 0.92,
    aiSuggestedRationale: 'This is a clear Core-level coordination role with routine, well-defined tasks. The support nature and focus on documentation and scheduling are characteristic of C3.',
    aiWhyNotHigher: 'P1 would require more independent work and decision-making. This role explicitly supports project managers rather than leading work independently.',
    aiWhyNotLower: 'C2 would be too junior for coordination responsibilities across project activities. C3 is appropriate for experienced coordinators.',
    aiJdImprovements: [
      'The JD is appropriately scoped for C3 level',
      'Consider adding any escalation or problem-solving expectations',
      'Clarify reporting structure and who this role supports'
    ],
    agreedMgmtLevel: 'C3',
    status: 'Grades Pending',
    countriesNeeded: ['Spain', 'Mexico'],
    urgency: 'Normal',
    owner: 'Noemi Rodriguez',
    ownerCoLead: 'Cecilia Luraschi',
    requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Special filter types for metric cards
type SpecialFilter = 'urgent' | 'overdue' | 'pending-review' | null;

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobProfileStatus | 'all'>('all');
  const [specialFilter, setSpecialFilter] = useState<SpecialFilter>(null);
  const [requests, setRequests] = useState<JobProfileRequest[]>(DEMO_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<JobProfileRequest | null>(null);

  const handleUpdateRequest = (updatedRequest: JobProfileRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
    setSelectedRequest((current) =>
      current?.id === updatedRequest.id ? updatedRequest : current
    );
  };

  // Helper functions for special filters
  const isUrgent = (r: JobProfileRequest) => r.urgency === 'Urgent' && r.status !== 'Completed';
  const isOverdue = (r: JobProfileRequest) => r.dueDate && new Date(r.dueDate) < new Date() && r.status !== 'Completed';
  const isPendingReview = (r: JobProfileRequest) => r.status === 'Awaiting Mgmt Level' || r.status === 'Under Review';

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = searchQuery === '' ||
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.department?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      // Apply special filter if active
      let matchesSpecialFilter = true;
      if (specialFilter === 'urgent') {
        matchesSpecialFilter = isUrgent(request);
      } else if (specialFilter === 'overdue') {
        matchesSpecialFilter = isOverdue(request);
      } else if (specialFilter === 'pending-review') {
        matchesSpecialFilter = isPendingReview(request);
      }
      
      return matchesSearch && matchesStatus && matchesSpecialFilter;
    });
  }, [requests, searchQuery, statusFilter, specialFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: requests.length };
    STATUS_OPTIONS.forEach(status => {
      counts[status] = requests.filter(r => r.status === status).length;
    });
    return counts;
  }, [requests]);

  // Calculate stats for metric cards
  const urgentCount = requests.filter(isUrgent).length;
  const overdueCount = requests.filter(isOverdue).length;
  const pendingReviewCount = requests.filter(isPendingReview).length;

  // Handle metric card click
  const handleMetricClick = (filter: SpecialFilter) => {
    if (specialFilter === filter) {
      // Toggle off if already active
      setSpecialFilter(null);
    } else {
      setSpecialFilter(filter);
      setStatusFilter('all'); // Reset status filter when using special filter
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSpecialFilter(null);
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Job Profile Requests
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track job profile requests across the organization
          </p>
        </div>
        <Link href="/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={clearFilters}
          className={`stat-card text-left group ${
            !specialFilter && statusFilter === 'all' ? 'border-primary ring-1 ring-primary/20' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Requests</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{requests.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleMetricClick('pending-review')}
          className={`stat-card text-left group ${
            specialFilter === 'pending-review' ? 'border-amber-500/50 ring-1 ring-amber-500/20 bg-amber-500/5' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending Review</p>
              <p className="text-3xl font-semibold text-amber-400 mt-2">{pendingReviewCount}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              specialFilter === 'pending-review' ? 'bg-amber-500/20' : 'bg-secondary group-hover:bg-amber-500/10'
            }`}>
              <Clock className={`w-5 h-5 transition-colors ${
                specialFilter === 'pending-review' ? 'text-amber-400' : 'text-muted-foreground group-hover:text-amber-400'
              }`} />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleMetricClick('urgent')}
          className={`stat-card text-left group ${
            specialFilter === 'urgent' ? 'border-orange-500/50 ring-1 ring-orange-500/20 bg-orange-500/5' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Urgent</p>
              <p className="text-3xl font-semibold text-orange-400 mt-2">{urgentCount}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              specialFilter === 'urgent' ? 'bg-orange-500/20' : 'bg-secondary group-hover:bg-orange-500/10'
            }`}>
              <AlertTriangle className={`w-5 h-5 transition-colors ${
                specialFilter === 'urgent' ? 'text-orange-400' : 'text-muted-foreground group-hover:text-orange-400'
              }`} />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleMetricClick('overdue')}
          className={`stat-card text-left group ${
            specialFilter === 'overdue' ? 'border-red-500/50 ring-1 ring-red-500/20 bg-red-500/5' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Overdue</p>
              <p className="text-3xl font-semibold text-red-400 mt-2">{overdueCount}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              specialFilter === 'overdue' ? 'bg-red-500/20' : 'bg-secondary group-hover:bg-red-500/10'
            }`}>
              <AlertCircle className={`w-5 h-5 transition-colors ${
                specialFilter === 'overdue' ? 'text-red-400' : 'text-muted-foreground group-hover:text-red-400'
              }`} />
            </div>
          </div>
        </button>
      </div>

      {/* Active Filter Indicator */}
      {specialFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filtering by:</span>
          <span className={`px-3 py-1 rounded-full font-medium text-xs ${
            specialFilter === 'pending-review' ? 'bg-amber-500/20 text-amber-400' :
            specialFilter === 'urgent' ? 'bg-orange-500/20 text-orange-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {specialFilter === 'pending-review' ? 'Pending Review' :
             specialFilter === 'urgent' ? 'Urgent' : 'Overdue'}
          </span>
          <button
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-card rounded-xl p-4 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border focus:bg-secondary focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as JobProfileStatus | 'all');
                setSpecialFilter(null);
              }}
              className="h-10 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
            >
              <option value="all">All statuses ({statusCounts.all})</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status} ({statusCounts[status] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setStatusFilter('all');
              setSpecialFilter(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'all' && !specialFilter
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            All ({statusCounts.all})
          </button>
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setSpecialFilter(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status && !specialFilter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              {status} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredRequests.length}</span> of{' '}
          <span className="font-medium text-foreground">{requests.length}</span> requests
        </p>
      </div>

      {/* Request Cards */}
      {filteredRequests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={() => setSelectedRequest(request)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No requests found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Detail Modal */}
      <JobProfileDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUpdateRequest={handleUpdateRequest}
      />
    </div>
  );
}
