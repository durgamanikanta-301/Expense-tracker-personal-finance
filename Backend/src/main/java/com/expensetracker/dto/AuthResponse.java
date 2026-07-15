package com.expensetracker.dto;

/**
 * Response body returned after a successful login or registration.
 */
public class AuthResponse {

    private final String token;
    private final String tokenType;
    private final long expiresIn;
    private final UserProfileResponse user;

    public AuthResponse(String token, long expiresIn, UserProfileResponse user) {
        this.token     = token;
        this.tokenType = "Bearer";
        this.expiresIn = expiresIn;
        this.user      = user;
    }

    public String getToken()              { return token; }
    public String getTokenType()          { return tokenType; }
    public long getExpiresIn()            { return expiresIn; }
    public UserProfileResponse getUser()  { return user; }
}
