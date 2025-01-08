package com.example.server.dtos;

import java.util.Set;
import java.util.UUID;

public class ClassroomDto {

    private UUID id;
    private UUID teacherId;
    private Set<UUID> studentIds;
    private String name;

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(UUID teacherId) {
        this.teacherId = teacherId;
    }

    public Set<UUID> getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(Set<UUID> studentIds) {
        this.studentIds = studentIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
