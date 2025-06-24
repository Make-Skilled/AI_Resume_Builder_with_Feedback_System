# AI Resume Builder with Feedback System

A comprehensive web application that leverages artificial intelligence to create professional, ATS-friendly resumes with intelligent feedback and multiple download formats.

## 🚀 Features

- **AI-Powered Resume Generation**: Uses Cohere AI to create compelling, professional resumes
- **Smart Feedback System**: Get detailed feedback on content, structure, and ATS compatibility
- **Multiple Download Formats**: PDF and text formats for various application systems
- **Professional Templates**: Industry-specific formatting and layouts
- **Real-time Preview**: See your resume take shape as you provide information
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML, Tailwind CSS, JavaScript
- **AI Integration**: Cohere API
- **PDF Generation**: ReportLab
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

- Python 3.8 or higher
- Cohere API key (sign up at [cohere.ai](https://cohere.ai))

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_Resume_Builder_with_Feedback_System
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up your Cohere API key**
   - Sign up for a free account at [cohere.ai](https://cohere.ai)
   - Get your API key from the dashboard
   - Replace `'YOUR_COHERE_API_KEY'` in `app.py` with your actual API key

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
AI_Resume_Builder_with_Feedback_System/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── templates/            # HTML templates
│   ├── index.html        # Homepage
│   ├── build_resume.html # Resume builder page
│   ├── features.html     # Features page
│   └── contact.html      # Contact page
└── static/               # Static files
    ├── css/              # CSS files (if any)
    └── js/               # JavaScript files
        ├── main.js       # Main JavaScript
        ├── resume-builder.js # Resume builder functionality
        └── contact.js    # Contact page functionality
```

## 🎯 How to Use

1. **Homepage**: Navigate through the attractive landing page with project information
2. **Build Resume**: Click "Build Resume with AI" to start the process
3. **Provide Information**: Fill in your personal details, experience, skills, and other relevant information
4. **AI Generation**: The AI will analyze your information and create a professional resume
5. **Get Feedback**: Use the feedback system to improve your resume
6. **Download**: Download your resume in PDF or text format

## 🔧 Configuration

### Cohere API Setup
1. Visit [cohere.ai](https://cohere.ai) and create an account
2. Navigate to the API Keys section
3. Create a new API key
4. Replace the placeholder in `app.py`:
   ```python
   co = cohere.Client('YOUR_ACTUAL_API_KEY_HERE')
   ```

### Customization
- Modify the AI prompts in `app.py` to adjust the resume generation style
- Update the Tailwind CSS classes in HTML files for different styling
- Add new resume sections by modifying the form in `build_resume.html`

## 🌟 Key Features Explained

### AI Resume Generation
The application uses Cohere's advanced language models to:
- Analyze user-provided information
- Generate professional, compelling content
- Optimize for ATS (Applicant Tracking Systems)
- Create industry-specific formatting

### Smart Feedback System
The AI provides feedback on:
- Content quality and relevance
- Structure and formatting
- ATS compatibility
- Areas for improvement
- Overall strengths and weaknesses

### Multiple Download Formats
- **PDF**: Professional formatting for printing and formal applications
- **Text**: Plain text format for online applications and ATS systems

## 🎨 Design Features

- **Responsive Design**: Works on all device sizes
- **Hover Effects**: Interactive elements throughout the interface
- **Modern UI**: Clean, professional design using Tailwind CSS
- **Smooth Animations**: Enhanced user experience with CSS transitions
- **Accessibility**: Proper semantic HTML and ARIA labels

## 🔒 Security Considerations

- API keys should be stored in environment variables in production
- Form validation on both client and server side
- Input sanitization to prevent XSS attacks
- HTTPS should be used in production

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. Set up a production server (e.g., AWS, Heroku, DigitalOcean)
2. Install dependencies: `pip install -r requirements.txt`
3. Set environment variables for API keys
4. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the FAQ section on the contact page
2. Review the error logs in the console
3. Ensure your Cohere API key is valid and has sufficient credits
4. Contact support through the contact form

## 🔮 Future Enhancements

- [ ] User accounts and resume history
- [ ] More resume templates
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Resume scoring system
- [ ] Integration with job boards
- [ ] Multi-language support

## 📊 Performance

- Fast resume generation (typically 2-5 seconds)
- Responsive design for all screen sizes
- Optimized for mobile devices
- Efficient PDF generation

---

**Built with ❤️ using Python, Flask, and Cohere AI** 