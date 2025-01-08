package com.example.server.dtos;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class ClassroomDto {
    private UUID teacherId;
    private String name;
    private Set<UUID> studentIds;
}
