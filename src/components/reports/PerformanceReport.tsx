import React, { useState, useMemo } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import { useTeamStore } from '../../store/teamStore';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { BarChart3, TrendingUp, DollarSign, Target, Filter } from 'lucide-react';
import { TeamMemberStats } from './TeamMemberStats';
import { PipelineChart } from './PipelineChart';

type DateRange = '7' | '30' | '90' | 'all';

export const PerformanceReport = () => {
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const { deals } = useKanbanStore();
  const { members } = useTeamStore();

  const filteredDeals = useMemo(() => {
    let filtered = deals;

    // Filter by date range
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const startDate = startOfDay(subDays(new Date(), days));
      filtered = filtered.filter(deal => 
        isWithinInterval(new Date(deal.createdAt), {
          start: startDate,
          end: endOfDay(new Date())
        })
      );
    }

    // Filter by team member
    if (selectedMemberId !== 'all') {
      filtered = filtered.filter(deal => deal.ownerId === selectedMemberId);
    }

    return filtered;
  }, [deals, dateRange, selectedMemberId]);

  const stats = useMemo(() => {
    const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = filteredDeals.filter(d => d.stage === 'Closed Won');
    const lostDeals = filteredDeals.filter(d => d.stage === 'Closed Lost');
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const winRate = wonDeals.length + lostDeals.length > 0
      ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
      : 0;

    return {
      totalValue,
      wonValue,
      winRate,
      totalDeals: filteredDeals.length,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length
    };
  }, [filteredDeals]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Filter className="w-6 h-6 mr-2 text-gray-400" />
            Filters
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Team Members</option>
              {members.map((member) => (
                <option key={member.uid} value={member.uid}>
                  {member.displayName || member.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pipeline</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalValue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {stats.totalDeals} active deals
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Won Deals Value</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.wonValue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {stats.wonDeals} won deals
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Deal Size</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalDeals > 0 
                  ? Math.round(stats.totalValue / stats.totalDeals).toLocaleString()
                  : '0'
                }
              </h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              Per deal average
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.winRate.toFixed(1)}%
              </h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {stats.wonDeals} won / {stats.lostDeals} lost
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Overview</h3>
        <PipelineChart deals={filteredDeals} />
      </div>

      {/* Team Performance */}
      {selectedMemberId === 'all' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Performance</h3>
          <TeamMemberStats deals={deals} members={members} dateRange={dateRange} />
        </div>
      )}
    </div>
  );
};