'use client';

export function SubmissionTable({ submissions = [], selectedId, onSelect, onApprove, onReject }) {
  if (!submissions.length) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A] dark:text-gray-300">
        No submissions found.
      </div>
    );
  }

  const statusStyles = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    approved: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  };

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        const isSelected = Number(selectedId) === Number(submission.id);
        const status = submission.submission_status || 'pending';
        const isPending = status === 'pending';
        const coverImage = Array.isArray(submission.images) && submission.images.length > 0
          ? (submission.images[0].image_path || submission.images[0].url || submission.images[0].src)
          : null;

        return (
          <div
            key={submission.id}
            onClick={() => onSelect(submission)}
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors ${
              isSelected
                ? 'border-[#C9A868] bg-[#FFF9F0] dark:border-[#C9A868] dark:bg-[#10314f]'
                : 'border-black/10 bg-white hover:bg-black/[0.02] dark:border-white/10 dark:bg-[#0E2D4A] dark:hover:bg-white/[0.03]'
            }`}
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-[#012241]">
              {coverImage ? (
                <img src={coverImage} alt={submission.name || 'Yacht'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-semibold text-gray-900 dark:text-white">
                  {submission.name || submission.submitted_brand_name || 'Untitled yacht'}
                </p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[status] || statusStyles.pending}`}>
                  {status}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-300">
                {submission.submitted_brand_name || 'Brand not set'}
              </p>
              <p className="mt-1 truncate text-xs text-gray-600 dark:text-gray-300">
                {submission.submitted_by_first_name || 'N/A'} {submission.submitted_by_last_name || ''}
              </p>
            </div>

            {isPending && (
              <div className="flex shrink-0 gap-2" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => onApprove(submission.id)}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onReject(submission.id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}