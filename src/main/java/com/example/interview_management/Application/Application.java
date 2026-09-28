package com.example.interview_management.Application;


import java.util.List;

import com.example.interview_management.Feedback.Feedback;
import com.example.interview_management.JobOpening.JobOpening;
import com.example.interview_management.PipelineStage.PipelineStage;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.OneToMany;

@Entity
@Table(name = "application")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getResumeLink() {
        return resumeLink;
    }

    public void setResumeLink(String resumeLink) {
        this.resumeLink = resumeLink;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public JobOpening getJobOpening() {
        return jobOpening;
    }

    public void setJobOpening(JobOpening jobOpening) {
        this.jobOpening = jobOpening;
    }

    @Column(name = "candidate_name", length = 100)
    private String candidateName;
    @Column(length = 100)
    private String email;
    @Column(name = "resume_link", length = 255)
    private String resumeLink;
    @Column(length = 50)
    private String status;
    @ManyToOne
    @JoinColumn(name = "job_id")
    private JobOpening jobOpening;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<PipelineStage> pipelineStages;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks;


}
