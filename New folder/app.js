const app = document.getElementById('app');
const toastContainer = document.getElementById('toast-container');

// Templates
const loginTemplate = document.getElementById('login-template');
const navbarTemplate = document.getElementById('navbar-template');
const homeTemplate = document.getElementById('home-template');
const createTrainTemplate = document.getElementById('create-train-template');
const editTrainTemplate = document.getElementById('edit-train-template');
const notFoundTemplate = document.getElementById('not-found-template');

// State
let currentPage = '';
let currentTrainId = null;

// Initialize the application
function init() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Set up routing
  window.addEventListener('hashchange', handleRouteChange);
  
  // Initialize sample data if none exists
  initializeData();
  
  // Initial route handling
  if (isLoggedIn) {
    renderNavbar();
    handleRouteChange();
  } else {
    navigateTo('login');
  }
}

// Initialize sample data if none exists
function initializeData() {
  if (!localStorage.getItem('trains')) {
    const sampleTrains = [
      {
        id: 1,
        trainNumber: "12301",
        trainName: "Rajdhani Express",
        source: "New Delhi",
        destination: "Mumbai",
        arrivalTime: "08:00",
        departureTime: "08:15",
        status: "On Time"
      },
      {
        id: 2,
        trainNumber: "12302",
        trainName: "Shatabdi Express",
        source: "Chennai",
        destination: "Bengaluru",
        arrivalTime: "10:30",
        departureTime: "10:45",
        status: "Delayed"
      },
      {
        id: 3,
        trainNumber: "12303",
        trainName: "Duronto Express",
        source: "Kolkata",
        destination: "New Delhi",
        arrivalTime: "16:00",
        departureTime: "16:15",
        status: "On Time"
      }
    ];
    
    localStorage.setItem('trains', JSON.stringify(sampleTrains));
  }
}

// Route handling
function handleRouteChange() {
  const hash = window.location.hash.slice(1) || '';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn && hash !== 'login') {
    navigateTo('login');
    return;
  }
  
  if (isLoggedIn && hash === 'login') {
    navigateTo('home');
    return;
  }
  
  const route = hash.split('/')[0];
  currentPage = route;
  
  switch (route) {
    case '':
    case 'home':
      renderHome();
      break;
    case 'create':
      renderCreateTrain();
      break;
    case 'edit':
      const id = hash.split('/')[1];
      if (id) {
        renderEditTrain(parseInt(id));
      } else {
        renderNotFound();
      }
      break;
    case 'login':
      renderLogin();
      break;
    default:
      renderNotFound();
  }
}

// Navigation
function navigateTo(route, id = null) {
  if (id !== null) {
    window.location.hash = `${route}/${id}`;
  } else {
    window.location.hash = route;
  }
}

