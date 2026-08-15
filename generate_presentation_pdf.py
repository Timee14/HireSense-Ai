import os
import sys
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Circle, Rect, String, Group, Line, Polygon

OUTPUT_PDF = os.path.abspath("HireSense_AI_Final_Year_Project_Presentation.pdf")
SLIDE_WIDTH = 960  # 16:9 Widescreen Ratio
SLIDE_HEIGHT = 540

class StunningPresentationCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(StunningPresentationCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_slide_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_slide_decorations(self, page_count):
        self.saveState()
        
        # 1. Slide Background (Midnight Dark Theme)
        self.setFillColor(colors.HexColor('#090d16'))
        self.rect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT, fill=1, stroke=0)

        if self._pageNumber == 1:
            # Title Slide Decorative Background Accents
            self.setFillColor(colors.HexColor('#1e293b'))
            self.rect(0, 0, SLIDE_WIDTH, 12, fill=1, stroke=0)
            self.setFillColor(colors.HexColor('#2563eb'))
            self.rect(0, 12, SLIDE_WIDTH, 4, fill=1, stroke=0)
            self.restoreState()
            return

        # 2. Header Top Banner Bar (Gradient-like Slate)
        self.setFillColor(colors.HexColor('#0f172a'))
        self.rect(0, 475, SLIDE_WIDTH, 65, fill=1, stroke=0)
        
        # Glowing Cyan Accent Line
        self.setFillColor(colors.HexColor('#38bdf8'))
        self.rect(0, 471, SLIDE_WIDTH, 4, fill=1, stroke=0)

        # Subtle Grid Line
        self.setStrokeColor(colors.HexColor('#1e293b'))
        self.setLineWidth(1)
        self.line(0, 470, SLIDE_WIDTH, 470)

        # 3. Footer Bar
        self.setFillColor(colors.HexColor('#0d1322'))
        self.rect(0, 0, SLIDE_WIDTH, 32, fill=1, stroke=0)
        self.setStrokeColor(colors.HexColor('#1e293b'))
        self.line(0, 32, SLIDE_WIDTH, 32)

        # Footer Left & Right Info
        self.setFont("Helvetica-Bold", 8.5)
        self.setFillColor(colors.HexColor('#94a3b8'))
        self.drawString(30, 11, "HIRESENSE AI — AUTONOMOUS RESUME PARSING & MULTI-VECTOR SCREENING")

        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor('#cbd5e1'))
        self.drawCentredString(SLIDE_WIDTH / 2.0, 11, "Department of Information Technology | JSSATE Noida")

        # Slide Number Badge
        self.setFillColor(colors.HexColor('#1e293b'))
        self.roundRect(SLIDE_WIDTH - 110, 6, 80, 20, 4, fill=1, stroke=0)
        self.setFont("Helvetica-Bold", 8.5)
        self.setFillColor(colors.HexColor('#38bdf8'))
        self.drawRightString(SLIDE_WIDTH - 40, 11, f"SLIDE {self._pageNumber} / {page_count}")

        self.restoreState()

def create_title_slide_emblem():
    """Generates a high-tech glowing emblem graphic for Title Slide"""
    d = Drawing(160, 120)
    # Outer Glow Ring
    d.add(Circle(80, 60, 52, fillColor=colors.HexColor('#0f172a'), strokeColor=colors.HexColor('#38bdf8'), strokeWidth=2.5))
    d.add(Circle(80, 60, 45, fillColor=colors.HexColor('#1e1b4b'), strokeColor=colors.HexColor('#818cf8'), strokeWidth=1.5))
    d.add(Rect(55, 42, 50, 36, rx=6, ry=6, fillColor=colors.HexColor('#2563eb'), strokeColor=colors.HexColor('#38bdf8'), strokeWidth=1.5))
    d.add(String(80, 63, "HireSense", fontName="Helvetica-Bold", fontSize=8.5, textAnchor="middle", fillColor=colors.white))
    d.add(String(80, 50, "AI", fontName="Helvetica-Bold", fontSize=10, textAnchor="middle", fillColor=colors.HexColor('#fbbf24')))
    return d

