package pkg1.Course.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="instructor")
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int instructorId;
    private String name;
    private String email;
    private int capacity;
    @ManyToOne
    @JoinColumn(name = "deptId")
    private Department deptId;
	public int getInstructorId() {
		return instructorId;
	}
	public void setInstructorId(int instructorId) {
		this.instructorId = instructorId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getCapacity() {
		return capacity;
	}
	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}
	public Department getDeptId() {
		return deptId;
	}
	public void setDeptId(Department deptId) {
		this.deptId = deptId;
	}
	public Instructor(int instructorId, String name, String email, int capacity, Department deptId) {
		super();
		this.instructorId = instructorId;
		this.name = name;
		this.email = email;
		this.capacity = capacity;
		this.deptId = deptId;
	}
	public Instructor() {
		super();
		// TODO Auto-generated constructor stub
	}

    // Getters and setters
	
    
}
