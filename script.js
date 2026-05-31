/**
 * ==========================================================================
 * ASYNCHRONOUS ENGINE CONTROLLER - NETFLIX BACKEND PIPELINE
 * ==========================================================================
 */

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
            document.querySelectorAll('.faq-item').forEach(i => { if(i!==item) i.classList.remove('active'); });
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
                localStorage.setItem('tempPipelineEmail', emailValue);
                window.location.href = '/signup';
            }
        });
    }

    // Signup page autofill trigger
    const regEmailInput = document.getElementById('regEmail');
    if (regEmailInput) {
        const cachedEmail = localStorage.getItem('tempPipelineEmail');
        if (cachedEmail) {
            regEmailInput.value = cachedEmail;
            localStorage.removeItem('tempPipelineEmail');
        }
    }

    // --- 4. BACKEND FLASK API ASYNC REGISTRATION ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const errorBox = document.getElementById('regPassError');

            errorBox.innerText = "";

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();

                if (result.success) {
                    window.location.href = '/signin';
                } else {
                    errorBox.innerText = result.message || "Registration error occurred.";
                }
            } catch (err) {
                errorBox.innerText = "Cannot establish contact with Python Engine server.";
            }
        });
    }

    // --- 5. BACKEND FLASK API SIGN-IN AUTHENTICATION ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const globalError = document.getElementById('passwordError');

            globalError.innerText = "";

            try {
                const response = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();

                if (result.success && result.redirect) {
                    window.location.href = result.redirect;
                } else {
                    globalError.innerText = result.message || "Invalid account credentials.";
                }
            } catch (err) {
                globalError.innerText = "Authentication database link failure.";
            }
        });
    }
});