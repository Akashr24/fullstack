package pkg1.Course.entity;

import jakarta.persistence.*;

@Entity
@Table(name="course")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int courseId;
    private String name;
    private int Credit;
    private String CourseCode;
    
    @OneToOne
    @JoinColumn(name = "instructorId")
    private Instructor instructorId;

	public int getCourseId() {
		return courseId;
	}

	public void setCourseId(int courseId) {
		this.courseId = courseId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Instructor getInstructorId() {
		return instructorId;
	}

	public void setInstructorId(Instructor instructorId) {
		this.instructorId = instructorId;
	}
	

	public Course(int courseId, String name, int credit, String courseCode, Instructor instructorId) {
		super();
		this.courseId = courseId;
		this.name = name;
		Credit = credit;
		CourseCode = courseCode;
		this.instructorId = instructorId;
	}

	public Course() {
		super();
		// TODO Auto-generated constructor stub
	}

	public int getCredit() {
		return Credit;
	}

	public void setCredit(int credit) {
		Credit = credit;
	}

	public String getCourseCode() {
		return CourseCode;
	}

	public void setCourseCode(String courseCode) {
		CourseCode = courseCode;
	}
    
	
}
