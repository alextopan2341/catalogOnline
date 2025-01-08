package com.example.server.dtos;

import lombok.Data;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
public class ClassroomDto {
    private UUID teacherId;
    private String teacherName;
    private String name;
    private Map<UUID,String> students;
    private Set<UUID> studentIds;
}
