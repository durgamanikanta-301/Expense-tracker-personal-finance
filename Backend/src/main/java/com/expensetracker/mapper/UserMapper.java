package com.expensetracker.mapper;

import com.expensetracker.dto.UserProfileResponse;
import com.expensetracker.entity.User;
import org.springframework.stereotype.Component;

/**
 * Stateless mapper converting {@link User} entities to DTOs.
 */
@Component
public class UserMapper {

    /**
     * Maps a {@link User} entity to a {@link UserProfileResponse} DTO.
     *
     * @param user the entity to map; must not be {@code null}
     * @return the mapped DTO
     */
    public UserProfileResponse toProfileResponse(User user) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setProfileImage(user.getProfileImage());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