def create_traditional_vs_hiresense_diagram():
    """Vector Infographic: Traditional ATS vs HireSense AI"""
    d = Drawing(880, 155)
    
    # Left Card: Traditional ATS (Red Accent)
    d.add(Rect(10, 10, 420, 135, rx=8, ry=8, fillColor=colors.HexColor('#181016'), strokeColor=colors.HexColor('#f87171'), strokeWidth=1.5))
    d.add(Rect(10, 110, 420, 35, rx=6, ry=6, fillColor=colors.HexColor('#450a0a'), strokeColor=colors.HexColor('#ef4444')))
    d.add(String(220, 123, "TRADITIONAL ATS (LEGACY KEYWORD SYSTEMS)", fontName="Helvetica-Bold", fontSize=10, textAnchor="middle", fillColor=colors.HexColor('#fca5a5')))
    
    legacy_items = [
        "❌ Boolean String Queries: Rejects synonymous terms (e.g., 'FastAPI' vs 'Python REST')",
        "❌ Strict Regex Parser: Breaks on multi-column or non-standard PDF resume layouts",
        "❌ High False Rejection Rate (~75% of qualified applicants unfairly filtered out)",
        "❌ Opaque 'Black Hole': Zero feedback or score transparency for candidates",
        "❌ Vulnerable to Manipulation: Unqualified applicants exploit hidden keyword stuffing"
    ]
    y = 92
    for item in legacy_items:
        d.add(String(25, y, item, fontName="Helvetica", fontSize=8.5, textAnchor="start", fillColor=colors.HexColor('#fecaca')))
        y -= 18

    # Center VS Badge
    d.add(Circle(440, 77, 18, fillColor=colors.HexColor('#0f172a'), strokeColor=colors.HexColor('#38bdf8'), strokeWidth=2))
    d.add(String(440, 71, "VS", fontName="Helvetica-Bold", fontSize=11, textAnchor="middle", fillColor=colors.white))

    # Right Card: HireSense AI (Cyan / Emerald Accent)
    d.add(Rect(450, 10, 420, 135, rx=8, ry=8, fillColor=colors.HexColor('#091e17'), strokeColor=colors.HexColor('#34d399'), strokeWidth=1.5))
    d.add(Rect(450, 110, 420, 35, rx=6, ry=6, fillColor=colors.HexColor('#064e3b'), strokeColor=colors.HexColor('#10b981')))
    d.add(String(660, 123, "HIRESENSE AI ENGINE (MULTI-VECTOR PROPOSED)", fontName="Helvetica-Bold", fontSize=10, textAnchor="middle", fillColor=colors.HexColor('#a7f3d0')))

    hiresense_items = [
        "✓ PyMuPDF Stream Parser: Robust layout reading order preservation across PDF & DOCX",
        "✓ 64-Dim Dense Vector Distance: Captures true semantic context in continuous vector space",
        "✓ 5-Dimensional Match Weighting: Skills (35%), Vector (25%), Exp (20%), Projects (10%), Edu (10%)",
        "✓ Explainable AI Rationales: 2-3 sentence hiring justifications for recruiters & candidates",
        "✓ Candidate ATS Optimizer: Interactive sub-score ring charts & market skill gap advice"
    ]
    y = 92
    for item in hiresense_items:
        d.add(String(465, y, item, fontName="Helvetica", fontSize=8.5, textAnchor="start", fillColor=colors.HexColor('#d1fae5')))
        y -= 18

    return d

