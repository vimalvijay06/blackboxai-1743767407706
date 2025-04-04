// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize local storage if empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('loans')) {
        localStorage.setItem('loans', JSON.stringify([]));
    }

    // Navigation active state
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('font-bold', 'text-blue-200');
        }
    });

    // Auto-redirect if logged in
    if (currentPage === 'index.html' || currentPage === '') {
        const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
        if (loggedInUser) {
            window.location.href = 'home.html';
        }
    }
});

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Data Management Functions
function addTransaction(type, data) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({
        id: Date.now(),
        type,
        ...data,
        date: new Date().toISOString()
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return true;
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

function calculateTotals() {
    const transactions = getTransactions();
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += parseFloat(transaction.amount);
        } else {
            expenses += parseFloat(transaction.amount);
        }
    });
    
    return {
        income,
        expenses,
        balance: income - expenses
    };
}