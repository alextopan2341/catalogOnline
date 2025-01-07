package com.example.server.repository;

import com.example.server.model.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, UUID> {

    // Metodă pentru a găsi toate absențele unui student
    List<Absence> findByStudentId(UUID studentId);

    // Metodă pentru a găsi toate absențele unui profesor
    List<Absence> findByTeacherId(UUID teacherId);

    // Metodă pentru a găsi toate absențele unui student la o materie specifică
    List<Absence> findByStudentIdAndSubject(UUID studentId, String subject);
}
