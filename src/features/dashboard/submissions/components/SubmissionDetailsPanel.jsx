'use client';

export function SubmissionDetailsPanel({ submission, onApprove, onReject }) {
  if (!submission) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A] dark:text-gray-300">
        Select a submission to review details.
      </div>
    );
  }

  const images = Array.isArray(submission.images) ? submission.images : [];
  const specs = Array.isArray(submission.specifications) ? submission.specifications : [];
  const amenities = Array.isArray(submission.amenities) ? submission.amenities : [];

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#0E2D4A]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C9A868]">Submission</p>
          <h2 className="mt-2 text-xl font-bold">{submission.name || 'Untitled yacht'} </h2>
        </div>
        <span className="rounded-full bg-[#C9A868]/20 px-3 py-1 text-xs font-medium text-[#8B6B2E]">
          {submission.submission_status || 'pending'}
        </span>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-[#012241]">
          <p className="text-xs text-gray-500 dark:text-gray-300">Brand</p>
          <p className="mt-1 font-medium">{submission.submitted_brand_name || submission.brand_name || 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-[#012241]">
          <p className="text-xs text-gray-500 dark:text-gray-300">Price</p>
          <p className="mt-1 font-medium">{submission.price_sale ? `$${Number(submission.price_sale).toLocaleString()}` : 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-[#012241]">
          <p className="text-xs text-gray-500 dark:text-gray-300">Size</p>
          <p className="mt-1 font-medium">{submission.size_meters ? `${submission.size_meters} m` : 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-[#012241]">
          <p className="text-xs text-gray-500 dark:text-gray-300">Cabins</p>
          <p className="mt-1 font-medium">{submission.cabins ?? 'N/A'}</p>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Submitter</h3>
        <div className="rounded-xl bg-gray-50 p-3 text-sm dark:bg-[#012241]">
          <p>{submission.submitted_by_first_name || ''} {submission.submitted_by_last_name || ''}</p>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{submission.submitted_by_email || 'N/A'}</p>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{submission.submitted_by_phone || 'N/A'}</p>
        </div>
      </div>

      {submission.submitted_message && (
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Message</h3>
          <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700 dark:bg-[#012241] dark:text-gray-200">
            {submission.submitted_message}
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Images</h3>
          <div className="grid grid-cols-2 gap-2">
            {images.slice(0, 6).map((image, index) => (
              <img
                key={`${image.id || index}-${index}`}
                src={image.image_path || image.url || image.src}
                alt={`${submission.name || 'Yacht'} ${index + 1}`}
                className="h-24 w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {specs.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Specifications</h3>
          <div className="space-y-2 rounded-xl bg-gray-50 p-3 text-sm dark:bg-[#012241]">
            {specs.map((spec, index) => (
              <div key={`${spec.id || index}`} className="flex justify-between gap-3 border-b border-black/5 pb-2 last:border-b-0 last:pb-0 dark:border-white/10">
                <span className="text-gray-600 dark:text-gray-300">{spec.label || spec.name || 'Spec'}</span>
                <span className="font-medium">{spec.value || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {amenities.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <span key={`${amenity.id || index}`} className="rounded-full bg-[#C9A868]/15 px-2.5 py-1 text-xs font-medium text-[#6B5321] dark:text-[#F3D48F]">
                {amenity.name || amenity.title || 'Amenity'}
              </span>
            ))}
          </div>
        </div>
      )}
      {(submission.submission_status || 'pending') === 'pending' && (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => onApprove(submission.id)}
            className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject(submission.id)}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
