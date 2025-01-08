package com.example.server.dtos;

import com.example.server.model.Subject;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@Setter
public class GradeDto {
    private UUID id;
    private String studentId;
    private String professorId;
    private Subject subject;
    private long grade;
    private LocalDateTime date;
}
