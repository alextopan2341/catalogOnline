package com.example.server.repository;

import com.example.server.model.Grade;
import com.example.server.model.Subject;
import com.example.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GradeRepository extends JpaRepository<Grade, UUID> {
    List<Grade> findByStudentAndSubject(User user, Subject subject);
    List<Grade> findByProfessor(User professor);
}
