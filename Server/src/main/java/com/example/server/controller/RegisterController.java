package com.example.server.controller;

import com.example.server.dtos.UserRegisterDto;
import com.example.server.dtos.UserResponseDto;
import com.example.server.model.User;
import com.example.server.model.mapper.UserMapper;
import com.example.server.security.PasswordHasher;
import com.example.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@CrossOrigin(origins = "http://localhost:3000")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> register(@Validated @RequestBody UserRegisterDto userRegisterDto) {
        try {
            // Verificare: parolele trebuie să fie identice
            if (!userRegisterDto.getPassword().equals(userRegisterDto.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Passwords do not match.");
            }

            // Verificare: email-ul să nu fie deja folosit
            if (userService.findByEmail(userRegisterDto.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Email is already in use.");
            }

            // Convertim DTO-ul în entitate și salvăm utilizatorul
            User user = UserMapper.toEntity(userRegisterDto);
            user.setPassword(PasswordHasher.hashPassword(userRegisterDto.getPassword()));
            userService.saveUser(user);

            // Returnăm utilizatorul înregistrat sub formă de DTO
            UserResponseDto responseDto = UserMapper.toResponseDTO(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);

        } catch (Exception e) {
            // Gestionăm eventuale erori
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the registration.");
        }
    }
}
