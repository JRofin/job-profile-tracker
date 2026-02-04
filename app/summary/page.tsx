'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { JobProfileRequest, PEOPLE_PARTNER_BY_AREA } from '@/lib/types';

// Demo data - same as Dashboard (in production would come from a shared store/API)
const DEMO_REQUESTS: JobProfileRequest[] = [
  {
    id: '1',
    title: 'Cloud Platform Engineer II',
    description: 'Responsible for designing and implementing cloud infrastructure solutions.',
    department: 'Technology',
    proposedMgmtLevel: 'P2',
    aiSuggestedMgmtLevel: 'P2',
    agreedMgmtLevel: 'P2',
    status: 'Under Review',
    countriesNeeded: ['Spain', 'Mexico', 'Romania'],
    urgency: 'Normal',
    owner: 'Mansi Goyal',
    requestedBy: 'John Smith',
    requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    gradeRanges: [
      { id: 'gr-1', country: 'Spain', minGrade: 5, maxGrade: 7, addedBy: 'Ana Martinez', addedDate: new Date().toISOString() },
    ],
  },
  {
    id: '2',
    title: 'AI Data Specialist',
    description: 'Manages AI data collection and annotation projects.',
    department: 'Welo Data',
    proposedMgmtLevel: 'P2',
    aiSuggestedMgmtLevel: 'P2',
    status: 'Awaiting Mgmt Level',
    countriesNeeded: ['India', 'USA'],
    urgency: 'Urgent',
    owner: 'Andeen Riley',
    requestedBy: 'Sarah Johnson',
    requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Senior Language Solutions Architect',
    description: 'Strategic design authority for language technology solutions.',
    department: 'TME',
    proposedMgmtLevel: 'AP1',
    aiSuggestedMgmtLevel: 'AP2',
    agreedMgmtLevel: 'AP1',
    status: 'Ready for Workday',
    countriesNeeded: ['Spain', 'Germany', 'UK'],
    urgency: 'Normal',
    owner: 'Mansi Goyal',
    requestedBy: 'Michael Brown',
    requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    gradeRanges: [
      { id: 'gr-1', country: 'Spain', minGrade: 8, maxGrade: 10, addedBy: 'Ana Martinez', addedDate: new Date().toISOString() },
      { id: 'gr-2', country: 'Germany', minGrade: 9, maxGrade: 11, addedBy: 'Klaus Weber', addedDate: new Date().toISOString() },
      { id: 'gr-3', country: 'UK', minGrade: 8, maxGrade: 10, addedBy: 'John Davies', addedDate: new Date().toISOString() },
    ],
  },
  {
    id: '4',
    title: 'Project Coordinator',
    description: 'Coordinates project activities and communications.',
    department: 'Life Sciences',
    proposedMgmtLevel: 'C3',
    aiSuggestedMgmtLevel: 'C3',
    agreedMgmtLevel: 'C3',
    status: 'Grades Pending',
    countriesNeeded: ['Spain', 'Mexico'],
    urgency: 'Normal',
    owner: 'Noemi Rodriguez',
    requestedBy: 'Emily Davis',
    requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    gradeRanges: [
      { id: 'gr-1', country: 'Spain', minGrade: 3, maxGrade: 4, addedBy: 'Ana Martinez', addedDate: new Date().toISOString() },
    ],
  },
  {
    id: '5',
    title: 'Senior Project Manager',
    description: 'Leads complex multi-functional projects with significant business impact.',
    department: 'Operations',
    proposedMgmtLevel: 'L1',
    aiSuggestedMgmtLevel: 'L1',
    agreedMgmtLevel: 'L1',
    status: 'Completed',
    countriesNeeded: ['USA', 'India'],
    urgency: 'Normal',
    owner: 'Marina Liang',
    requestedBy: 'David Wilson',
    requestDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    gradeRanges: [
      { id: 'gr-1', country: 'USA', minGrade: 10, maxGrade: 12, addedBy: 'Tom Anderson', addedDate: new Date().toISOString() },
      { id: 'gr-2', country: 'India', minGrade: 9, maxGrade: 11, addedBy: 'Priya Sharma', addedDate: new Date().toISOString() },
    ],
  },
  {
    id: '6',
    title: 'Finance Analyst',
    description: 'Analyzes financial data and prepares reports for management.',
    department: 'Finance',
    proposedMgmtLevel: 'P1',
    aiSuggestedMgmtLevel: 'P1',
    agreedMgmtLevel: 'P1',
    status: 'Completed',
    countriesNeeded: ['Spain'],
    urgency: 'Normal',
    owner: 'Farhat Safa',
    requestedBy: 'Lisa Chen',
    requestDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    gradeRanges: [
      { id: 'gr-1', country: 'Spain', minGrade: 4, maxGrade: 6, addedBy: 'Ana Martinez', addedDate: new Date().toISOString() },
    ],
  },
];

