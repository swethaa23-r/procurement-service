document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    feather.replace();

    // Elements
    const togglePwds = document.querySelectorAll('.toggle-pwd');
    const roleSelect = document.getElementById('role');
    const roleDesc = document.getElementById('roleDesc');
    const roleError = document.getElementById('roleError');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Toggle Password Visibility
    togglePwds.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.currentTarget.previousElementSibling;
            const icon = e.currentTarget.querySelector('svg');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.outerHTML = feather.icons['eye-off'].toSvg();
            } else {
                input.type = 'password';
                icon.outerHTML = feather.icons['eye'].toSvg();
            }
        });
    });

    // Role Selection Logic (Signup descriptions & Login styling)
    if (roleSelect) {
        roleSelect.addEventListener('change', () => {
            roleSelect.classList.remove('is-invalid');
            if (roleError) roleError.style.display = 'none';

            if (roleDesc) {
                const val = roleSelect.value;
                roleDesc.style.display = 'block';
                // Trigger animation by resetting
                roleDesc.style.animation = 'none';
                roleDesc.offsetHeight; // trigger reflow
                roleDesc.style.animation = 'fadeUp 0.3s ease forwards';

                if (val === 'spend-supplier-analytics') {
                    roleDesc.textContent = 'Analyze spending patterns, supplier performance, purchasing trends and procurement insights.';
                } else if (val === 'procurement-dashboard') {
                    roleDesc.textContent = 'Manage procurement activities, sourcing workflows, suppliers and purchasing operations.';
                } else {
                    roleDesc.style.display = 'none';
                }
            }
        });
    }

    // --- LOGIN VALIDATION & SUBMISSION ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const btn = document.getElementById('loginBtn');
            const btnText = btn.querySelector('.btn-text');

            // Reset errors
            roleSelect.classList.remove('is-invalid');
            roleError.style.display = 'none';

            if (!roleSelect.value) {
                roleSelect.classList.add('is-invalid');
                roleError.style.display = 'block';
                isValid = false;
            }
            if (!email.value) isValid = false;
            if (!password.value) isValid = false;

            if (isValid) {
                btn.classList.add('loading');
                btn.disabled = true;
                btnText.textContent = 'Signing in...';

                // Simulate network request
                setTimeout(() => {
                    const role = roleSelect.value;
                    const destination = role === 'procurement-dashboard' ? 'procurement-dashboard.html' : 'spend-supplier-analytics.html';
                    
                    // Save user info
                    const user = { email: email.value, role: role };
                    localStorage.setItem('stackly_user', JSON.stringify(user));
                    
                    window.location.href = destination;
                }, 1200);
            }
        });
    }

    // --- SIGNUP VALIDATION & SUBMISSION ---
    if (signupForm) {
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirmPassword');
        const pwdStrengthBox = document.getElementById('pwdStrengthBox');
        const sb1 = document.getElementById('sb1');
        const sb2 = document.getElementById('sb2');
        const sb3 = document.getElementById('sb3');
        const pwdStrengthText = document.getElementById('pwdStrengthText');

        // Password Strength Indicator
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            pwdStrengthBox.style.display = 'block';
            
            let strength = 0;
            if (val.length >= 8) strength++;
            if (val.match(/[A-Z]/) && val.match(/[0-9]/)) strength++;
            if (val.match(/[^A-Za-z0-9]/)) strength++;

            // Reset bars
            sb1.style.background = 'var(--panel-bg)';
            sb2.style.background = 'var(--panel-bg)';
            sb3.style.background = 'var(--panel-bg)';

            if (val.length === 0) {
                pwdStrengthBox.style.display = 'none';
            } else if (strength === 0 || val.length < 8) {
                sb1.style.background = 'var(--error)';
                pwdStrengthText.textContent = 'Weak';
                pwdStrengthText.style.color = 'var(--error)';
            } else if (strength === 1 || (strength === 2 && val.length < 10)) {
                sb1.style.background = '#F59E0B'; // Warning orange
                sb2.style.background = '#F59E0B';
                pwdStrengthText.textContent = 'Medium';
                pwdStrengthText.style.color = '#F59E0B';
            } else {
                sb1.style.background = 'var(--success)';
                sb2.style.background = 'var(--success)';
                sb3.style.background = 'var(--success)';
                pwdStrengthText.textContent = 'Strong';
                pwdStrengthText.style.color = 'var(--success)';
            }
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const company = document.getElementById('company');
            const terms = document.getElementById('terms');
            const btn = document.getElementById('signupBtn');
            const btnText = btn.querySelector('.btn-text');
            const successMsg = document.getElementById('successMsg');

            // Clear previous errors
            document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));

            // Validation logic
            if (fullName.value.trim().length < 2) {
                fullName.classList.add('is-invalid');
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }
            if (company.value.trim() === '') {
                company.classList.add('is-invalid');
                document.getElementById('companyError').style.display = 'block';
                isValid = false;
            }
            if (!roleSelect.value) {
                roleSelect.classList.add('is-invalid');
                roleError.style.display = 'block';
                isValid = false;
            }
            if (passwordInput.value.length < 8) {
                passwordInput.classList.add('is-invalid');
                document.getElementById('pwdError').style.display = 'block';
                isValid = false;
            }
            if (passwordInput.value !== confirmInput.value || confirmInput.value === '') {
                confirmInput.classList.add('is-invalid');
                document.getElementById('confirmError').style.display = 'block';
                isValid = false;
            }
            if (!terms.checked) {
                document.getElementById('termsError').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                btn.classList.add('loading');
                btn.disabled = true;
                btnText.textContent = 'Creating Account...';

                // Simulate network request
                setTimeout(() => {
                    btn.style.display = 'none';
                    successMsg.style.display = 'block';
                    
                    const role = roleSelect.value;
                    const destination = role === 'procurement-dashboard' ? 'procurement-dashboard.html' : 'spend-supplier-analytics.html';
                    
                    // Save user info
                    const user = { 
                        name: fullName.value,
                        email: email.value, 
                        company: company.value,
                        role: role 
                    };
                    localStorage.setItem('stackly_user', JSON.stringify(user));
                    
                    setTimeout(() => {
                        window.location.href = destination;
                    }, 1500);
                }, 1500);
            }
        });
    }

    // Input focus enhancements
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('is-invalid');
            const err = input.parentElement.querySelector('.error-msg');
            if(err) err.style.display = 'none';
        });
    });
});
