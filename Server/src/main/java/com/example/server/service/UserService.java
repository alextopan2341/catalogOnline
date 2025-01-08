package com.example.server.service;

import com.example.server.dtos.StudentDto;
import com.example.server.dtos.UserLoginDto;
import com.example.server.dtos.UserResponseDto;
import com.example.server.model.Grade;
import com.example.server.model.Role;
import com.example.server.model.Subject;
import com.example.server.model.User;
import com.example.server.model.mapper.UserMapper;
import com.example.server.repository.GradeRepository;
import com.example.server.repository.UserRepository;
import com.example.server.security.PasswordHasher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GradeRepository gradeRepository;

    public void createUser(UserLoginDto userLoginDto){
        User user = new User();
        user.setEmail(userLoginDto.getEmail());
        user.setPassword(PasswordHasher.hashPassword(userLoginDto.getPassword()));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public boolean logIn(UserLoginDto userLoginDto) {
        User dbUser = userRepository.findByEmail(userLoginDto.getEmail());
        if(dbUser == null){
            return false;
        }
        return PasswordHasher.verifyPassword(userLoginDto.getPassword(),dbUser.getPassword());
    }

    public Object getUserDataByRole(String username) {
        User user = findByEmail(username);
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }
        // Verifică rolul utilizatorului și returnează datele corespunzătoare
        if (Role.STUDENT.equals(user.getRole())) {
            return getStudentData(user); // Returnează datele pentru student
        } else if (Role.PROFESSOR.equals(user.getRole())) {
            return null;//getProfessorData(user); // Returnează datele pentru profesor
        } else {
            throw new IllegalStateException("Unknown role: " + user.getRole());
        }
    }

    public StudentDto getStudentData(User user) {
        Set<Subject> subjects = user.getSubjects();  // Get all subjects for the student
        Map<String, String> grades = new HashMap<>();

        // Iterate over each subject and fetch grades
        for (Subject subject : subjects) {
            List<Grade> subjectGrades = gradeRepository.findByStudentAndSubject(user, subject);

            // Concatenate all grades for the subject into a single string
            String gradeList = subjectGrades.stream()
                    .map(grade -> String.valueOf(grade.getGrade()))
                    .collect(Collectors.joining(", "));

            grades.put(subject.name(), gradeList);  // Store the concatenated grades as a single string
        }

        // Return the student DTO with the concatenated grades
        return new StudentDto(user.getId(), user.getFullName(), user.getEmail(), grades, new HashMap<>());
    }


    private String getGradeForSubject(User user, Subject subject) {
        List<Grade> grades = gradeRepository.findByStudentAndSubject(user, subject);
        if (grades != null && !grades.isEmpty()) {
            Grade lastGrade = grades.get(grades.size() - 1);
            return String.valueOf(lastGrade.getGrade());
        } else {
            return "N/A";
        }
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public List<UserResponseDto> getUserByRole(Role role){
        List<User> userList = userRepository.findAllByRole(role);
        return userList.stream().map((UserMapper::toResponseDTO)).toList();
    }
}
