package com.example.server.service;

import com.example.server.dtos.GradeDto;
import com.example.server.model.Grade;
import com.example.server.model.User;
import com.example.server.repository.GradeRepository;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class GradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GradeRepository gradeRepository;

    public Grade addGradeToStudent(UUID studentId, GradeDto gradeDto) {
        // Căutăm studentul în baza de date
        User student = userRepository.findById(UUID.fromString(gradeDto.getStudentId()))
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Căutăm profesorul în baza de date
        User professor = userRepository.findById(UUID.fromString(gradeDto.getProfessorId()))
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        // Creăm obiectul Grade
        Grade grade = Grade.builder()
                .student(student)
                .professor(professor)
                .subject(gradeDto.getSubject())  // Adăugăm subiectul
                .grade(gradeDto.getGrade())  // Adăugăm nota
                .date(LocalDateTime.now())  // Data curentă
                .build();

        // Salvăm nota în baza de date
        return gradeRepository.save(grade);
    }
}
