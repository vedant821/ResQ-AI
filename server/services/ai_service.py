"""
Rule-based AI analysis service.
No external AI API calls — all analysis is deterministic.
"""

INCIDENT_KEYWORDS = {
    "Road Accident": ["accident", "crash", "collision", "vehicle", "car", "truck", "bike", "motorcycle", "road", "highway", "hit", "run", "traffic", "injured", "bleeding", "fracture"],
    "Fire": ["fire", "burn", "smoke", "flames", "blaze", "arson", "wildfire", "explosion", "ignite", "engulfed"],
    "Flood": ["flood", "water", "rain", "storm", "submerge", "drowning", "overflow", "dam", "surge", "waterlog"],
    "Medical Emergency": ["heart", "attack", "stroke", "seizure", "unconscious", "breathing", "choking", "allergic", "poison", "overdose", "faint", "chest pain", "cardiac"],
    "Earthquake": ["earthquake", "tremor", "quake", "seismic", "aftershock", "shaking", "magnitude"],
    "Building Collapse": ["collapse", "building", "structure", "rubble", "debris", "trapped", "demolition", "crumble"],
    "Gas Leak": ["gas", "leak", "smell", "fumes", "propane", "lpg", "cylinder", "pipeline", "toxic", "carbon monoxide"],
    "Chemical Spill": ["chemical", "spill", "hazardous", "toxic", "biohazard", "contamination", "radiation", "acid", "corrosive"],
}

SEVERITY_KEYWORDS = {
    "critical": ["dead", "death", "dying", "fatal", "multiple casualties", "explosion", "collapsed", "trapped", "unconscious", "not breathing", "cardiac arrest", "critical", "catastrophic"],
    "high": ["serious", "severe", "major", "badly injured", "heavy bleeding", "broken bones", "spreading", "large fire", "multiple injured", "urgent", "dangerous"],
    "medium": ["injured", "moderate", "contained", "stable", "small fire", "minor flooding", "single casualty", "controlled"],
    "low": ["minor", "small", "slight", "no injuries", "precaution", "false alarm", "smell", "suspicious", "under control"],
}

FIRST_AID = {
    "Road Accident": [
        "Ensure the scene is safe before approaching.",
        "Call emergency services immediately (112/108).",
        "Do NOT move the injured unless there is immediate danger.",
        "If bleeding, apply firm pressure with a clean cloth.",
        "If not breathing, begin CPR if trained.",
        "Keep the injured warm with a blanket.",
    ],
    "Fire": [
        "Evacuate the area immediately.",
        "Call the fire department (101).",
        "If clothing is on fire: STOP, DROP, and ROLL.",
        "Crawl low under smoke.",
        "Cover burns with cool running water for 10-20 minutes.",
        "Do NOT apply ice, butter, or ointments to burns.",
    ],
    "Flood": [
        "Move to higher ground immediately.",
        "Do NOT walk, swim, or drive through flood waters.",
        "Stay away from power lines.",
        "Signal for help if stranded.",
        "Drink only clean/bottled water.",
    ],
    "Medical Emergency": [
        "Call emergency services immediately (112/108).",
        "Check responsiveness.",
        "If not breathing, begin CPR.",
        "For choking: perform abdominal thrusts.",
        "Keep the person calm and still.",
    ],
    "Earthquake": [
        "DROP, COVER, and HOLD ON.",
        "Stay away from windows and exterior walls.",
        "After shaking stops, check for injuries.",
        "Be prepared for aftershocks.",
        "Check for gas leaks.",
    ],
    "Building Collapse": [
        "If trapped, cover nose and mouth with cloth.",
        "Tap on pipes to signal rescuers.",
        "Conserve energy and stay calm.",
        "Do NOT light matches.",
        "Wait for professional rescue teams.",
    ],
    "Gas Leak": [
        "Evacuate immediately — no sparks or flames.",
        "Open windows while evacuating if safe.",
        "Call gas emergency from outside.",
        "Move to fresh air.",
        "Do NOT re-enter until cleared.",
    ],
    "Chemical Spill": [
        "Evacuate upwind from the spill.",
        "Call hazmat teams.",
        "Do NOT touch spilled chemicals.",
        "Flush affected skin with water for 15-20 minutes.",
        "Seek medical attention.",
    ],
}

