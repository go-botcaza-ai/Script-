"""
NeuraforgeAI & Botcaza - Aptos On-Chain & BigQuery Python Worker
Compatible con Render.com (Python Web Service o Background Worker)
"""

import os
import sys
import json
import time
import requests
from dotenv import load_dotenv

load_dotenv()

APTOS_NODE_URL = os.getenv("APTOS_NODE_URL", "https://fullnode.mainnet.aptoslabs.com/v1")
PUBLISHER_ID = "pub-9493850506792206"
GA4_ID = "G-24Q6GBQN75"

def get_latest_aptos_ledger():
    """Consulta la información del ledger de Aptos Mainnet"""
    try:
        response = requests.get(APTOS_NODE_URL, timeout=10)
        if response.status_code == 200:
            return response.json()
        return {"error": f"HTTP {response.status_code}", "body": response.text}
    except Exception as e:
        return {"error": str(e)}

def query_sample_whale_activity():
    """Ejemplo de monitoreo de bloques on-chain"""
    ledger = get_latest_aptos_ledger()
    chain_id = ledger.get("chain_id", 1)
    ledger_version = ledger.get("ledger_version", "0")
    block_height = ledger.get("block_height", "0")
    
    print(f"[NeuraforgeAI Python Worker] Aptos Chain ID: {chain_id} | Block: {block_height} | Version: {ledger_version}")
    return {
        "network": "Aptos Mainnet",
        "block_height": block_height,
        "ledger_version": ledger_version,
        "publisher_id": PUBLISHER_ID,
        "ga4_measurement_id": GA4_ID,
        "timestamp": time.time()
    }

if __name__ == "__main__":
    print(f"Iniciando Worker de NeuraforgeAI en Render.com...")
    data = query_sample_whale_activity()
    print("Métricas iniciales:", json.dumps(data, indent=2))
