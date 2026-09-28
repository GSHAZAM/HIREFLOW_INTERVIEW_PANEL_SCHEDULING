package com.example.interview_management.InterviewPanel;


import com.example.interview_management.PipelineStage.PipelineStage;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
public class InterviewPanel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String panelName;
    private LocalDateTime scheduledDateTime;

    @ElementCollection
    private List<String> members; // list of interviewer names/emails

    @OneToMany(mappedBy = "interviewPanel", cascade = CascadeType.ALL)
    private List<PipelineStage> pipelineStages;

    // getters and setters
}
