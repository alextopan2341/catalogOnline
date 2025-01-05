package com.example.server.service;

import com.example.server.dtos.UserLoginDto;
import com.example.server.model.Role;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import com.example.server.security.PasswordHasher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

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

    public void saveUser(User user) {
        userRepository.save(user);
    }
}
