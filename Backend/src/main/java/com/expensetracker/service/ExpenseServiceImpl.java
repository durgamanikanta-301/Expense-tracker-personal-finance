package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.TransactionType;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ExpenseNotFoundException;
import com.expensetracker.mapper.ExpenseMapper;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link ExpenseService}.
 *
 * <p>All operations are scoped to the currently authenticated user — the user ID
 * is resolved from the security context, not from a path parameter, preventing
 * unauthorised access to other users' data.</p>
 */
@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper     expenseMapper;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository,
                              ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.expenseMapper     = expenseMapper;
    }

    @Override
    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();
        Expense expense  = expenseMapper.toEntity(request, currentUser);
        Expense saved    = expenseRepository.save(expense);
        return expenseMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Long userId  = SecurityUtils.getCurrentUserId();
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
        return expenseMapper.toResponse(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        Long userId = SecurityUtils.getCurrentUserId();
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId)
                .stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Long userId  = SecurityUtils.getCurrentUserId();
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
        expenseMapper.updateEntity(expense, request);
        Expense updated = expenseRepository.save(expense);
        return expenseMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteExpense(Long id) {
        Long userId  = SecurityUtils.getCurrentUserId();
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
        expenseRepository.delete(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByType(TransactionType type) {
        Long userId = SecurityUtils.getCurrentUserId();
        return expenseRepository
                .findByUserIdAndTransactionTypeOrderByExpenseDateDesc(userId, type)
                .stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCategory(Category category) {
        Long userId = SecurityUtils.getCurrentUserId();
        return expenseRepository
                .findByUserIdAndCategoryOrderByExpenseDateDesc(userId, category)
                .stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        Long userId = SecurityUtils.getCurrentUserId();
        return expenseRepository
                .findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, startDate, endDate)
                .stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByMonthAndYear(int month, int year) {
        Long userId = SecurityUtils.getCurrentUserId();
        return expenseRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByYear(int year) {
        Long userId = SecurityUtils.getCurrentUserId();
        return expenseRepository.findByUserIdAndYear(userId, year)
                .stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }
}
