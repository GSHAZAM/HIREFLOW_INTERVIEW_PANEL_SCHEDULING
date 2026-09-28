package com.example.interview_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.interview_management.Application.Application;
import com.example.interview_management.Service.ApplicationService;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService service;


    @PostMapping
    public Application addApplication(@RequestBody Application app) {
        return service.saveApplication(app);
    }


    @GetMapping
    public List<Application> getAllApplications() {
        return service.getApplications();
    }

    @GetMapping("/{id}")
    public Application getApplication(@PathVariable Long id) {
        return service.getApplicationById(id);
    }

    @PutMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id, @RequestBody String status) {
        return service.updateApplicationStatus(id, status);
    }


    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
        return "Application with ID " + id + " deleted successfully!";
    }
}
