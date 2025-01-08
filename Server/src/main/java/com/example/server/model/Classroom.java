package com.example.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Setter
@Getter
@Entity
public class Classroom {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(updatable = false, nullable = false, columnDefinition = "UUID")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "classroom_students",
            joinColumns = @JoinColumn(name = "classroom_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<User> students = new HashSet<>();
}
