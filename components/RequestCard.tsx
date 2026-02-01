'use client';

import { JobProfileRequest, STATUS_COLORS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MapPin, AlertTriangle, Sparkles } from 'lucide-react';

interface RequestCardProps {
  request: JobProfileRequest;
  onClick?: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  const isOverdue = request.dueDate && new Date(request.dueDate) < new Date() && request.status !== 'Completed';
  
  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isOverdue ? 'border-red-300 bg-red-50' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">{request.title}</CardTitle>
          <Badge className={STATUS_COLORS[request.status] || 'bg-gray-100'}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
        
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {request.department && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {request.department}
            </span>
          )}
          
          {request.countriesNeeded?.length > 0 && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {request.countriesNeeded.slice(0, 2).join(', ')}
              {request.countriesNeeded.length > 2 && ` +${request.countriesNeeded.length - 2}`}
            </span>
          )}
          
          {request.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              {isOverdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              {new Date(request.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {request.proposedMgmtLevel && request.proposedMgmtLevel !== 'I don\'t know / Let the team decide' && (
            <span className="px-2 py-0.5 bg-gray-100 rounded text-sm font-medium">
              {request.proposedMgmtLevel}
            </span>
          )}
          
          {request.aiSuggestedMgmtLevel && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-cyan-50 text-welocalize-blue rounded text-sm">
              <Sparkles className="h-3 w-3" />
              IA: {request.aiSuggestedMgmtLevel}
            </span>
          )}
          
          {request.agreedMgmtLevel && (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-sm font-medium">
              Agreed: {request.agreedMgmtLevel}
            </span>
          )}
          
          {request.urgency === 'Urgent' && (
            <Badge variant="destructive" className="text-xs">Urgent</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
