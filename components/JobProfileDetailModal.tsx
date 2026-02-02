'use client';

import { useState, useCallback } from 'react';
import { JobProfileRequest, STATUS_COLORS, GradeRange, Comment, ReviewerVote } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GradeRangesSection, CommentsSection, ReviewerVotesSection } from '@/components/CollaborativePanel';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  MapPin,
  Calendar,
  User,
  Clock,
  Lightbulb,
  FileText
} from 'lucide-react';

interface JobProfileDetailModalProps {
  request: JobProfileRequest | null;
  onClose: () => void;
  onUpdateRequest?: (updatedRequest: JobProfileRequest) => void;
}

export function JobProfileDetailModal({ request, onClose, onUpdateRequest }: JobProfileDetailModalProps) {
  // Local state for collaborative data (in production, this would sync with backend)
  const [localGradeRanges, setLocalGradeRanges] = useState<GradeRange[]>(request?.gradeRanges || []);
  const [localComments, setLocalComments] = useState<Comment[]>(request?.comments || []);
  const [localVotes, setLocalVotes] = useState<ReviewerVote[]>(request?.reviewerVotes || []);
  const [localAgreedLevel, setLocalAgreedLevel] = useState<string | undefined>(request?.agreedMgmtLevel);

  // Reset local state when request changes
  const resetState = useCallback(() => {
    setLocalGradeRanges(request?.gradeRanges || []);
    setLocalComments(request?.comments || []);
    setLocalVotes(request?.reviewerVotes || []);
    setLocalAgreedLevel(request?.agreedMgmtLevel);
  }, [request]);

  // Handlers for collaborative actions
  const handleAddGradeRange = (gradeRange: Omit<GradeRange, 'id' | 'addedDate'>) => {
    const newGradeRange: GradeRange = {
      ...gradeRange,
      id: `gr-${Date.now()}`,
      addedDate: new Date().toISOString()
    };
    setLocalGradeRanges(prev => [...prev, newGradeRange]);
    // In production: call API to save
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: 'Current User', // In production: get from auth
      authorInitials: 'CU',
      text,
      createdAt: new Date().toISOString()
    };
    setLocalComments(prev => [...prev, newComment]);
    // In production: call API to save
  };

  const handleAddVote = (vote: Omit<ReviewerVote, 'id' | 'reviewedAt'>) => {
    const newVote: ReviewerVote = {
      ...vote,
      id: `v-${Date.now()}`,
      reviewedAt: new Date().toISOString()
    };
    setLocalVotes(prev => [...prev, newVote]);
    // In production: call API to save
  };

  const handleAgreeLevel = (level: string) => {
    setLocalAgreedLevel(level);
    // In production: call API to save and update status
  };

  if (!request) return null;

  const isOverdue = request.dueDate && new Date(request.dueDate) < new Date() && request.status !== 'Completed';
  const confidencePercent = request.aiConfidence ? Math.round(request.aiConfidence * 100) : null;

  return (
    <Dialog open={!!request} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose}>
        {/* Header */}
        <DialogHeader className="pr-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle>{request.title}</DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {request.department && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {request.department}
                  </span>
                )}
                <Badge className={STATUS_COLORS[request.status] || 'bg-gray-100'}>
                  {request.status}
                </Badge>
                {request.urgency === 'Urgent' && (
                  <Badge variant="destructive">Urgent</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {/* Job Description */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
              <FileText className="h-4 w-4" />
              Job Description
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {request.description}
            </p>
          </section>

          {/* AI Assessment */}
          {request.aiSuggestedMgmtLevel && (
            <section className="border-2 border-welocalize-blue rounded-lg bg-gradient-to-br from-cyan-50 to-white overflow-hidden">
              <div className="px-4 py-3 bg-white/80 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-welocalize-blue" />
                  <h3 className="font-semibold text-gray-900">AI Assessment</h3>
                </div>
                {confidencePercent !== null && (
                  <Badge variant="secondary" className="bg-welocalize-blue text-white">
                    {confidencePercent}% confidence
                  </Badge>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Suggested Level */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-welocalize-blue">
                      {request.aiSuggestedMgmtLevel}
                    </div>
                    {request.aiCareerStep && request.aiStage && (
                      <div className="text-sm text-muted-foreground">
                        {request.aiCareerStep} Stage {request.aiStage}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {request.proposedMgmtLevel && request.proposedMgmtLevel !== 'I don\'t know / Let the team decide' && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Proposed: </span>
                        <span className="font-medium">{request.proposedMgmtLevel}</span>
                        {request.proposedMgmtLevel === request.aiSuggestedMgmtLevel && (
                          <span className="ml-2 text-green-600 text-xs">Match</span>
                        )}
                      </div>
                    )}
                    {request.agreedMgmtLevel && (
                      <div className="text-sm mt-1">
                        <span className="text-muted-foreground">Agreed: </span>
                        <span className="font-medium text-green-700">{request.agreedMgmtLevel}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rationale */}
                {request.aiSuggestedRationale && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-900 text-sm">Why this level</div>
                      <p className="text-sm text-blue-800 mt-1">{request.aiSuggestedRationale}</p>
                    </div>
                  </div>
                )}

                {/* Why not higher */}
                {request.aiWhyNotHigher && (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-orange-900 text-sm">Why not higher</div>
                      <p className="text-sm text-orange-800 mt-1">{request.aiWhyNotHigher}</p>
                    </div>
                  </div>
                )}

                {/* Why not lower */}
                {request.aiWhyNotLower && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-green-900 text-sm">Why not lower</div>
                      <p className="text-sm text-green-800 mt-1">{request.aiWhyNotLower}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* JD Improvement Suggestions */}
          {request.aiJdImprovements && request.aiJdImprovements.length > 0 && (
            <section className="border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-amber-50 border-b flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">JD Improvement Suggestions</h3>
              </div>
              <ul className="divide-y">
                {request.aiJdImprovements.map((improvement, index) => (
                  <li key={index} className="px-4 py-3 text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-amber-600 font-medium">{index + 1}.</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Team Review Section */}
          <ReviewerVotesSection
            reviewerVotes={localVotes}
            aiSuggestedLevel={request.aiSuggestedMgmtLevel}
            agreedLevel={localAgreedLevel}
            onAddVote={handleAddVote}
            onAgreeLevel={handleAgreeLevel}
          />

          {/* Grade Ranges Section */}
          <GradeRangesSection
            gradeRanges={localGradeRanges}
            countriesNeeded={request.countriesNeeded || []}
            onAddGradeRange={handleAddGradeRange}
          />

          {/* Discussion Section */}
          <CommentsSection
            comments={localComments}
            onAddComment={handleAddComment}
          />

          {/* Metadata */}
          <section className="grid grid-cols-2 gap-4 text-sm">
            {/* Countries */}
            {request.countriesNeeded && request.countriesNeeded.length > 0 && (
              <div className="col-span-2 flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Countries: </span>
                  <span className="font-medium">{request.countriesNeeded.join(', ')}</span>
                </div>
              </div>
            )}

            {/* Request Date */}
            {request.requestDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Requested: </span>
                  <span className="font-medium">
                    {formatDate(request.requestDate)}
                  </span>
                </div>
              </div>
            )}

            {/* Due Date */}
            {request.dueDate && (
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`} />
                <div className={isOverdue ? 'text-red-600' : ''}>
                  <span className={isOverdue ? 'text-red-600' : 'text-muted-foreground'}>Due: </span>
                  <span className="font-medium">
                    {formatDate(request.dueDate)}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </div>
              </div>
            )}

            {/* Assigned To */}
            {request.assignedTo && (
              <div className="col-span-2 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Assigned to: </span>
                  <span className="font-medium">{request.assignedTo}</span>
                </div>
              </div>
            )}

            {/* Justification */}
            {request.justification && (
              <div className="col-span-2">
                <div className="text-muted-foreground mb-1">Justification:</div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.justification}</p>
              </div>
            )}

            {/* Notes */}
            {request.notes && (
              <div className="col-span-2">
                <div className="text-muted-foreground mb-1">Notes:</div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.notes}</p>
              </div>
            )}
          </section>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
