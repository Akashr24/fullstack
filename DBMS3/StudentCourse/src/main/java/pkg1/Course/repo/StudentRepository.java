package pkg1.Course.repo;
import org.springframework.data.jpa.repository.JpaRepository;

import pkg1.Course.entity.Student;


public interface StudentRepository extends JpaRepository<Student, Integer> {
}

