'use client';

import { useMemo, useState } from 'react';

export function YachtSpecsList({ yacht, onUpdateSpecifications }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState([]);

  const specs = useMemo(() => {
    const data = Array.isArray(yacht?.specifications) ? yacht.specifications : [];
    return data.length ? data : [];
  }, [yacht]);

  const startEditing = () => {
    setDraft(specs.map((spec) => ({ ...spec })));
    setIsEditing(true);
  };

  const save = async () => {
    if (!yacht?.id || !onUpdateSpecifications) return;
    await onUpdateSpecifications(yacht.id, draft);
    setIsEditing(false);
  };

  const updateField = (index, field, value) => {
    setDraft((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  const addSpec = () => {
    setDraft((current) => [...current, { label: '', value: '', spec_group: 'specification', sort_order: current.length }]);
  };

  const removeSpec = (index) => {
    setDraft((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Specifications</h3>
        {!isEditing ? (
          <button type="button" onClick={startEditing} className="rounded-xl border border-[#C9A868] px-3 py-1.5 text-xs font-semibold text-[#C9A868]">Edit</button>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={addSpec} className="rounded-xl bg-[#C9A868] px-3 py-1.5 text-xs font-semibold text-black">Add row</button>
            <button type="button" onClick={save} className="rounded-xl bg-[#0E2D4A] px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-[#0E2D4A]">Save</button>
          </div>
        )}
      </div>

      {!isEditing ? (
        specs.length === 0 ? (
          <p className="text-sm text-gray-500">No specifications added.</p>
        ) : (
          <div className="space-y-2">
            {specs.map((spec, index) => (
              <div key={spec.id || `${spec.label}-${index}`} className="flex justify-between gap-3 rounded-xl bg-white px-3 py-2 dark:bg-[#0E2D4A]">
                <span className="font-medium">{spec.label}</span>
                <span className="text-gray-600 dark:text-gray-300">{spec.value}</span>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {draft.length === 0 ? (
            <p className="text-sm text-gray-500">No specifications yet.</p>
          ) : (
            draft.map((spec, index) => (
              <div key={`${spec.label || 'spec'}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  value={spec.label || ''}
                  onChange={(event) => updateField(index, 'label', event.target.value)}
                  placeholder="Label"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#0E2D4A]"
                />
                <input
                  value={spec.value || ''}
                  onChange={(event) => updateField(index, 'value', event.target.value)}
                  placeholder="Value"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#0E2D4A]"
                />
                <button type="button" onClick={() => removeSpec(index)} className="rounded-lg border border-red-300 px-2 py-2 text-xs text-red-600">Remove</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
