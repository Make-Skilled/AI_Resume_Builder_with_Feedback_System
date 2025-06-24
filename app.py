from flask import Flask, render_template, request, jsonify, send_file
import cohere
import os
import json
from datetime import datetime
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import re

app = Flask(__name__)

# Initialize Cohere client
co = cohere.Client('YOUR_ACTUAL_API_KEY_HERE')  # Replace with your actual API key

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/build-resume', methods=['GET', 'POST'])
def build_resume():
    if request.method == 'POST':
        data = request.get_json()
        user_info = data.get('userInfo', {})
        resume_data = {
            'user_info': user_info,
            'timestamp': datetime.now().isoformat()
        }
        return jsonify({
            'success': True,
            'resume': resume_data,
            'message': 'Resume generated successfully!'
        })
    return render_template('build_resume.html')

@app.route('/download-resume', methods=['POST'])
def download_resume():
    data = request.get_json()
    resume_data = data.get('resume', {})
    user_info = resume_data.get('user_info', {})
    format_type = data.get('format', 'pdf')
    if format_type == 'pdf':
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        styles = getSampleStyleSheet()
        name_style = ParagraphStyle('NameTitle', parent=styles['Heading1'], fontSize=28, textColor=colors.HexColor('#111827'), spaceAfter=20, alignment=1, fontName='Helvetica-Bold')
        section_style = ParagraphStyle('Section', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor('#2563eb'), spaceAfter=10, spaceBefore=16, fontName='Helvetica-Bold', alignment=0, underlineWidth=0)
        content_style = ParagraphStyle('Content', parent=styles['Normal'], fontSize=11, spaceAfter=8, fontName='Helvetica', leftIndent=0)
        bullet_style = ParagraphStyle('Bullet', parent=styles['Normal'], fontSize=11, leftIndent=14, bulletIndent=0, spaceAfter=4, fontName='Helvetica')
        # Build left and right columns
        left_col = []
        left_col.append(Paragraph('DETAILS', section_style))
        if user_info.get('address'):
            left_col.append(Paragraph(f"Address: {user_info.get('address')}", content_style))
        if user_info.get('phone'):
            left_col.append(Paragraph(f"Phone: {user_info.get('phone')}", content_style))
        if user_info.get('email'):
            left_col.append(Paragraph(f"Email: {user_info.get('email')}", content_style))
        if user_info.get('nationality'):
            left_col.append(Paragraph(f"Nationality: {user_info.get('nationality')}", content_style))
        left_col.append(Spacer(1, 12))
        if user_info.get('skills'):
            left_col.append(Paragraph('SKILLS', section_style))
            for skill in user_info.get('skills', '').split(','):
                left_col.append(Paragraph(f"- {skill.strip()}", bullet_style))
            left_col.append(Spacer(1, 12))
        if user_info.get('languages'):
            left_col.append(Paragraph('LANGUAGES', section_style))
            for lang in user_info.get('languages', '').split(','):
                left_col.append(Paragraph(f"- {lang.strip()}", bullet_style))
        # Build right column
        right_col = []
        if user_info.get('summary'):
            right_col.append(Paragraph('PROFILE', section_style))
            right_col.append(Paragraph(user_info.get('summary', ''), content_style))
            right_col.append(Spacer(1, 12))
        if user_info.get('experience'):
            right_col.append(Paragraph('EMPLOYMENT HISTORY', section_style))
            for line in user_info.get('experience', '').split('\n'):
                if line.strip():
                    right_col.append(Paragraph(line.strip(), bullet_style if line.strip().startswith('-') else content_style))
            right_col.append(Spacer(1, 12))
        if user_info.get('education'):
            right_col.append(Paragraph('EDUCATION', section_style))
            for edu in user_info.get('education', '').split('\n'):
                if edu.strip():
                    right_col.append(Paragraph(edu.strip(), content_style))
            right_col.append(Spacer(1, 12))
        if user_info.get('projects'):
            right_col.append(Paragraph('PROJECTS', section_style))
            for proj in user_info.get('projects', '').split('\n'):
                if proj.strip():
                    right_col.append(Paragraph(proj.strip(), bullet_style if proj.strip().startswith('-') else content_style))
            right_col.append(Spacer(1, 12))
        if user_info.get('certifications'):
            right_col.append(Paragraph('CERTIFICATIONS', section_style))
            for cert in user_info.get('certifications', '').split('\n'):
                if cert.strip():
                    right_col.append(Paragraph(cert.strip(), bullet_style if cert.strip().startswith('-') else content_style))
        # Name as a separate, centered Paragraph above the table
        story = [
            Paragraph(user_info.get('name', ''), name_style),
            Spacer(1, 18)
        ]
        # Build the two-column table (without the name in the table)
        table_data = [
            [left_col, right_col]
        ]
        table = Table(table_data, colWidths=[2.2*inch, 4.8*inch], hAlign='LEFT')
        table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LINEBEFORE', (1,0), (1,-1), 1, colors.HexColor('#e5e7eb')),
        ]))
        story.append(table)
        # Signature field at the bottom
        story.append(Spacer(1, 40))
        signature_style = ParagraphStyle('Signature', parent=styles['Normal'], fontSize=12, textColor=colors.HexColor('#111827'), spaceAfter=6, alignment=0, fontName='Helvetica-Oblique')
        story.append(Paragraph('Signature: ____________________________', signature_style))
        doc.build(story)
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f'resume_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf',
            mimetype='application/pdf'
        )
    elif format_type == 'txt':
        buffer = io.BytesIO()
        buffer.write(str(resume_data).encode('utf-8'))
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f'resume_{datetime.now().strftime("%Y%m%d_%H%M%S")}.txt',
            mimetype='text/plain'
        )

@app.route('/get-feedback', methods=['POST'])
def get_feedback():
    data = request.get_json()
    resume_content = data.get('resume', '')
    
    feedback_prompt = f"""
    Analyze the following resume and provide constructive feedback on:
    1. Content quality and relevance
    2. Structure and formatting
    3. ATS (Applicant Tracking System) compatibility
    4. Areas for improvement
    5. Overall strength and weaknesses
    
    Resume:
    {resume_content}
    
    Please provide detailed, actionable feedback that will help improve this resume.
    """
    
    try:
        response = co.generate(
            model='command',
            prompt=feedback_prompt,
            max_tokens=1500,
            temperature=0.5,
            k=0,
            stop_sequences=[],
            return_likelihoods='NONE'
        )
        
        feedback = response.generations[0].text
        
        return jsonify({
            'success': True,
            'feedback': feedback
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
