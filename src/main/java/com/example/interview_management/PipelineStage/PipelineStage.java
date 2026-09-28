package com.example.interview_management.PipelineStage;

import com.example.interview_management.Application.Application;
import com.example.interview_management.InterviewPanel.InterviewPanel;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class PipelineStage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stageName; // Screening, HR Round, Technical Round
    private String status;    // Pending, Completed

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne
    @JoinColumn(name = "panel_id")
    private InterviewPanel interviewPanel;

}


