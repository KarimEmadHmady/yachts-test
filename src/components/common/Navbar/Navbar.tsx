'use client';
// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'New Boats', href: '/new-boats' },
  { label: 'Pre Owned', href: '/pre-owned' },
  { label: 'Service', href: '/services' },
  { label: 'Charter', href: '/charter' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, handleThemeChange } = useTheme();

  const closeAll = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className={`${theme === 'dark' ? 'bg-[#0E2D4A] text-white' : 'bg-[#f7f7f7] text-black'} z-50 sticky top-0 transition-colors duration-300`}>
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" onClick={closeAll} className="flex-shrink-0">
            <Image
              className="block"
              src="/logo.png"
              alt="Blue Horizon Marine Concepts"
              width={100}
              height={48}
              style={{ width: 100, height: 48 }}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-[13px] font-bold tracking-wide uppercase hover:text-[#C9A868] transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme toggle (desktop) */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
              type="button"
              aria-label="Toggle theme"
              className="flex items-center bg-white rounded-full p-1 gap-1"
            >
              <span className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-[#0E2D4A]' : ''}`}>
                <Image src="/icon.png" alt="" width={16} height={16} className={`w-4 h-4 object-contain ${theme === 'light' ? '' : 'brightness-0'}`} />
              </span>
              <span className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#0E2D4A]' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${theme === 'dark' ? 'text-[#C9A868]' : 'text-[#0E2D4A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`${theme === 'dark' ? 'text-white' : 'text-black'} lg:hidden focus:outline-none`}
            aria-label="toggle menu"
          >
            {!isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={`${theme === 'dark' ? 'bg-[#0E2D4A] text-white' : 'bg-white text-black'} lg:hidden fixed top-0 left-0 right-0 bottom-0 z-[99999] flex flex-col w-full h-screen`}>
          <div className={`${theme === 'dark' ? 'border-white/10' : 'border-black/10'} flex items-center justify-between px-6 py-5 border-b flex-shrink-0`}>
            <Link href="/" onClick={closeAll}>
              <Image className="block" src="/logo.png" alt="Blue Horizon Marine Concepts" width={140} height={40} style={{ width: 140, height: 40 }} />
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'} w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 active:scale-95`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className={`${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'} px-5 py-4 rounded-xl font-bold text-base uppercase tracking-wide transition-all duration-200`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={`${theme === 'dark' ? 'border-white/10' : 'border-black/10'} px-6 py-4 border-t flex-shrink-0`}>
            <button
              onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
              type="button"
              aria-label="Toggle theme"
              className="flex items-center bg-white rounded-full p-1 gap-1 w-fit"
            >
              <span className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-[#0E2D4A]' : ''}`}>
                <Image src="/icon.png" alt="" width={16} height={16} className={`w-4 h-4 object-contain ${theme === 'light' ? '' : 'brightness-0'}`} />
              </span>
              <span className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#0E2D4A]' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${theme === 'dark' ? 'text-[#C9A868]' : 'text-[#0E2D4A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}