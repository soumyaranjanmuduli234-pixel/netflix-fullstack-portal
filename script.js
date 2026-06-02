// 🌐 LOCAL HOST BACKEND PIPELINE ACTIVE
const BACKEND_URL = 'http://127.0.0.1:5000';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVBAR SCROLL EFFECT ---
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

    // --- 2. FAQ MODULE ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- 3. LOCAL SIGNUP PIPELINE (NO AUTO-REFRESH) ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop default form submission reload
            
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const messageBox = document.getElementById('signupMessage');

            try {
                messageBox.style.color = '#f1c40f'; // Yellow status text
                messageBox.innerText = 'Connecting with local database engine...';

                const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageBox.style.color = '#2ecc71'; // Green success
                    messageBox.innerText = 'Registration Successful! Jumping to Login...';
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 2000);
                } else {
                    messageBox.style.color = '#e74c3c'; // Red error
                    messageBox.innerText = data.error || 'Signup failed. User might exist.';
                }
            } catch (error) {
                console.error('Local Signup core break:', error);
                messageBox.style.color = '#e74c3c';
                messageBox.innerText = 'Local Server down! Run "python app.py" first.';
            }
        });
    }

    // --- 4. LOCAL SIGNIN PIPELINE ---
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop default form submission reload

            const email = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value.trim();
            const messageBox = document.getElementById('signinMessage');

            try {
                messageBox.style.color = '#f1c40f';
                messageBox.innerText = 'Verifying security keys locally...';

                const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageBox.style.color = '#2ecc71';
                    messageBox.innerText = 'Access Granted! Routing handshake...';
                    
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userToken', data.token || 'session_active');
                    
                    setTimeout(() => {
                        window.location.href = 'browse.html';
                    }, 1500);
                } else {
                    messageBox.style.color = '#e74c3c';
                    messageBox.innerText = data.error || 'Invalid credentials.';
                }
            } catch (error) {
                console.error('Local Signin core break:', error);
                messageBox.style.color = '#e74c3c';
                messageBox.innerText = 'Local database verification engine offline.';
            }
        });
    }
});