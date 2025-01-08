package com.example.server.repository;

import com.example.server.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    // Metodă pentru a găsi toate clasele unui profesor
    List<Classroom> findByTeacherId(UUID teacherId);
}
