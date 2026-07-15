package com.expensetracker.service;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;

import java.util.List;

/**
 * Contract for budget CRUD and query operations.
 */
public interface BudgetService {

    BudgetResponse createBudget(BudgetRequest request);

    BudgetResponse getBudgetById(Long id);

    List<BudgetResponse> getAllBudgets();

    List<BudgetResponse> getBudgetsByMonthAndYear(int month, int year);

    BudgetResponse updateBudget(Long id, BudgetRequest request);

    void deleteBudget(Long id);
}
