import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_student_report_card():
    os.makedirs('generated', exist_ok=True)
    pdf_filename = "generated/Hillside_Academy_Report_Card.pdf"
    
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40,
        title="Official Academic Statement Matrix Transcript"
    )
    
    styles = getSampleStyleSheet()
    story = []
    
    title_style = ParagraphStyle(
        'AcademyHeader', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=22,
        textColor=colors.HexColor('#1e1b4b'), alignment=1, spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'AcademySub', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=10,
        textColor=colors.HexColor('#475569'), alignment=1, spaceAfter=20
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12,
        textColor=colors.HexColor('#1e1b4b'), spaceBefore=15, spaceAfter=10
    )
    
    body_text = ParagraphStyle(
        'CardBody', parent=styles['Normal'], fontName='Helvetica', fontSize=10,
        textColor=colors.HexColor('#334155'), leading=14
    )
    
    story.append(Paragraph("🏢 HILLSIDE ACADEMY WORKSPACE PORTAL", title_style))
    story.append(Paragraph("Official Ministry Primary Leaving Sequence Report Certificate", subtitle_style))
    story.append(Spacer(1, 10))
    
    profile_data = [
        [Paragraph("<b>Student Full Name:</b> Tariku Abebe", body_text), Paragraph("<b>Academic Term Sequence:</b> 2026 Quarter 3", body_text)],
        [Paragraph("<b>Assigned Grade Level:</b> Grade 8A (PSLCE)", body_text), Paragraph("<b>Cluster Tracking Node:</b> FidelPortal-#9843", body_text)]
    ]
    
    profile_table = Table(profile_data, colWidths=[260, 260])
    profile_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(profile_table)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("📊 Continuous Assessment Grading Balance", section_heading))
    score_data = [
        ["Assigned Subject Core", "CA Mark 1 (15)", "CA Mark 2 (15)", "Total Sequence (30)", "Evaluation Status"],
        ["Mathematics (Grade 8A)", "14.50", "12.00", "26.50", "Exemplary Pass"],
        ["General Science Matrix", "11.00", "13.50", "24.50", "Satisfactory Pass"],
        ["English Grammar Sequence", "15.00", "14.00", "29.00", "Exemplary Pass"],
        ["Social Studies Pathway", "12.50", "11.50", "24.00", "Satisfactory Pass"]
    ]
    
    score_table = Table(score_data, colWidths=[180, 85, 85, 90, 80])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e1b4b')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 20))
    
    disclaimer_style = ParagraphStyle(
        'DisclaimerFootnote', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8,
        textColor=colors.HexColor('#94a3b8'), alignment=1, spaceBefore=30
    )
    story.append(Paragraph("This is for informational purposes only. For medical advice or diagnosis, consult a professional. AI responses may include mistakes.", disclaimer_style))
    
    doc.build(story)

if __name__ == "__main__":
    generate_student_report_card()
