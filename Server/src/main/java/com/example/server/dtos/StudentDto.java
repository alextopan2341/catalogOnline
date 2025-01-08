package com.example.server.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Setter
@Getter
public class StudentDto {
    private String fullName;
    private String email;
    private Map<String, String> grades; // Mapează subiect -> notă
    private Map<String, Integer> absences; // Mapează subiect -> absențe

    public StudentDto(String fullName, String email, Map<String, String> grades, Map<String, Integer> absences) {
        this.fullName = fullName;
        this.email = email;
        this.grades = grades;
        this.absences = absences;
    }

}
