import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { PartRequest, WeeklyTable, VerificationRequest } from '../../../../types';

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalAmount: number;
  urgentRequests: number;
  averageCompletionTime: number;
  requestsByStatus: Record<string, number>;
  pendingVerifications: number;
}

export const useLoadDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [weeklyTables, setWeeklyTables] = useState<WeeklyTable[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalAmount: 0,
    urgentRequests: 0,
    averageCompletionTime: 0,
    requestsByStatus: {},
    pendingVerifications: 0
  });

  const loadData = async () => {
    try {
      const [partRequestsResponse, weeklyTablesResponse, verificationRequestsResponse] = await Promise.all([
        supabase
          .from('part_requests')
          .select('*, unit:units(*), provider:providers(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('weekly_tables')
          .select('*')
          .order('week_start', { ascending: false }),
        supabase
          .from('verification_requests')
          .select(`
            id,
            profile_id,
            role,
            status,
            admin_notes,
            created_at,
            updated_at,
            profile:profiles (
              id,
              role
            )
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
      ]);

      if (partRequestsResponse.error) throw partRequestsResponse.error;
      if (weeklyTablesResponse.error) throw weeklyTablesResponse.error;
      if (verificationRequestsResponse.error) throw verificationRequestsResponse.error;

      const requests = partRequestsResponse.data;
      setPartRequests(requests);
      setWeeklyTables(weeklyTablesResponse.data);
      setVerificationRequests(verificationRequestsResponse.data);

      // Calculate statistics
      const statusCounts = requests.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const completedRequests = requests.filter(r => r.status === 'status_13');
      const avgTime = completedRequests.length > 0
        ? completedRequests.reduce((sum, r) => {
            const created = new Date(r.created_at);
            const completed = new Date(r.updated_at);
            return sum + (completed.getTime() - created.getTime());
          }, 0) / completedRequests.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;

      setStats({
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => !['status_13', 'status_minus_1'].includes(r.status)).length,
        completedRequests: completedRequests.length,
        totalAmount: requests.reduce((sum, r) => sum + (r.total_amount || 0), 0),
        urgentRequests: requests.filter(r => r.is_important).length,
        averageCompletionTime: Math.round(avgTime * 10) / 10,
        requestsByStatus: statusCounts,
        pendingVerifications: verificationRequestsResponse.data.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    loading,
    partRequests,
    weeklyTables,
    verificationRequests,
    stats,
    loadData
  };
};