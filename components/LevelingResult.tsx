'use client';

import { useState } from 'react';
import { LevelingResponse, ImproveJDResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, TrendingDown, Info, FileText, Loader2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface LevelingResultProps {
  result: LevelingResponse;
  onAccept: (level: string) => void;
  title?: string;
  description?: string;
  department?: string;
}

export function LevelingResult({ result, onAccept, title, description, department }: LevelingResultProps) {
  const confidencePercent = Math.round((result.confidence || 0.7) * 100);
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);
  const [improvedJD, setImprovedJD] = useState<ImproveJDResponse | null>(null);
  const [jdError, setJdError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);

  const handleGenerateImprovedJD = async () => {
    if (!title || !description) {
      setJdError('Title and description are required to generate improved JD');
      return;
    }

    setIsGeneratingJD(true);
    setJdError(null);

    try {
      const response = await fetch('/api/leveling/improve-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          department,
          suggestedLevel: result.suggestedLevel,
          jdImprovements: result.jdImprovements,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error generating improved JD');
      }

      const data: ImproveJDResponse = await response.json();
      setImprovedJD(data);
    } catch (error) {
      setJdError(error instanceof Error ? error.message : 'Error generating improved JD');
    } finally {
      setIsGeneratingJD(false);
    }
  };

  const handleCopyJD = async () => {
    if (improvedJD?.improvedJD) {
      await navigator.clipboard.writeText(improvedJD.improvedJD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <Card className="border-2 border-welocalize-blue bg-gradient-to-br from-cyan-50 to-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-welocalize-blue" />
            <CardTitle className="text-lg">AI Assessment</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-welocalize-blue text-white">
            {confidencePercent}% confidence
          </Badge>
        </div>
        <CardDescription>
          Suggestion based on Welo Global Career Framework
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Suggested Level */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          <div className="text-center">
            <div className="text-4xl font-bold text-welocalize-blue">{result.suggestedLevel}</div>
            <div className="text-sm text-muted-foreground">{result.careerStep} Stage {result.stage}</div>
          </div>
          <div className="flex-1">
            <button
              onClick={() => onAccept(result.suggestedLevel)}
              className="w-full px-4 py-2 bg-welocalize-blue text-white rounded-md hover:bg-welocalize-blue-dark transition-colors font-medium"
            >
              Accept this level
            </button>
          </div>
        </div>

        {/* Rationale */}
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-blue-900 text-sm">Why this level</div>
              <p className="text-sm text-blue-800 mt-1">{result.rationale}</p>
            </div>
          </div>

          {result.whyNotHigher && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-orange-900 text-sm">Why not higher</div>
                <p className="text-sm text-orange-800 mt-1">{result.whyNotHigher}</p>
              </div>
            </div>
          )}

          {result.whyNotLower && (
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-green-900 text-sm">Why not lower</div>
                <p className="text-sm text-green-800 mt-1">{result.whyNotLower}</p>
              </div>
            </div>
          )}

          {/* JD Improvements suggestions (collapsible) */}
          {result.jdImprovements && result.jdImprovements.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowImprovements(!showImprovements)}
                className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900 text-sm">Suggested JD improvements</span>
                  <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                    {result.jdImprovements.length}
                  </Badge>
                </div>
                {showImprovements ? (
                  <ChevronUp className="h-4 w-4 text-purple-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-purple-600" />
                )}
              </button>
              {showImprovements && (
                <div className="p-3 bg-white border-t">
                  <ul className="space-y-2">
                    {result.jdImprovements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-purple-600 font-medium">{idx + 1}.</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Generate Improved JD Button */}
          {title && description && (
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateImprovedJD}
                disabled={isGeneratingJD}
                className="w-full border-purple-500 text-purple-700 hover:bg-purple-50"
              >
                {isGeneratingJD ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating improved JD...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate improved JD (aligned with Career Framework & 4 Pillars)
                  </>
                )}
              </Button>
              {jdError && (
                <p className="text-sm text-red-600 mt-2">{jdError}</p>
              )}
            </div>
          )}

          {/* Improved JD Result */}
          {improvedJD && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Improved Job Description
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyJD}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {copied ? (
                    <>
                      <Check className="mr-1 h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              
              {/* Changes summary */}
              {improvedJD.changes && improvedJD.changes.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-1">Changes made:</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    {improvedJD.changes.map((change, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* The improved JD */}
              <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                  {improvedJD.improvedJD}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
