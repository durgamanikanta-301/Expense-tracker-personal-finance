package com.expensetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Expense Tracker Spring Boot application.
 *
 * <p>Bootstraps the Spring context, auto-configures all beans, and starts the embedded Tomcat
 * server on the port defined in {@code application.properties}.</p>
 */
@SpringBootApplication
public class ExpenseTrackerApplication {

    /**
     * Main method — delegates to {@link SpringApplication} to launch the application.
     *
     * @param args command-line arguments passed at startup
     */
    public static void main(String[] args) {
        SpringApplication.run(ExpenseTrackerApplication.class, args);
    }
}
