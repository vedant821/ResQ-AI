ResQ AI

ResQ AI is an emergency incident reporting and management system developed to help citizens report emergencies quickly and assist administrators in managing incidents through a centralized dashboard.

The main goal of this project is to simplify emergency reporting by allowing users to submit incident details, upload images, and receive AI-assisted analysis. The system helps organize emergency reports so that administrators can review, prioritize, and update incident status efficiently.

Project Objective

The objective of this project is to reduce the time required to collect and organize emergency information. It provides a structured platform where emergency reports can be submitted, analyzed, and managed from a single dashboard.

Key Features

For Citizens

• User Registration and Login
• Report Emergency Incidents
• Upload Incident Images
• Add Incident Description
• View Submitted Reports
• Track Report Status
• Receive AI-generated Analysis
• View First Aid Suggestions

For Administrators

• Secure Admin Login
• View All Emergency Reports
• Search and Filter Incidents
• Update Incident Status
• Dashboard with Statistics
• Monitor Recent Activities
• View Incident Details

AI Features

• Detect Emergency Category
• Estimate Incident Severity
• Generate First Aid Instructions
• Create Emergency Summary
• Recommend Required Emergency Services

Technology Used

Frontend

React
Vite
Tailwind CSS
Framer Motion
Lucide React

Backend

FastAPI
Python

Database

Supabase

Authentication

Clerk Authentication

Charts

Recharts

Deployment

Frontend - Vercel

Backend - Railway

Project Structure

client

components

pages

services

hooks

context

assets

server

routes

controllers

models

services

database

middleware

Installation

Clone the repository.

Install frontend dependencies.

cd client

npm install

npm run dev

Install backend dependencies.

cd server

pip install -r requirements.txt

uvicorn main:app --reload

Project Workflow

Citizen logs into the application.

↓

Reports an emergency.

↓

Uploads an image and enters incident details.

↓

AI analyzes the incident.

↓

The system generates emergency recommendations.

↓

The report is stored in the database.

↓

The administrator reviews the report.

↓

Status is updated.

↓

Citizen can track the report status.

Emergency Categories

Road Accident

Fire

Flood

Medical Emergency

Building Collapse

Gas Leak

Earthquake

Chemical Spill

Severity Levels

Critical

High

Medium

Low

Current Limitations

The project currently depends on an internet connection.

Location tracking is limited.

Emergency dispatch is simulated for demonstration purposes.

Future Improvements

Real-time ambulance tracking

Hospital availability integration

Emergency SMS alerts

Offline emergency reporting

Government emergency service integration

Voice-based emergency reporting

Screenshots

Home Page

Citizen Dashboard

Emergency Report Page

AI Analysis Page

Admin Dashboard

Challenges During Development

Creating a clean and responsive user interface.

Managing emergency report workflow.

Integrating AI analysis into the reporting process.

Displaying dashboard analytics efficiently.

Handling image uploads securely.

Author

Vedant Khade

Thank you for visiting this project.
