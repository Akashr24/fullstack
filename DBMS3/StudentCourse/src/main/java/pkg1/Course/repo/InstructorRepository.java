package pkg1.Course.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import pkg1.Course.entity.Instructor;

public interface InstructorRepository extends JpaRepository<Instructor, Integer> {
}
