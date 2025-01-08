package com.example.server.service;

import com.example.server.dtos.AddStudentDto;
import com.example.server.dtos.ClassroomDto;
import com.example.server.dtos.UserResponseDto;
import com.example.server.model.Classroom;
import com.example.server.model.User;
import com.example.server.model.mapper.UserMapper;
import com.example.server.repository.ClassroomRepository;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
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

        Set<User> students = new HashSet<>();
        for (UUID studentId : addStudentDto.getStudentIds()) {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            students.add(student);
        }

        classroom.setStudents(students);
        return classroomRepository.save(classroom);
    }

    public Classroom addStudentToClassroom(String classroomId,User student) {
        Classroom classroom = classroomRepository.findById(UUID.fromString(classroomId))
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        Set<User> students = classroom.getStudents();
        students.add(student);
        classroom.setStudents(students);
        return classroomRepository.save(classroom);
    }

    public List<Classroom> getAll(){
        return classroomRepository.findAll();
    }

    public User getProfessorByName(String name){
        Classroom classroom = classroomRepository.findByName(name);
        return classroom.getTeacher();
    }

    public List<UserResponseDto> getStudentsByClassroomId(UUID classroomId){
        Classroom classroom = classroomRepository.getReferenceById(classroomId);
        return classroom.getStudents().stream().map(UserMapper::toResponseDTO).toList();
    }

    public Classroom getClassroomById(UUID classroomId){
        return classroomRepository.getReferenceById(classroomId);
    }
}
