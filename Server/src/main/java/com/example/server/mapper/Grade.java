package com.example.server.mapper;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @ManyToOne
    private User student;

    @ManyToOne
    private User professor;

    @Enumerated(EnumType.STRING)
    private Subject subject;

    @Pattern(regexp = "^(10|[1-9])$", message = "Grade must be between 1 and 10")
    private long grade;

    private LocalDateTime date;

}

