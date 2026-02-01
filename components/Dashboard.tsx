'use client';

import { useState, useMemo } from 'react';
import { RequestCard } from '@/components/RequestCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobProfileRequest, STATUS_OPTIONS, JobProfileStatus } from '@/lib/types';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

// Demo data - in production this would come from SharePoint
const DEMO_REQUESTS: JobProfileRequest[] = [
  {
    id: '1',
    title: 'Cloud Platform Engineer II',
    description: 'Responsible for designing and implementing cloud infrastructure solutions. Works independently on complex technical problems.',
    department: 'IT',
    proposedMgmtLevel: 'P2',
    aiSuggestedMgmtLevel: 'P2',
    aiSuggestedRationale: 'Based on the technical complexity and independent work nature of the role.',
    status: 'Under Review',
    countriesNeeded: ['Spain', 'Mexico', 'Romania'],
    urgency: 'Normal',
    requestDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'AI Data Specialist',
    description: 'Manages AI data collection and annotation projects. Coordinates with global teams to ensure data quality.',
    department: 'Welo Data',
    proposedMgmtLevel: '',
    status: 'Awaiting Mgmt Level',
    countriesNeeded: ['India', 'USA'],
    urgency: 'Urgent',
    requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Senior Language Solutions Architect',
    description: 'Strategic design authority for language technology solutions. Influences multiple functions with company-wide impact.',
    department: 'TME',
    proposedMgmtLevel: 'AP1',
    agreedMgmtLevel: 'AP1',
    status: 'Ready for Workday',
    countriesNeeded: ['Spain', 'Germany', 'UK'],
    urgency: 'Normal',
    assignedTo: 'Maria Garcia',
    requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Project Coordinator',
    description: 'Coordinates project activities and communications. Supports project managers with routine tasks.',
    department: 'Life Sciences',
    proposedMgmtLevel: 'C3',
    aiSuggestedMgmtLevel: 'C3',
    agreedMgmtLevel: 'C3',
    status: 'Grades Pending',
    countriesNeeded: ['Spain', 'Mexico'],
    urgency: 'Normal',
    requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobProfileStatus | 'all'>('all');
  const [requests] = useState<JobProfileRequest[]>(DEMO_REQUESTS);

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = searchQuery === '' ||
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.department?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: requests.length };
    STATUS_OPTIONS.forEach(status => {
      counts[status] = requests.filter(r => r.status === status).length;
    });
    return counts;
  }, [requests]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Profile Requests</h1>
          <p className="text-muted-foreground">
            {filteredRequests.length} of {requests.length} requests
          </p>
        </div>
        <Link href="/new">
          <Button className="bg-welocalize-blue hover:bg-welocalize-blue-dark">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobProfileStatus | 'all')}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-welocalize-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({statusCounts.all})
        </button>
        {STATUS_OPTIONS.map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-welocalize-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {filteredRequests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={() => {
                // In production: navigate to detail page or open modal
                console.log('Open request:', request.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">No requests found</p>
          <Link href="/new">
            <Button variant="link" className="mt-2 text-welocalize-blue">
              Create new request
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
