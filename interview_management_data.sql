CREATE DATABASE hirefire_db;

USE hirefire_db;

-- Example table for JobOpening
CREATE TABLE job_opening (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    department VARCHAR(100),
    description TEXT,
    status VARCHAR(20)
);

-- Example table for Application
CREATE TABLE application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_name VARCHAR(100),
    email VARCHAR(100),
    resume_link VARCHAR(255),
    status VARCHAR(50),
    job_id BIGINT,
    FOREIGN KEY (job_id) REFERENCES job_opening(id)
);

SELECT * FROM job_opening;