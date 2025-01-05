package com.example.server.controller;

import com.example.server.dtos.StudentDto;
import com.example.server.model.Role;
import com.example.server.model.User;
import com.example.server.security.jwttoken.JwtService;
import com.example.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/dashboard")
    public @ResponseBody ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String bearerToken) {
        try {
            // Extragem tokenul din Authorization header
            String token = bearerToken.substring(7); // Eliminăm "Bearer " din începutul tokenului
            String email = jwtService.extractUserEmail(token); // Extragem email-ul din token

            // Căutăm utilizatorul în baza de date pe baza email-ului
            User user = userService.findByEmail(email);

            // Verificăm rolul utilizatorului și returnăm datele corespunzătoare
            if (user != null) {
                if (user.getRole().equals("STUDENT")) {
                    // Returnăm datele pentru Student
                    StudentDto studentDto = userService.getStudentData(user);
                    return ResponseEntity.ok(studentDto);
                } else if (user.getRole().equals("PROFESSOR")) {
                    // Returnăm datele pentru Profesor
                   // ProfessorDto professorDto = userService.getProfessorDashboardData(user);
                    return null;//TODO: ResponseEntity.ok(professorDto);
                }
            }
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/student")
    public @ResponseBody ResponseEntity<?> getStudentDashboard(@RequestHeader("Authorization") String bearerToken) {
        try {
            // Extragem tokenul din Authorization header
            String token = bearerToken.substring(7); // Eliminăm "Bearer " din începutul tokenului
            String email = jwtService.extractUserEmail(token); // Extragem email-ul din token

            // Căutăm utilizatorul în baza de date pe baza email-ului
            User user = userService.findByEmail(email);

            if (user != null && user.getRole().equals(Role.STUDENT)) {
                // Returnăm datele pentru Student
                StudentDto studentDto = userService.getStudentData(user);
                return ResponseEntity.ok(studentDto);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is not a student.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Endpoint pentru profesor
    @GetMapping("/professor")
    public @ResponseBody ResponseEntity<?> getProfessorDashboard(@RequestHeader("Authorization") String bearerToken) {
        try {
            // Extragem tokenul din Authorization header
            String token = bearerToken.substring(7); // Eliminăm "Bearer " din începutul tokenului
            String email = jwtService.extractUserEmail(token); // Extragem email-ul din token

            // Căutăm utilizatorul în baza de date pe baza email-ului
            User user = userService.findByEmail(email);

            if (user != null && user.getRole().equals(Role.PROFESSOR)) {
                // TODO: Returnează datele pentru Profesor
                return ResponseEntity.ok("Professor data (not implemented yet).");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is not a professor.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
