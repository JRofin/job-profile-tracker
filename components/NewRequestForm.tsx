'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelingResult } from '@/components/LevelingResult';
import { DEPARTMENTS, MANAGEMENT_LEVELS, COUNTRIES, LevelingResponse, JobProfileRequest } from '@/lib/types';
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
      const request: Partial<JobProfileRequest> = {
        ...formData,
        status: formData.proposedMgmtLevel === 'I don\'t know / Let the team decide' || !formData.proposedMgmtLevel
          ? 'Awaiting Mgmt Level'
          : 'Under Review',
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
      <Card>
        <CardHeader>
          <CardTitle>New Job Profile Request</CardTitle>
          <CardDescription>
            Fill in the job details. You can use AI to get a management level suggestion.
          </CardDescription>
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
          </div>

          {/* AI Suggestion Button */}
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSuggestLevel}
              disabled={isLoadingLeveling || !formData.title || !formData.description}
              className="w-full border-welocalize-blue text-welocalize-blue hover:bg-welocalize-blue hover:text-white"
            >
              {isLoadingLeveling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest level with AI
                </>
              )}
            </Button>

            {levelingError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {levelingError}
              </div>
            )}
          </div>

          {/* Leveling Result */}
          {levelingResult && (
            <LevelingResult result={levelingResult} onAccept={handleAcceptLevel} />
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
      <Button
        type="submit"
        disabled={isSubmitting || !formData.title || !formData.description}
        className="w-full bg-welocalize-blue hover:bg-welocalize-blue-dark"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : submitSuccess ? (
          <>
            ✓ Request Submitted
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Request
          </>
        )}
      </Button>
    </form>
  );
}
