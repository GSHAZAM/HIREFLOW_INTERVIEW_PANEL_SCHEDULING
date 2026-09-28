package com.example.interview_management.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.interview_management.Application.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

}
