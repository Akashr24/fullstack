let currentUser = null;
let currentSection = 'overview';
let editingId = null;
let editingType = null;

// Data storage
let data = {
    students: [
        { id: 1, name: 'Joysten', email: 'joy@sode.edu', contact: '9449567456', department: 'Computer Science Engineering' },
        { id: 2, name: 'Ganesh', email: 'jane@sode.edu', contact: '7463453257', department: 'Electrical Engineering' },
        { id: 3, name: 'Hrishikesh', email: 'bob@sode.edu', contact: '734567892', department: 'Mechanical Engineering' }
    ],
    departments: [
        { id: 1, name: 'Computer Science Engineering' },
        { id: 2, name: 'Electrical Engineering' },
        { id: 3, name: 'Mechanical Engineering' },
        { id: 4, name: 'Chemical Engineering' },
        { id: 5, name: 'AIML' }
    ],
    instructors: [
        { id: 1, name: 'Dr.Nagaraj Bhat', email: 'nagaraj@sode.edu', capacity: 100, department: 'Computer Science Engineering' },
        { id: 2, name: 'Prof. Bob Smith', email: 'bob@sode.edu', capacity: 50, department: 'Electrical Engineering' },
        { id: 3, name: 'Dr. Carol Brown', email: 'carol@sode.edu', capacity: 60, department: 'Mechanical Engineering' }
    ],
    courses: [
        { id: 1, name: 'Data Structures', instructor: 'Dr.Nagaraj Bhat', email: 'nagaraj@sode.edu', department: 'Computer Science Engineering' },
        { id: 2, name: 'Electromagnetic theory', instructor: 'Prof. Bob Smith', email: 'bob@sode.edu', department: 'Electrical Engineering' },
        { id: 3, name: 'Quantum Physics', instructor: 'Dr. Carol Brown', email: 'carol@sode.edu', department: 'Mechanical Engineering' }
    ],
    registrations: [
        { id: 1, studentId: 1, studentName: 'John Doe', courseId: 1, courseName: 'Data Structures', department: 'Computer Science Engineering', enrollmentDate: '2024-01-15' },
        { id: 2, studentId: 2, studentName: 'Jane Smith', courseId: 2, courseName: 'Electromagnetic theory', department: 'Electrical Engineering', enrollmentDate: '2024-01-16' },
        { id: 3, studentId: 3, studentName: 'Bob Johnson', courseId: 3, courseName: 'Quantum Physics', department: 'Mechanical Engineering', enrollmentDate: '2024-01-17' }
    ]
};

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserSpan = document.getElementById('currentUser');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalForm = document.getElementById('modalForm');
const formFields = document.getElementById('formFields');
const submitBtn = document.getElementById('submitBtn');
const closeModal = document.getElementById('closeModal');
const togglePassword = document.getElementById('togglePassword');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    setupEventListeners();
    updateStats();
    renderAllTables();
});

// Event Listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Password toggle
    togglePassword.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-off';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    });
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchSection(this.dataset.section);
        });
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchSection(this.dataset.section);
        });
    });
    
    // Add buttons
    document.getElementById('addStudentBtn').addEventListener('click', () => openModal('student'));
    document.getElementById('addDepartmentBtn').addEventListener('click', () => openModal('department'));
    document.getElementById('addInstructorBtn').addEventListener('click', () => openModal('instructor'));
    document.getElementById('addCourseBtn').addEventListener('click', () => openModal('course'));
    document.getElementById('addRegistrationBtn').addEventListener('click', () => openModal('registration'));
    
    // Modal
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // Modal form
    modalForm.addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    document.getElementById('studentsSearch').addEventListener('input', (e) => searchTable('students', e.target.value));
    document.getElementById('departmentsSearch').addEventListener('input', (e) => searchTable('departments', e.target.value));
    document.getElementById('instructorsSearch').addEventListener('input', (e) => searchTable('instructors', e.target.value));
    document.getElementById('coursesSearch').addEventListener('input', (e) => searchTable('courses', e.target.value));
    document.getElementById('registrationsSearch').addEventListener('input', (e) => searchTable('registrations', e.target.value));
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        currentUser = username;
        currentUserSpan.textContent = username;
        
        loginPage.classList.remove('active');
        dashboardPage.classList.add('active');
        
        showToast('Login Successful', 'Welcome to University Management System', 'success');
        
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        showToast('Login Failed', 'Please enter both username and password', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    dashboardPage.classList.remove('active');
    loginPage.classList.add('active');
    switchSection('overview');
    showToast('Logged Out', 'You have been successfully logged out', 'success');
}

// Navigation
function switchSection(section) {
    currentSection = section;
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');
}

