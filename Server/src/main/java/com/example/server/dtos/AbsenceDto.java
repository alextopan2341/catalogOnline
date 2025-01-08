package com.example.server.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class AbsenceDto {
    private UUID id;
    private UUID studentId;
    private UUID teacherId;
    private String subject;
    private LocalDate date;
    private Boolean justified;
}
