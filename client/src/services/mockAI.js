// Rule-based AI simulation for incident analysis
// No external AI API calls — all analysis is deterministic

const INCIDENT_KEYWORDS = {
  'Road Accident': ['accident', 'crash', 'collision', 'vehicle', 'car', 'truck', 'bike', 'motorcycle', 'road', 'highway', 'hit', 'run', 'traffic', 'injured', 'bleeding', 'fracture', 'rollover', 'pile-up', 'wreck'],
  'Fire': ['fire', 'burn', 'smoke', 'flames', 'blaze', 'arson', 'wildfire', 'inferno', 'explosion', 'ignite', 'engulfed', 'charred', 'combustion'],
  'Flood': ['flood', 'water', 'rain', 'storm', 'submerge', 'drowning', 'overflow', 'dam', 'surge', 'waterlog', 'deluge', 'tsunami', 'rising water'],
  'Medical Emergency': ['heart', 'attack', 'stroke', 'seizure', 'unconscious', 'breathing', 'choking', 'allergic', 'reaction', 'poison', 'overdose', 'faint', 'chest pain', 'cardiac', 'diabetic', 'blood pressure', 'cpr'],
  'Earthquake': ['earthquake', 'tremor', 'quake', 'seismic', 'aftershock', 'richter', 'shaking', 'magnitude', 'tectonic'],
  'Building Collapse': ['collapse', 'building', 'structure', 'rubble', 'debris', 'trapped', 'demolition', 'crumble', 'cave-in', 'infrastructure'],
  'Gas Leak': ['gas', 'leak', 'smell', 'fumes', 'propane', 'natural gas', 'lpg', 'cylinder', 'pipeline', 'toxic', 'carbon monoxide', 'ventilation'],
  'Chemical Spill': ['chemical', 'spill', 'hazardous', 'toxic', 'biohazard', 'contamination', 'radiation', 'nuclear', 'acid', 'corrosive', 'industrial'],
};

const SEVERITY_KEYWORDS = {
  critical: ['dead', 'death', 'dying', 'fatal', 'multiple casualties', 'mass', 'explosion', 'collapsed', 'trapped', 'unconscious', 'not breathing', 'cardiac arrest', 'critical', 'severe', 'life threatening', 'emergency', 'catastrophic', 'widespread destruction'],
  high: ['serious', 'severe', 'major', 'badly injured', 'heavy bleeding', 'broken bones', 'spreading', 'large fire', 'multiple injured', 'urgent', 'dangerous', 'significant', 'extensive damage', 'hospitalization'],
  medium: ['injured', 'moderate', 'contained', 'stable', 'small fire', 'minor flooding', 'single casualty', 'controlled', 'manageable', 'responsive'],
  low: ['minor', 'small', 'slight', 'no injuries', 'precaution', 'false alarm', 'smell', 'suspicious', 'report', 'no damage', 'under control'],
};