// Modal Management
function openModal(type, item = null) {
    editingType = type;
    editingId = item ? item.id : null;
    
    const titles = {
        student: item ? 'Edit Student' : 'Add New Student',
        department: item ? 'Edit Department' : 'Add New Department',
        instructor: item ? 'Edit Instructor' : 'Add New Instructor',
        course: item ? 'Edit Course' : 'Add New Course',
        registration: 'Register Student for Course'
    };
    
    modalTitle.textContent = titles[type];
    generateFormFields(type, item);
    modal.classList.add('active');
    
    // Focus first input
    setTimeout(() => {
        const firstInput = formFields.querySelector('input, select');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeModalHandler() {
    modal.classList.remove('active');
    editingType = null;
    editingId = null;
    modalForm.reset();
}

function generateFormFields(type, item = null) {
    let fields = '';
    
    switch (type) {
        case 'student':
            fields = `
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" value="${item ? item.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="${item ? item.email : ''}" required>
                </div>
                <div class="form-group">
                    <label for="contact">Contact</label>
                    <input type="text" id="contact" name="contact" value="${item ? item.contact : ''}" required>
                </div>
                <div class="form-group">
                    <label for="department">Department</label>
                    <select id="department" name="department" required>
                        <option value="">Select Department</option>
                        ${data.departments.map(dept => 
                            `<option value="${dept.name}" ${item && item.department === dept.name ? 'selected' : ''}>${dept.name}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
            break;
            
        case 'department':
            fields = `
                <div class="form-group">
                    <label for="name">Department Name</label>
                    <input type="text" id="name" name="name" value="${item ? item.name : ''}" required>
                </div>
            `;
            break;
            
        case 'instructor':
            fields = `
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" value="${item ? item.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="${item ? item.email : ''}" required>
                </div>
                <div class="form-group">
                    <label for="capacity">Student Capacity</label>
                    <input type="number" id="capacity" name="capacity" value="${item ? item.capacity : ''}" required>
                </div>
                <div class="form-group">
                    <label for="department">Department</label>
                    <select id="department" name="department" required>
                        <option value="">Select Department</option>
                        ${data.departments.map(dept => 
                            `<option value="${dept.name}" ${item && item.department === dept.name ? 'selected' : ''}>${dept.name}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
            break;
            
        case 'course':
            fields = `
                <div class="form-group">
                    <label for="name">Course Name</label>
                    <input type="text" id="name" name="name" value="${item ? item.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="instructor">Instructor</label>
                    <select id="instructor" name="instructor" required>
                        <option value="">Select Instructor</option>
                        ${data.instructors.map(inst => 
                            `<option value="${inst.name}" data-email="${inst.email}" data-department="${inst.department}" ${item && item.instructor === inst.name ? 'selected' : ''}>${inst.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="email">Instructor Email</label>
                    <input type="email" id="email" name="email" value="${item ? item.email : ''}" readonly>
                </div>
                <div class="form-group">
                    <label for="department">Department</label>
                    <input type="text" id="department" name="department" value="${item ? item.department : ''}" readonly>
                </div>
            `;
            break;
            
        case 'registration':
            fields = `
                <div class="form-group">
                    <label for="studentId">Select Student</label>
                    <select id="studentId" name="studentId" required>
                        <option value="">Choose a student</option>
                        ${data.students.map(student => 
                            `<option value="${student.id}">${student.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="courseId">Select Course</label>
                    <select id="courseId" name="courseId" required>
                        <option value="">Choose a course</option>
                        ${data.courses.map(course => 
                            `<option value="${course.id}">${course.name} (${course.department})</option>`
                        ).join('')}
                    </select>
                </div>
            `;
            break;
    }
    
    formFields.innerHTML = fields;
    submitBtn.textContent = item ? `Update ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    // Add event listener for instructor selection in course form
    if (type === 'course') {
        const instructorSelect = document.getElementById('instructor');
        instructorSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            document.getElementById('email').value = selectedOption.dataset.email || '';
            document.getElementById('department').value = selectedOption.dataset.department || '';
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(modalForm);
    const data_obj = {};
    
    for (let [key, value] of formData.entries()) {
        data_obj[key] = value;
    }
    
    if (editingType === 'registration') {
        handleRegistration(data_obj);
    } else {
        if (editingId) {
            updateItem(editingType, editingId, data_obj);
        } else {
            addItem(editingType, data_obj);
        }
    }
    
    closeModalHandler();
}

// CRUD Operations
function addItem(type, itemData) {
    const newId = Math.max(...data[type + 's'].map(item => item.id), 0) + 1;
    const newItem = { id: newId, ...itemData };
    
    if (type === 'instructor') {
        newItem.capacity = parseInt(itemData.capacity);
    }
    
    data[type + 's'].push(newItem);
    saveToLocalStorage();
    renderTable(type + 's');
    updateStats();
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} Added`, `New ${type} has been added successfully.`, 'success');
}

function updateItem(type, id, itemData) {
    const index = data[type + 's'].findIndex(item => item.id === id);
    if (index !== -1) {
        if (type === 'instructor') {
            itemData.capacity = parseInt(itemData.capacity);
        }
        data[type + 's'][index] = { ...data[type + 's'][index], ...itemData };
        saveToLocalStorage();
        renderTable(type + 's');
        updateStats();
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} Updated`, `${type.charAt(0).toUpperCase() + type.slice(1)} information has been updated successfully.`, 'success');
    }
}

function deleteItem(type, id) {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        data[type + 's'] = data[type + 's'].filter(item => item.id !== id);
        saveToLocalStorage();
        renderTable(type + 's');
        updateStats();
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`, `${type.charAt(0).toUpperCase() + type.slice(1)} has been removed from the system.`, 'error');
    }
}

function handleRegistration(regData) {
    const student = data.students.find(s => s.id === parseInt(regData.studentId));
    const course = data.courses.find(c => c.id === parseInt(regData.courseId));
    
    if (!student || !course) {
        showToast('Error', 'Please select both student and course.', 'error');
        return;
    }
    
    // Check if registration already exists
    const existingReg = data.registrations.find(r => 
        r.studentId === parseInt(regData.studentId) && r.courseId === parseInt(regData.courseId)
    );
    
    if (existingReg) {
        showToast('Registration Exists', 'This student is already registered for this course.', 'error');
        return;
    }
    
    const newId = Math.max(...data.registrations.map(item => item.id), 0) + 1;
    const newRegistration = {
        id: newId,
        studentId: parseInt(regData.studentId),
        studentName: student.name,
        courseId: parseInt(regData.courseId),
        courseName: course.name,
        department: course.department,
        enrollmentDate: new Date().toISOString().split('T')[0]
    };
    
    data.registrations.push(newRegistration);
    saveToLocalStorage();
    renderTable('registrations');
    updateStats();
    showToast('Registration Added', 'Student has been successfully registered for the course.', 'success');
}

// Table Rendering
function renderAllTables() {
    renderTable('students');
    renderTable('departments');
    renderTable('instructors');
    renderTable('courses');
    renderTable('registrations');
}

function renderTable(type) {
    const tableBody = document.querySelector(`#${type}Table tbody`);
    const searchValue = document.getElementById(`${type}Search`).value.toLowerCase();
    
    let filteredData = data[type];
    
    if (searchValue) {
        filteredData = data[type].filter(item => {
            return Object.values(item).some(value => 
                value.toString().toLowerCase().includes(searchValue)
            );
        });
    }
    
    tableBody.innerHTML = '';
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        
        switch (type) {
            case 'students':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.contact}</td>
                    <td><span class="badge">${item.department}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="openModal('student', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteItem('student', ${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
                
            case 'departments':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>
                        <button class="action-btn edit" onclick="openModal('department', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteItem('department', ${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
                
            case 'instructors':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td><span class="badge">${item.capacity} students</span></td>
                    <td><span class="badge">${item.department}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="openModal('instructor', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteItem('instructor', ${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
                
            case 'courses':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.instructor}</td>
                    <td>${item.email}</td>
                    <td><span class="badge">${item.department}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="openModal('course', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteItem('course', ${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
                
            case 'registrations':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.studentName}</td>
                    <td>${item.courseName}</td>
                    <td><span class="badge">${item.department}</span></td>
                    <td>${item.enrollmentDate}</td>
                    <td>
                        <button class="action-btn delete" onclick="deleteItem('registration', ${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
        }
        
        tableBody.appendChild(row);
    });
    
    // Update table count
    document.getElementById(`${type}TableCount`).textContent = 
        `${filteredData.length} ${type === 'registrations' ? 'registration' : type.slice(0, -1)}${filteredData.length !== 1 ? 's' : ''}`;
}

function searchTable(type, searchValue) {
    renderTable(type);
}

// Statistics
function updateStats() {
    document.getElementById('studentsCount').textContent = data.students.length;
    document.getElementById('departmentsCount').textContent = data.departments.length;
    document.getElementById('instructorsCount').textContent = data.instructors.length;
    document.getElementById('coursesCount').textContent = data.courses.length;
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('universityManagementData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('universityManagementData');
    if (savedData) {
        data = JSON.parse(savedData);
    }
}

// Toast Notifications
function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Global functions for onclick handlers
window.openModal = openModal;
window.deleteItem = deleteItem;
