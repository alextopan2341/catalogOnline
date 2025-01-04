package com.example.server.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Builder
@Data
public class UserResponseDto {
    private String id;
    private String fullName;
    private String email;
    private String role;
    private Set<String> subjects;
}
