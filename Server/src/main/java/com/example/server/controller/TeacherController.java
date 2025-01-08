package com.example.server.controller;

import com.example.server.dtos.AbsenceDto;
import com.example.server.dtos.GradeDto;
import com.example.server.dtos.StudentDto;
import com.example.server.model.Absence;
import com.example.server.model.Grade;
import com.example.server.service.AbsenceService;
import com.example.server.service.ClassroomService;
import com.example.server.service.GradeService;
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

    @Autowired
    private GradeService gradeService;

    // Endpoint pentru a adăuga o notă unui student
    @PostMapping("/students/{studentId}/grades")
    public ResponseEntity<Grade> addGradeToStudent(@PathVariable UUID studentId, @RequestBody GradeDto gradeDto) {
        // Verificăm dacă profesorul și studentul există în sistem
        Grade grade = gradeService.addGradeToStudent(studentId, gradeDto);
        return ResponseEntity.ok(grade);
    }

    @PostMapping("/students/{studentId}/absences")
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
