package com.expensetracker.service;

import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.RegisterRequest;
import com.expensetracker.dto.UpdateProfileRequest;
import com.expensetracker.dto.UserProfileResponse;

/**
 * Contract for authentication-related business operations.
 */
public interface AuthService {

    /**
     * Registers a new user and returns a JWT token.
     *
     * @param request registration details
     * @return authentication response containing the JWT and user profile
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates an existing user and returns a JWT token.
     *
     * @param request login credentials
     * @return authentication response containing the JWT and user profile
     */
    AuthResponse login(LoginRequest request);

    /**
     * Returns the profile of the currently authenticated user.
     *
     * @return the authenticated user's profile
     */
    UserProfileResponse getProfile();

    /**
     * Updates the profile of the currently authenticated user.
     *
     * @param request updated profile fields
     * @return the updated user profile
     */
    UserProfileResponse updateProfile(UpdateProfileRequest request);
}
