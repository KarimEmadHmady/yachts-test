'use client';

import { useCallback, useRef, useState } from 'react';
import { dashboardSubmissionService } from '../services/submissionService';

export function useDashboardSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentStatusRef = useRef(null);

  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

  const run = useCallback(async (operation) => {
    setLoading(true);
    setError('');
    try {
      return await operation();
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong');
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

const fetchSubmissions = useCallback(
  /**
   * @param {string | null} [status]
   */
  (status = null) => run(async () => {
    currentStatusRef.current = status;

    const result = await dashboardSubmissionService.list(status, token());

    const normalized = Array.isArray(result) ? result : [];

    setSubmissions(normalized);

    return normalized;
  }),
  [run]
);

  const fetchSubmissionById = useCallback(async (id) => run(async () => {
    const result = await dashboardSubmissionService.getById(id, token());
    setSelectedSubmission(result || null);
    return result;
  }), [run]);

const approveSubmission = useCallback(async (id) => run(async () => {
  const result = await dashboardSubmissionService.approve(id, token());
  const result2 = await dashboardSubmissionService.list(currentStatusRef.current, token());
  setSubmissions(Array.isArray(result2) ? result2 : []);
  if (selectedSubmission?.id === id) {
    setSelectedSubmission({ ...selectedSubmission, submission_status: 'approved', status: 'published' });
  }

  // 🔔 tell every other instance of this hook (like the Sidebar) to refresh
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('submissions-updated'));
  }

  return result;
}), [run, selectedSubmission]);

const rejectSubmission = useCallback(async (id, comment = '') => run(async () => {
  const result = await dashboardSubmissionService.reject(id, comment, token());
  const result2 = await dashboardSubmissionService.list(currentStatusRef.current, token());
  setSubmissions(Array.isArray(result2) ? result2 : []);
  if (selectedSubmission?.id === id) {
    setSelectedSubmission({ ...selectedSubmission, submission_status: 'rejected', rejection_comment: comment });
  }

  // 🔔 same here
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('submissions-updated'));
  }

  return result;
}), [run, selectedSubmission]);

  return {
    submissions,
    selectedSubmission,
    setSelectedSubmission,
    loading,
    error,
    fetchSubmissions,
    fetchSubmissionById,
    approveSubmission,
    rejectSubmission,
  };
}