package com.example.server.dtos;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class AddStudentDto {
    private Set<UUID> studentIds;
}
