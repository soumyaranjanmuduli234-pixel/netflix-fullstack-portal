/**
 * =================================================================
 * ASYNCHRONOUS ENGINE CONTROLLER - NETFLIX BACKEND PIPELINE
 * PRODUCTION DEPLOYMENT (RENDER CLOUD ACTIVE)
 * =================================================================
 */

// 🌐 LIVE RENDER PRODUCTION BACKEND URL
const BACKEND_URL = 'https://netflix-backend-xnby.onrender.com';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVBAR TRANSPARENCY CONTROLLER ON SCROLL ---
    const browseNav = document.querySelector('.browse-nav');
    if (browseNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                browseNav.classList.add('nav-black');
            } else {
                browseNav.classList.remove('nav-black');
            }
        });
    }

    // --- 2. LANDING FAQ TOGGLE MODULE ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            document.querySelectorAll('.faq-item').forEach(i => {
                if (i !== item) i.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- 3. LANDING PAGE EMAIL PIPELINE FLOW ---
    const heroForm = document.getElementById('heroEmailForm');
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailValue = document.getElementById('heroEmailInput').value.trim();
            if (emailValue) {
                // Email ko session storage mein daal rahe hain taaki signup page par auto-fill ho sake
                sessionStorage.setItem('preFilledEmail', emailValue);
                window.location.href = 'signup.html';
            }
        });
    }

    // Auto-fill email on Signup Page if available
    const signupEmailInput = document.getElementById('signupEmail');
    if (signupEmailInput) {
        const savedEmail = sessionStorage.getItem('preFilledEmail');
        if (savedEmail) {
            signupEmailInput.value = savedEmail;
            sessionStorage.removeItem('preFilledEmail'); // Clean up
        }
    }

    // --- 4. BACKEND PIPELINE: USER SIGNUP SYSTEM ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const messageBox = document.getElementById('signupMessage');

            try {
                messageBox.style.color = '#e50914';
                messageBox.innerText = 'Creating account on cloud... Please wait.';

                const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageBox.style.color = '#2ecc71';
                    messageBox.innerText = 'Registration Successful! Redirecting to login...';
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 2000);
                } else {
                    messageBox.innerText = data.error || 'Signup failed. Try again.';
                }
            } catch (error) {
                console.error('Error during signup:', error);
                messageBox.innerText = 'Server down or Connection Error. Check Render Logs.';
            }
        });
    }

    // --- 5. BACKEND PIPELINE: USER SIGNIN/LOGIN SYSTEM ---
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value.trim();
            const messageBox = document.getElementById('signinMessage');

            try {
                messageBox.style.color = '#e50914';
                messageBox.innerText = 'Verifying credentials...';

                const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageBox.style.color = '#2ecc71';
                    messageBox.innerText = 'Access Granted! Welcome back.';
                    
                    // Auth state handle karne ke liye local token structure lock karo
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userToken', data.token || 'session_active');
                    
                    setTimeout(() => {
                        window.location.href = 'browse.html';
                    }, 1500);
                } else {
                    messageBox.innerText = data.error || 'Invalid credentials or Auth Bypass blocked.';
                }
            } catch (error) {
                console.error('Error during login:', error);
                messageBox.innerText = 'Backend connection timed out. Server engine waking up...';
            }
        });
    }

    // --- 6. AUTH GATE ROUTER GUARD (FOR BROWSE PAGES) ---
    const targetProtectedPages = ['browse.html', 'movies.html', 'tvshows.html', 'newpopular.html', 'mylist.html'];
    const currentPath = window.location.pathname.split('/').pop();

    if (targetProtectedPages.includes(currentPath)) {
        const authCheck = localStorage.getItem('isLoggedIn');
        if (authCheck !== 'true') {
            alert('Access Denied. Please Sign In first to clear identity handshake.');
            window.location.href = 'signin.html';
        }
    }

    // --- 7. LOGOUT EXECUTION CONTROLLER ---
    const logoutBtn = document.getElementById('logoutActionBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
});