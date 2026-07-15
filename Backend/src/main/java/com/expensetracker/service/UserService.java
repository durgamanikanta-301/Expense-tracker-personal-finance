package com.expensetracker.service;

import com.expensetracker.dto.UserProfileResponse;

/**
 * Contract for user management operations (admin / self-service).
 */
public interface UserService {

    /**
     * Retrieves the profile of a user by their ID.
     *
     * @param userId the target user's ID
     * @return the user's profile
     */
    UserProfileResponse getUserById(Long userId);
}
