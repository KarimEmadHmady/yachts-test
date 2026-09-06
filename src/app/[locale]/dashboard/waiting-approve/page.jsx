'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDashboardSubmissions } from '@/features/dashboard/submissions/hooks/useDashboardSubmissions';
import { SubmissionTable } from '@/features/dashboard/submissions/components/SubmissionTable';
import { SubmissionDetailsPanel } from '@/features/dashboard/submissions/components/SubmissionDetailsPanel';

export default function WaitingApprovePage() {
  const {
    submissions,
    selectedSubmission,
    setSelectedSubmission,
    fetchSubmissions,
    fetchSubmissionById,
    approveSubmission,
    rejectSubmission,
    loading,
    error,
  } = useDashboardSubmissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTargetId, setRejectTargetId] = useState(null);

  useEffect(() => {
    fetchSubmissions(filter).catch(() => undefined);
  }, [fetchSubmissions, filter]);

  const filteredSubmissions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return submissions;

    return submissions.filter((submission) => {
      const haystack = [
        submission.name,
        submission.submitted_brand_name,
        submission.submitted_by_first_name,
        submission.submitted_by_last_name,
        submission.submitted_by_email,
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [searchTerm, submissions]);

  const handleApprove = async (id) => {
    try {
      await approveSubmission(id);
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const openRejectModal = async (id) => {
    setRejectTargetId(id);
    const submission = submissions.find((item) => Number(item.id) === Number(id));
    setRejectReason(submission?.rejection_comment || '');
  };

  const confirmReject = async () => {
    if (!rejectTargetId) return;

    try {
      await rejectSubmission(rejectTargetId, rejectReason);
      setRejectTargetId(null);
      setRejectReason('');
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const handleSelect = async (submission) => {
    setSelectedSubmission(submission);
    if (submission?.id) {
      await fetchSubmissionById(submission.id).catch(() => undefined);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A868]">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">Waiting approvals</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-[#0E2D4A]"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#0E2D4A]">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by yacht, brand, or submitter..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1.1fr]">
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A]">
                Loading submissions...
              </div>
            ) : (
              <SubmissionTable
                submissions={filteredSubmissions}
                selectedId={selectedSubmission?.id}
                onSelect={handleSelect}
                onApprove={handleApprove}
                onReject={openRejectModal}
              />
            )}
          </div>

          <SubmissionDetailsPanel
            submission={selectedSubmission}
            onApprove={handleApprove}
            onReject={openRejectModal}
          />
        </div>
      </div>

      {rejectTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-[#0E2D4A]">
            <h3 className="mb-3 text-xl font-bold">Reject submission</h3>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={5}
              placeholder="Add a rejection note..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectTargetId(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm reject
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
