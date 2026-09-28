package com.example.interview_management.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.interview_management.Application.Application;
import com.example.interview_management.Repository.ApplicationRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ApplicationService {
    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository;
    }

    public Application saveApplication(Application application) {
        return repository.save(application);
    }

    public List<Application> getApplications() {
        return repository.findAll();
    }

    public Application getApplicationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Application not found: " + id));
    }

    public void deleteApplication(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Application not found: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public Application updateApplicationStatus(Long id, String status) {
        Application application = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Application not found: " + id));
        application.setStatus(status);
        return repository.save(application);
    }
}
