'use client';

import { JobProfileRequest, STATUS_COLORS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MapPin, AlertTriangle, Sparkles, UserCheck, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface RequestCardProps {
  request: JobProfileRequest;
  onClick?: () => void;
}

const STATUS_CONFIG: Record<string, { bg: string; iconType: 'new' | 'clock' | 'eye' | 'chart' | 'check' | 'progress' | 'done' }> = {
  'New': { bg: 'bg-blue-500', iconType: 'new' },
  'Awaiting Mgmt Level': { bg: 'bg-amber-500', iconType: 'clock' },
  'Under Review': { bg: 'bg-purple-500', iconType: 'eye' },
  'Grades Pending': { bg: 'bg-orange-500', iconType: 'chart' },
  'Ready for Workday': { bg: 'bg-emerald-500', iconType: 'check' },
  'In Progress': { bg: 'bg-indigo-500', iconType: 'progress' },
  'Completed': { bg: 'bg-muted-foreground', iconType: 'done' },
};

function StatusIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4 text-foreground";
  switch (type) {
    case 'new':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
    case 'clock':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'eye':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'check':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'progress':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'done':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  const isOverdue = request.dueDate && new Date(request.dueDate) < new Date() && request.status !== 'Completed';
  const statusConfig = STATUS_CONFIG[request.status] || { bg: 'bg-muted', iconType: 'new' as const };
  
  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 bg-card border-border hover:border-primary/30 hover:bg-secondary/30 ${
        isOverdue ? 'border-red-500/30 bg-red-500/5' : ''
      } ${request.urgency === 'Urgent' && !isOverdue ? 'border-l-2 border-l-orange-500' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Status Icon */}
            <div className={`w-9 h-9 rounded-lg ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon type={statusConfig.iconType} />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {request.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge className={`${STATUS_COLORS[request.status] || 'bg-muted text-muted-foreground'} text-xs font-medium border-0`}>
                  {request.status}
                </Badge>
                {request.urgency === 'Urgent' && (
                  <Badge variant="destructive" className="text-xs border-0">
                    Urgent
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{request.description}</p>
        
        {/* Meta info */}
        <div className="flex flex-wrap gap-2 text-xs">
          {request.department && (
            <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md text-muted-foreground">
              <User className="h-3 w-3" />
              {request.department}
            </span>
          )}
          
          {request.countriesNeeded?.length > 0 && (
            <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {request.countriesNeeded.slice(0, 2).join(', ')}
              {request.countriesNeeded.length > 2 && (
                <span className="opacity-60">+{request.countriesNeeded.length - 2}</span>
              )}
            </span>
          )}
          
          {request.dueDate && (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
              isOverdue 
                ? 'bg-red-500/20 text-red-400 font-medium' 
                : 'bg-secondary text-muted-foreground'
            }`}>
              {isOverdue ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {formatDate(request.dueDate)}
            </span>
          )}
        </div>

        {/* Level badges */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {request.proposedMgmtLevel && request.proposedMgmtLevel !== 'I don\'t know / Let the team decide' && (
            <span className="px-2.5 py-1 bg-secondary rounded-md text-xs font-medium text-foreground">
              {request.proposedMgmtLevel}
            </span>
          )}
          
          {request.aiSuggestedMgmtLevel && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20">
              <Sparkles className="h-3 w-3" />
              AI: {request.aiSuggestedMgmtLevel}
            </span>
          )}
          
          {request.agreedMgmtLevel && (
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-medium">
              {request.agreedMgmtLevel}
            </span>
          )}

          {(request.owner || request.assignedTo) && (
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground" title="Owner">
              <UserCheck className="h-3 w-3" />
              {(request.owner || request.assignedTo)?.split(' ')[0]}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
