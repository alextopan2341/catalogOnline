package com.example.server.dtos;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class GradeDto {
    private String id;
    private String studentId;
    private String professorId;
    private String subject;
    private long grade;
    private LocalDateTime date;
}
