'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelingResult } from '@/components/LevelingResult';
import { DEPARTMENTS, MANAGEMENT_LEVELS, COUNTRIES, getPeoplePartnerForDepartment, LevelingResponse, JobProfileRequest } from '@/lib/types';
import { Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';

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
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-welocalize-blue to-cyan-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Job Profile Details</CardTitle>
              <CardDescription>
                Required fields marked with *
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Cloud Platform Engineer II"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe main responsibilities, requirements, autonomy level, team management..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          <div className="flex flex-col gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 text-welocalize-blue" />
              <span className="font-medium">AI-Powered Analysis</span>
            </div>
            <p className="text-sm text-slate-500">
              Get an intelligent suggestion for the management level based on the Career Framework and 4 Pillars.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleSuggestLevel}
              disabled={isLoadingLeveling || !formData.title || !formData.description}
              className="w-full bg-white border-welocalize-blue text-welocalize-blue hover:bg-gradient-to-r hover:from-welocalize-blue hover:to-cyan-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md"
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
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
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
            <Label htmlFor="proposedMgmtLevel">
              Proposed Level
              {levelingResult && formData.proposedMgmtLevel === levelingResult.suggestedLevel && (
                <span className="ml-2 text-xs text-welocalize-blue">(AI suggestion accepted)</span>
              )}
            </Label>
            <select
              id="proposedMgmtLevel"
              value={formData.proposedMgmtLevel}
              onChange={(e) => handleInputChange('proposedMgmtLevel', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select a level</option>
              {MANAGEMENT_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Countries */}
          <div className="space-y-2">
            <Label>Countries Requiring Grade Ranges</Label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map(country => (
                <button
                  key={country}
                  type="button"
                  onClick={() => handleCountryToggle(country)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.countriesNeeded.includes(country)
                      ? 'bg-welocalize-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label>Urgency</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="Normal"
                  checked={formData.urgency === 'Normal'}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="text-welocalize-blue"
                />
                Normal
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="Urgent"
                  checked={formData.urgency === 'Urgent'}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="text-welocalize-blue"
                />
                Urgent
              </label>
            </div>
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification">Justification (optional)</Label>
            <Textarea
              id="justification"
              placeholder="Why is this Job Profile needed?"
              value={formData.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="sticky bottom-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.description}
          className={`w-full shadow-lg hover:shadow-xl transition-all ${
            submitSuccess 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gradient-to-r from-welocalize-blue to-cyan-600 hover:from-welocalize-blue-dark hover:to-cyan-700'
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
