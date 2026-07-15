package com.expensetracker.service;

import com.expensetracker.dto.DashboardResponse;

/**
 * Contract for aggregated dashboard metrics.
 */
public interface DashboardService {

    /**
     * Returns a comprehensive dashboard summary for the currently authenticated user.
     *
     * @return aggregated financial metrics, monthly summaries, and recent transactions
     */
    DashboardResponse getDashboard();
}