// Helper to get level category
function getLevelCategory(level: string): string {
  if (!level) return 'Unknown';
  const prefix = level.replace(/[0-9]/g, '');
  const categories: Record<string, string> = {
    'C': 'Core (C)',
    'P': 'Professional (P)',
    'SS': 'Sales Strategist (SS)',
    'AP': 'Advanced Professional (AP)',
    'L': 'Leader (L)',
    'SL': 'Senior Leader (SL)',
    'EL': 'Executive Leader (EL)',
  };
  return categories[prefix] || level;
}

export default function SummaryPage() {
  const requests = DEMO_REQUESTS;

  // Analytics calculations
  const analytics = useMemo(() => {
    // By Owner (People Partner / GM)
    const byOwner: Record<string, number> = {};
    requests.forEach(r => {
      const owner = r.owner || 'Unassigned';
      byOwner[owner] = (byOwner[owner] || 0) + 1;
    });

    // By Management Level
    const byLevel: Record<string, number> = {};
    requests.forEach(r => {
      const level = r.agreedMgmtLevel || r.proposedMgmtLevel || 'Pending';
      byLevel[level] = (byLevel[level] || 0) + 1;
    });

    // By Level Category (C, P, AP, L, etc.)
    const byLevelCategory: Record<string, number> = {};
    requests.forEach(r => {
      const level = r.agreedMgmtLevel || r.proposedMgmtLevel;
      if (level && level !== "I don't know / Let the team decide") {
        const category = getLevelCategory(level);
        byLevelCategory[category] = (byLevelCategory[category] || 0) + 1;
      }
    });

    // By Department
    const byDepartment: Record<string, number> = {};
    requests.forEach(r => {
      const dept = r.department || 'Unknown';
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });

    // By Status
    const byStatus: Record<string, number> = {};
    requests.forEach(r => {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    });

    // Countries with most grade ranges
    const gradesByCountry: Record<string, number> = {};
    requests.forEach(r => {
      r.gradeRanges?.forEach(gr => {
        gradesByCountry[gr.country] = (gradesByCountry[gr.country] || 0) + 1;
      });
    });

    // Who added most grades
    const gradesByPerson: Record<string, number> = {};
    requests.forEach(r => {
      r.gradeRanges?.forEach(gr => {
        gradesByPerson[gr.addedBy] = (gradesByPerson[gr.addedBy] || 0) + 1;
      });
    });

    // By Requester
    const byRequester: Record<string, number> = {};
    requests.forEach(r => {
      const requester = r.requestedBy || 'Unknown';
      byRequester[requester] = (byRequester[requester] || 0) + 1;
    });

    // Completion rate
    const completed = requests.filter(r => r.status === 'Completed').length;
    const completionRate = Math.round((completed / requests.length) * 100);

    // Average time to completion (for completed requests)
    const completedRequests = requests.filter(r => r.status === 'Completed' && r.requestDate);
    
    return {
      total: requests.length,
      completed,
      completionRate,
      byOwner: Object.entries(byOwner).sort((a, b) => b[1] - a[1]),
      byLevel: Object.entries(byLevel).sort((a, b) => b[1] - a[1]),
      byLevelCategory: Object.entries(byLevelCategory).sort((a, b) => b[1] - a[1]),
      byDepartment: Object.entries(byDepartment).sort((a, b) => b[1] - a[1]),
      byStatus: Object.entries(byStatus).sort((a, b) => b[1] - a[1]),
      gradesByCountry: Object.entries(gradesByCountry).sort((a, b) => b[1] - a[1]),
      gradesByPerson: Object.entries(gradesByPerson).sort((a, b) => b[1] - a[1]),
      byRequester: Object.entries(byRequester).sort((a, b) => b[1] - a[1]),
    };
  }, [requests]);

  // Color for progress bars
  const getBarColor = (index: number) => {
    const colors = [
      'bg-welocalize-blue',
      'bg-cyan-500',
      'bg-teal-500',
      'bg-emerald-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-welocalize-blue transition-colors">
          Dashboard
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">Summary</span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Job Profiles Summary</h1>
        <p className="text-slate-500 mt-1">
          Analytics and insights on job profile requests
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-welocalize-blue to-cyan-600 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-white/80">Total Profiles</p>
            <p className="text-4xl font-bold mt-1">{analytics.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-white/80">Completed</p>
            <p className="text-4xl font-bold mt-1">{analytics.completed}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-white/80">Completion Rate</p>
            <p className="text-4xl font-bold mt-1">{analytics.completionRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-white/80">In Progress</p>
            <p className="text-4xl font-bold mt-1">{analytics.total - analytics.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* By Owner (People Partner) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-welocalize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              By People Partner (Owner)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.byOwner.map(([owner, count], idx) => (
              <div key={owner} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{owner}</span>
                  <span className="text-slate-500">{count} profiles</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBarColor(idx)} rounded-full transition-all`}
                    style={{ width: `${(count / analytics.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By Level Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-welocalize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              By Management Level Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.byLevelCategory.map(([category, count], idx) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{category}</span>
                  <span className="text-slate-500">{count} profiles</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBarColor(idx)} rounded-full transition-all`}
                    style={{ width: `${(count / analytics.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By Specific Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-welocalize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              By Specific Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.byLevel.map(([level, count]) => (
                <Badge 
                  key={level} 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200"
                >
                  <span className="font-semibold text-welocalize-blue">{level}</span>
                  <span className="ml-2 text-slate-500">{count}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-welocalize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              By Department
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.byDepartment.map(([dept, count], idx) => (
              <div key={dept} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{dept}</span>
                  <span className="text-slate-500">{count} profiles</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBarColor(idx)} rounded-full transition-all`}
                    style={{ width: `${(count / analytics.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Grade Ranges by Country */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-welocalize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Grade Ranges by Country
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.gradesByCountry.length > 0 ? (
              analytics.gradesByCountry.map(([country, count], idx) => (
                <div key={country} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{country}</span>
                    <span className="text-slate-500">{count} grades added</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getBarColor(idx)} rounded-full transition-all`}
                      style={{ width: `${(count / Math.max(...analytics.gradesByCountry.map(g => g[1]))) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No grade ranges added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Contributors (Grade Ranges) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-welocalize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Top Contributors (Grades Added)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.gradesByPerson.length > 0 ? (
              analytics.gradesByPerson.slice(0, 5).map(([person, count], idx) => (
                <div key={person} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${getBarColor(idx)} flex items-center justify-center text-white text-sm font-medium`}>
                      {idx + 1}
                    </div>
                    <span className="font-medium text-slate-700">{person}</span>
                  </div>
                  <Badge variant="secondary">{count} grades</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No grades added yet</p>
            )}
          </CardContent>
        </Card>

        {/* By Status */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-welocalize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {analytics.byStatus.map(([status, count]) => {
                const statusColors: Record<string, string> = {
                  'New': 'bg-blue-100 text-blue-800 border-blue-200',
                  'Awaiting Mgmt Level': 'bg-amber-100 text-amber-800 border-amber-200',
                  'Under Review': 'bg-purple-100 text-purple-800 border-purple-200',
                  'Grades Pending': 'bg-orange-100 text-orange-800 border-orange-200',
                  'Ready for Workday': 'bg-green-100 text-green-800 border-green-200',
                  'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
                  'Completed': 'bg-slate-100 text-slate-800 border-slate-200',
                };
                return (
                  <div 
                    key={status} 
                    className={`p-4 rounded-xl border ${statusColors[status] || 'bg-slate-100 border-slate-200'}`}
                  >
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm font-medium mt-1">{status}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
