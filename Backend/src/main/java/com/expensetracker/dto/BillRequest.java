package com.expensetracker.dto;

import com.expensetracker.entity.BillFrequency;
import com.expensetracker.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request body for creating or updating a {@link com.expensetracker.entity.Bill}.
 */
public class BillRequest {

    @NotBlank(message = "Bill name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Frequency is required")
    private BillFrequency frequency;

    @NotNull(message = "Next due date is required")
    private LocalDate nextDueDate;

    private boolean autoDebit;

    private Integer reminderDays;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    // -----------------------------------------------------------------------
    // Getters and Setters
    // -----------------------------------------------------------------------

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public BillFrequency getFrequency() { return frequency; }
    public void setFrequency(BillFrequency frequency) { this.frequency = frequency; }

    public LocalDate getNextDueDate() { return nextDueDate; }
    public void setNextDueDate(LocalDate nextDueDate) { this.nextDueDate = nextDueDate; }

    public boolean isAutoDebit() { return autoDebit; }
    public void setAutoDebit(boolean autoDebit) { this.autoDebit = autoDebit; }

    public Integer getReminderDays() { return reminderDays; }
    public void setReminderDays(Integer reminderDays) { this.reminderDays = reminderDays; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
