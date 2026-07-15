package com.expensetracker.mapper;

import com.expensetracker.dto.SavingsGoalRequest;
import com.expensetracker.dto.SavingsGoalResponse;
import com.expensetracker.entity.SavingsGoal;
import com.expensetracker.entity.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Stateless mapper converting between {@link SavingsGoal} entities and DTOs.
 */
@Component
public class SavingsGoalMapper {

    public SavingsGoal toEntity(SavingsGoalRequest request, User user) {
        SavingsGoal goal = new SavingsGoal();
        goal.setName(request.getName());
        goal.setDescription(request.getDescription());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setSavedAmount(request.getSavedAmount() != null ? request.getSavedAmount() : BigDecimal.ZERO);
        goal.setDeadline(request.getDeadline());
        goal.setCompleted(false);
        goal.setUser(user);
        return goal;
    }

    public SavingsGoalResponse toResponse(SavingsGoal goal) {
        SavingsGoalResponse dto = new SavingsGoalResponse();
        dto.setId(goal.getId());
        dto.setName(goal.getName());
        dto.setDescription(goal.getDescription());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setSavedAmount(goal.getSavedAmount());
        dto.setRemainingAmount(goal.getRemainingAmount());
        dto.setProgressPercentage(goal.getProgressPercentage());
        dto.setDeadline(goal.getDeadline());
        dto.setCompleted(goal.isCompleted());
        dto.setUserId(goal.getUser().getId());
        dto.setCreatedAt(goal.getCreatedAt());
        dto.setUpdatedAt(goal.getUpdatedAt());
        return dto;
    }

    public void updateEntity(SavingsGoal entity, SavingsGoalRequest request) {
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setTargetAmount(request.getTargetAmount());
        if (request.getSavedAmount() != null) {
            entity.setSavedAmount(request.getSavedAmount());
        }
        entity.setDeadline(request.getDeadline());
        // Auto-complete when target is reached
        entity.setCompleted(entity.getSavedAmount().compareTo(entity.getTargetAmount()) >= 0);
    }
}
