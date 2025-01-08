package com.example.server.controller;

import com.example.server.dtos.AddStudentDto;
import com.example.server.dtos.ClassroomDto;
import com.example.server.model.Classroom;
import com.example.server.model.Role;
import com.example.server.model.User;
import com.example.server.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
        Classroom updatedClassroom = classroomService.modifyStudentsToClassroom(classroomId, addStudentDto);
        return ResponseEntity.ok(updatedClassroom);
    }

    @GetMapping("/getClasses")
    public ResponseEntity<?> register(){
        List<Classroom> classes = classroomService.getAll();
        return ResponseEntity.ok(classes.stream()
                .collect(Collectors.toMap(Classroom::getName, Classroom::getId)));
    }

    @PostMapping("/getProfessor")
    public ResponseEntity<?> getProfessors(@RequestBody String className){
        //should also return the old values of proffesorsdd
        return ResponseEntity.ok(classroomService.getProfessorByName(className));
    }

    @GetMapping("/{classroomId}/students")
    public ResponseEntity<?> getStudentsByClassroomId(
            @PathVariable("classroomId") String classroomId) {
        return ResponseEntity.ok(classroomService.getStudentsByClassroomId(UUID.fromString(classroomId)));
    }

    @GetMapping("/{classroomId}/classroom")
    public ResponseEntity<?> getClassroomById(
            @PathVariable("classroomId") String classroomId) {
        Classroom classroom = classroomService.getClassroomById(UUID.fromString(classroomId));
        ClassroomDto classroomDto = new ClassroomDto();
        classroomDto.setName(classroom.getName());
        classroomDto.setTeacherId(classroom.getTeacher().getId());
        classroomDto.setTeacherName(classroom.getTeacher().getFullName());
        classroomDto.setStudents(classroom.getStudents().stream().collect(Collectors.toMap(User::getId,User::getFullName)));
        return ResponseEntity.ok(classroomDto);
    }

}
