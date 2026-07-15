package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Dashboard summary response combining all key financial metrics for the authenticated user.
 */
public class DashboardResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal currentBalance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpense;
    private BigDecimal monthlyBalance;
    private int currentMonth;
    private int currentYear;
    private List<CategorySummary> categoryWiseSpending;
    private List<MonthlySummary> monthlySummaries;
    private List<ExpenseResponse> recentTransactions;

    // -----------------------------------------------------------------------
    // Getters and Setters
    // -----------------------------------------------------------------------

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpense() { return totalExpense; }
    public void setTotalExpense(BigDecimal totalExpense) { this.totalExpense = totalExpense; }

    public BigDecimal getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(BigDecimal currentBalance) { this.currentBalance = currentBalance; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public BigDecimal getMonthlyExpense() { return monthlyExpense; }
    public void setMonthlyExpense(BigDecimal monthlyExpense) { this.monthlyExpense = monthlyExpense; }

    public BigDecimal getMonthlyBalance() { return monthlyBalance; }
    public void setMonthlyBalance(BigDecimal monthlyBalance) { this.monthlyBalance = monthlyBalance; }

    public int getCurrentMonth() { return currentMonth; }
    public void setCurrentMonth(int currentMonth) { this.currentMonth = currentMonth; }

    public int getCurrentYear() { return currentYear; }
    public void setCurrentYear(int currentYear) { this.currentYear = currentYear; }

    public List<CategorySummary> getCategoryWiseSpending() { return categoryWiseSpending; }
    public void setCategoryWiseSpending(List<CategorySummary> categoryWiseSpending) { this.categoryWiseSpending = categoryWiseSpending; }

    public List<MonthlySummary> getMonthlySummaries() { return monthlySummaries; }
    public void setMonthlySummaries(List<MonthlySummary> monthlySummaries) { this.monthlySummaries = monthlySummaries; }

    public List<ExpenseResponse> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<ExpenseResponse> recentTransactions) { this.recentTransactions = recentTransactions; }
}
