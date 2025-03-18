import { useState, useMemo } from 'react';
import { PartRequest } from '../../../../types';

export const useFilteredRequests = (partRequests: PartRequest[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [invoiceFilter, setInvoiceFilter] = useState('');

  const getDateFilteredRequests = (requests: PartRequest[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (dateFilter) {
      case 'today':
        return requests.filter(r => new Date(r.created_at) >= today);
      case 'week':
        return requests.filter(r => new Date(r.created_at) >= weekAgo);
      case 'month':
        return requests.filter(r => new Date(r.created_at) >= monthAgo);
      default:
        return requests;
    }
  };

  const filteredRequests = useMemo(() => {
    return getDateFilteredRequests(partRequests).filter(request => {
      const matchesSearch = 
        request.short_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.problem_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.unit?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      const matchesInvoice = !invoiceFilter || 
        request.invoice_number?.toLowerCase().includes(invoiceFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesInvoice;
    });
  }, [partRequests, searchTerm, statusFilter, dateFilter, invoiceFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    invoiceFilter,
    setInvoiceFilter,
    filteredRequests
  };
};