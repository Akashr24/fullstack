// API Configuration
const API_BASE = 'http://localhost:8080';

// Available GET endpoints for http://localhost:8080
const API_ENDPOINTS = {
    // Main entity endpoints
    students: '/students',           // GET all students
    departments: '/departments',     // GET all departments
    courses: '/courses',            // GET all courses
    instructors: '/instructors',    // GET all instructors

    // Individual record endpoints (by ID)
    studentById: '/students/{id}',      // GET specific student
    departmentById: '/departments/{id}', // GET specific department
    courseById: '/courses/{id}',        // GET specific course
    instructorById: '/instructors/{id}', // GET specific instructor
};

// Global state
let students = [];
let departments = [];
let courses = [];
let instructors = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    checkAuth();

    initializeTabs();
    initializeForms();
    initializeRefreshButtons();

    // Test API connection first, then fetch data
    const apiStatus = await testApiConnection();
    if (apiStatus) {
        fetchAllData();
    } else {
        showToast('API connection failed. Please check if the server is running on http://localhost:8080', 'error');
    }
});

// Initialize refresh buttons for individual data types
function initializeRefreshButtons() {
    // Add refresh buttons to each tab if they don't exist
    addRefreshButton('students-tab', 'Refresh Students', fetchStudents);
    addRefreshButton('departments-tab', 'Refresh Departments', fetchDepartments);
    addRefreshButton('courses-tab', 'Refresh Courses', fetchCourses);
    addRefreshButton('instructors-tab', 'Refresh Instructors', fetchInstructors);
}

