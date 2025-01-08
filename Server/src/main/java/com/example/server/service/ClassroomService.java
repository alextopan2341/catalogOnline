package com.example.server.service;

import com.example.server.dtos.ClassroomDto;
import com.example.server.model.Classroom;
import com.example.server.model.User;
import com.example.server.repository.ClassroomRepository;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.UUID;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private UserRepository userRepository;

    public Classroom createClassroom(ClassroomDto classroomDto) {
        User teacher = userRepository.findById(classroomDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (!"TEACHER".equals(teacher.getRole())) {
            throw new RuntimeException("The specified user is not a teacher.");
        }

        Classroom classroom = new Classroom();
        classroom.setTeacher(teacher);
        classroom.setName(classroomDto.getName());

        HashSet<User> students = new HashSet<>();
        for (UUID studentId : classroomDto.getStudentIds()) {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            if (!"STUDENT".equals(student.getRole())) {
                throw new RuntimeException("The specified user is not a student.");
            }
            students.add(student);
        }

        classroom.setStudents(students);
        return classroomRepository.save(classroom);
    }
}
