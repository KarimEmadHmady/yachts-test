'use client';

import { useMemo, useState } from 'react';

export function YachtAmenitiesList({ yacht, onUpdateAmenities }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const amenities = useMemo(() => Array.isArray(yacht?.amenities) ? yacht.amenities : [], [yacht]);
  const availableAmenities = useMemo(() => Array.isArray(yacht?.allAmenities) ? yacht.allAmenities : [], [yacht]);

  const startEditing = () => {
    const ids = amenities.map((item) => item.id);
    setSelectedAmenities(ids);
    setIsEditing(true);
  };

  const save = async () => {
    if (!yacht?.id || !onUpdateAmenities) return;
    await onUpdateAmenities(yacht.id, selectedAmenities);
    setIsEditing(false);
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Amenities</h3>
        {!isEditing ? (
          <button type="button" onClick={startEditing} className="rounded-xl border border-[#C9A868] px-3 py-1.5 text-xs font-semibold text-[#C9A868]">Edit</button>
        ) : (
          <button type="button" onClick={save} className="rounded-xl bg-[#0E2D4A] px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-[#0E2D4A]">Save</button>
        )}
      </div>

      {!isEditing ? (
        amenities.length === 0 ? (
          <p className="text-sm text-gray-500">No amenities selected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span key={amenity.id} className="rounded-full bg-[#C9A868]/10 px-3 py-1 text-xs font-medium text-[#C9A868]">
                {amenity.name}
              </span>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-wrap gap-2">
          {availableAmenities.length === 0 ? (
            <p className="text-sm text-gray-500">No available amenities.</p>
          ) : (
            availableAmenities.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedAmenities.includes(amenity.id) ? 'border-[#C9A868] bg-[#C9A868] text-black' : 'border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-[#0E2D4A] dark:text-gray-200'}`}
              >
                {amenity.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
