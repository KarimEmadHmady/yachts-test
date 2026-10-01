'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, UploadCloud, ArrowUpRight } from 'lucide-react';

export interface SellYourBoatForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  brandName: string;
  price: string;
  size: string;
  cabins: number;
  message: string;
}

export interface SellYourBoatPayload extends SellYourBoatForm {
  gallery: File[];
}

interface SellYourBoatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: SellYourBoatPayload) => void | Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
  submitSuccess?: boolean;
}

export function SellYourBoatModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitError = null,
  submitSuccess = false,
}: SellYourBoatModalProps) {
  const [form, setForm] = useState<SellYourBoatForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    brandName: '',
    price: '',
    size: '',
    cabins: 1,
    message: '',
  });

  const [gallery, setGallery] = useState<File[]>([]);

  if (!isOpen) return null;

  const update = (patch: Partial<SellYourBoatForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGallery((prev) => [...prev, ...files]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({ ...form, gallery });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-reveal="scale"
        data-reveal-duration="450"
        onClick={(e) => e.stopPropagation()}
        className="
          grid
          w-full
          max-w-4xl
          max-h-[99vh]
          grid-cols-1
          overflow-hidden
          rounded-2xl
          sm:rounded-3xl
          border border-[#C9A667]/30
          bg-white
          shadow-2xl
          dark:bg-[#0E2D4A]
          md:grid-cols-2
        "
      >
        {/* FORM */}
        <div className="min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-2">
            <h2 className="text-base font-bold uppercase tracking-wide text-black sm:text-lg dark:text-white">
              Sale Your Boat
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="
                flex shrink-0 items-center gap-1.5
                text-xs font-semibold
                text-[#C9A667]
                underline decoration-[#C9A667]/50 underline-offset-4
                transition-colors
                hover:text-[#B8944F]
              "
            >
              Close
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[95vh] overflow-y-auto px-5 pb-5 sm:px-8 sm:pb-8">
            <p className="mb-2 mt-1 text-xs leading-relaxed text-black/50 sm:text-sm dark:text-white/50 p-2">
              Please Fill And Send The Below Form And Will Get In Touch With You
              For Listing Your Boats On Our Page
            </p>

            <form onSubmit={handleSubmit} className="space-y-1">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
                <PillInput
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(v) => update({ firstName: v })}
                />

                <PillInput
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(v) => update({ lastName: v })}
                />
              </div>

              <PillInput
                placeholder="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(v) => update({ phone: v })}
              />

              <PillInput
                placeholder="E-Mail Address"
                type="email"
                value={form.email}
                onChange={(v) => update({ email: v })}
              />

              <PillInput
                placeholder="Brand Name"
                value={form.brandName}
                onChange={(v) => update({ brandName: v })}
              />

              <PillInput
                placeholder="Price In USD"
                type="number"
                value={form.price}
                onChange={(v) => update({ price: v })}
              />

              <PillInput
                placeholder="Size"
                value={form.size}
                onChange={(v) => update({ size: v })}
              />

              {/* Cabins */}
              <div
                className="
                  flex items-center justify-between
                  rounded-full
                  border border-black/15
                  px-4 py-2.5
                  dark:border-white/15
                "
              >
                <span className="text-sm text-black/40 dark:text-white/40">
                  Cabins
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease cabins"
                    onClick={() =>
                      update({ cabins: Math.max(0, form.cabins - 1) })
                    }
                    className="
                      flex h-6 w-6 items-center justify-center
                      rounded-full
                      border border-black/20
                      text-black/60
                      transition-colors
                      hover:border-[#C9A667]
                      hover:text-[#C9A667]
                      dark:border-white/20
                      dark:text-white/60
                    "
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <span className="w-6 rounded-md bg-[#C9A667]/15 py-0.5 text-center text-sm font-semibold text-[#C9A667]">
                    {form.cabins}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase cabins"
                    onClick={() => update({ cabins: form.cabins + 1 })}
                    className="
                      flex h-6 w-6 items-center justify-center
                      rounded-full
                      border border-black/20
                      text-black/60
                      transition-colors
                      hover:border-[#C9A667]
                      hover:text-[#C9A667]
                      dark:border-white/20
                      dark:text-white/60
                    "
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Upload */}
              <label
                className="
                  flex cursor-pointer items-center justify-between
                  rounded-full
                  border border-black/15
                  px-4 py-2.5
                  transition-colors
                  hover:border-[#C9A667]
                  dark:border-white/15
                  mt-1 mb-1
                "
              >
                <span className="truncate pr-3 text-sm text-black/40 dark:text-white/40 ">
                  {gallery.length > 0
                    ? `${gallery.length} File(s) Selected`
                    : 'Upload Yacht Gallery'}
                </span>

                <UploadCloud
                  className="h-4 w-4 shrink-0 text-[#C9A667] mt-1 mb-1"
                  strokeWidth={1.75}
                />

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only mt-1 mb-1"
                  onChange={handleFileChange}
                />
              </label>

              {/* Message */}
              <textarea
                placeholder="Your Message..."
                rows={4}
                value={form.message}
                onChange={(e) => update({ message: e.target.value })}
                className="
                  w-full resize-none
                  rounded-2xl
                  border border-black/15
                  bg-transparent
                  px-5 py-3.5
                  text-sm text-black
                  placeholder:text-black/40
                  outline-none
                  transition-colors
                  focus:border-[#C9A667]
                  dark:border-white/15
                  dark:text-white
                  dark:placeholder:text-white/40
                  mt-1
                  mb-1
                "
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  border border-[#C9A667]
                  px-6 py-2.5
                  text-sm font-semibold
                  text-[#C9A667]
                  transition-colors
                  hover:bg-[#C9A667]
                  hover:text-[#0E2D4A]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  mb-2
                "
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
                <ArrowUpRight className="h-4 w-4" />
              </button>

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}

              {submitSuccess && (
                <p className="text-sm text-emerald-500">
                  Your boat was submitted successfully.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative  min-h-auto group md:block mb-5 ">
          <Image
            src="/Group467.png"
            alt="Sale your boat"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="
            rounded-[60px]
            p-4
            
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-103
          "
          />
        </div>
      </div>
    </div>
  );
}

interface PillInputProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

function PillInput({
  placeholder,
  type = 'text',
  value,
  onChange,
}: PillInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        min-w-0
        rounded-full
        border border-black/15
        bg-transparent
        px-4 py-2.5
        mt-1
        mb-1
        text-sm
        text-black
        placeholder:text-black/40
        outline-none
        transition-colors
        focus:border-[#C9A667]
        dark:border-white/15
        dark:text-white
        dark:placeholder:text-white/40
      "
    />
  );
}