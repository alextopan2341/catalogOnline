package com.example.server.controller;

import com.example.server.dtos.AddStudentDto;
import com.example.server.dtos.ClassroomDto;
import com.example.server.model.Classroom;
import com.example.server.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    // Endpoint pentru crearea unei clase
    @PostMapping
    public ResponseEntity<Classroom> createClassroom(@RequestBody ClassroomDto classroomDto) {
        Classroom classroom = classroomService.createClassroom(classroomDto);
        return ResponseEntity.ok(classroom);
    }

    // Endpoint pentru adăugarea de studenți la o clasă
    @PostMapping("/{classroomId}/students")
    public ResponseEntity<Classroom> addStudentsToClassroom(
            @PathVariable("classroomId") String classroomId,
            @RequestBody AddStudentDto addStudentDto) {
        Classroom updatedClassroom = classroomService.addStudentsToClassroom(classroomId, addStudentDto);
        return ResponseEntity.ok(updatedClassroom);
    }
}