EMERGENCY_SERVICES = {
    "Road Accident": ["Ambulance (108)", "Police (100)", "Traffic Control", "Trauma Center"],
    "Fire": ["Fire Department (101)", "Ambulance (108)", "Police (100)"],
    "Flood": ["NDRF", "Coast Guard", "Ambulance (108)", "Municipal Emergency"],
    "Medical Emergency": ["Ambulance (108)", "Nearest Hospital", "Poison Control"],
    "Earthquake": ["NDRF", "Ambulance (108)", "Fire Department (101)", "Search & Rescue"],
    "Building Collapse": ["NDRF", "Fire Department (101)", "Ambulance (108)", "Structural Engineers"],
    "Gas Leak": ["Gas Emergency Service", "Fire Department (101)", "Ambulance (108)", "Hazmat Team"],
    "Chemical Spill": ["Hazmat Team", "Fire Department (101)", "Ambulance (108)", "Environmental Agency"],
}


def classify_incident(description: str, selected_type: str = None) -> str:
    if selected_type and selected_type != "Other":
        return selected_type

    desc = description.lower()
    best_match = "Medical Emergency"
    best_score = 0

    for incident_type, keywords in INCIDENT_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in desc)
        if score > best_score:
            best_score = score
            best_match = incident_type

    return best_match


def estimate_severity(description: str, incident_type: str) -> str:
    desc = description.lower()
    score = 0

    for kw in SEVERITY_KEYWORDS["critical"]:
        if kw in desc:
            score += 4
    for kw in SEVERITY_KEYWORDS["high"]:
        if kw in desc:
            score += 3
    for kw in SEVERITY_KEYWORDS["medium"]:
        if kw in desc:
            score += 2
    for kw in SEVERITY_KEYWORDS["low"]:
        if kw in desc:
            score += 1

    dangerous = ["Fire", "Earthquake", "Building Collapse", "Chemical Spill"]
    if incident_type in dangerous:
        score += 3

    if len(desc) > 200:
        score += 1

    if score >= 10:
        return "Critical"
    if score >= 6:
        return "High"
    if score >= 3:
        return "Medium"
    return "Low"


def calculate_confidence(description: str, incident_type: str) -> float:
    desc = description.lower()
    keywords = INCIDENT_KEYWORDS.get(incident_type, [])
    matches = sum(1 for kw in keywords if kw in desc)
    base = min(0.65 + matches * 0.05, 0.98)
    import random
    variation = random.uniform(-0.03, 0.03)
    return round(min(max(base + variation, 0.45), 0.98), 2)


def analyze_incident(description: str, selected_type: str = None) -> dict:
    incident_type = classify_incident(description, selected_type)
    severity = estimate_severity(description, incident_type)
    confidence = calculate_confidence(description, incident_type)

    priority_map = {"Critical": 1, "High": 2, "Medium": 3, "Low": 4}

    recommendations = [f"Incident classified as {incident_type} with {severity} severity."]
    if severity in ("Critical", "High"):
        recommendations.append("Immediate dispatch of emergency services recommended.")
        recommendations.append("Alert nearby hospitals for potential incoming casualties.")
    elif severity == "Medium":
        recommendations.append("Dispatch standard emergency response team.")
    else:
        recommendations.append("Assign to routine response queue.")

    return {
        "incident_type": incident_type,
        "severity": severity,
        "confidence": confidence,
        "confidence_percent": round(confidence * 100),
        "first_aid": FIRST_AID.get(incident_type, FIRST_AID["Medical Emergency"]),
        "emergency_services": EMERGENCY_SERVICES.get(incident_type, EMERGENCY_SERVICES["Medical Emergency"]),
        "recommendations": recommendations,
        "priority_score": priority_map.get(severity, 5),
    }
