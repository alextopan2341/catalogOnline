package com.example.server.dtos;

import com.example.server.model.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Builder
@Data
public class UserResponseDto {
    private String id;
    private String fullName;
    private String email;
    private Role role;
    private Set<String> subjects;
}
