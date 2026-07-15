package com.expensetracker.util;

import com.expensetracker.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility class for retrieving the currently authenticated user from the
 * Spring Security context.
 */
public final class SecurityUtils {

    private SecurityUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Returns the currently authenticated {@link User} from the security context.
     *
     * @return the authenticated user
     * @throws IllegalStateException if no authenticated user is present in the context
     */
    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found in security context");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw new IllegalStateException("Principal is not a User instance: " + principal.getClass());
    }

    /**
     * Returns the ID of the currently authenticated user.
     *
     * @return the authenticated user's ID
     */
    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Returns the email of the currently authenticated user.
     *
     * @return the authenticated user's email
     */
    public static String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }
}
