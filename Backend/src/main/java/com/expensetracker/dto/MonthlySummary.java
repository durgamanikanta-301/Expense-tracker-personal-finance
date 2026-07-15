package com.expensetracker.dto;

import java.math.BigDecimal;

/**
 * Income vs expense summary for a single month.
 */
public class MonthlySummary {

    private int year;
    private int month;
    private String monthName;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;

    public MonthlySummary(int year, int month, String monthName,
                          BigDecimal income, BigDecimal expense) {
        this.year      = year;
        this.month     = month;
        this.monthName = monthName;
        this.income    = income;
        this.expense   = expense;
        this.balance   = income.subtract(expense);
    }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public BigDecimal getIncome() { return income; }
    public void setIncome(BigDecimal income) { this.income = income; }

    public BigDecimal getExpense() { return expense; }
    public void setExpense(BigDecimal expense) { this.expense = expense; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