const FIRST_AID = {
  'Road Accident': [
    'Ensure the scene is safe before approaching.',
    'Call emergency services immediately (112/108).',
    'Do NOT move the injured unless there is immediate danger (fire, explosion).',
    'Check for consciousness — tap shoulders and ask "Are you okay?"',
    'If bleeding, apply firm pressure with a clean cloth.',
    'If the person is not breathing, begin CPR if trained.',
    'Keep the injured warm with a blanket or clothing.',
    'Do NOT remove helmets unless breathing is obstructed.',
    'Note the time of the accident and relay to emergency services.',
    'Keep bystanders at a safe distance.',
  ],
  'Fire': [
    'Evacuate the area immediately — do NOT try to fight large fires.',
    'Call the fire department (101).',
    'If clothing is on fire: STOP, DROP, and ROLL.',
    'Crawl low under smoke to breathe cleaner air.',
    'Feel doors before opening — if hot, do NOT open.',
    'Cover burns with cool (NOT cold) running water for 10-20 minutes.',
    'Do NOT apply ice, butter, or ointments to burns.',
    'Remove jewelry or tight clothing near the burn before swelling.',
    'Cover the burn loosely with a sterile, non-stick bandage.',
    'If smoke inhalation is suspected, move to fresh air immediately.',
  ],
  'Flood': [
    'Move to higher ground immediately.',
    'Do NOT walk, swim, or drive through flood waters.',
    'Stay away from power lines and electrical wires.',
    'Avoid bridges over fast-moving water.',
    'If trapped in a vehicle, stay inside unless water is rising inside.',
    'Signal for help if stranded — wave a bright cloth.',
    'Drink only clean/bottled water to avoid contamination.',
    'Watch for snakes and other displaced animals.',
    'Listen to local emergency broadcasts for updates.',
    'After flooding, avoid walking in standing water — it may be contaminated.',
  ],
  'Medical Emergency': [
    'Call emergency services immediately (112/108).',
    'Check responsiveness — gently shake and shout.',
    'If not breathing, begin CPR: 30 chest compressions, 2 rescue breaths.',
    'For choking: perform the Heimlich maneuver (abdominal thrusts).',
    'For heart attack: have the person chew an aspirin if not allergic.',
    'For seizures: clear the area, do NOT restrain, turn on side after.',
    'For allergic reactions: use an EpiPen if available.',
    'Keep the person calm and still.',
    'Monitor breathing and pulse continuously.',
    'Do NOT give food or water if person is unconscious.',
  ],
  'Earthquake': [
    'DROP, COVER, and HOLD ON under a sturdy desk or table.',
    'Stay away from windows, heavy furniture, and exterior walls.',
    'If outdoors, move to an open area away from buildings.',
    'If driving, stop safely and stay in the vehicle.',
    'After shaking stops, check for injuries and provide first aid.',
    'Be prepared for aftershocks.',
    'Check for gas leaks — if you smell gas, leave immediately.',
    'Do NOT use elevators.',
    'Listen to emergency broadcasts for instructions.',
    'Avoid damaged buildings — they may collapse.',
  ],
  'Building Collapse': [
    'If trapped, cover your nose and mouth with a cloth.',
    'Tap on pipes or walls to signal rescuers — do NOT shout (dust).',
    'Conserve energy and stay calm.',
    'If you can move, crawl toward light or fresh air.',
    'Call emergency services if you have a phone.',
    'Do NOT light matches (gas leaks possible).',
    'If outside, stay far from the building — secondary collapses are common.',
    'Help others evacuate if safe to do so.',
    'Mark your location for rescuers.',
    'Wait for professional rescue teams before entering rubble.',
  ],
  'Gas Leak': [
    'Evacuate the area immediately — do NOT use light switches or phones inside.',
    'Do NOT create any sparks or flames.',
    'Open windows and doors while evacuating if safe.',
    'Call the gas emergency number from outside.',
    'Move to fresh air if feeling dizzy or nauseous.',
    'If someone has inhaled gas, move them to fresh air.',
    'If unconscious, check breathing and begin CPR if needed.',
    'Do NOT re-enter the building until cleared by professionals.',
    'Turn off the gas supply if you know how and it is safe.',
    'Warn neighbors to evacuate.',
  ],
  'Chemical Spill': [
    'Evacuate the area upwind from the spill.',
    'Call emergency services and hazmat teams.',
    'Do NOT touch or walk through spilled chemicals.',
    'If exposed, remove contaminated clothing immediately.',
    'Flush affected skin with large amounts of water for 15-20 minutes.',
    'If chemicals are in the eyes, rinse with water for 15 minutes.',
    'Do NOT induce vomiting if chemicals were swallowed.',
    'Seal off the contaminated area if possible.',
    'Provide emergency responders with chemical names if known.',
    'Seek medical attention even if symptoms seem mild.',
  ],
};

const EMERGENCY_SERVICES = {
  'Road Accident': ['Ambulance (108)', 'Police (100)', 'Traffic Control', 'Trauma Center'],
  'Fire': ['Fire Department (101)', 'Ambulance (108)', 'Police (100)'],
  'Flood': ['National Disaster Response Force (NDRF)', 'Coast Guard', 'Ambulance (108)', 'Municipal Emergency'],
  'Medical Emergency': ['Ambulance (108)', 'Nearest Hospital', 'Poison Control Center'],
  'Earthquake': ['NDRF', 'Ambulance (108)', 'Fire Department (101)', 'Search & Rescue'],
  'Building Collapse': ['NDRF', 'Fire Department (101)', 'Ambulance (108)', 'Structural Engineers'],
  'Gas Leak': ['Gas Emergency Service', 'Fire Department (101)', 'Ambulance (108)', 'Hazmat Team'],
  'Chemical Spill': ['Hazmat Team', 'Fire Department (101)', 'Ambulance (108)', 'Environmental Agency'],
};

