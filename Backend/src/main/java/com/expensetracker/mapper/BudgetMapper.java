package com.expensetracker.mapper;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.User;
import org.springframework.stereotype.Component;

/**
 * Stateless mapper converting between {@link Budget} entities and DTOs.
 */
@Component
public class BudgetMapper {

    public Budget toEntity(BudgetRequest request, User user) {
        Budget budget = new Budget();
        budget.setName(request.getName());
        budget.setCategory(request.getCategory());
        budget.setBudgetAmount(request.getBudgetAmount());
        budget.setBudgetYear(request.getBudgetYear());
        budget.setBudgetMonth(request.getBudgetMonth());
        budget.setDescription(request.getDescription());
        budget.setUser(user);
        return budget;
    }

    public BudgetResponse toResponse(Budget budget) {
        BudgetResponse dto = new BudgetResponse();
        dto.setId(budget.getId());
        dto.setName(budget.getName());
        dto.setCategory(budget.getCategory().name());
        dto.setBudgetAmount(budget.getBudgetAmount());
        dto.setSpentAmount(budget.getSpentAmount());
        dto.setRemainingAmount(budget.getRemainingAmount());
        dto.setBudgetYear(budget.getBudgetYear());
        dto.setBudgetMonth(budget.getBudgetMonth());
        dto.setExceeded(budget.isExceeded());
        dto.setDescription(budget.getDescription());
        dto.setUserId(budget.getUser().getId());
        dto.setCreatedAt(budget.getCreatedAt());
        dto.setUpdatedAt(budget.getUpdatedAt());
        return dto;
    }

    public void updateEntity(Budget entity, BudgetRequest request) {
        entity.setName(request.getName());
        entity.setCategory(request.getCategory());
        entity.setBudgetAmount(request.getBudgetAmount());
        entity.setBudgetYear(request.getBudgetYear());
        entity.setBudgetMonth(request.getBudgetMonth());
        entity.setDescription(request.getDescription());
    }
}
