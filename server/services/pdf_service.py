import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas


def generate_incident_pdf_stream(incident: dict) -> io.BytesIO:
    """
    Generates a beautifully formatted PDF report for an incident using ReportLab.
    Returns a BytesIO stream.
    """
    buffer = io.BytesIO()
    
    # Create the PDF document canvas
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Color Palette (Matches ResQ AI Clean styling)
    primary_color = colors.HexColor("#2563EB")  # Deep Blue
    dark_text = colors.HexColor("#0f172a")     # Slate 900
    muted_text = colors.HexColor("#475569")    # Slate 600
    light_bg = colors.HexColor("#f8fafc")      # Slate 50
    border_color = colors.HexColor("#cbd5e1")  # Slate 300
    
    severity = incident.get("severity", "Medium")
    if severity == "Critical":
        sev_color = colors.HexColor("#dc2626")  # Red
    elif severity == "High":
        sev_color = colors.HexColor("#ea580c")  # Orange
    elif severity == "Medium":
        sev_color = colors.HexColor("#d97706")  # Amber
    else:
        sev_color = colors.HexColor("#16a34a")  # Green

    # 1. Header Banner
    c.setFillColor(primary_color)
    c.rect(0, height - 100, width, 100, fill=True, stroke=False)
    
    # Title Text in Header
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(40, height - 55, "ResQ AI")
    
    c.setFont("Helvetica", 12)
    c.setFillColor(colors.white)
    c.drawString(40, height - 75, "Emergency Incident Triage & Response Report")
    
    # Report Meta info (Right side of header)
    c.setFont("Helvetica-Bold", 10)
    c.drawRightString(width - 40, height - 45, f"Report ID: {incident.get('id', 'N/A')}")
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 40, height - 65, f"Generated: {incident.get('created_at', 'Just Now')[:10]}")
    c.drawRightString(width - 40, height - 80, f"Priority: Level {incident.get('priority_score', 'N/A')}/4")

    # 2. Main content container coordinates
    y_pos = height - 140
    
    # Left Column: Incident Details
    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y_pos, "1. Incident Overview")
    y_pos -= 10
    c.setStrokeColor(border_color)
    c.setLineWidth(0.5)
    c.line(40, y_pos, width - 40, y_pos)
    
    y_pos -= 25
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y_pos, "Title:")
    c.setFont("Helvetica", 11)
    c.drawString(100, y_pos, incident.get("title", "Unnamed Incident"))
    
    y_pos -= 20
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y_pos, "Category:")
    c.setFont("Helvetica", 11)
    c.drawString(100, y_pos, incident.get("type", "General Emergency"))
    
    y_pos -= 20
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y_pos, "Location:")
    c.setFont("Helvetica", 11)
    c.drawString(100, y_pos, incident.get("location", "Unknown Location"))
    
    y_pos -= 20
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y_pos, "Reporter:")
    c.setFont("Helvetica", 11)
    c.drawString(100, y_pos, f"{incident.get('reporter_name', 'Anonymous')} ({incident.get('contact_number', 'N/A')})")

    # Severity Indicator Badge Box
    y_pos -= 35
    c.setFillColor(light_bg)
    c.roundRect(40, y_pos - 10, width - 80, 45, 6, fill=True, stroke=True)
    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(60, y_pos + 12, "AI Triaged Severity Level:")
    
    c.setFillColor(sev_color)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(210, y_pos + 11, f"{severity}")
    
    # Confidence Level
    c.setFillColor(muted_text)
    c.setFont("Helvetica", 10)
    conf = incident.get("confidence", 0.0)
    c.drawString(60, y_pos - 3, f"Analysis classification confidence: {int(conf * 100)}% based on description telemetry.")

    # 3. Description Block
    y_pos -= 45
    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y_pos, "2. Description of Incident")
    y_pos -= 10
    c.line(40, y_pos, width - 40, y_pos)
    
    y_pos -= 20
    c.setFillColor(muted_text)
    c.setFont("Helvetica", 10)
    
    # Simple line-wrap description
    desc = incident.get("description", "No description provided.")
    words = desc.split(' ')
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        # standard letter margin wrap width
        if len(' '.join(current_line)) > 90:
            current_line.pop()
            lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
        
    for line in lines[:6]:  # Limit lines to prevent overflow
        c.drawString(40, y_pos, line)
        y_pos -= 16

    # 4. First Aid Instructions
    y_pos -= 15
    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y_pos, "3. First Aid Instructions (Bystander Advice)")
    y_pos -= 10
    c.line(40, y_pos, width - 40, y_pos)
    
    y_pos -= 20
    c.setFont("Helvetica", 10)
    c.setFillColor(dark_text)
    
    first_aid_steps = []
    analysis_data = incident.get("analysis", {})
    if isinstance(analysis_data, dict):
        first_aid_steps = analysis_data.get("first_aid", [])
        
    if not first_aid_steps:
        first_aid_steps = [
            "Ensure the scene is safe before approaching.",
            "Call emergency services immediately (112/108).",
            "Keep the victim calm and warm.",
        ]
        
    for i, step in enumerate(first_aid_steps[:5]):
        c.setFont("Helvetica-Bold", 10)
        c.drawString(40, y_pos, f"Step {i+1}:")
        c.setFont("Helvetica", 10)
        c.drawString(90, y_pos, step)
        y_pos -= 18

    # 5. Required Emergency Services
    y_pos -= 15
    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y_pos, "4. Dispatched Services")
    y_pos -= 10
    c.line(40, y_pos, width - 40, y_pos)
    
    y_pos -= 20
    services = []
    if isinstance(analysis_data, dict):
        services = analysis_data.get("emergency_services", [])
        
    if not services:
        services = ["Ambulance (108)", "Police (100)"]
        
    c.setFont("Helvetica", 10)
    c.drawString(40, y_pos, f"Recommended responders: {', '.join(services)}")
    
    # Footer Notice
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(muted_text)
    c.drawCentredString(width / 2.0, 30, "Generated automatically by ResQ AI Crisis Triage Engine. Keep a copy for emergency coordinators.")
    
    c.showPage()
    c.save()
    
    buffer.seek(0)
    return buffer
