'use client';
// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDashboardSubmissions } from '@/features/dashboard/submissions/hooks/useDashboardSubmissions';



export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [yachtManagerOpen, setyachtManagerOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);


  const { submissions: pendingSubmissions, fetchSubmissions } = useDashboardSubmissions();
  const pendingCount = pendingSubmissions?.length || 0;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchSubmissions('pending').catch(() => undefined);

    // تحديث دوري كل دقيقة عشان العداد يفضل محدّث من غير ما يحتاج المستخدم يعمل reload
    const interval = setInterval(() => {
      fetchSubmissions('pending').catch(() => undefined);
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchSubmissions]);

useEffect(() => {
  const handler = () => fetchSubmissions('pending').catch(() => undefined);
  window.addEventListener('submissions-updated', handler);
  return () => window.removeEventListener('submissions-updated', handler);
}, [fetchSubmissions]);

  useEffect(() => {
    if (
      pathname.includes('/dashboard/yachts') ||
      pathname.includes('/dashboard/waiting-approve') ||
      pathname.includes('/dashboard/add-yacht') ||
      pathname.includes('/dashboard/category')
    ) {
      setyachtManagerOpen(true);
    }
  }, [pathname]);


  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  const isAdmin = hasMounted && user?.role === 'admin';
  const isManager = hasMounted && user?.role === 'manager';
  const displayUserName = hasMounted ? (user?.username || 'User') : 'User';
  const displayUserEmail = hasMounted ? (user?.email || 'user@example.com') : 'user@example.com';
  const displayUserRole = hasMounted ? (user?.role || 'user') : 'user';


  const toggleSidebar = () => {
    const sidebar = document.getElementById('top-bar-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
      setIsOpen(!isOpen);
      setDropdownOpen(null);
    }
  };

  // Reusable submenu link class
  const subLinkClass = (active: any) =>
    `flex items-center px-2 py-1.5 rounded-base hover:bg-black/10 dark:hover:bg-white/20 hover:text-black dark:hover:text-white group transition-all duration-300 text-sm ${active ? 'text-black dark:text-white bg-black/10 dark:bg-white/20' : 'text-black/70 dark:text-white/80'
    }`;

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-black/10 dark:border-white/10 shadow-lg">
        <div className="px-3 py-3 lg:px-5 lg:pl-3 bg-[#f7f7f7] dark:bg-[#0E2D4A] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                type="button"
                className="sm:hidden text-black dark:text-white bg-transparent border-0 hover:bg-black/10 dark:hover:bg-white/10 font-medium leading-5 rounded-base text-sm p-2 focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <span className="sr-only">Open sidebar</span>
                <div className="relative w-6 h-5 flex flex-col justify-between items-center">
                  <span className={`block w-full h-[1.5px] bg-black dark:bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6px]' : 'rotate-0 translate-y-0'}`}></span>
                  <span className={`block w-[70%] h-[1px] bg-black dark:bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block w-full h-[1.5px] bg-black dark:bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6px]' : 'rotate-0 translate-y-0'}`}></span>
                </div>
              </button>
              <Link href="/dashboard" className="flex ms-2 md:me-24">
                <Image src="/logo.png" alt="Logo" width={80} height={30} className="me-3 object-contain" />
              </Link>
            </div>
            <div className="flex items-center" >
              <div className="flex items-center ms-3 relative">
                <div  >
                  <button
                    type="button"
                    className="flex text-sm bg-black/10 dark:bg-white/10 rounded-full focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-black/30 dark:hover:ring-white/50"
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === 'user' ? null : 'user')
                    }
                  >
                    <Image
                      src={user?.avatar || "/images-user.png"}
                      alt=""
                      width={28}
                      height={20}
                      className="rounded-full transition-all duration-300 hover:ring-2 hover:ring-black dark:hover:ring-white"
                    />
                  </button>
                </div>
                <div
                  id="dropdown-user"
                  onMouseLeave={() => setDropdownOpen(null)}
                  className={`absolute top-full right-0 mt-2 z-50 bg-white/95 dark:bg-[#12395c]/95 backdrop-blur-md border border-black/10 dark:border-white/20 rounded-xl shadow-2xl w-auto transition-all duration-300 ${dropdownOpen === 'user'
                    ? 'block scale-100 opacity-100'
                    : 'hidden scale-95 opacity-0'
                    }`}
                >
                  <div className="px-4 py-3 border-b border-black/10 dark:border-white/10" role="none">
                    <div className="flex items-start justify-between flex-col">
                      <p className="text-sm font-semibold text-black dark:text-white">{displayUserName}</p>
                      <p className="text-sm text-black/60 dark:text-white/70 truncate">{displayUserEmail}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-medium mt-1 ${displayUserRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {displayUserRole}
                      </span>
                    </div>
                  </div>
                  <ul className="p-2 text-sm text-black/80 dark:text-white/80 font-medium" role="none">
                    <li>
                      <Link href="/dashboard/user-profile" className="inline-flex items-center w-full p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 rounded-lg transition-all duration-200 transform hover:scale-105 hover:translate-x-1" role="menuitem">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Profile Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="" className="inline-flex items-center w-full p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 rounded-lg transition-all duration-200 transform hover:scale-105 hover:translate-x-1" role="menuitem" onClick={handleLogout}>
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside id="top-bar-sidebar" className="fixed top-0 left-0 z-40 w-64 h-full transition-all duration-500 ease-in-out -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-1 py-4 overflow-y-auto bg-[#f7f7f7] dark:bg-[#0E2D4A] border-default transition-colors">
          <ul className="space-y-4 font-medium mt-[60px]">

            {isAdmin && (
              <>
                {/* Dashboard */}
                <li>
                  <Link href="/dashboard" className="flex items-center px-2 py-1.5 text-black dark:text-white rounded-xl hover:bg-black/10 dark:hover:bg-white/20 group transition-all duration-300 transform hover:translate-x-2 w-[95%]">
                    <svg className="w-5 h-5 text-black dark:text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
                    </svg>
                    <span className="ms-3 text-black dark:text-white">Dashboard</span>
                  </Link>
                </li>



                {/* ── yacht Manager submenu ── */}
                <li>
                  <button
                    type="button"
                    onClick={() => setyachtManagerOpen(!yachtManagerOpen)}
                    className="flex items-center justify-between w-[95%] px-2 py-1.5 text-black dark:text-white rounded-xl hover:bg-black/10 dark:hover:bg-white/20 group transition-all duration-300 transform hover:translate-x-2"
                  >
                    <div className="flex items-center">
                      <svg className="shrink-0 w-5 h-5 text-black dark:text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8" />
                      </svg>
                      <span className="ms-3 text-black dark:text-white whitespace-nowrap">yacht Manager</span>
                      {pendingCount > 0 && (
                        <span className="relative ms-2 flex h-5 min-w-5 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {pendingCount > 99 ? '99+' : pendingCount}
                          </span>
                        </span>
                      )}
                    </div>
                    <svg className={`w-4 h-4 text-black dark:text-white transition-transform duration-300 ${yachtManagerOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {yachtManagerOpen && (
                    <ul className="ms-8 mt-2 space-y-1">
                      {/* All yachts */}
                      <li>
                        <Link href="/dashboard/yachts" className={subLinkClass(pathname === '/dashboard/yachts' || (pathname.includes('/dashboard/yachts') && !pathname.includes('yachts-manager')))}>
                          <svg className="w-4 h-4 me-2 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9" />
                          </svg>
                          <span>All yachts</span>
                        </Link>
                      </li>

                      {/* yacht Waiting Approve */}
                      <li>
                        <Link href="/dashboard/waiting-approve" className={subLinkClass(pathname.includes('/dashboard/waiting-approve'))}>
                          <svg className="w-4 h-4 me-2 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12.5l1.8 1.8L15 10" />
                          </svg>
                          <span>yacht Waiting Approve</span>
                          {pendingCount > 0 && (
                            <span className="relative ml-auto flex h-5 min-w-5 items-center justify-center">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {pendingCount > 99 ? '99+' : pendingCount}
                              </span>
                            </span>
                          )}
                        </Link>
                      </li>

                      {/* Add yacht */}
                      <li>
                        <Link href="/dashboard/edit-yacht/new" className={subLinkClass(pathname.includes('/dashboard/edit-yacht'))}>
                          <svg className="w-4 h-4 me-2 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                          </svg>
                          <span>Add yacht</span>
                        </Link>
                      </li>

                      {/* brands */}
                      <li>
                        <Link href="/dashboard/brands" className={subLinkClass(pathname.includes('/dashboard/brand'))}>
                          <svg className="w-4 h-4 me-2 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41 10.59 3.41a2 2 0 0 0-2.83 0L3.41 8.76a2 2 0 0 0 0 2.83l10 10a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83z" />
                            <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
                          </svg>
                          <span>Brands</span>
                        </Link>
                      </li>
                      {/* Categories */}
                      <li>
                        <Link href="/dashboard/category" className={subLinkClass(pathname.includes('/dashboard/category'))}>
                          <svg
                            className="w-4 h-4 me-2 shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
                            />
                          </svg>
                          <span>Categories</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/dashboard/amenities" className={subLinkClass(pathname.includes('/dashboard/amenities'))}>
                          <svg className="w-4 h-4 me-2 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20" />
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>Amenities</span>
                        </Link>
                      </li>


                    </ul>
                  )}
                </li>

                <li>
                  <Link href="/dashboard/leads" className="flex items-center px-2 py-1.5 text-black dark:text-white rounded-xl hover:bg-black/10 dark:hover:bg-white/20 group transition-all duration-300 transform hover:translate-x-2 w-[95%]">
                    <svg
                      className="shrink-0 w-5 h-5 text-black dark:text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-5 3V5Z"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M8 9h8M8 13h5"
                      />
                    </svg>
                    <span className="flex-1 ms-3 text-sm whitespace-nowrap text-black dark:text-white">Enquiries &amp; Subscriptions</span>
                  </Link>
                </li>

                {/* Users */}
                <li>
                  <Link href="/dashboard/users" className="flex items-center px-2 py-1.5 text-black dark:text-white rounded-xl hover:bg-black/10 dark:hover:bg-white/20 group transition-all duration-300 transform hover:translate-x-2 w-[95%]">
                    <svg className="shrink-0 w-5 h-5 text-black dark:text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap text-black dark:text-white">Users</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/blogs" className="flex items-center px-2 py-1.5 text-black dark:text-white rounded-xl hover:bg-black/10 dark:hover:bg-white/20 group transition-all duration-300 transform hover:translate-x-2 w-[95%]">
                    <svg className="w-4 h-4 me-2 shrink-0  group-hover:scale-110 group-hover:text-[#008dff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18a2 2 0 0 1 2 2v13.5A2.5 2.5 0 0 1 17.5 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 11h8M8 15h5" />
                    </svg>
                    <span>Blogs</span>
                  </Link>
                </li>
              </>
            )}

            {/* Manager Only */}
            {isManager && (
              <li>
                <Link href="/dashboard/yachts" className="flex items-center px-2 py-1.5 text-black dark:text-white rounded-xl hover:bg-black/10 dark:hover:bg-white/20 group transition-all duration-300 transform hover:translate-x-2 w-[95%]">
                  <svg className="shrink-0 w-5 h-5 text-black dark:text-white transition duration-300 group-hover:scale-110 group-hover:text-[#008dff]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap text-black dark:text-white">yachts</span>
                </Link>
              </li>
            )}

            {/* Logout */}
            {isAuthenticated && (
              <li>
                <Link href="" className="flex items-center px-2 py-1.5 text-black dark:text-white rounded-xl hover:bg-black/10 dark:hover:bg-white/20 group transition-all duration-300 transform hover:translate-x-2 w-[95%]" onClick={handleLogout}>
                  <svg className="shrink-0 w-5 h-5 text-red-500 transition duration-300 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap text-red-500">Logout</span>
                </Link>
              </li>
            )}

          </ul>
        </div>
      </aside>
    </>
  );
}