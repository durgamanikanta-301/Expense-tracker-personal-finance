package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.TransactionType;

import java.time.LocalDate;
import java.util.List;

/**
 * Contract for expense CRUD and filtering operations.
 */
public interface ExpenseService {

    ExpenseResponse createExpense(ExpenseRequest request);

    ExpenseResponse getExpenseById(Long id);

    List<ExpenseResponse> getAllExpenses();

    ExpenseResponse updateExpense(Long id, ExpenseRequest request);

    void deleteExpense(Long id);

    List<ExpenseResponse> getExpensesByType(TransactionType type);

    List<ExpenseResponse> getExpensesByCategory(Category category);

    List<ExpenseResponse> getExpensesByDateRange(LocalDate startDate, LocalDate endDate);

    List<ExpenseResponse> getExpensesByMonthAndYear(int month, int year);

    List<ExpenseResponse> getExpensesByYear(int year);
}