// Toast notifications
function showToast(title, description, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div class="toast-description">${description}</div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Render functions
function renderNavbar() {
  const navbarContent = navbarTemplate.content.cloneNode(true);
  
  // If there's already a navbar, remove it
  const existingNavbar = document.querySelector('.navbar');
  if (existingNavbar) existingNavbar.remove();
  
  // Add event listener to logout button
  const logoutBtn = navbarContent.querySelector('#nav-logout');
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
  
  document.body.insertBefore(navbarContent, app);
}

function renderLogin() {
  const loginContent = loginTemplate.content.cloneNode(true);
  
  // Set up login form
  const loginForm = loginContent.querySelector('#login-form');
  loginForm.addEventListener('submit', handleLogin);
  
  // Clear previous content
  app.innerHTML = '';
  app.appendChild(loginContent);
}

function renderHome() {
  const homeContent = homeTemplate.content.cloneNode(true);
   const trains = getTrains();
  
  const tableBody = homeContent.querySelector('#trains-table-body');
  const noTrainsMessage = homeContent.querySelector('#no-trains-message');
  const trainsTable = homeContent.querySelector('#trains-table');
  
  // Check if there are trains
  if (trains.length > 0) {
    // Render train rows
    trains.forEach(train => {
      const row = document.createElement('tr');
      
      // Define status class
      let statusClass = '';
      switch (train.status) {
        case 'On Time':
          statusClass = 'status-on-time';
          break;
        case 'Delayed':
          statusClass = 'status-delayed';
          break;
        case 'Cancelled':
          statusClass = 'status-cancelled';
          break;
        case 'Arrived':
          statusClass = 'status-arrived';
          break;
        case 'Departed':
          statusClass = 'status-departed';
          break;
      }
      
      row.innerHTML = `
        <td>${train.trainNumber}</td>
        <td>${train.trainName}</td>
        <td>${train.source}</td>
        <td>${train.destination}</td>
        <td>${train.arrivalTime}</td>
        <td>${train.departureTime}</td>
        <td class="${statusClass}">${train.status}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${train.id}">Edit</button>
          <button class="action-btn delete-btn" data-id="${train.id}">Delete</button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Show table, hide no trains message
    trainsTable.classList.remove('hidden');
    noTrainsMessage.classList.add('hidden');
    
    // Add event listeners to edit and delete buttons
    const editButtons = tableBody.querySelectorAll('.edit-btn');
    const deleteButtons = tableBody.querySelectorAll('.delete-btn');
    
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.dataset.id);
        navigateTo('edit', id);
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.dataset.id);
        handleDeleteTrain(id);
      });
    });
  } else {
    // Hide table, show no trains message
    trainsTable.classList.add('hidden');
    noTrainsMessage.classList.remove('hidden');
    
    // Add event listener to "Add Train" link
    const addTrainLink = homeContent.querySelector('#add-first-train-link');
    addTrainLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('create');
    });
  }
  
  // Clear previous content
  app.innerHTML = '';
  app.appendChild(homeContent);
}

function renderCreateTrain() {
  const createContent = createTrainTemplate.content.cloneNode(true);
  
  // Set up form
  const form = createContent.querySelector('#create-train-form');
  form.addEventListener('submit', handleCreateTrain);
  
  // Clear previous content
  app.innerHTML = '';
  app.appendChild(createContent);
}

function renderEditTrain(id) {
  const editContent = editTrainTemplate.content.cloneNode(true);
  
  // Find train by ID
  const trains = getTrains();
  const train = trains.find(t => t.id === id);
  
  if (!train) {
    renderNotFound();
    return;
  }
  
  // Fill form with train data
  const form = editContent.querySelector('#edit-train-form');
  const idField = editContent.querySelector('#edit-train-id');
  const trainNumberField = editContent.querySelector('#edit-trainNumber');
  const trainNameField = editContent.querySelector('#edit-trainName');
  const sourceField = editContent.querySelector('#edit-source');
  const destinationField = editContent.querySelector('#edit-destination');
  const arrivalTimeField = editContent.querySelector('#edit-arrivalTime');
  const departureTimeField = editContent.querySelector('#edit-departureTime');
  const statusField = editContent.querySelector('#edit-status');
  
  idField.value = train.id;
  trainNumberField.value = train.trainNumber;
  trainNameField.value = train.trainName;
  sourceField.value = train.source;
  destinationField.value = train.destination;
  arrivalTimeField.value = train.arrivalTime;
  departureTimeField.value = train.departureTime;
  statusField.value = train.status;
  
  // Set up form submission
  form.addEventListener('submit', handleEditTrain);
  
  // Set up cancel button
  const cancelButton = editContent.querySelector('#cancel-edit');
  cancelButton.addEventListener('click', () => {
    navigateTo('home');
  });
  
  // Clear previous content
  app.innerHTML = '';
  app.appendChild(editContent);
}

function renderNotFound() {
  const notFoundContent = notFoundTemplate.content.cloneNode(true);
  
  // Set up return home link
  const returnHomeLink = notFoundContent.querySelector('#return-home');
  returnHomeLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });
  
  // Clear previous content
  app.innerHTML = '';
  app.appendChild(notFoundContent);
}

// Event Handlers
function handleLogin(e) {
  e.preventDefault();
  
  // Get form values
  const usernameField = document.getElementById('username');
  const passwordField = document.getElementById('password');
  const username = usernameField.value.trim();
  const password = passwordField.value;
  
  // Reset error messages
  document.getElementById('username-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  
  // Validate form
  let isValid = true;
  
  if (!username) {
    document.getElementById('username-error').textContent = 'Username is required';
    isValid = false;
  }
  
  if (!password) {
    document.getElementById('password-error').textContent = 'Password is required';
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Check credentials
  if (username === 'admin' && password === 'password') {
    // Set login state
    localStorage.setItem('isLoggedIn', 'true');
    
    // Show navbar
    renderNavbar();
    
    // Show toast
    showToast('Login successful', 'Welcome to Railway Scheduling System');
    
    // Navigate to home
    navigateTo('home');
  } else {
    showToast('Login failed', 'Invalid username or password. Try admin/password', 'error');
  }
}

function handleCreateTrain(e) {
  e.preventDefault();
  
  // Get form values
  const trainNumberField = document.getElementById('trainNumber');
  const trainNameField = document.getElementById('trainName');
  const sourceField = document.getElementById('source');
  const destinationField = document.getElementById('destination');
  const arrivalTimeField = document.getElementById('arrivalTime');
  const departureTimeField = document.getElementById('departureTime');
  const statusField = document.getElementById('status');
  
  const trainNumber = trainNumberField.value.trim();
  const trainName = trainNameField.value.trim();
  const source = sourceField.value.trim();
  const destination = destinationField.value.trim();
  const arrivalTime = arrivalTimeField.value;
  const departureTime = departureTimeField.value;
  const status = statusField.value;
  
  // Reset error messages
  document.getElementById('trainNumber-error').textContent = '';
  document.getElementById('trainName-error').textContent = '';
  document.getElementById('source-error').textContent = '';
  document.getElementById('destination-error').textContent = '';
  document.getElementById('arrivalTime-error').textContent = '';
  document.getElementById('departureTime-error').textContent = '';
  document.getElementById('status-error').textContent = '';
  
  // Validate form
  let isValid = true;
  
  if (!trainNumber) {
    document.getElementById('trainNumber-error').textContent = 'Train number is required';
    isValid = false;
  }
  
  if (!trainName) {
    document.getElementById('trainName-error').textContent = 'Train name is required';
    isValid = false;
  }
  
  if (!source) {
    document.getElementById('source-error').textContent = 'Source station is required';
    isValid = false;
  }
  
  if (!destination) {
    document.getElementById('destination-error').textContent = 'Destination station is required';
    isValid = false;
  }
  
  if (!arrivalTime) {
    document.getElementById('arrivalTime-error').textContent = 'Arrival time is required';
    isValid = false;
  }
  
  if (!departureTime) {
    document.getElementById('departureTime-error').textContent = 'Departure time is required';
    isValid = false;
  }
  
  if (!status) {
    document.getElementById('status-error').textContent = 'Status is required';
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Create new train
  const trains = getTrains();
  
  // Generate new ID
  const newId = trains.length > 0
    ? Math.max(...trains.map(t => t.id)) + 1
    : 1;
  
  // Create train object
  const newTrain = {
    id: newId,
    trainNumber,
    trainName,
    source,
    destination,
    arrivalTime,
    departureTime,
    status
  };
  
  // Add train to array
  trains.push(newTrain);
  
  // Save to localStorage
  localStorage.setItem('trains', JSON.stringify(trains));
  
  // Show success message
  showToast('Success', 'Train details added successfully');
  
  // Navigate to home page
  navigateTo('home');
}

function handleEditTrain(e) {
  e.preventDefault();
  
  // Get form values
  const idField = document.getElementById('edit-train-id');
  const trainNumberField = document.getElementById('edit-trainNumber');
  const trainNameField = document.getElementById('edit-trainName');
  const sourceField = document.getElementById('edit-source');
  const destinationField = document.getElementById('edit-destination');
  const arrivalTimeField = document.getElementById('edit-arrivalTime');
  const departureTimeField = document.getElementById('edit-departureTime');
  const statusField = document.getElementById('edit-status');
  
  const id = parseInt(idField.value);
  const trainNumber = trainNumberField.value.trim();
  const trainName = trainNameField.value.trim();
  const source = sourceField.value.trim();
  const destination = destinationField.value.trim();
  const arrivalTime = arrivalTimeField.value;
  const departureTime = departureTimeField.value;
  const status = statusField.value;
  
  // Reset error messages
  document.getElementById('edit-trainNumber-error').textContent = '';
  document.getElementById('edit-trainName-error').textContent = '';
  document.getElementById('edit-source-error').textContent = '';
  document.getElementById('edit-destination-error').textContent = '';
  document.getElementById('edit-arrivalTime-error').textContent = '';
  document.getElementById('edit-departureTime-error').textContent = '';
  document.getElementById('edit-status-error').textContent = '';
  
  // Validate form
  let isValid = true;
  
  if (!trainNumber) {
    document.getElementById('edit-trainNumber-error').textContent = 'Train number is required';
    isValid = false;
  }
  
  if (!trainName) {
    document.getElementById('edit-trainName-error').textContent = 'Train name is required';
    isValid = false;
  }
  
  if (!source) {
    document.getElementById('edit-source-error').textContent = 'Source station is required';
    isValid = false;
  }
  
  if (!destination) {
    document.getElementById('edit-destination-error').textContent = 'Destination station is required';
    isValid = false;
  }
  
  if (!arrivalTime) {
    document.getElementById('edit-arrivalTime-error').textContent = 'Arrival time is required';
    isValid = false;
  }
  
  if (!departureTime) {
    document.getElementById('edit-departureTime-error').textContent = 'Departure time is required';
    isValid = false;
  }
  
  if (!status) {
    document.getElementById('edit-status-error').textContent = 'Status is required';
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Update train
  const trains = getTrains();
  
  // Find and update train
  const updatedTrains = trains.map(train => {
    if (train.id === id) {
      return {
        id,
        trainNumber,
        trainName,
        source,
        destination,
        arrivalTime,
        departureTime,
        status
      };
    }
    return train;
  });
  
  // Save to localStorage
  localStorage.setItem('trains', JSON.stringify(updatedTrains));
  
  // Show success message
  showToast('Success', 'Train details updated successfully');
  
  // Navigate to home page
  navigateTo('home');
}

function handleDeleteTrain(id) {
  if (confirm('Are you sure you want to delete this train?')) {
    // Get trains
    const trains = getTrains();
    
    // Remove train with matching ID
    const updatedTrains = trains.filter(train => train.id !== id);
    
    // Save to localStorage
    localStorage.setItem('trains', JSON.stringify(updatedTrains));
    
    // Show success message
    showToast('Train deleted', 'The train details have been deleted successfully');
    
    // Refresh home page
    renderHome();
  }
}

function logout() {
  // Clear login state
  localStorage.removeItem('isLoggedIn');
  
  // Show toast
  showToast('Logged out', 'You have been logged out successfully');
  
  // Navigate to login page
  navigateTo('login');
}

// Helper functions
function getTrains() {
  const trainsJSON = localStorage.getItem('trains');
  return trainsJSON ? JSON.parse(trainsJSON) : [];
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
