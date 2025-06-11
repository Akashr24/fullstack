package pkg1.Course.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import pkg1.Course.entity.Instructor;
import pkg1.Course.repo.InstructorRepository;

import java.util.List;

@RestController
@RequestMapping("/instructors")
public class InstructorController {

    @Autowired
    private InstructorRepository instructorRepo;

    @GetMapping 
    public List<Instructor> getAllInstructors() {
        return instructorRepo.findAll();
    }

    @GetMapping("/{id}")
    public Instructor getInstructor(@PathVariable int id) {
        return instructorRepo.findById(id).orElse(null);
    }

    @PostMapping 
    public Instructor createInstructor(@RequestBody Instructor instructor) {
        return instructorRepo.save(instructor);
    }

    @PutMapping("/{id}")
    public Instructor updateInstructor(@PathVariable int id, @RequestBody Instructor instructor) {
        instructor.setInstructorId(id);
        return instructorRepo.save(instructor);
    }

    @DeleteMapping("/{id}")
    public void deleteInstructor(@PathVariable int id) {
        instructorRepo.deleteById(id);
    }
}