function addRefreshButton(tabId, buttonText, refreshFunction) {
    const tab = document.getElementById(tabId);
    if (!tab) return;

    const cardHeader = tab.querySelector('.card-header');
    if (!cardHeader) return;

    // Check if refresh button already exists
    if (cardHeader.querySelector('.refresh-btn')) return;

    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn btn-secondary refresh-btn';
    refreshBtn.textContent = '🔄 ' + buttonText;
    refreshBtn.style.marginLeft = '10px';
    refreshBtn.onclick = refreshFunction;

    cardHeader.appendChild(refreshBtn);
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Form initialization
function initializeForms() {
    // Student form
    document.getElementById('student-form').addEventListener('submit', handleStudentSubmit);
    
    // Department form
    document.getElementById('department-form').addEventListener('submit', handleDepartmentSubmit);
    
    // Course form
    document.getElementById('course-form').addEventListener('submit', handleCourseSubmit);
    
    // Instructor form
    document.getElementById('instructor-form').addEventListener('submit', handleInstructorSubmit);
}

// Enhanced API call function with better error handling
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        console.log(`Making ${method} request to: ${API_BASE}${endpoint}`);

        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
            console.log('Request data:', data);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, config);

        console.log(`Response status: ${response.status} for ${endpoint}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        if (method === 'DELETE' || response.status === 204) {
            return null;
        }

        const result = await response.json();
        console.log(`Response data for ${endpoint}:`, result);
        return result;
    } catch (error) {
        console.error('API call failed:', error);
        showToast(`Failed to communicate with server: ${error.message}`, 'error');
        throw error;
    }
}

// Individual GET functions for each endpoint
async function getStudents() {
    try {
        return await apiCall('/students');
    } catch (error) {
        console.error('Failed to fetch students:', error);
        return [];
    }
}

async function getDepartments() {
    try {
        return await apiCall('/departments');
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        return [];
    }
}

async function getCourses() {
    try {
        return await apiCall('/courses');
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        return [];
    }
}

async function getInstructors() {
    try {
        return await apiCall('/instructors');
    } catch (error) {
        console.error('Failed to fetch instructors:', error);
        return [];
    }
}

// Get individual records by ID
async function getStudentById(id) {
    try {
        return await apiCall(`/students/${id}`);
    } catch (error) {
        console.error(`Failed to fetch student ${id}:`, error);
        return null;
    }
}

async function getDepartmentById(id) {
    try {
        return await apiCall(`/departments/${id}`);
    } catch (error) {
        console.error(`Failed to fetch department ${id}:`, error);
        return null;
    }
}

async function getCourseById(id) {
    try {
        return await apiCall(`/courses/${id}`);
    } catch (error) {
        console.error(`Failed to fetch course ${id}:`, error);
        return null;
    }
}

async function getInstructorById(id) {
    try {
        return await apiCall(`/instructors/${id}`);
    } catch (error) {
        console.error(`Failed to fetch instructor ${id}:`, error);
        return null;
    }
}

// Additional GET utility functions
async function searchStudents(query) {
    try {
        // If API supports search, use it; otherwise filter locally
        const allStudents = await getStudents();
        return allStudents.filter(student =>
            student.name?.toLowerCase().includes(query.toLowerCase()) ||
            student.email?.toLowerCase().includes(query.toLowerCase()) ||
            student.studentId?.toString().includes(query)
        );
    } catch (error) {
        console.error('Failed to search students:', error);
        return [];
    }
}

async function getStudentsByDepartment(deptId) {
    try {
        const allStudents = await getStudents();
        return allStudents.filter(student =>
            student.deptId?.deptId === deptId ||
            student.department === deptId ||
            student.deptId === deptId
        );
    } catch (error) {
        console.error('Failed to get students by department:', error);
        return [];
    }
}

async function getCoursesByDepartment(deptId) {
    try {
        const allCourses = await getCourses();
        return allCourses.filter(course =>
            course.instructorId?.deptId?.deptId === deptId ||
            course.department === deptId
        );
    } catch (error) {
        console.error('Failed to get courses by department:', error);
        return [];
    }
}

async function getInstructorsByDepartment(deptId) {
    try {
        const allInstructors = await getInstructors();
        return allInstructors.filter(instructor =>
            instructor.deptId?.deptId === deptId ||
            instructor.department === deptId ||
            instructor.deptId === deptId
        );
    } catch (error) {
        console.error('Failed to get instructors by department:', error);
        return [];
    }
}

// Test API connectivity
async function testApiConnection() {
    try {
        console.log('Testing API connection...');
        showToast('Testing API connection...', 'info');

        const testResults = {
            students: false,
            departments: false,
            courses: false,
            instructors: false
        };

        try {
            await apiCall('/students');
            testResults.students = true;
        } catch (e) { console.log('Students endpoint failed:', e.message); }

        try {
            await apiCall('/departments');
            testResults.departments = true;
        } catch (e) { console.log('Departments endpoint failed:', e.message); }

        try {
            await apiCall('/courses');
            testResults.courses = true;
        } catch (e) { console.log('Courses endpoint failed:', e.message); }

        try {
            await apiCall('/instructors');
            testResults.instructors = true;
        } catch (e) { console.log('Instructors endpoint failed:', e.message); }

        const workingEndpoints = Object.values(testResults).filter(Boolean).length;
        const totalEndpoints = Object.keys(testResults).length;

        console.log('API Test Results:', testResults);
        showToast(`API Test: ${workingEndpoints}/${totalEndpoints} endpoints working`,
                  workingEndpoints === totalEndpoints ? 'success' : 'error');

        return testResults;
    } catch (error) {
        console.error('API connection test failed:', error);
        showToast('API connection test failed', 'error');
        return null;
    }
}

// Display comprehensive API information
function displayApiInfo() {
    console.log('=== API CONFIGURATION ===');
    console.log('Base URL:', API_BASE);
    console.log('Available GET Endpoints:');

    Object.entries(API_ENDPOINTS).forEach(([key, endpoint]) => {
        console.log(`  ${key}: ${API_BASE}${endpoint}`);
    });

    console.log('\n=== AVAILABLE GET METHODS ===');
    console.log('1. getStudents() - Fetch all students');
    console.log('2. getDepartments() - Fetch all departments');
    console.log('3. getCourses() - Fetch all courses');
    console.log('4. getInstructors() - Fetch all instructors');
    console.log('5. getStudentById(id) - Fetch specific student');
    console.log('6. getDepartmentById(id) - Fetch specific department');
    console.log('7. getCourseById(id) - Fetch specific course');
    console.log('8. getInstructorById(id) - Fetch specific instructor');
    console.log('9. searchStudents(query) - Search students locally');
    console.log('10. getStudentsByDepartment(deptId) - Filter students by department');
    console.log('11. getCoursesByDepartment(deptId) - Filter courses by department');
    console.log('12. getInstructorsByDepartment(deptId) - Filter instructors by department');
    console.log('13. testApiConnection() - Test all endpoints');
    console.log('14. fetchAllData() - Fetch all data types');
    console.log('15. fetchStudents() - Fetch and display students only');
    console.log('16. fetchDepartments() - Fetch and display departments only');
    console.log('17. fetchCourses() - Fetch and display courses only');
    console.log('18. fetchInstructors() - Fetch and display instructors only');

    console.log('\n=== POST REQUEST STRUCTURES ===');
    console.log('Course POST: { "name": "ADA", "instructorId": { "instructorId": 1 }, "credit": 4, "courseCode": "BCS402" }');
    console.log('Department POST: { "deptName": "CSE", "head": "Shakal" }');
    console.log('Student POST: { "name": "John", "email": "john@example.com", "contact": "1234567890", "deptId": { "deptId": 1 } }');
    console.log('Instructor POST: { "name": "Jane", "email": "jane@example.com", "capacity": 100, "deptId": { "deptId": 1 } }');

    showToast('API information logged to console', 'info');
}

// Add keyboard shortcut to display API info
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+I to display API info
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        displayApiInfo();
    }

    // Ctrl+Shift+T to test API connection
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        testApiConnection();
    }

    // Ctrl+Shift+R to refresh all data
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        fetchAllData();
    }
});

// Search functionality for students table
function searchStudentsTable() {
    const searchInput = document.getElementById('student-search');
    const searchTerm = searchInput.value.toLowerCase();
    const tableRows = document.querySelectorAll('#students-table tbody tr');

    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let found = false;

        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                found = true;
            }
        });

        row.style.display = found ? '' : 'none';
    });
}

function clearStudentSearch() {
    const searchInput = document.getElementById('student-search');
    searchInput.value = '';
    searchStudentsTable();
}

function populateDepartmentDropdown() {
    // Populate student department dropdown
    const studentDeptSelect = document.getElementById('student-department');
    if (studentDeptSelect) {
        studentDeptSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.deptId;
            option.textContent = dept.deptName;
            studentDeptSelect.appendChild(option);
        });
    }
}

function populateCourseInstructorDropdown() {
    const select = document.getElementById('course-instructor');
    const deptDisplay = document.getElementById('course-department-display');

    if (!select) return;

    select.innerHTML = '<option value="">Select Instructor</option>';

    instructors.forEach(inst => {
        const option = document.createElement('option');
        option.value = inst.instructorId;
        option.textContent = `${inst.name} (${inst.deptId?.deptName || 'N/A'}) - Capacity: ${inst.capacity || 'N/A'}`;
        option.dataset.dept = inst.deptId?.deptName || '';
        option.dataset.deptId = inst.deptId?.deptId || '';
        select.appendChild(option);
    });

    // Remove existing event listeners to avoid duplicates
    const newSelect = select.cloneNode(true);
    select.parentNode.replaceChild(newSelect, select);

    // Add event listener to show department name on change
    newSelect.addEventListener('change', () => {
        const selectedOption = newSelect.options[newSelect.selectedIndex];
        if (deptDisplay) {
            deptDisplay.value = selectedOption.dataset.dept || '';
        }
    });
}

function populateInstructorDepartmentDropdown() {
    const instructorDeptSelect = document.getElementById('instructor-department');
    if (!instructorDeptSelect) return;

    instructorDeptSelect.innerHTML = '<option value="">Select Department</option>';
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.deptId;
        option.textContent = dept.deptName;
        instructorDeptSelect.appendChild(option);
    });
}



// Fetch all data using individual GET functions
async function fetchAllData() {
    try {
        console.log('Fetching all data from API...');
        showToast('Loading data...', 'info');

        // Use individual GET functions with better error handling
        const [studentsData, departmentsData, coursesData, instructorsData] = await Promise.all([
            getStudents(),
            getDepartments(),
            getCourses(),
            getInstructors(),
        ]);

        console.log('Fetched data summary:', {
            students: `${studentsData?.length || 0} records`,
            departments: `${departmentsData?.length || 0} records`,
            courses: `${coursesData?.length || 0} records`,
            instructors: `${instructorsData?.length || 0} records`
        });

        // Store data globally
        students = studentsData || [];
        departments = departmentsData || [];
        courses = coursesData || [];
        instructors = instructorsData || [];

        // Update UI
        updateStatistics();
        renderStudentsTable();
        renderDepartmentsTable();
        renderCoursesTable();
        renderInstructorsTable();
        populateDepartmentDropdown();
        populateInstructorDepartmentDropdown();
        populateCourseInstructorDropdown();

        showToast('Data loaded successfully!', 'success');
    } catch (error) {
        console.error('Failed to fetch data:', error);
        showToast('Failed to load data. Please check if the server is running.', 'error');
    }
}

// Fetch specific data type
async function fetchStudents() {
    try {
        showToast('Loading students...', 'info');
        students = await getStudents();
        renderStudentsTable();
        updateStatistics();
        showToast('Students loaded successfully!', 'success');
    } catch (error) {
        console.error('Failed to fetch students:', error);
        showToast('Failed to load students', 'error');
    }
}

async function fetchDepartments() {
    try {
        showToast('Loading departments...', 'info');
        departments = await getDepartments();
        renderDepartmentsTable();
        updateStatistics();
        populateDepartmentDropdown();
        populateInstructorDepartmentDropdown();
        // Note: Course instructor dropdown doesn't need department refresh
        showToast('Departments loaded successfully!', 'success');
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        showToast('Failed to load departments', 'error');
    }
}

async function fetchCourses() {
    try {
        showToast('Loading courses...', 'info');
        courses = await getCourses();
        renderCoursesTable();
        updateStatistics();
        showToast('Courses loaded successfully!', 'success');
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        showToast('Failed to load courses', 'error');
    }
}

async function fetchInstructors() {
    try {
        showToast('Loading instructors...', 'info');
        instructors = await getInstructors();
        renderInstructorsTable();
        updateStatistics();
        populateInstructorDepartmentDropdown();
        populateCourseInstructorDropdown(); // Update course instructor dropdown too
        showToast('Instructors loaded successfully!', 'success');
    } catch (error) {
        console.error('Failed to fetch instructors:', error);
        showToast('Failed to load instructors', 'error');
    }
}


// Update statistics
function updateStatistics() {
    document.getElementById('students-count').textContent = students.length;
    document.getElementById('departments-count').textContent = departments.length;
    document.getElementById('courses-count').textContent = courses.length;
    document.getElementById('instructors-count').textContent = instructors.length;
}

// Render tables
function renderStudentsTable() {
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = '';

    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No students found</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        // Handle actual API response structure
        const departmentName = student.deptId?.deptName || 'N/A';
        const studentId = student.studentId || 'N/A';
        const contact = student.contact || 'N/A';

        row.innerHTML = `
            <td>${studentId}</td>
            <td>${student.name || 'N/A'}</td>
            <td>${student.email || 'N/A'}</td>
            <td>${contact}</td>
            <td>${departmentName}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteStudent(${studentId})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderDepartmentsTable() {
    const tbody = document.querySelector('#departments-table tbody');
    tbody.innerHTML = '';

    if (!departments || departments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No departments found</td></tr>';
        return;
    }

    departments.forEach(dept => {
        const row = document.createElement('tr');
        // Handle actual API response structure
        const deptId = dept.deptId || 'N/A';
        const deptName = dept.deptName || 'N/A';

        row.innerHTML = `
            <td>${deptId}</td>
            <td>${deptName}</td>
            <td>${dept.head || 'N/A'}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteDepartment(${deptId})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderCoursesTable() {
    const tbody = document.querySelector('#courses-table tbody');
    tbody.innerHTML = '';

    if (!courses || courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No courses found</td></tr>';
        return;
    }

    courses.forEach(course => {
        const row = document.createElement('tr');
        // Handle actual API response structure
        const courseId = course.courseId || 'N/A';
        const courseName = course.name || 'N/A';
        const deptName = course.instructorId?.deptId?.deptName || 'N/A';

        row.innerHTML = `
            <td>${courseId}</td>
            <td>${courseName}</td>
            <td>${course.courseCode || 'N/A'}</td>
            <td>${course.credit || 'N/A'}</td>
            <td>${deptName}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteCourse(${courseId})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderInstructorsTable() {
    const tbody = document.querySelector('#instructors-table tbody');
    tbody.innerHTML = '';

    if (!instructors || instructors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No instructors found</td></tr>';
        return;
    }

    instructors.forEach(instructor => {
        const row = document.createElement('tr');
        // Handle actual API response structure
        const instructorId = instructor.instructorId || 'N/A';
        const deptName = instructor.deptId?.deptName || 'N/A';

        row.innerHTML = `
            <td>${instructorId}</td>
            <td>${instructor.name || 'N/A'}</td>
            <td>${instructor.email || 'N/A'}</td>
            <td>${deptName}</td>
            <td>${instructor.capacity || 'N/A'}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteInstructor(${instructorId})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Form handlers
async function handleStudentSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const studentData = {
        name: formData.get('name'),
        email: formData.get('email'),
        contact: formData.get('phone'), // API expects 'contact' not 'phone'
        deptId: {
            deptId: parseInt(formData.get('department')) // API expects nested deptId object
        }
    };

    try {
        console.log('Sending student data:', studentData);
        await apiCall('/students', 'POST', studentData);
        showToast('Student created successfully', 'success');
        fetchAllData();
        closeModal('student-modal');
        e.target.reset();
    } catch (error) {
        console.error('Failed to create student:', error);
        showToast('Failed to create student. Please check the form data.', 'error');
    }
}

async function handleDepartmentSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const departmentData = {
        deptName: formData.get('name'),
        head: formData.get('head')
        // Note: description is not included in POST as per API specification
    };

    try {
        console.log('Sending department data:', departmentData);
        await apiCall('/departments', 'POST', departmentData);
        showToast('Department created successfully', 'success');
        fetchAllData();
        closeModal('department-modal');
        e.target.reset();
    } catch (error) {
        console.error('Failed to create department:', error);
        showToast('Failed to create department. Please check the form data.', 'error');
    }
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const courseData = {
        name: formData.get('name'),
        instructorId: {
            instructorId: parseInt(formData.get('instructor'))
        },
        credit: parseInt(formData.get('credits')),
        courseCode: formData.get('code')
    };

    try {
        console.log('Sending course data:', courseData);
        await apiCall('/courses', 'POST', courseData);
        showToast('Course created successfully', 'success');
        fetchAllData();
        closeModal('course-modal');
        e.target.reset();
    } catch (error) {
        console.error('Failed to create course:', error);
        showToast('Failed to create course. Please check the form data.', 'error');
    }
}


async function handleInstructorSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const instructorData = {
        name: formData.get('name'),
        email: formData.get('email'),
        capacity: parseInt(formData.get('capacity')) || 100, // Add capacity field with default
        deptId: {
            deptId: parseInt(formData.get('department'))
        }
    };

    try {
        await apiCall('/instructors', 'POST', instructorData);
        showToast('Instructor created successfully', 'success');
        fetchAllData();
        closeModal('instructor-modal');
        e.target.reset();
    } catch (error) {
        console.error('Failed to create instructor:', error);
        showToast('Failed to create instructor. Please check the form data.', 'error');
    }
}


// Delete functions
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await apiCall(`/students/${id}`, 'DELETE');
            showToast('Student deleted successfully', 'success');
            fetchAllData();
        } catch (error) {
            console.error('Failed to delete student:', error);
        }
    }
}

async function deleteDepartment(id) {
    if (confirm('Are you sure you want to delete this department?')) {
        try {
            await apiCall(`/departments/${id}`, 'DELETE');
            showToast('Department deleted successfully', 'success');
            fetchAllData();
        } catch (error) {
            console.error('Failed to delete department:', error);
        }
    }
}

async function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            await apiCall(`/courses/${id}`, 'DELETE');
            showToast('Course deleted successfully', 'success');
            fetchAllData();
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    }
}

async function deleteInstructor(id) {
    if (confirm('Are you sure you want to delete this instructor?')) {
        try {
            await apiCall(`/instructors/${id}`, 'DELETE');
            showToast('Instructor deleted successfully', 'success');
            fetchAllData();
        } catch (error) {
            console.error('Failed to delete instructor:', error);
        }
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide toast after different durations based on type
    const duration = type === 'info' ? 2000 : 3000;
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Display username
    if (username) {
        document.getElementById('username-display').textContent = username;
    }
}

// Logout function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        showToast('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}
