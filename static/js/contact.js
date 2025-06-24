// Contact page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};

            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }

            // Validate form
            if (!validateContactForm(formObject)) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Simulate form submission (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('Error:', error);
                showNotification('An error occurred while sending your message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Form validation
    function validateContactForm(data) {
        const errors = [];

        // Check required fields
        if (!data.firstName || !data.firstName.trim()) {
            errors.push('First name is required');
        }

        if (!data.lastName || !data.lastName.trim()) {
            errors.push('Last name is required');
        }

        if (!data.email || !data.email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.subject) {
            errors.push('Please select a subject');
        }

        if (!data.message || !data.message.trim()) {
            errors.push('Message is required');
        } else if (data.message.length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        if (errors.length > 0) {
            showNotification(errors.join('\n'), 'error');
            return false;
        }

        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });

        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        // Remove existing error styling
        clearFieldError(field);

        // Validate based on field type
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    showFieldError(field, 'This field is required');
                }
                break;

            case 'email':
                if (!value) {
                    showFieldError(field, 'Email is required');
                } else if (!isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                }
                break;

            case 'subject':
                if (!value) {
                    showFieldError(field, 'Please select a subject');
                }
                break;

            case 'message':
                if (!value) {
                    showFieldError(field, 'Message is required');
                } else if (value.length < 10) {
                    showFieldError(field, 'Message must be at least 10 characters long');
                }
                break;
        }
    }

    function showFieldError(field, message) {
        field.classList.add('border-red-500', 'focus:border-red-500');

        // Create or update error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.className = 'field-error text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus:border-red-500');

        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full max-w-md`;

        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
        } else {
            notification.classList.add('bg-red-500', 'text-white');
        }

        // Handle multiline messages
        const lines = message.split('\n');
        lines.forEach((line, index) => {
            if (index > 0) {
                notification.appendChild(document.createElement('br'));
            }
            notification.appendChild(document.createTextNode(line));
        });

        // Add icon
        const icon = document.createElement('span');
        icon.className = 'mr-2';
        icon.textContent = type === 'success' ? '✅' : '❌';
        notification.prepend(icon);

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Add character counter for message textarea
    const messageTextarea = contactForm.querySelector('textarea[name="message"]');
    if (messageTextarea) {
        const counter = document.createElement('div');
        counter.className = 'text-sm text-gray-500 mt-1 text-right';
        messageTextarea.parentNode.appendChild(counter);

        function updateCounter() {
            const count = messageTextarea.value.length;
            const maxLength = 1000;
            counter.textContent = `${count}/${maxLength} characters`;

            if (count > maxLength * 0.9) {
                counter.classList.add('text-red-500');
            } else {
                counter.classList.remove('text-red-500');
            }
        }

        messageTextarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    // Add hover effects for contact information cards
    const contactCards = document.querySelectorAll('.bg-white.rounded-xl.shadow-lg');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        });
    });

    // Add smooth scrolling for FAQ section
    const faqItems = document.querySelectorAll('.bg-gray-50.rounded-lg');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add expand/collapse functionality if needed
            this.classList.toggle('bg-gray-100');
        });
    });

    // Add copy email functionality
    const emailElement = document.querySelector('.text-gray-600');
    if (emailElement && emailElement.textContent.includes('@')) {
        emailElement.style.cursor = 'pointer';
        emailElement.title = 'Click to copy email';

        emailElement.addEventListener('click', function() {
            const email = this.textContent;
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copied to clipboard!', 'success');
            }).catch(() => {
                showNotification('Failed to copy email', 'error');
            });
        });
    }

    // Add auto-save functionality for contact form
    let autoSaveTimeout;
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                const formData = new FormData(contactForm);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                localStorage.setItem('contactFormData', JSON.stringify(data));
            }, 1000);
        });
    });

    // Load saved contact form data
    const savedContactData = localStorage.getItem('contactFormData');
    if (savedContactData) {
        try {
            const data = JSON.parse(savedContactData);
            Object.keys(data).forEach(key => {
                const field = contactForm.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (error) {
            console.error('Error loading saved contact data:', error);
        }
    }

    // Clear saved data when form is successfully submitted
    contactForm.addEventListener('submit', function() {
        localStorage.removeItem('contactFormData');
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe contact form and information sections
    const animatedElements = document.querySelectorAll('.bg-white.rounded-xl.shadow-lg, .bg-gray-50.rounded-lg');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    console.log('Contact page JavaScript loaded successfully!');
});