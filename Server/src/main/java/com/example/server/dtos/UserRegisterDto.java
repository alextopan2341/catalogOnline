package com.example.server.dtos;

import com.example.server.model.Role;
import lombok.Data;

import java.util.Set;

@Data
public class UserRegisterDto {
    private String fullName;
    private String email;
    private String password;
    private String confirmPassword;
    private Role role;
    private Set<String> subjects;
    private String classroom;
}
