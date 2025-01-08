package com.example.server.service;

import com.example.server.dtos.AddStudentDto;
import com.example.server.dtos.ClassroomDto;
import com.example.server.dtos.StudentDto;
import com.example.server.model.Absence;
import com.example.server.model.Classroom;
import com.example.server.model.Grade;
import com.example.server.model.User;
import com.example.server.repository.AbsenceRepository;
import com.example.server.repository.ClassroomRepository;
import com.example.server.repository.GradeRepository;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private AbsenceRepository absenceRepository;

    @Autowired
    private GradeRepository gradeRepository;

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

    public Map<UUID, Map<String, String>> getGradesByProfessor(UUID professorId) {
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        List<Grade> grades = gradeRepository.findByProfessor(professor);

        Map<UUID, Map<String, String>> studentGrades = new HashMap<>();

        for (Grade grade : grades) {
            UUID studentId = grade.getStudent().getId();
            studentGrades.putIfAbsent(studentId, new HashMap<>());
            studentGrades.get(studentId).put(grade.getSubject().toString(), String.valueOf(grade.getGrade()));
        }

        return studentGrades;
    }

    public List<StudentDto> getStudentsForProfessor(UUID professorId) {
        List<Classroom> classrooms = classroomRepository.findByTeacherId(professorId);
        Map<UUID, Map<String, String>> studentGrades = getGradesByProfessor(professorId);

        // Obține toate absențele profesorului
        List<Absence> absences = absenceRepository.findByTeacherId(professorId);

        // Grupează absențele după student și materie
        Map<UUID, Map<String, Integer>> studentAbsences = new HashMap<>();
        for (Absence absence : absences) {
            UUID studentId = absence.getStudent().getId();
            String subject = absence.getSubject();

            studentAbsences.putIfAbsent(studentId, new HashMap<>());
            studentAbsences.get(studentId).put(subject,
                    studentAbsences.get(studentId).getOrDefault(subject, 0) + 1);
        }

        // Creează lista de DTO-uri pentru studenți
        List<StudentDto> studentDtos = new ArrayList<>();
        for (Classroom classroom : classrooms) {
            for (User student : classroom.getStudents()) {
                Map<String, String> grades = studentGrades.getOrDefault(student.getId(), new HashMap<>());
                Map<String, Integer> absencesForStudent = studentAbsences.getOrDefault(student.getId(), new HashMap<>());
                studentDtos.add(new StudentDto(student.getId(),student.getFullName(), student.getEmail(), grades, absencesForStudent));
            }
        }
        return studentDtos;
    }
}
