# app/services/entri_service.py
import logging
import requests
from app.core.config import settings
#===============================================================================================================================================================================================================================================
logger = logging.getLogger(__name__)
#===============================================================================================================================================================================================================================================
ENTRI_TOKEN_URL = "https://api.goentri.com/token"
#===============================================================================================================================================================================================================================================
def get_entri_token():
    try:
        response = requests.post(
            settings.ENTRI_TOKEN_URL,
            json={
                "applicationId": settings.ENTRI_APPLICATION_ID,
                "secret": settings.ENTRI_SECRET
            }
        )
        response.raise_for_status()
        return response.json()["auth_token"]
    except requests.RequestException as e:
        logger.error(f"Failed to obtain Entri token: {str(e)}")
        raise Exception(f"Failed to obtain Entri token: {str(e)}")
#===============================================================================================================================================================================================================================================
def get_entri_config(domain: str, email: str, callback_url: str):
    token = get_entri_token()
    return {
        "applicationId": settings.ENTRI_APPLICATION_ID,
        "token": token,
        "prefilledDomain": domain,
        "callbackUrl": callback_url,
        "dnsRecords": [
            {
                "type": "MX",
                "host": "@",
                "value": f"mail.{domain}",
                "priority": 10,
                "ttl": 3600
            },
            {
                "type": "TXT",
                "host": "@",
                "value": f"v=spf1 include:_spf.{domain} ~all",
                "ttl": 3600
            }
        ],
    }
#===============================================================================================================================================================================================================================================
def verify_dns_records(domain: str):
    logger.info(f"Verifying DNS records for domain: {domain}")
    return True
#===============================================================================================================================================================================================================================================