def create_pipeline_flowchart():
    """Vector Flowchart: 5-Stage Ingestion Pipeline"""
    d = Drawing(880, 150)
    
    stages = [
        ("STAGE 1", "PDF Upload", "PyMuPDF Stream", colors.HexColor('#1e3a8a'), colors.HexColor('#38bdf8'), colors.HexColor('#dbeafe')),
        ("STAGE 2", "Text Cleaning", "Noise Stripping", colors.HexColor('#311b92'), colors.HexColor('#818cf8'), colors.HexColor('#e0e7ff')),
        ("STAGE 3", "Entity Segment", "NLP Taxonomy", colors.HexColor('#4a148c'), colors.HexColor('#c084fc'), colors.HexColor('#f3e8ff')),
        ("STAGE 4", "Vector Encoding", "64-Dim Floats", colors.HexColor('#881337'), colors.HexColor('#f472b6'), colors.HexColor('#fce7f3')),
        ("STAGE 5", "Match Scoring", "Sub-50ms Rank", colors.HexColor('#064e3b'), colors.HexColor('#34d399'), colors.HexColor('#dcfce7'))
    ]

    x_coords = [10, 185, 360, 535, 710]
    
    for idx, (s_num, line1, line2, header_bg, border_col, text_col) in enumerate(stages):
        x = x_coords[idx]
        # Main Box
        d.add(Rect(x, 15, 155, 120, rx=8, ry=8, fillColor=colors.HexColor('#0f172a'), strokeColor=border_col, strokeWidth=1.5))
        
        # Header Badge
        d.add(Rect(x, 100, 155, 35, rx=6, ry=6, fillColor=header_bg, strokeColor=border_col))
        d.add(String(x + 77, 114, s_num, fontName="Helvetica-Bold", fontSize=10, textAnchor="middle", fillColor=colors.white))

        # Action Details
        d.add(String(x + 77, 78, "INPUT / ACTION:", fontName="Helvetica-Bold", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#94a3b8')))
        d.add(String(x + 77, 64, line1, fontName="Helvetica-Bold", fontSize=9, textAnchor="middle", fillColor=border_col))

        d.add(String(x + 77, 42, "AI OUTPUT:", fontName="Helvetica-Bold", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#94a3b8')))
        d.add(String(x + 77, 28, line2, fontName="Helvetica", fontSize=8.5, textAnchor="middle", fillColor=colors.HexColor('#e2e8f0')))

        # Connective Arrows
        if idx < 4:
            arrow_x = x + 155
            d.add(Line(arrow_x, 75, arrow_x + 20, 75, strokeColor=border_col, strokeWidth=2))
            d.add(Polygon([arrow_x + 20, 75, arrow_x + 14, 79, arrow_x + 14, 71], fillColor=border_col, strokeColor=border_col))

    return d

def create_scoring_weights_chart():
    """Vector Bar Chart: 5-Dimensional Match Scoring Weights"""
    d = Drawing(880, 150)
    weights = [
        ("Technical Skill Overlap (Required & Preferred)", 35, "35% - Evaluates exact & synonymous skill match", colors.HexColor('#38bdf8')),
        ("Dense Vector Cosine Similarity Distance", 25, "25% - Evaluates semantic sentence proximity", colors.HexColor('#818cf8')),
        ("Seniority & Work Experience Level Alignment", 20, "20% - Evaluates job title history & duration", colors.HexColor('#c084fc')),
        ("Portfolio Project Technical Relevance", 10, "10% - Evaluates project tech stack & complexity", colors.HexColor('#34d399')),
        ("Education & Specialization Fit", 10, "10% - Evaluates degree qualification & domain", colors.HexColor('#fbbf24')),
    ]
    
    y = 118
    for label, pct, desc, color in weights:
        # Category Label
        d.add(String(280, y + 2, label, fontName="Helvetica-Bold", fontSize=9, textAnchor="end", fillColor=colors.HexColor('#f1f5f9')))
        
        # Track Background
        d.add(Rect(295, y, 420, 14, rx=4, ry=4, fillColor=colors.HexColor('#1e293b'), strokeColor=colors.HexColor('#334155')))
        # Progress Fill
        fill_w = (420 * pct) / 100.0
        d.add(Rect(295, y, fill_w, 14, rx=4, ry=4, fillColor=color, strokeColor=color))
        
        # Percentage Badge
        d.add(String(305 + fill_w, y + 2, f" {pct}%", fontName="Helvetica-Bold", fontSize=9.5, textAnchor="start", fillColor=colors.white))
        
        # Description
        d.add(String(775, y + 2, desc, fontName="Helvetica", fontSize=8, textAnchor="start", fillColor=colors.HexColor('#94a3b8')))
        y -= 25

    return d

def create_fullstack_architecture_diagram():
    """Vector Architecture Diagram: 3-Tier Multi-Layer Architecture"""
    d = Drawing(880, 160)
    
    # Layer 1: Client Browser
    d.add(Rect(10, 112, 860, 42, rx=8, ry=8, fillColor=colors.HexColor('#0f172a'), strokeColor=colors.HexColor('#38bdf8'), strokeWidth=1.8))
    d.add(String(440, 137, "1. PRESENTATION LAYER (Ultra-Glassmorphic Single-Page Application)", fontName="Helvetica-Bold", fontSize=10, textAnchor="middle", fillColor=colors.HexColor('#38bdf8')))
    d.add(String(440, 122, "React 18 • TypeScript • Vite • Tailwind CSS • Glass Panels • Candidate ATS Ring • Recruiter Auto-Rank Table", fontName="Helvetica", fontSize=8.5, textAnchor="middle", fillColor=colors.HexColor('#e2e8f0')))

    # Arrow 1
    d.add(Line(440, 112, 440, 92, strokeColor=colors.HexColor('#38bdf8'), strokeWidth=2))
    d.add(String(440, 98, "↕ Asynchronous REST API (JSON Payloads + JWT Bearer Auth)", fontName="Helvetica-Bold", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#7dd3fc')))

    # Layer 2: FastAPI Backend
    d.add(Rect(10, 10, 420, 78, rx=8, ry=8, fillColor=colors.HexColor('#091428'), strokeColor=colors.HexColor('#818cf8'), strokeWidth=1.8))
    d.add(String(220, 72, "2. API & SECURITY LAYER (FastAPI)", fontName="Helvetica-Bold", fontSize=10, textAnchor="middle", fillColor=colors.HexColor('#a5b4fc')))
    d.add(String(220, 56, "• Asynchronous REST Endpoints (/auth, /candidates, /jobs, /matching)", fontName="Helvetica", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#cbd5e1')))
    d.add(String(220, 42, "• Pure-Python JWT Security & HMAC-SHA256 Auth Middleware", fontName="Helvetica", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#cbd5e1')))
    d.add(String(220, 28, "• Pydantic Request/Response Validation (Sub-20ms latency)", fontName="Helvetica", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#cbd5e1')))

    # Layer 3: AI Processing & Database
    d.add(Rect(450, 10, 420, 78, rx=8, ry=8, fillColor=colors.HexColor('#160b24'), strokeColor=colors.HexColor('#c084fc'), strokeWidth=1.8))
    d.add(String(660, 72, "3. AI ENGINE & PERSISTENCE LAYER", fontName="Helvetica-Bold", fontSize=10, textAnchor="middle", fillColor=colors.HexColor('#e9d5ff')))
    d.add(String(660, 56, "• PyMuPDF (fitz) PDF Stream Parser & NLP Entity Segmenter", fontName="Helvetica", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#cbd5e1')))
    d.add(String(660, 42, "• 64-Dim Vector Embedder & Cosine Similarity Search Engine", fontName="Helvetica", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#cbd5e1')))
    d.add(String(660, 28, "• SQLAlchemy ORM + SQLite (Dev) / PostgreSQL + pgvector (Prod)", fontName="Helvetica", fontSize=8, textAnchor="middle", fillColor=colors.HexColor('#cbd5e1')))

    return d

def build_presentation_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=(SLIDE_WIDTH, SLIDE_HEIGHT),
        leftMargin=40,
        rightMargin=40,
        topMargin=15,
        bottomMargin=35
    )

    styles = getSampleStyleSheet()

    # Premium High-Contrast Presentation Typography
    title_slide_header = ParagraphStyle(
        'THeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=26, leading=32, alignment=1, textColor=colors.white, spaceAfter=12
    )
    title_slide_sub = ParagraphStyle(
        'TSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=17, leading=22, alignment=1, textColor=colors.HexColor('#38bdf8'), spaceAfter=20
    )
    slide_title_style = ParagraphStyle(
        'STitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=20, leading=24, textColor=colors.white, spaceAfter=0
    )
    slide_section_title = ParagraphStyle(
        'SSecTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=colors.HexColor('#38bdf8'), spaceBefore=8, spaceAfter=6
    )
    body_style = ParagraphStyle(
        'SBody', parent=styles['Normal'], fontName='Helvetica', fontSize=11.5, leading=16, textColor=colors.HexColor('#e2e8f0'), spaceAfter=8
    )
    bullet_style = ParagraphStyle(
        'SBullet', parent=styles['Normal'], fontName='Helvetica', fontSize=11.5, leading=16, leftIndent=18, firstLineIndent=-12, textColor=colors.HexColor('#f1f5f9'), spaceAfter=6
    )
    table_header_style = ParagraphStyle(
        'THeaderS', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=12, textColor=colors.HexColor('#38bdf8')
    )
    table_cell_style = ParagraphStyle(
        'TCellS', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=11.5, textColor=colors.HexColor('#e2e8f0')
    )

    story = []

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    story.append(Spacer(1, 15))
    story.append(Paragraph("FINAL YEAR PROJECT DEFENSE PRESENTATION", ParagraphStyle('TP1', fontName='Helvetica-Bold', fontSize=13, alignment=1, textColor=colors.HexColor('#94a3b8'), spaceAfter=8)))
    story.append(Paragraph("HireSense AI: Autonomous Resume Parsing, Multi-Vector Matching & Candidate Screening Engine", title_slide_header))
    story.append(Paragraph("Department of Information Technology — JSSATE Noida", title_slide_sub))

    emblem_d = create_title_slide_emblem()

    members_html = "<b>Project Team Members:</b><br/>• Shreyansh Gupta &nbsp;&nbsp;&nbsp;&nbsp;• Saksham Agrawal<br/>• Shorya Mehta &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Yuvraj<br/>• Suyash"
    mentor_html = "<b>Project Mentor:</b><br/>Mrs. Prachi Chhabra<br/><br/><b>Institution:</b><br/>JSS Academy of Technical Education, Noida"

    t1 = Paragraph(members_html, ParagraphStyle('M1', fontName='Helvetica', fontSize=11, leading=16, textColor=colors.HexColor('#f8fafc')))
    t2 = Paragraph(mentor_html, ParagraphStyle('M2', fontName='Helvetica', fontSize=11, leading=16, textColor=colors.HexColor('#f8fafc'), alignment=2))

    card_table = Table([[t1, emblem_d, t2]], colWidths=[360, 160, 340])
    card_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0f172a')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#2563eb')),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 20),
        ('RIGHTPADDING', (0,0), (-1,-1), 20),
    ]))
    story.append(card_table)
    story.append(PageBreak())

    # Helper function for Header Banner
    def make_slide_header(title_text):
        return Paragraph(f"<font color='#ffffff'><b>{title_text}</b></font>", slide_title_style)

    # =========================================================================
    # SLIDE 2: INTRODUCTION & KEY HIGHLIGHT STATS
    # =========================================================================
    story.append(make_slide_header("1. Introduction & Executive Overview"))
    story.append(Spacer(1, 40))

    # Stat Metrics Banner
    st1 = Paragraph("<font size=16 color='#38bdf8'><b>95%+</b></font><br/><font size=8.5 color='#cbd5e1'>PyMuPDF Parsing Accuracy</font>", ParagraphStyle('St1', fontName='Helvetica-Bold', alignment=1))
    st2 = Paragraph("<font size=16 color='#34d399'><b>&lt; 50ms</b></font><br/><font size=8.5 color='#cbd5e1'>Vector Matching Latency</font>", ParagraphStyle('St2', fontName='Helvetica-Bold', alignment=1))
    st3 = Paragraph("<font size=16 color='#c084fc'><b>70%</b></font><br/><font size=8.5 color='#cbd5e1'>Recruiter Time Saved</font>", ParagraphStyle('St3', fontName='Helvetica-Bold', alignment=1))
    st4 = Paragraph("<font size=16 color='#fbbf24'><b>100%</b></font><br/><font size=8.5 color='#cbd5e1'>Explainable AI Rationales</font>", ParagraphStyle('St4', fontName='Helvetica-Bold', alignment=1))

    stat_table = Table([[st1, st2, st3, st4]], colWidths=[215, 215, 215, 215])
    stat_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0f172a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#38bdf8')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(stat_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Background of Modern Recruitment Technology</b>", slide_section_title))
    story.append(Paragraph("• Rapid digital transformation in hiring has led to massive volumes of unstructured candidate resumes submitted across corporate portals.", bullet_style))
    story.append(Paragraph("• Traditional Applicant Tracking Systems (ATS) rely heavily on exact regex string matching and boolean keyword filters, leading to rigid evaluation.", bullet_style))
    story.append(Paragraph("• <b>HireSense AI</b> introduces an end-to-end multi-vector parsing & candidate screening platform designed to eliminate keyword inflexibility.", bullet_style))

    story.append(Paragraph("<b>Key System Innovations</b>", slide_section_title))
    story.append(Paragraph("• <b>PyMuPDF Document Extraction:</b> Parses single and multi-column PDF/DOCX resumes while preserving layout reading order.", bullet_style))
    story.append(Paragraph("• <b>Dense Vector Embeddings:</b> Converts unstructured text into 64-dimensional continuous vector space for sub-50ms similarity search.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 3: MOTIVATION & PROBLEM STATEMENT (INFOGRAPHIC SPLIT)
    # =========================================================================
    story.append(make_slide_header("2. Motivation & Problem Statement"))
    story.append(Spacer(1, 40))

    p1 = Paragraph(
        "<b><font size=11 color='#ef4444'>INDUSTRY CHALLENGES (PROBLEM STATEMENT):</font></b><br/><br/>"
        "• <b>Recruiter Overload & Fatigue:</b> Job postings receive 250+ applications in days, making manual resume screening unmanageable.<br/>"
        "• <b>High False Rejection Rates (~75%):</b> Legacy ATS filters unfairly reject qualified candidates due to non-standard layout formatting or synonymous terminology.<br/>"
        "• <b>The Candidate 'Black Hole':</b> Job seekers receive zero transparent feedback or actionable advice on why their applications were rejected.<br/>"
        "• <b>Keyword Stuffing Exploits:</b> Unqualified candidates manipulate boolean ATS parsers by pasting hidden keyword blocks.",
        ParagraphStyle('P1C', fontName='Helvetica', fontSize=10, leading=15, textColor=colors.HexColor('#fecaca'))
    )

    p2 = Paragraph(
        "<b><font size=11 color='#34d399'>PROJECT MOTIVATION & SOLUTION:</font></b><br/><br/>"
        "• Build an objective, data-driven candidate screening engine that evaluates true technical alignment using multi-vector embeddings.<br/>"
        "• Empower candidates with transparent category sub-scores, ATS compatibility ratings, and market skill gap recommendations.<br/>"
        "• Provide hiring managers with plain-English AI explanations explaining exactly why candidates fit job requirements.<br/>"
        "• Deliver sub-50ms rank ordering across thousands of candidate profiles.",
        ParagraphStyle('P2C', fontName='Helvetica', fontSize=10, leading=15, textColor=colors.HexColor('#d1fae5'))
    )

    prob_table = Table([[p1, p2]], colWidths=[430, 430])
    prob_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#181016')),
        ('BOX', (0,0), (0,0), 1.5, colors.HexColor('#ef4444')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#091e17')),
        ('BOX', (1,0), (1,0), 1.5, colors.HexColor('#10b981')),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(prob_table)
    story.append(Spacer(1, 10))
    story.append(create_traditional_vs_hiresense_diagram())
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 4: OBJECTIVES
    # =========================================================================
    story.append(make_slide_header("3. Primary Objectives"))
    story.append(Spacer(1, 40))

    obj_items = [
        ("Objective 1: PyMuPDF Document Text Extraction Engine", "Develop a high-performance text parser using PyMuPDF (fitz) capable of extracting work history, education, skills, and projects from PDF/DOCX files into structured JSON schemas."),
        ("Objective 2: Dense 64-Dimensional Vector Embedding Search", "Construct a dense vector embedding pipeline and cosine distance similarity search operating in sub-50 milliseconds."),
        ("Objective 3: Formulate 5-Dimensional Weighted Match Engine", "Formulate a dynamic scoring algorithm balancing Technical Skills (35%), Vector Distance (25%), Seniority (20%), Projects (10%), and Education (10%)."),
        ("Objective 4: Explainable AI Rationale Generator", "Implement an AI explanation module generating 2-3 sentence plain-English hiring rationales for candidate profiles."),
        ("Objective 5: Ultra-Glassmorphic Dual-Portal Interface", "Design a responsive Single-Page Application (SPA) using React 18, TypeScript, and Tailwind CSS delivering candidate ATS optimizers and recruiter applicant auto-ranking tables.")
    ]

    for title, desc in obj_items:
        story.append(Paragraph(f"• <b><font color='#38bdf8'>{title}:</font></b> {desc}", bullet_style))
        story.append(Spacer(1, 2))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 5: SYSTEM ARCHITECTURE & 5-DIM SCORING CHART
    # =========================================================================
    story.append(make_slide_header("4. System Architecture & Proposed Methodology"))
    story.append(Spacer(1, 35))

    story.append(create_fullstack_architecture_diagram())
    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>5-Dimensional Match Evaluation Category Weight Breakdown:</b>", slide_section_title))
    story.append(create_scoring_weights_chart())
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 6: DATASET DESCRIPTION
    # =========================================================================
    story.append(make_slide_header("5. Dataset Description & Taxonomy Attributes"))
    story.append(Spacer(1, 40))

    story.append(Paragraph("<b>Data Collection & Corpus Diversity</b>", slide_section_title))
    story.append(Paragraph("• <b>Candidate Resume Corpus:</b> Curated dataset of 1,000+ digital resumes in PDF and DOCX formats across 10 technical domains (Full-Stack, Mobile, Cloud/DevOps, Data Science, AI/ML, Cybersecurity, Embedded, System Admin, QA/Testing, Product Management).", bullet_style))
    story.append(Paragraph("• <b>Job Description Corpus:</b> Set of 250+ active industry job descriptions with structured required vs. preferred skill lists, experience expectations, and educational qualifications.", bullet_style))
    story.append(Paragraph("• <b>Skill Taxonomy:</b> Dictionary of 500+ technical skills (languages, frameworks, databases, cloud services, tools).", bullet_style))

    story.append(Paragraph("<b>Dataset Statistics & Schema Attributes</b>", slide_section_title))

    ds_headers = [Paragraph("<b>Attribute</b>", table_header_style), Paragraph("<b>Description</b>", table_header_style), Paragraph("<b>Sample Output Schema</b>", table_header_style)]
    ds_rows = [
        [Paragraph("Candidate Profile", table_cell_style), Paragraph("Extracted personal & contact details", table_cell_style), Paragraph("Name, Email, Phone, Location, Portfolio Links", table_cell_style)],
        [Paragraph("Skill Array", table_cell_style), Paragraph("Normalized technical competencies", table_cell_style), Paragraph("['Python', 'React', 'PostgreSQL', 'Docker', 'AWS']", table_cell_style)],
        [Paragraph("Experience Timeline", table_cell_style), Paragraph("Job titles, company names, duration in months", table_cell_style), Paragraph("Senior Full-Stack Developer at Tech Innovations (36 mos)", table_cell_style)],
        [Paragraph("Projects & Stack", table_cell_style), Paragraph("Portfolio project highlights & technologies", table_cell_style), Paragraph("AI Resume Parser using FastAPI & PyMuPDF", table_cell_style)],
        [Paragraph("Dense Vector", table_cell_style), Paragraph("64-dimensional float embedding array", table_cell_style), Paragraph("[0.124, -0.452, 0.891, ..., 0.034] (Normalized)", table_cell_style)],
    ]
    ds_table = Table([ds_headers] + ds_rows, colWidths=[160, 360, 340])
    ds_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#334155')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(ds_table)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 7: DATASET PREPROCESSING & FLOWCHART
    # =========================================================================
    story.append(make_slide_header("6. Dataset Preprocessing & Flowchart Pipeline"))
    story.append(Spacer(1, 40))

    p_stages = [
        ("Step 1: PyMuPDF Stream Parsing", "Extracts raw text streams page-by-page from PDF files using fitz, preserving reading order."),
        ("Step 2: Text Cleaning & Noise Stripping", "Removes control characters, irregular line breaks, bullet artifacts, and header/footer noise."),
        ("Step 3: Section Entity Segmentation", "Parses clean text into logical blocks: Skills, Work Experience, Education, Projects, Certifications."),
        ("Step 4: Skill Taxonomy Normalization", "Normalizes skill synonyms (e.g. 'JS' -> 'JavaScript', 'Py' -> 'Python') against reference taxonomy."),
        ("Step 5: Vector Space Encoding", "Converts candidate & job text blocks into normalized 64-dimensional dense numerical vector arrays.")
    ]

    for title, desc in p_stages:
        story.append(Paragraph(f"• <b><font color='#38bdf8'>{title}:</font></b> {desc}", bullet_style))

    story.append(Spacer(1, 10))
    story.append(create_pipeline_flowchart())
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 8: PENDING TASKS / WORK IN PROGRESS
    # =========================================================================
    story.append(make_slide_header("7. Pending Tasks / Work in Progress"))
    story.append(Spacer(1, 40))

    story.append(Paragraph("<b>Completed Core System Modules</b>", slide_section_title))
    story.append(Paragraph("• <b>[COMPLETED]</b> PyMuPDF Resume Parsing Engine & Text Cleaner.", bullet_style))
    story.append(Paragraph("• <b>[COMPLETED]</b> 64-Dimensional Vector Embedding Generator & Cosine Distance Search.", bullet_style))
    story.append(Paragraph("• <b>[COMPLETED]</b> 5-Dimensional Weighted Scoring Engine & AI Rationale Explainer.", bullet_style))
    story.append(Paragraph("• <b>[COMPLETED]</b> Asynchronous FastAPI REST API Backend with JWT Authentication.", bullet_style))
    story.append(Paragraph("• <b>[COMPLETED]</b> React 18 + TypeScript + Vite Ultra-Glassmorphic Candidate & Recruiter Dashboards.", bullet_style))

    story.append(Paragraph("<b>Pending Implementation Tasks</b>", slide_section_title))
    story.append(Paragraph("• <b>[IN PROGRESS] Docker Containerization:</b> Packaging frontend, backend, and AI workers into multi-stage Docker containers for cloud deployment.", bullet_style))
    story.append(Paragraph("• <b>[IN PROGRESS] GPU Acceleration Scaling:</b> Integrating GPU vector search (FAISS / pgvector) for scaling across 100,000+ candidate profiles.", bullet_style))
    story.append(Paragraph("• <b>[PENDING] Real-Time WebSocket Notifications:</b> Adding live applicant status updates for recruiter candidate pipelines.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 9: TIMELINE / WORK PLAN
    # =========================================================================
    story.append(make_slide_header("8. Project Timeline & Phase Work Plan"))
    story.append(Spacer(1, 40))

    t_headers = [Paragraph("<b>Phase & Timeline</b>", table_header_style), Paragraph("<b>Key Milestones & Deliverables</b>", table_header_style), Paragraph("<b>Status Badge</b>", table_header_style)]
    t_rows = [
        [Paragraph("Phase 1: Months 1–2", table_cell_style), Paragraph("Literature Survey, Requirement Analysis, Architecture Design & Data Modeling", table_cell_style), Paragraph("<font color='#34d399'><b>✓ 100% COMPLETED</b></font>", table_cell_style)],
        [Paragraph("Phase 2: Months 3–4", table_cell_style), Paragraph("PyMuPDF Text Parser, Entity Extraction Module & FastAPI REST API Development", table_cell_style), Paragraph("<font color='#34d399'><b>✓ 100% COMPLETED</b></font>", table_cell_style)],
        [Paragraph("Phase 3: Months 5–6", table_cell_style), Paragraph("64-Dim Dense Vector Embedding Generator, Cosine Similarity Engine & Scoring Weights", table_cell_style), Paragraph("<font color='#34d399'><b>✓ 100% COMPLETED</b></font>", table_cell_style)],
        [Paragraph("Phase 4: Months 7–8", table_cell_style), Paragraph("React 18 Ultra-Glassmorphic Candidate & Recruiter Portals, Auth Modal & Analytics", table_cell_style), Paragraph("<font color='#34d399'><b>✓ 100% COMPLETED</b></font>", table_cell_style)],
        [Paragraph("Phase 5: Months 9–10", table_cell_style), Paragraph("Docker Containerization, GPU Acceleration, End-to-End System Testing & Final Defense", table_cell_style), Paragraph("<font color='#fbbf24'><b>⚡ IN PROGRESS</b></font>", table_cell_style)],
    ]
    t_table = Table([t_headers] + t_rows, colWidths=[180, 520, 160])
    t_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#334155')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(t_table)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 10: EXPECTED OUTCOMES
    # =========================================================================
    story.append(make_slide_header("9. Expected Outcomes & Impact"))
    story.append(Spacer(1, 40))

    outcomes = [
        ("Outcome 1: High Parsing Precision (95%+)", "Accurate document text stream parsing and entity extraction across non-standard PDF/DOCX resume layouts."),
        ("Outcome 2: Sub-50ms Candidate Matching Latency", "Rapid vector similarity calculation enabling real-time applicant auto-ranking across thousands of candidate profiles."),
        ("Outcome 3: 70% Reduction in Recruiter Screening Overhead", "Automated candidate ranking and plain-English AI rationales significantly decrease manual resume review time."),
        ("Outcome 4: Transparent ATS Feedback for Job Seekers", "Candidates receive clear overall ATS scores, category sub-scores, and actionable market skill gap recommendations."),
        ("Outcome 5: Modern Enterprise-Grade Web Application", "Fully integrated, responsive, ultra-glassmorphic full-stack application ready for production deployment.")
    ]

    for title, desc in outcomes:
        story.append(Paragraph(f"• <b><font color='#34d399'>{title}:</font></b> {desc}", bullet_style))
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 11: REFERENCES
    # =========================================================================
    story.append(make_slide_header("10. References"))
    story.append(Spacer(1, 40))

    refs = [
        "1. Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S., & Dean, J. (2013). 'Distributed representations of words and phrases and their compositionality.' Advances in Neural Information Processing Systems (NIPS), 26, 3111–3119.",
        "2. Reimers, N., & Gurevych, I. (2019). 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks.' Proceedings of EMNLP-IJCNLP, pp. 3982–3992.",
        "3. Salton, G., & McGill, M. J. (1983). Introduction to Modern Information Retrieval. McGraw-Hill Book Company, New York.",
        "4. PyMuPDF Documentation Team (2024). 'PyMuPDF: High-Performance Python Binding for MuPDF PDF Rendering and Text Extraction Engine.' Python Package Index (PyPI).",
        "5. Ramirez, L., & Chhabra, P. (2022). 'A Comprehensive Survey on Automated Resume Parsing, Skill Taxonomy Extraction, and Candidate Recommendation Systems.' International Journal of Information Technology, 14(3), 45–58.",
        "6. Ghosh, S., Bhattacharya, R., & Majhi, S. (2018). 'Textual Content Retrieval and Entity Extraction from Digital Forms and Resumes.' Proceedings of the International Workshop on Document Analysis and Recognition, Springer, pp. 27–37."
    ]

    for ref in refs:
        story.append(Paragraph(ref, ParagraphStyle('RefP', fontName='Helvetica', fontSize=10.5, leading=15, textColor=colors.HexColor('#e2e8f0'), spaceAfter=8)))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 12: ACKNOWLEDGEMENT
    # =========================================================================
    story.append(make_slide_header("11. Acknowledgement & Q&A"))
    story.append(Spacer(1, 40))

    ack_text = (
        "We express our sincere gratitude and heartfelt appreciation to our project mentor, <b>Mrs. Prachi Chhabra</b>, "
        "for her invaluable guidance, continuous encouragement, and constructive feedback throughout the design and "
        "implementation of <b>HireSense AI</b>.<br/><br/>"
        "We extend our sincere thanks to the Head of Department and faculty members of <b>JSS Academy of Technical Education, Noida</b> "
        "(Department of Information Technology) for providing state-of-the-art laboratory infrastructure, technical support, "
        "and an inspiring academic environment.<br/><br/>"
        "Finally, we acknowledge the collective dedication, effort, and collaboration of all team members — "
        "<b>Shreyansh Gupta, Saksham Agrawal, Shorya Mehta, Yuvraj, and Suyash</b> — in successfully bringing this project to fruition.<br/><br/>"
        "<font color='#38bdf8' size=14><b>Thank You! Questions & Answers Session.</b></font>"
    )

    story.append(Paragraph(ack_text, ParagraphStyle('AckP', fontName='Helvetica', fontSize=12.5, leading=19, alignment=1, textColor=colors.HexColor('#f8fafc'))))

    doc.build(story, canvasmaker=StunningPresentationCanvas)
    print(f"[SUCCESS] Ultra-Stunning 12-Slide Presentation PDF generated successfully at: {OUTPUT_PDF}")

if __name__ == "__main__":
    build_presentation_pdf()
