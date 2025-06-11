drop database studentcourse;
create database studentcourse;
use studentcourse;

-- DEPARTMENT Table
CREATE TABLE DEPARTMENT (
    Dept_ID INT PRIMARY KEY auto_increment,
    Dept_Name VARCHAR(100) UNIQUE,
    Head VARCHAR(100)
    
);

-- STUDENT Tableregisters
CREATE TABLE STUDENT (
    Student_ID INT PRIMARY KEY auto_increment,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Contact VARCHAR(15),
    Dept_ID INT,
    FOREIGN KEY (Dept_ID) REFERENCES DEPARTMENT(Dept_ID)
);

-- INSTRUCTOR Table
CREATE TABLE INSTRUCTOR (
    Instructor_ID INT PRIMARY KEY auto_increment,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Capacity INT,
    Dept_ID INT,
    FOREIGN KEY (Dept_ID) REFERENCES DEPARTMENT(Dept_ID)
);

-- COURSE Table
CREATE TABLE COURSE (
    Course_ID INT PRIMARY KEY auto_increment,
    Name VARCHAR(100),
    Instructor_ID INT,
    CourseCode  VARCHAR(100),
    Credit INT,
    FOREIGN KEY (Instructor_ID) REFERENCES INSTRUCTOR(Instructor_ID)
);

-- REGISTERS Table (Associative Entity between STUDENT and COURSE)


-- TEACHES Table (Associative Entity between INSTRUCTOR and COURSE)


use studentcourse;

SELECT 
    Student_ID, name, email, dept_name
FROM
    student
        INNER JOIN
    department;
