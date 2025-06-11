package pkg1.Course.repo;
import org.springframework.data.jpa.repository.JpaRepository;

import pkg1.Course.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
}
