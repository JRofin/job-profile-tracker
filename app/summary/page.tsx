'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { JobProfileRequest, PEOPLE_PARTNER_BY_AREA } from '@/lib/types';
import { Users, BarChart3, Building2, Globe, Star, CheckCircle2 } from 'lucide-react';

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
      'bg-primary',
      'bg-teal-500',
      'bg-emerald-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-foreground font-medium">Summary</span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Job Profiles Summary</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Analytics and insights on job profile requests
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Profiles</p>
          <p className="text-3xl font-semibold text-primary mt-2">{analytics.total}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</p>
          <p className="text-3xl font-semibold text-emerald-400 mt-2">{analytics.completed}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completion Rate</p>
          <p className="text-3xl font-semibold text-purple-400 mt-2">{analytics.completionRate}%</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In Progress</p>
          <p className="text-3xl font-semibold text-amber-400 mt-2">{analytics.total - analytics.completed}</p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* By Owner (People Partner) */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <Users className="w-4 h-4 text-primary" />
              By People Partner (Owner)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.byOwner.map(([owner, count], idx) => (
              <div key={owner} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{owner}</span>
                  <span className="text-muted-foreground">{count} profiles</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <BarChart3 className="w-4 h-4 text-primary" />
              By Management Level Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.byLevelCategory.map(([category, count], idx) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{category}</span>
                  <span className="text-muted-foreground">{count} profiles</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <BarChart3 className="w-4 h-4 text-primary" />
              By Specific Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.byLevel.map(([level, count]) => (
                <Badge 
                  key={level} 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm bg-secondary border-0"
                >
                  <span className="font-medium text-primary">{level}</span>
                  <span className="ml-2 text-muted-foreground">{count}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Department */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <Building2 className="w-4 h-4 text-primary" />
              By Department
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.byDepartment.map(([dept, count], idx) => (
              <div key={dept} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{dept}</span>
                  <span className="text-muted-foreground">{count} profiles</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <Globe className="w-4 h-4 text-primary" />
              Grade Ranges by Country
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.gradesByCountry.length > 0 ? (
              analytics.gradesByCountry.map(([country, count], idx) => (
                <div key={country} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{country}</span>
                    <span className="text-muted-foreground">{count} grades added</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getBarColor(idx)} rounded-full transition-all`}
                      style={{ width: `${(count / Math.max(...analytics.gradesByCountry.map(g => g[1]))) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No grade ranges added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Contributors (Grade Ranges) */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <Star className="w-4 h-4 text-primary" />
              Top Contributors (Grades Added)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.gradesByPerson.length > 0 ? (
              analytics.gradesByPerson.slice(0, 5).map(([person, count], idx) => (
                <div key={person} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg ${getBarColor(idx)} flex items-center justify-center text-foreground text-xs font-medium`}>
                      {idx + 1}
                    </div>
                    <span className="font-medium text-foreground text-sm">{person}</span>
                  </div>
                  <Badge variant="secondary" className="border-0">{count} grades</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No grades added yet</p>
            )}
          </CardContent>
        </Card>

        {/* By Status */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base font-medium">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {analytics.byStatus.map(([status, count]) => {
                const statusColors: Record<string, string> = {
                  'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  'Awaiting Mgmt Level': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  'Under Review': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                  'Grades Pending': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                  'Ready for Workday': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  'In Progress': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                  'Completed': 'bg-muted text-muted-foreground border-border',
                };
                return (
                  <div 
                    key={status} 
                    className={`p-4 rounded-xl border ${statusColors[status] || 'bg-muted border-border'}`}
                  >
                    <p className="text-2xl font-semibold">{count}</p>
                    <p className="text-xs font-medium mt-1 opacity-80">{status}</p>
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
