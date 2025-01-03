package com.example.server.dtos;

import lombok.Data;

import java.util.Set;

@Data
public class UserRegisterDto {
    private String fullName;
    private String email;
    private String password;
    private String confirmPassword;
    private Set<String> subjects;
}
