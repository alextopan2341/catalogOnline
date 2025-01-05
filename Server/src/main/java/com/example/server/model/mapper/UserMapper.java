package com.example.server.model.mapper;

import com.example.server.dtos.UserRegisterDto;
import com.example.server.dtos.UserResponseDto;
import com.example.server.model.Role;
import com.example.server.model.Subject;
import com.example.server.model.User;

import java.util.stream.Collectors;

public class UserMapper {
    public static UserResponseDto toResponseDTO(User user) {
        return UserResponseDto.builder()
                .id(user.getId().toString())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .subjects(user.getSubjects().stream()
                        .map(Enum::toString)
                        .collect(Collectors.toSet()))
                .build();
    }

    public static User toEntity(UserRegisterDto dto) {
        return User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .subjects(dto.getSubjects().stream()
                        .map(Subject::valueOf)
                        .collect(Collectors.toSet()))
                .role(dto.getRole())
                .build();
    }
}

