package pkg1.Course.repo;
import org.springframework.data.jpa.repository.JpaRepository;

import pkg1.Course.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
}