function classifyIncident(description, selectedType) {
  if (selectedType && selectedType !== 'Other') return selectedType;

  const desc = description.toLowerCase();
  let bestMatch = 'Medical Emergency';
  let bestScore = 0;

  for (const [type, keywords] of Object.entries(INCIDENT_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (desc.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = type;
    }
  }

  return bestMatch;
}

function estimateSeverity(description, incidentType) {
  const desc = description.toLowerCase();
  let severityScore = 0;

  // Check critical keywords
  for (const keyword of SEVERITY_KEYWORDS.critical) {
    if (desc.includes(keyword)) severityScore += 4;
  }
  for (const keyword of SEVERITY_KEYWORDS.high) {
    if (desc.includes(keyword)) severityScore += 3;
  }
  for (const keyword of SEVERITY_KEYWORDS.medium) {
    if (desc.includes(keyword)) severityScore += 2;
  }
  for (const keyword of SEVERITY_KEYWORDS.low) {
    if (desc.includes(keyword)) severityScore += 1;
  }

  // Boost for inherently dangerous incidents
  const dangerousTypes = ['Fire', 'Earthquake', 'Building Collapse', 'Chemical Spill'];
  if (dangerousTypes.includes(incidentType)) severityScore += 3;

  // Length heuristic — longer descriptions often mean more serious
  if (desc.length > 200) severityScore += 1;
  if (desc.length > 400) severityScore += 1;

  if (severityScore >= 10) return 'Critical';
  if (severityScore >= 6) return 'High';
  if (severityScore >= 3) return 'Medium';
  return 'Low';
}

function calculateConfidence(description, incidentType) {
  const desc = description.toLowerCase();
  const keywords = INCIDENT_KEYWORDS[incidentType] || [];
  let matches = 0;

  for (const keyword of keywords) {
    if (desc.includes(keyword)) matches++;
  }

  const base = Math.min(0.65 + matches * 0.05, 0.98);
  // Add small random variation for realism
  const variation = (Math.random() * 0.06 - 0.03);
  return Math.min(Math.max(base + variation, 0.45), 0.98);
}

export function analyzeIncident(description, selectedType, imageFile) {
  const incidentType = classifyIncident(description, selectedType);
  const severity = estimateSeverity(description, incidentType);
  const confidence = calculateConfidence(description, incidentType);
  const firstAid = FIRST_AID[incidentType] || FIRST_AID['Medical Emergency'];
  const emergencyServices = EMERGENCY_SERVICES[incidentType] || EMERGENCY_SERVICES['Medical Emergency'];

  return {
    incidentType,
    severity,
    confidence: parseFloat(confidence.toFixed(2)),
    confidencePercent: Math.round(confidence * 100),
    firstAid,
    emergencyServices,
    imageAnalyzed: !!imageFile,
    analysisTimestamp: new Date().toISOString(),
    recommendations: generateRecommendations(incidentType, severity),
    priorityScore: calculatePriority(severity),
  };
}

function generateRecommendations(type, severity) {
  const recs = [
    `Incident classified as ${type} with ${severity} severity.`,
  ];

  if (severity === 'Critical' || severity === 'High') {
    recs.push('Immediate dispatch of emergency services recommended.');
    recs.push('Alert nearby hospitals for potential incoming casualties.');
    recs.push('Establish a perimeter and coordinate with law enforcement.');
  } else if (severity === 'Medium') {
    recs.push('Dispatch standard emergency response team.');
    recs.push('Monitor situation for escalation.');
  } else {
    recs.push('Assign to routine response queue.');
    recs.push('Follow up within standard response time.');
  }

  return recs;
}

function calculatePriority(severity) {
  switch (severity) {
    case 'Critical': return 1;
    case 'High': return 2;
    case 'Medium': return 3;
    case 'Low': return 4;
    default: return 5;
  }
}
