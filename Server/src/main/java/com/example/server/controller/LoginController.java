package com.example.server.controller;

import com.example.server.dtos.UserLoginDto;
import com.example.server.model.User;
import com.example.server.model.mapper.UserMapper;
import com.example.server.security.jwttoken.JwtService;
import com.example.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/auth")
    public @ResponseBody ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto) {
        if (userService.logIn(userLoginDto)) {
            User user = userService.findByEmail(userLoginDto.getEmail());
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(token);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/user")
    public @ResponseBody ResponseEntity<?> getUser(@RequestHeader("Authorization")String bearerToken){
        try{
            String token = bearerToken.substring(7);
            String email = jwtService.extractUserEmail(token);
            User user = userService.findByEmail(email);
            //check if the token is valid since the filter doesn't check for the /login/* endpoints
            if(!jwtService.isTokenValid(token, user)){
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            return ResponseEntity.ok(UserMapper.toResponseDTO(user));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/create")
    public @ResponseBody ResponseEntity<?> create(@RequestBody UserLoginDto userLoginDto) {
        userService.createUser(userLoginDto);
        return ResponseEntity.ok("Ok");
    }

}
