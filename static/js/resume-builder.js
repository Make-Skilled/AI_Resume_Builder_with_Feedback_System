// Resume Builder JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');
    const resultsSection = document.getElementById('resultsSection');
    const resumeContent = document.getElementById('resumeContent');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadTxtBtn = document.getElementById('downloadTxtBtn');
    const getFeedbackBtn = document.getElementById('getFeedbackBtn');
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackContent = document.getElementById('feedbackContent');

    let generatedResume = '';

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        loadingText.classList.remove('hidden');

        // Collect form data
        const formData = new FormData(form);
        const userInfo = {};

        for (let [key, value] of formData.entries()) {
            userInfo[key] = value;
        }

        try {
            // Send request to generate resume
            const response = await fetch('/build-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInfo: userInfo })
            });

            const data = await response.json();

            if (data.success) {
                generatedResume = data.resume;
                displayResume(data.resume);
                showSuccessMessage('Resume generated successfully!');
            } else {
                showErrorMessage(data.error || 'Failed to generate resume');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('An error occurred while generating your resume. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            loadingText.classList.add('hidden');
        }
    });

    // Display generated resume
    function displayResume(resumeObj) {
        let html = '';
        // Name
        if (resumeObj.user_info && resumeObj.user_info.name) {
            html += `<h2 class=\"text-3xl font-extrabold mb-4 text-center text-gray-900\">${resumeObj.user_info.name}</h2>`;
        }
        // Two columns with vertical line
        html += `<div class=\"flex flex-col sm:flex-row gap-8\">`;
        // Left column
        html += `<div class=\"sm:w-1/3 pr-6 border-r-2 border-gray-300\">`;
        html += `<h3 class=\"font-bold mb-2 text-blue-600 text-lg\">Details</h3>`;
        if (resumeObj.user_info.address) html += `<div class=\"mb-1\"><b>Address:</b> ${resumeObj.user_info.address}</div>`;
        if (resumeObj.user_info.phone) html += `<div class=\"mb-1\"><b>Phone:</b> ${resumeObj.user_info.phone}</div>`;
        if (resumeObj.user_info.email) html += `<div class=\"mb-1\"><b>Email:</b> ${resumeObj.user_info.email}</div>`;
        if (resumeObj.user_info.nationality) html += `<div class=\"mb-1\"><b>Nationality:</b> ${resumeObj.user_info.nationality}</div>`;
        if (resumeObj.user_info.skills) {
            html += `<h4 class=\"font-bold mt-4 text-blue-600\">Skills</h4><ul class=\"ml-4 mb-2\">`;
            resumeObj.user_info.skills.split(',').forEach(skill => {
                html += `<li class=\"list-disc list-inside\">${skill.trim()}</li>`;
            });
            html += `</ul>`;
        }
        if (resumeObj.user_info.languages) {
            html += `<h4 class=\"font-bold mt-4 text-blue-600\">Languages</h4><ul class=\"ml-4 mb-2\">`;
            resumeObj.user_info.languages.split(',').forEach(lang => {
                html += `<li class=\"list-disc list-inside\">${lang.trim()}</li>`;
            });
            html += `</ul>`;
        }
        html += `</div>`;
        // Right column
        html += `<div class=\"sm:w-2/3 pl-6\">`;
        if (resumeObj.user_info.summary) {
            html += `<h3 class=\"font-bold mb-2 text-blue-600 text-lg\">Profile</h3><div class=\"mb-4\">${resumeObj.user_info.summary}</div>`;
        }
        if (resumeObj.user_info.experience) {
            html += `<h3 class=\"font-bold mt-4 mb-2 text-blue-600 text-lg\">Employment History</h3>`;
            html += `<div class=\"mb-4\">${resumeObj.user_info.experience.replace(/\n/g, '<br>')}</div>`;
        }
        if (resumeObj.user_info.education) {
            html += `<h3 class=\"font-bold mt-4 mb-2 text-blue-600 text-lg\">Education</h3>`;
            html += `<div class=\"mb-4\">${resumeObj.user_info.education.replace(/\n/g, '<br>')}</div>`;
        }
        if (resumeObj.user_info.projects) {
            html += `<h3 class=\"font-bold mt-4 mb-2 text-blue-600 text-lg\">Projects</h3>`;
            html += `<div class=\"mb-4\">${resumeObj.user_info.projects.replace(/\n/g, '<br>')}</div>`;
        }
        if (resumeObj.user_info.certifications) {
            html += `<h3 class=\"font-bold mt-4 mb-2 text-blue-600 text-lg\">Certifications</h3>`;
            html += `<div class=\"mb-4\">${resumeObj.user_info.certifications.replace(/\n/g, '<br>')}</div>`;
        }
        html += `</div></div>`;
        // Signature field at the bottom
        html += `<div class=\"mt-12\"><span class=\"font-semibold\">Signature:</span> <span class=\"inline-block border-b border-gray-400 w-64 align-middle\"></span></div>`;
        resumeContent.innerHTML = html;
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Download PDF handler
    downloadPdfBtn.addEventListener('click', async function() {
        if (!generatedResume) {
            showErrorMessage('No resume to download. Please generate a resume first.');
            return;
        }

        try {
            this.disabled = true;
            this.textContent = 'Generating PDF...';

            const response = await fetch('/download-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resume: generatedResume,
                    format: 'pdf'
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `resume_${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                showSuccessMessage('PDF downloaded successfully!');
            } else {
                showErrorMessage('Failed to download PDF');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('An error occurred while downloading the PDF');
        } finally {
            this.disabled = false;
            this.textContent = '📄 Download PDF';
        }
    });

    // Download TXT handler
    downloadTxtBtn.addEventListener('click', async function() {
        if (!generatedResume) {
            showErrorMessage('No resume to download. Please generate a resume first.');
            return;
        }

        try {
            this.disabled = true;
            this.textContent = 'Generating TXT...';

            const response = await fetch('/download-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resume: generatedResume,
                    format: 'txt'
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `resume_${new Date().toISOString().slice(0, 10)}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                showSuccessMessage('Text file downloaded successfully!');
            } else {
                showErrorMessage('Failed to download text file');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('An error occurred while downloading the text file');
        } finally {
            this.disabled = false;
            this.textContent = '📝 Download TXT';
        }
    });

    // Get feedback handler
    getFeedbackBtn.addEventListener('click', async function() {
        if (!generatedResume) {
            showErrorMessage('No resume to analyze. Please generate a resume first.');
            return;
        }

        try {
            this.disabled = true;
            this.textContent = 'Analyzing...';

            const response = await fetch('/get-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resume: generatedResume })
            });

            const data = await response.json();

            if (data.success) {
                displayFeedback(data.feedback);
                showSuccessMessage('Feedback generated successfully!');
            } else {
                showErrorMessage(data.error || 'Failed to generate feedback');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('An error occurred while generating feedback');
        } finally {
            this.disabled = false;
            this.textContent = '💡 Get Feedback';
        }
    });

    // Display feedback
    function displayFeedback(feedbackText) {
        const formattedFeedback = feedbackText
            .split('\n')
            .map(line => `<p class="mb-2">${line}</p>`)
            .join('');

        feedbackContent.innerHTML = formattedFeedback;
        feedbackSection.classList.remove('hidden');

        // Scroll to feedback
        feedbackSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                field.classList.add('focus:border-red-500');
            } else {
                field.classList.remove('border-red-500');
                field.classList.remove('focus:border-red-500');
            }
        });

        return isValid;
    }

    // Real-time form validation
    const formFields = form.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('border-red-500');
            } else {
                this.classList.remove('border-red-500');
            }
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('border-red-500') && this.value.trim()) {
                this.classList.remove('border-red-500');
            }
        });
    });

    // Success message function
    function showSuccessMessage(message) {
        showNotification(message, 'success');
    }

    // Error message function
    function showErrorMessage(message) {
        showNotification(message, 'error');
    }

    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
        } else {
            notification.classList.add('bg-red-500', 'text-white');
        }

        notification.textContent = message;

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
        }, 3000);
    }

    // Add character counter for textareas
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const counter = document.createElement('div');
        counter.className = 'text-sm text-gray-500 mt-1 text-right';
        textarea.parentNode.appendChild(counter);

        function updateCounter() {
            const count = textarea.value.length;
            const maxLength = textarea.getAttribute('maxlength') || 1000;
            counter.textContent = `${count}/${maxLength} characters`;

            if (count > maxLength * 0.9) {
                counter.classList.add('text-red-500');
            } else {
                counter.classList.remove('text-red-500');
            }
        }

        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });

    // Add auto-save functionality
    let autoSaveTimeout;
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                const formData = new FormData(form);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                localStorage.setItem('resumeFormData', JSON.stringify(data));
            }, 1000);
        });
    });

    // Load saved data on page load
    const savedData = localStorage.getItem('resumeFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    // Clear saved data when form is successfully submitted
    form.addEventListener('submit', function() {
        localStorage.removeItem('resumeFormData');
    });

    console.log('Resume Builder JavaScript loaded successfully!');
});