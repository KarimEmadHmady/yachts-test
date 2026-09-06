const STATUS_CONFIG = {
  draft: { label: 'Draft', className: 'bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60' },
  published: { label: 'Published', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  archived: { label: 'Archived', className: 'bg-black/10 text-black/40 dark:bg-white/10 dark:text-white/40' },
  pending: { label: 'Pending review', className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  approved: { label: 'Approved', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  rejected: { label: 'Rejected', className: 'bg-red-500/15 text-red-600 dark:text-red-400' },
};

export function YachtStatusBadge({ status }) {
  if (!status) return null;
  const normalizedStatus = status.toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || {
    label: status,
    className: 'bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}