package com.expensetracker.util;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;

/**
 * Utility class for common date operations.
 */
public final class DateUtils {

    private DateUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Returns the current calendar month as a numeric value (1–12).
     *
     * @return current month number
     */
    public static int currentMonth() {
        return LocalDate.now().getMonthValue();
    }

    /**
     * Returns the current calendar year.
     *
     * @return current year (e.g. 2024)
     */
    public static int currentYear() {
        return LocalDate.now().getYear();
    }

    /**
     * Returns the full English name for a given month number.
     *
     * @param month the month number (1 = January, 12 = December)
     * @return the month's full display name in English
     */
    public static String monthName(int month) {
        return Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }

    /**
     * Returns the first day of the given month and year.
     *
     * @param year  the year
     * @param month the month (1–12)
     * @return the first day of that month
     */
    public static LocalDate firstDayOfMonth(int year, int month) {
        return LocalDate.of(year, month, 1);
    }

    /**
     * Returns the last day of the given month and year.
     *
     * @param year  the year
     * @param month the month (1–12)
     * @return the last day of that month
     */
    public static LocalDate lastDayOfMonth(int year, int month) {
        return LocalDate.of(year, month, 1).withDayOfMonth(
                LocalDate.of(year, month, 1).lengthOfMonth());
    }
}
