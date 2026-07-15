package com.expensetracker.service;

import com.expensetracker.dto.CategorySummary;
import com.expensetracker.dto.DashboardResponse;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.MonthlySummary;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.TransactionType;
import com.expensetracker.mapper.ExpenseMapper;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.util.DateUtils;
import com.expensetracker.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link DashboardService}.
 *
 * <p>All aggregation queries run in a single read-only transaction.
 * Category percentages are calculated relative to total expenses for the
 * current month.</p>
 */
@Service
public class DashboardServiceImpl implements DashboardService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper     expenseMapper;

    public DashboardServiceImpl(ExpenseRepository expenseRepository,
                                 ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.expenseMapper     = expenseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        Long userId     = SecurityUtils.getCurrentUserId();
        int  month      = DateUtils.currentMonth();
        int  year       = DateUtils.currentYear();

        // ---- All-time totals ----
        BigDecimal totalIncome  = orZero(expenseRepository.sumAmountByUserIdAndType(userId, TransactionType.INCOME));
        BigDecimal totalExpense = orZero(expenseRepository.sumAmountByUserIdAndType(userId, TransactionType.EXPENSE));
        BigDecimal balance      = totalIncome.subtract(totalExpense);

        // ---- Current-month totals ----
        BigDecimal monthlyIncome  = orZero(expenseRepository.sumAmountByUserIdAndTypeAndMonthAndYear(userId, TransactionType.INCOME,  month, year));
        BigDecimal monthlyExpense = orZero(expenseRepository.sumAmountByUserIdAndTypeAndMonthAndYear(userId, TransactionType.EXPENSE, month, year));
        BigDecimal monthlyBalance = monthlyIncome.subtract(monthlyExpense);

        // ---- Category-wise spending (current month) ----
        List<Object[]> rawCategory = expenseRepository.sumExpenseByCategory(userId, month, year);
        List<CategorySummary> categorySummaries = buildCategorySummaries(rawCategory, monthlyExpense);

        // ---- Monthly summaries (last 6 months) ----
        List<MonthlySummary> monthlySummaries = buildMonthlySummaries(userId, month, year);

        // ---- Recent transactions (last 10) ----
        List<ExpenseResponse> recent = expenseRepository.findRecentByUserId(userId, 10)
                .stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());

        // ---- Assemble response ----
        DashboardResponse response = new DashboardResponse();
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setCurrentBalance(balance);
        response.setMonthlyIncome(monthlyIncome);
        response.setMonthlyExpense(monthlyExpense);
        response.setMonthlyBalance(monthlyBalance);
        response.setCurrentMonth(month);
        response.setCurrentYear(year);
        response.setCategoryWiseSpending(categorySummaries);
        response.setMonthlySummaries(monthlySummaries);
        response.setRecentTransactions(recent);
        return response;
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    private BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private List<CategorySummary> buildCategorySummaries(List<Object[]> raw, BigDecimal total) {
        List<CategorySummary> list = new ArrayList<>();
        for (Object[] row : raw) {
            Category category = (Category) row[0];
            BigDecimal amount = new BigDecimal(row[1].toString());
            double pct = 0.0;
            if (total.compareTo(BigDecimal.ZERO) > 0) {
                pct = amount.divide(total, 4, RoundingMode.HALF_UP).doubleValue() * 100;
            }
            list.add(new CategorySummary(category.name(), amount, Math.round(pct * 100.0) / 100.0));
        }
        return list;
    }

    private List<MonthlySummary> buildMonthlySummaries(Long userId, int currentMonth, int currentYear) {
        List<MonthlySummary> summaries = new ArrayList<>();
        int month = currentMonth;
        int year  = currentYear;

        for (int i = 0; i < 6; i++) {
            BigDecimal inc = orZero(expenseRepository.sumAmountByUserIdAndTypeAndMonthAndYear(
                    userId, TransactionType.INCOME, month, year));
            BigDecimal exp = orZero(expenseRepository.sumAmountByUserIdAndTypeAndMonthAndYear(
                    userId, TransactionType.EXPENSE, month, year));
            summaries.add(new MonthlySummary(year, month, DateUtils.monthName(month), inc, exp));

            month--;
            if (month == 0) {
                month = 12;
                year--;
            }
        }
        return summaries;
    }
}
