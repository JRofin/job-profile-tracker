'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelingResult } from '@/components/LevelingResult';
import { DEPARTMENTS, MANAGEMENT_LEVELS, COUNTRIES, getPeoplePartnerForDepartment, LevelingResponse, JobProfileRequest } from '@/lib/types';
import { Sparkles, Send, Loader2, AlertCircle, FileText } from 'lucide-react';

interface NewRequestFormProps {
  onSubmit?: (request: Partial<JobProfileRequest>) => Promise<void>;
}

export function NewRequestForm({ onSubmit }: NewRequestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    proposedMgmtLevel: '',
    justification: '',
    countriesNeeded: [] as string[],
    urgency: 'Normal' as 'Normal' | 'Urgent',
  });

  const [levelingResult, setLevelingResult] = useState<LevelingResponse | null>(null);
  const [isLoadingLeveling, setIsLoadingLeveling] = useState(false);
  const [levelingError, setLevelingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear leveling result if title or description changes
    if (field === 'title' || field === 'description') {
      setLevelingResult(null);
      setLevelingError(null);
    }
  };

  const handleCountryToggle = (country: string) => {
    setFormData(prev => ({
      ...prev,
      countriesNeeded: prev.countriesNeeded.includes(country)
        ? prev.countriesNeeded.filter(c => c !== country)
        : [...prev.countriesNeeded, country]
    }));
  };

  const handleSuggestLevel = async () => {
    if (!formData.title || !formData.description) {
      setLevelingError('Please enter the job title and description');
      return;
    }

    setIsLoadingLeveling(true);
    setLevelingError(null);

    try {
      const response = await fetch('/api/leveling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          department: formData.department,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error getting suggestion');
      }

      const result: LevelingResponse = await response.json();
      setLevelingResult(result);
    } catch (error) {
      setLevelingError(error instanceof Error ? error.message : 'Error getting suggestion');
    } finally {
      setIsLoadingLeveling(false);
    }
  };

  const handleAcceptLevel = (level: string) => {
    setFormData(prev => ({ ...prev, proposedMgmtLevel: level }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      return;
    }

    setIsSubmitting(true);

    try {
      const peoplePartner = formData.department ? getPeoplePartnerForDepartment(formData.department) : null;
      const request: Partial<JobProfileRequest> = {
        ...formData,
        status: formData.proposedMgmtLevel === 'I don\'t know / Let the team decide' || !formData.proposedMgmtLevel
          ? 'Awaiting Mgmt Level'
          : 'Under Review',
        owner: peoplePartner?.lead,
        ownerCoLead: peoplePartner?.coLead,
        assignedTo: peoplePartner?.lead ?? undefined,
        aiSuggestedMgmtLevel: levelingResult?.suggestedLevel,
        aiSuggestedRationale: levelingResult?.rationale,
        aiCareerStep: levelingResult?.careerStep,
        aiStage: levelingResult?.stage,
        aiConfidence: levelingResult?.confidence,
        aiWhyNotHigher: levelingResult?.whyNotHigher,
        aiWhyNotLower: levelingResult?.whyNotLower,
        aiJdImprovements: levelingResult?.jdImprovements,
        aiSuggestedDate: levelingResult ? new Date().toISOString() : undefined,
        requestDate: new Date().toISOString(),
      };

      if (onSubmit) {
        await onSubmit(request);
      } else {
        // Demo mode - just log
        console.log('Request to submit:', request);
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-medium text-foreground">Job Profile Details</CardTitle>
              <CardDescription className="text-muted-foreground">
                Required fields marked with *
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Cloud Platform Engineer II"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-secondary/50 border-border focus:bg-secondary focus:border-primary/50"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe main responsibilities, requirements, autonomy level, team management..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className="bg-secondary/50 border-border focus:bg-secondary focus:border-primary/50"
              required
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department" className="text-foreground">Department</Label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {formData.department && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Owner (People Partner):</span>{' '}
                {getPeoplePartnerForDepartment(formData.department).lead}
                {' '}
                <span className="text-muted-foreground">(Co-Lead: {getPeoplePartnerForDepartment(formData.department).coLead})</span>
                {' '}
                — They will receive reminders and drive execution.
              </p>
            )}
          </div>

          {/* AI Suggestion Button */}
          <div className="flex flex-col gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">AI-Powered Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Get an intelligent suggestion for the management level based on the Career Framework and 4 Pillars.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleSuggestLevel}
              disabled={isLoadingLeveling || !formData.title || !formData.description}
              className="w-full bg-card border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              {isLoadingLeveling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest Level with AI
                </>
              )}
            </Button>

            {levelingError && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {levelingError}
              </div>
            )}
          </div>

          {/* Leveling Result */}
          {levelingResult && (
            <LevelingResult 
              result={levelingResult} 
              onAccept={handleAcceptLevel}
              title={formData.title}
              description={formData.description}
              department={formData.department}
            />
          )}

          {/* Management Level */}
          <div className="space-y-2">
            <Label htmlFor="proposedMgmtLevel" className="text-foreground">
              Proposed Level
              {levelingResult && formData.proposedMgmtLevel === levelingResult.suggestedLevel && (
                <span className="ml-2 text-xs text-primary">(AI suggestion accepted)</span>
              )}
            </Label>
            <select
              id="proposedMgmtLevel"
              value={formData.proposedMgmtLevel}
              onChange={(e) => handleInputChange('proposedMgmtLevel', e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              <option value="">Select a level</option>
              {MANAGEMENT_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Countries */}
          <div className="space-y-2">
            <Label className="text-foreground">Countries Requiring Grade Ranges</Label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map(country => (
                <button
                  key={country}
                  type="button"
                  onClick={() => handleCountryToggle(country)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    formData.countriesNeeded.includes(country)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label className="text-foreground">Urgency</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="radio"
                  name="urgency"
                  value="Normal"
                  checked={formData.urgency === 'Normal'}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="accent-primary"
                />
                Normal
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="radio"
                  name="urgency"
                  value="Urgent"
                  checked={formData.urgency === 'Urgent'}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="accent-primary"
                />
                Urgent
              </label>
            </div>
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification" className="text-foreground">Justification (optional)</Label>
            <Textarea
              id="justification"
              placeholder="Why is this Job Profile needed?"
              value={formData.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              rows={3}
              className="bg-secondary/50 border-border focus:bg-secondary focus:border-primary/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="sticky bottom-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.description}
          className={`w-full transition-all ${
            submitSuccess 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'bg-primary hover:bg-primary/90'
          }`}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Request...
            </>
          ) : submitSuccess ? (
            <>
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Request Submitted Successfully!
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
