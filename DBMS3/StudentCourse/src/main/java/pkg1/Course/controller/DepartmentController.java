package pkg1.Course.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import pkg1.Course.entity.Department;
import pkg1.Course.repo.DepartmentRepository;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    @Autowired
    private DepartmentRepository deptRepo;

    @GetMapping
    public List<Department> getAllDepartments() {
        return deptRepo.findAll();
    }

    @GetMapping("/{id}")
    public Department getDepartment(@PathVariable int id) {
        return deptRepo.findById(id).orElse(null);
    }

    @PostMapping
    public Department createDepartment(@RequestBody Department dept) {
        return deptRepo.save(dept);
    }

    @PutMapping("/{id}")
    public Department updateDepartment(@PathVariable int id, @RequestBody Department dept) {
        dept.setDeptId(id);
        return deptRepo.save(dept);
    }

    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable int id) {
        deptRepo.deleteById(id);
    }
}
