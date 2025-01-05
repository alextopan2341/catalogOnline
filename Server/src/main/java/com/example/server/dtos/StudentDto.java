package com.example.server.dtos;

import java.util.Map;

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

    // Getters și Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Map<String, String> getGrades() {
        return grades;
    }

    public void setGrades(Map<String, String> grades) {
        this.grades = grades;
    }

    public Map<String, Integer> getAbsences() {
        return absences;
    }

    public void setAbsences(Map<String, Integer> absences) {
        this.absences = absences;
    }
}
