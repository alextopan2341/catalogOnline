package com.example.server.model.mapper;

import com.example.server.dtos.GradeDto;
import com.example.server.model.Grade;

public class GradeMapper {
    public static GradeDto toDTO(Grade grade) {
        return GradeDto.builder()
                .id(grade.getId().toString())
                .studentId(grade.getStudent().getId().toString())
                .professorId(grade.getProfessor().getId().toString())
                .subject(grade.getSubject().toString())
                .grade((int) grade.getGrade())
                .date(grade.getDate())
                .build();
    }
}
