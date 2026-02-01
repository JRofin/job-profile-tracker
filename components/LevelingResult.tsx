'use client';

import { LevelingResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface LevelingResultProps {
  result: LevelingResponse;
  onAccept: (level: string) => void;
}

export function LevelingResult({ result, onAccept }: LevelingResultProps) {
  const confidencePercent = Math.round((result.confidence || 0.7) * 100);
  
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
          Suggestion based on Welocalize Career Framework
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
        </div>
      </CardContent>
    </Card>
  );
}
