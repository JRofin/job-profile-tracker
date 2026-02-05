'use client';

import { useState } from 'react';
import { GradeRange, Comment, ReviewerVote, COUNTRIES, MANAGEMENT_LEVELS } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  MessageSquare,
  Users,
  Plus,
  Send,
  Check,
  ThumbsUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// ============ Grade Ranges Section ============
interface GradeRangesSectionProps {
  gradeRanges: GradeRange[];
  countriesNeeded: string[];
  onAddGradeRange: (gradeRange: Omit<GradeRange, 'id' | 'addedDate'>) => void;
}

export function GradeRangesSection({ gradeRanges, countriesNeeded, onAddGradeRange }: GradeRangesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [country, setCountry] = useState('');
  const [minGrade, setMinGrade] = useState('');
  const [maxGrade, setMaxGrade] = useState('');
  const [notes, setNotes] = useState('');

  // Countries that still need grade ranges
  const countriesWithGrades = gradeRanges.map(gr => gr.country);
  const pendingCountries = countriesNeeded.filter(c => !countriesWithGrades.includes(c));

  const handleSubmit = () => {
    if (!country || !minGrade || !maxGrade) return;
    onAddGradeRange({
      country,
      minGrade: parseInt(minGrade),
      maxGrade: parseInt(maxGrade),
      addedBy: 'Current User',
      notes: notes || undefined
    });
    setIsAdding(false);
    setCountry('');
    setMinGrade('');
    setMaxGrade('');
    setNotes('');
  };

  return (
    <section className="border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-emerald-400" />
          <h3 className="font-medium text-foreground">Grade Ranges by Country</h3>
        </div>
        <div className="flex items-center gap-2">
          {pendingCountries.length > 0 && (
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-0">
              {pendingCountries.length} pending
            </Badge>
          )}
          {!isAdding && (
            <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-border">
        {gradeRanges.length === 0 && !isAdding && (
          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
            No grade ranges added yet. Countries needed: {countriesNeeded.join(', ')}
          </div>
        )}

        {gradeRanges.map((gr) => (
          <div key={gr.id} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground">{gr.country}</span>
              <Badge variant="secondary" className="border-0">Grade {gr.minGrade} - {gr.maxGrade}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {gr.addedBy} · {formatDate(gr.addedDate)}
            </div>
          </div>
        ))}

        {isAdding && (
          <div className="px-4 py-3 bg-secondary/30 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-9 rounded-lg border border-border bg-secondary/50 px-3 py-1 text-sm text-foreground focus:bg-secondary focus:ring-2 focus:ring-primary"
              >
                <option value="">Select country...</option>
                {COUNTRIES.filter(c => countriesNeeded.includes(c)).map(c => (
                  <option key={c} value={c} disabled={countriesWithGrades.includes(c)}>
                    {c} {countriesWithGrades.includes(c) ? '(done)' : ''}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Min grade"
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="h-9 bg-secondary/50 border-border"
              />
              <Input
                type="number"
                placeholder="Max grade"
                value={maxGrade}
                onChange={(e) => setMaxGrade(e.target.value)}
                className="h-9 bg-secondary/50 border-border"
              />
            </div>
            <Input
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-9 bg-secondary/50 border-border"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={!country || !minGrade || !maxGrade}>
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============ Comments Section ============
interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export function CommentsSection({ comments, onAddComment }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(comments.length <= 3);

  const displayedComments = isExpanded ? comments : comments.slice(-3);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
  };

  return (
    <section className="border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-blue-500/10 border-b border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          <h3 className="font-medium text-foreground">Discussion</h3>
          {comments.length > 0 && (
            <Badge variant="secondary" className="border-0">{comments.length}</Badge>
          )}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {comments.length === 0 && (
          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
            No comments yet. Start the discussion!
          </div>
        )}

        {comments.length > 3 && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/10 flex items-center justify-center gap-1"
          >
            <ChevronUp className="h-4 w-4" />
            Show {comments.length - 3} earlier comments
          </button>
        )}

        {displayedComments.map((comment) => (
          <div key={comment.id} className="px-4 py-3 border-b border-border last:border-b-0">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                {comment.authorInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-foreground/80 mt-1">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}

        {isExpanded && comments.length > 3 && (
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/10 flex items-center justify-center gap-1"
          >
            <ChevronDown className="h-4 w-4" />
            Show less
          </button>
        )}
      </div>

      <div className="px-4 py-3 bg-secondary/30 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none bg-secondary/50 border-border"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="h-[60px] w-10 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ============ Reviewer Votes Section ============
interface ReviewerVotesSectionProps {
  reviewerVotes: ReviewerVote[];
  aiSuggestedLevel?: string;
  agreedLevel?: string;
  onAddVote: (vote: Omit<ReviewerVote, 'id' | 'reviewedAt'>) => void;
  onAgreeLevel: (level: string) => void;
}

export function ReviewerVotesSection({
  reviewerVotes,
  aiSuggestedLevel,
  agreedLevel,
  onAddVote,
  onAgreeLevel
}: ReviewerVotesSectionProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(aiSuggestedLevel || '');
  const [voteNotes, setVoteNotes] = useState('');

  // Calculate vote summary
  const voteCounts: Record<string, number> = {};
  reviewerVotes.forEach(vote => {
    voteCounts[vote.suggestedLevel] = (voteCounts[vote.suggestedLevel] || 0) + 1;
  });
  const topVotedLevel = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0];

  const handleSubmitVote = () => {
    if (!selectedLevel) return;
    onAddVote({
      reviewer: 'Current User',
      reviewerInitials: 'CU',
      suggestedLevel: selectedLevel,
      hasApproved: true,
      notes: voteNotes || undefined
    });
    setIsVoting(false);
    setVoteNotes('');
  };

  // Filter management levels to only show actual levels (not "I don't know")
  const levelOptions = MANAGEMENT_LEVELS.filter(l => !l.includes("don't know"));

  return (
    <section className="border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-400" />
          <h3 className="font-medium text-foreground">Team Review</h3>
          {reviewerVotes.length > 0 && (
            <Badge variant="secondary" className="border-0">{reviewerVotes.length} votes</Badge>
          )}
        </div>
        {!isVoting && !agreedLevel && (
          <Button size="sm" variant="outline" onClick={() => setIsVoting(true)}>
            <ThumbsUp className="h-4 w-4 mr-1" /> Add Vote
          </Button>
        )}
      </div>

      {/* Agreed Level Banner */}
      {agreedLevel && (
        <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="font-medium text-emerald-400">
            Agreed Level: <span className="text-lg">{agreedLevel}</span>
          </span>
        </div>
      )}

      {/* Vote Summary */}
      {reviewerVotes.length > 0 && !agreedLevel && (
        <div className="px-4 py-3 bg-secondary/30 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {Object.entries(voteCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([level, count]) => (
                <button
                  key={level}
                  onClick={() => onAgreeLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    level === topVotedLevel?.[0]
                      ? 'bg-purple-500 text-white'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {level}: {count} vote{count > 1 ? 's' : ''}
                </button>
              ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click a level to set it as the agreed level
          </p>
        </div>
      )}

      {/* Individual Votes */}
      <div className="divide-y divide-border max-h-48 overflow-y-auto">
        {reviewerVotes.length === 0 && !isVoting && (
          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
            No votes yet. Be the first to review!
          </div>
        )}

        {reviewerVotes.map((vote) => (
          <div key={vote.id} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center text-sm font-medium">
                {vote.reviewerInitials}
              </div>
              <div>
                <span className="font-medium text-sm text-foreground">{vote.reviewer}</span>
                {vote.notes && (
                  <p className="text-xs text-muted-foreground">{vote.notes}</p>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-0">
              {vote.suggestedLevel}
            </Badge>
          </div>
        ))}

        {/* Add Vote Form */}
        {isVoting && (
          <div className="px-4 py-3 bg-secondary/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">My suggested level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="h-9 rounded-lg border border-border bg-secondary/50 px-3 py-1 text-sm text-foreground flex-1 focus:ring-2 focus:ring-primary"
              >
                <option value="">Select level...</option>
                {levelOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <Input
              placeholder="Notes (optional) - Why do you suggest this level?"
              value={voteNotes}
              onChange={(e) => setVoteNotes(e.target.value)}
              className="h-9 bg-secondary/50 border-border"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setIsVoting(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmitVote} disabled={!selectedLevel}>
                <ThumbsUp className="h-4 w-4 mr-1" /> Submit Vote
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
