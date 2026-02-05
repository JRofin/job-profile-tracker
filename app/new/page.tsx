import { NewRequestForm } from '@/components/NewRequestForm';
import Link from 'next/link';

export default function NewRequestPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-foreground font-medium">New Request</span>
      </nav>

      {/* Page Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Create New Job Profile Request</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the job details below. Use AI to get a management level suggestion.
        </p>
      </div>

      <NewRequestForm />
    </div>
  );
}
