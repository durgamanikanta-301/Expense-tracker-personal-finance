package com.expensetracker.mapper;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import org.springframework.stereotype.Component;

/**
 * Stateless mapper converting between {@link Expense} entities and DTOs.
 */
@Component
public class ExpenseMapper {

    /**
     * Creates a new {@link Expense} entity from a {@link ExpenseRequest} DTO.
     *
     * @param request the inbound DTO
     * @param user    the owning user
     * @return a new (unpersisted) expense entity
     */
    public Expense toEntity(ExpenseRequest request, User user) {
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setTransactionType(request.getTransactionType());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setUser(user);
        return expense;
    }

    /**
     * Maps a persisted {@link Expense} entity to a {@link ExpenseResponse} DTO.
     *
     * @param expense the entity to map
     * @return the mapped DTO
     */
    public ExpenseResponse toResponse(Expense expense) {
        ExpenseResponse dto = new ExpenseResponse();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory().name());
        dto.setTransactionType(expense.getTransactionType().name());
        dto.setDescription(expense.getDescription());
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setUserId(expense.getUser().getId());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        return dto;
    }

    /**
     * Applies updates from a {@link ExpenseRequest} onto an existing {@link Expense} entity.
     *
     * @param entity  the entity to update in-place
     * @param request the DTO containing new values
     */
    public void updateEntity(Expense entity, ExpenseRequest request) {
        entity.setTitle(request.getTitle());
        entity.setAmount(request.getAmount());
        entity.setCategory(request.getCategory());
        entity.setTransactionType(request.getTransactionType());
        entity.setDescription(request.getDescription());
        entity.setExpenseDate(request.getExpenseDate());
    }
}
