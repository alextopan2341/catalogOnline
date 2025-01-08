package com.example.server.service;

import com.example.server.dtos.AddStudentDto;
import com.example.server.dtos.ClassroomDto;
import com.example.server.model.Classroom;
import com.example.server.model.User;
import com.example.server.repository.ClassroomRepository;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private UserRepository userRepository;

    // Creare clasă
    public Classroom createClassroom(ClassroomDto classroomDto) {
        User teacher = userRepository.findById(classroomDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Classroom classroom = new Classroom();
        classroom.setTeacher(teacher);
        classroom.setName(classroomDto.getName());
        classroom.setStudents(new HashSet<>());

        return classroomRepository.save(classroom);
    }

    // Adăugare studenți la o clasă existentă
    public Classroom addStudentsToClassroom(String classroomId, AddStudentDto addStudentDto) {
        Classroom classroom = classroomRepository.findById(UUID.fromString(classroomId))
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        Set<User> students = classroom.getStudents();
        for (UUID studentId : addStudentDto.getStudentIds()) {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            students.add(student);
        }

        classroom.setStudents(students);
        return classroomRepository.save(classroom);
    }
}
