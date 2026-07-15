package com.expensetracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service responsible for JWT generation, parsing, and validation.
 *
 * <p>Uses the jjwt 0.12.x API exclusively — no deprecated methods.</p>
 */
@Service
public class JwtService {

    private final String secretKey;
    private final long jwtExpirationMs;

    /**
     * Constructor injection of JWT configuration from {@code application.properties}.
     *
     * @param secretKey       the HMAC secret (at least 256 bits / 32 chars recommended)
     * @param jwtExpirationMs token validity duration in milliseconds
     */
    public JwtService(
            @Value("${app.jwt.secret}") String secretKey,
            @Value("${app.jwt.expiration}") long jwtExpirationMs) {
        this.secretKey       = secretKey;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    // -----------------------------------------------------------------------
    // Token generation
    // -----------------------------------------------------------------------

    /**
     * Generates a signed JWT for the given user with no extra claims.
     *
     * @param userDetails the authenticated user
     * @return signed compact JWT string
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a signed JWT with additional custom claims.
     *
     * @param extraClaims map of claim name → value to embed in the payload
     * @param userDetails the authenticated user
     * @return signed compact JWT string
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    // -----------------------------------------------------------------------
    // Token validation
    // -----------------------------------------------------------------------

    /**
     * Returns {@code true} if the token is valid for the supplied user and has not expired.
     *
     * @param token       the JWT string
     * @param userDetails the user to validate against
     * @return {@code true} when token is authentic and not expired
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // -----------------------------------------------------------------------
    // Claims extraction
    // -----------------------------------------------------------------------

    /**
     * Extracts the {@code sub} (username / email) claim from the token.
     *
     * @param token the JWT string
     * @return the subject claim value
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the token expiry date.
     *
     * @param token the JWT string
     * @return the expiration {@link Date}
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim using the provided resolver function.
     *
     * @param token         the JWT string
     * @param claimsResolver a function that extracts the desired value from {@link Claims}
     * @param <T>           the type of the extracted claim
     * @return the extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Returns the configured token expiration in milliseconds.
     *
     * @return expiration duration in ms
     */
    public long getExpirationMs() {
        return jwtExpirationMs;
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
