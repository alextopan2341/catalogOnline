package com.example.server.service;

import com.example.server.dtos.AbsenceDto;
import com.example.server.model.Absence;
import com.example.server.model.User;
import com.example.server.repository.AbsenceRepository;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AbsenceService {

    @Autowired
    private AbsenceRepository absenceRepository;

    @Autowired
    private UserRepository userRepository;

    public Absence addAbsence(AbsenceDto absenceDto) {
        User student = userRepository.findById(absenceDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User teacher = userRepository.findById(absenceDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Absence absence = new Absence();
        absence.setStudent(student);
        absence.setTeacher(teacher);
        absence.setSubject(absenceDto.getSubject());
        absence.setDate(absenceDto.getDate());
        absence.setJustified(absenceDto.getJustified());

        return absenceRepository.save(absence);
    }


    public List<Absence> getAbsencesForStudent(UUID studentId) {
        // Find the user with the given UUID
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Ensure the user has the "STUDENT" role
        if (!"STUDENT".equals(student.getRole())) {
            throw new RuntimeException("The specified user is not a student.");
        }

        // Retrieve absences directly using the repository method
        return absenceRepository.findByStudentId(studentId);
    }
}
