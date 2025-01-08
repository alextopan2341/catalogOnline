package com.example.server.controller;

import com.example.server.dtos.AbsenceDto;
import com.example.server.dtos.StudentDto;
import com.example.server.model.Absence;
import com.example.server.service.AbsenceService;
import com.example.server.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/teachers")
public class TeacherController {

    @Autowired
    private AbsenceService absenceService;

    @Autowired
    private ClassroomService classroomService;

    @PostMapping("/absences")
    public ResponseEntity<Absence> addAbsence(@RequestBody AbsenceDto absenceDto) {
        Absence absence = absenceService.addAbsence(absenceDto);
        return ResponseEntity.ok(absence);
    }

    @GetMapping("/students/{studentId}/absences")
    public ResponseEntity<List<Absence>> getAbsences(@PathVariable UUID studentId) {
        List<Absence> absences = absenceService.getAbsencesForStudent(studentId);
        return ResponseEntity.ok(absences);
    }

    @GetMapping("/{professorId}/students")
    public ResponseEntity<List<StudentDto>> getStudentsForProfessor(@PathVariable UUID professorId) {
        List<StudentDto> students = classroomService.getStudentsForProfessor(professorId);
        return ResponseEntity.ok(students);
    }

}
