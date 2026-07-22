import os

def send_dispatch_sms(incident: dict, dispatched_units: list):
    """
    Sends an SMS alert using Twilio to notify active-duty responders.
    Falls back to console log printing if Twilio environment variables are missing.
    """
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")
    
    # We can default to the reporter's number or a designated responder phone number in .env
    to_number = os.getenv("RESPONDER_PHONE_NUMBER") or incident.get("contact_number")
    
    incident_id = incident.get("id", "Unknown ID")
    location = incident.get("location", "Unknown Location")
    title = incident.get("title", "Emergency Alert")
    severity = incident.get("severity", "Medium")
    
    message_body = (
        f"🚨 [ResQ AI AUTONOMOUS DISPATCH]\n"
        f"Incident: #{incident_id} ({title})\n"
        f"Severity: {severity}\n"
        f"Location: {location}\n"
        f"Units Dispatched: {', '.join(dispatched_units)}\n"
        f"GPRS route locked. Move immediately."
    )
    
    # Check if Twilio client can be initialized
    if not all([account_sid, auth_token, from_number]) or not to_number:
        print(f"\n[TWILIO SMS GATEWAY MOCK]")
        print(f"Twilio credentials not fully set in .env. Mocking SMS dispatch to {to_number or 'N/A'}.")
        print(f"Message Content:\n{message_body}")
        print(f"=====================================\n")
        return False

    try:
        from twilio.rest import Client
        client = Client(account_sid, auth_token)
        
        # Send SMS
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
        
        print(f"Twilio SMS alert sent successfully to {to_number} (SID: {message.sid}) for Incident #{incident_id}")
        return True
    except Exception as e:
        print(f"Error sending SMS via Twilio REST API: {e}")
        # Return fallback status
        return False
