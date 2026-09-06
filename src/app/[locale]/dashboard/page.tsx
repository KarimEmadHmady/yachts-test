'use client';

import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { blogService } from '@/features/pageblog/api/blogService';
import { brandService } from '@/services/brandService';
import { categoryService } from '@/services/categoryService';
import { leadService } from '@/services/leadService';
import { useTheme } from '@/hooks/useTheme';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

const defaultStats = {
  totalYachts: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  brands: 0,
  categories: 0,
  blogs: 0,
  enquiries: 0,
  contact: 0,
  service: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    let mounted = true;

    const loadDashboardStats = async () => {
      try {
        const token = getToken();
        const [brands, categories, blogs, yachts, leads] = await Promise.all([
          brandService.list().catch(() => []),
          categoryService.list().catch(() => []),
          blogService.list().catch(() => []),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts'}/api/yachts`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
            .then((response) => (response.ok ? response.json() : []))
            .catch(() => []),
          leadService.getEnquiries(token).catch(() => []),
        ]);

        if (!mounted) return;

        const yachtSummary = Array.isArray(yachts)
          ? yachts.reduce(
              (accumulator, yacht) => {
                const status = String(yacht?.submission_status || 'pending').toLowerCase();
                if (status === 'approved') accumulator.approved += 1;
                else if (status === 'rejected') accumulator.rejected += 1;
                else accumulator.pending += 1;
                return accumulator;
              },
              { pending: 0, approved: 0, rejected: 0 },
            )
          : { pending: 0, approved: 0, rejected: 0 };

        const leadSummary = Array.isArray(leads)
          ? leads.reduce(
              (accumulator, lead) => {
                const type = String(lead?.type || 'enquiry').toLowerCase();
                if (type === 'contact') accumulator.contact += 1;
                else if (type === 'service') accumulator.service += 1;
                else accumulator.enquiries += 1;
                return accumulator;
              },
              { enquiries: 0, contact: 0, service: 0 },
            )
          : { enquiries: 0, contact: 0, service: 0 };

        setStats({
          totalYachts: Array.isArray(yachts) ? yachts.length : 0,
          pending: yachtSummary.pending,
          approved: yachtSummary.approved,
          rejected: yachtSummary.rejected,
          brands: Array.isArray(brands) ? brands.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          enquiries: leadSummary.enquiries,
          contact: leadSummary.contact,
          service: leadSummary.service,
        });
      } catch {
        if (mounted) setStats(defaultStats);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboardStats();

    return () => {
      mounted = false;
    };
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: 'Total yachts', value: stats.totalYachts },
      { label: 'Pending', value: stats.pending },
      { label: 'Approved', value: stats.approved },
      { label: 'Rejected', value: stats.rejected },
      { label: 'Brands', value: stats.brands },
      { label: 'Categories', value: stats.categories },
      { label: 'Blogs', value: stats.blogs },
      { label: 'Enquiries', value: stats.enquiries },
      { label: 'Contact', value: stats.contact },
      { label: 'Service', value: stats.service },
    ],
    [stats],
  );

  // ألوان محايدة تتماشى مع الثيم بدل الألوان الملونة المتفرقة
  const chartBaseOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    legend: { position: 'bottom', labels: { colors: isDark ? '#ffffff' : '#000000' } },
    dataLabels: { enabled: true },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    stroke: { width: 0 },
  };

  const yachtStatusChart: { series: number[]; options: ApexOptions } = {
    series: [stats.pending, stats.approved, stats.rejected],
    options: {
      ...chartBaseOptions,
      chart: { ...chartBaseOptions.chart, type: 'donut' },
      labels: ['Pending', 'Approved', 'Rejected'],
      colors: ['#94a3b8', '#0E2D4A', '#ef4444'],
      plotOptions: { pie: { donut: { size: '75%' } } },
    },
  };

  const leadsChart: { series: number[]; options: ApexOptions } = {
    series: [stats.enquiries, stats.contact, stats.service],
    options: {
      ...chartBaseOptions,
      chart: { ...chartBaseOptions.chart, type: 'donut' },
      labels: ['Enquiries', 'Contact', 'Service'],
      colors: ['#0E2D4A', '#94a3b8', '#C9A868'],
      plotOptions: { pie: { donut: { size: '75%' } } },
    },
  };

  const inventoryChart: { series: { name: string; data: number[] }[]; options: ApexOptions } = {
    series: [
      {
        name: 'Count',
        data: [stats.brands, stats.categories, stats.blogs],
      },
    ],
    options: {
      ...chartBaseOptions,
      chart: { ...chartBaseOptions.chart, type: 'bar' },
      colors: ['#0E2D4A'],
      xaxis: {
        categories: ['Brands', 'Categories', 'Blogs'],
        labels: { style: { colors: isDark ? '#ffffff' : '#000000' } },
      },
      yaxis: {
        labels: { style: { colors: isDark ? '#ffffff' : '#000000' } },
      },
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: '45%' },
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
    },
  };

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-4 text-black transition-colors dark:bg-[#012241] dark:text-white sm:p-6 lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <h1 className="text-xl font-bold">Overview</h1>
          <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">A quick summary of your platform</p>
        </div>

        {loading ? (
          <div className="mb-5 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/60 dark:border-white/10 dark:bg-[#12395c] dark:text-white/60">
            Loading dashboard analytics...
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-black/10 bg-white p-3.5 transition-colors dark:border-white/10 dark:bg-[#12395c]"
            >
              <p className="text-xs text-black/50 dark:text-white/50">{card.label}</p>
              <p className="mt-1 text-xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-white p-4 transition-colors dark:border-white/10 dark:bg-[#12395c]">
            <h2 className="mb-2 text-sm font-semibold">Yacht submissions</h2>
            <ApexChart options={yachtStatusChart.options} series={yachtStatusChart.series} type="donut" height={220} />
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4 transition-colors dark:border-white/10 dark:bg-[#12395c]">
            <h2 className="mb-2 text-sm font-semibold">Enquiries, contact &amp; service</h2>
            <ApexChart options={leadsChart.options} series={leadsChart.series} type="donut" height={220} />
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4 transition-colors dark:border-white/10 dark:bg-[#12395c]">
            <h2 className="mb-2 text-sm font-semibold">Content overview</h2>
            <ApexChart options={inventoryChart.options} series={inventoryChart.series} type="bar" height={220} />
          </div>
        </div>
      </div>
    </section>
  );
}