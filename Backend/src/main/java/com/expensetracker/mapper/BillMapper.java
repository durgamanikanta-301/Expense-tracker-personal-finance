package com.expensetracker.mapper;

import com.expensetracker.dto.BillRequest;
import com.expensetracker.dto.BillResponse;
import com.expensetracker.entity.Bill;
import com.expensetracker.entity.User;
import org.springframework.stereotype.Component;

/**
 * Stateless mapper converting between {@link Bill} entities and DTOs.
 */
@Component
public class BillMapper {

    public Bill toEntity(BillRequest request, User user) {
        Bill bill = new Bill();
        bill.setName(request.getName());
        bill.setAmount(request.getAmount());
        bill.setCategory(request.getCategory());
        bill.setFrequency(request.getFrequency());
        bill.setNextDueDate(request.getNextDueDate());
        bill.setAutoDebit(request.isAutoDebit());
        bill.setReminderDays(request.getReminderDays());
        bill.setDescription(request.getDescription());
        bill.setPaid(false);
        bill.setUser(user);
        return bill;
    }

    public BillResponse toResponse(Bill bill) {
        BillResponse dto = new BillResponse();
        dto.setId(bill.getId());
        dto.setName(bill.getName());
        dto.setAmount(bill.getAmount());
        dto.setCategory(bill.getCategory().name());
        dto.setFrequency(bill.getFrequency().name());
        dto.setNextDueDate(bill.getNextDueDate());
        dto.setPaid(bill.isPaid());
        dto.setLastPaidDate(bill.getLastPaidDate());
        dto.setAutoDebit(bill.isAutoDebit());
        dto.setReminderDays(bill.getReminderDays());
        dto.setOverdue(bill.isOverdue());
        dto.setDescription(bill.getDescription());
        dto.setUserId(bill.getUser().getId());
        dto.setCreatedAt(bill.getCreatedAt());
        dto.setUpdatedAt(bill.getUpdatedAt());
        return dto;
    }

    public void updateEntity(Bill entity, BillRequest request) {
        entity.setName(request.getName());
        entity.setAmount(request.getAmount());
        entity.setCategory(request.getCategory());
        entity.setFrequency(request.getFrequency());
        entity.setNextDueDate(request.getNextDueDate());
        entity.setAutoDebit(request.isAutoDebit());
        entity.setReminderDays(request.getReminderDays());
        entity.setDescription(request.getDescription());
    }
}
