'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SEARCH_LIMITS } from '@/lib/constants';

export default function PricingTable() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Back to Home Link */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-16">
        <div className="text-center">
          <h1 className="text-[2.5rem] font-black font-be-vietnam-pro text-zinc-900 dark:text-zinc-100 mb-6 tracking-[-0.02em] leading-tight">
            All Features Free
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium font-be-vietnam-pro leading-relaxed">
            Enjoy all features at no cost
          </p>
        </div>
      </div>

      {/* Free Plan Card */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
          <div className="flex flex-col items-start gap-4">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Free Plan</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">Access to all features</p>
            </div>
            
            <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800">
              Free Forever
            </Badge>

            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Included features:</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-zinc-600 dark:text-zinc-400">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {SEARCH_LIMITS.DAILY_SEARCH_LIMIT} daily searches
                </li>
                <li className="flex items-center text-zinc-600 dark:text-zinc-400">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {SEARCH_LIMITS.EXTREME_SEARCH_LIMIT} monthly extreme searches
                </li>
                <li className="flex items-center text-zinc-600 dark:text-zinc-400">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to all AI models
                </li>
                <li className="flex items-center text-zinc-600 dark:text-zinc-400">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced search capabilities
                </li>
                <li className="flex items-center text-zinc-600 dark:text-zinc-400">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Memory & chat history
                </li>
                <li className="flex items-center text-zinc-600 dark:text-zinc-400">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link href="/">
                <Button size="lg">
                  Start Using Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
