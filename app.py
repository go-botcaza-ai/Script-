"""
NeuraforgeAI & Botcaza - Production Python Web Service & Worker
Compatible con Render.com (gunicorn app:app)
"""

import os
import sys
import json
import time
import requests
from flask import Flask, jsonify, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

APTOS_NODE_URL = os.getenv("APTOS_NODE_URL", "https://fullnode.mainnet.aptoslabs.com/v1")
PUBLISHER_ID = os.getenv("ADSENSE_PUBLISHER_ID", "pub-9493850506792206")
GA4_ID = os.getenv("GA4_MEASUREMENT_ID", "G-24Q6GBQN75")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "status": "online",
        "service": "NeuraforgeAI & Botcaza Python API",
        "platform": "Render.com",
        "aptos_network": "Aptos Mainnet",
        "telegram_miniapp_url": "https://go.botcaza.ai",
        "timestamp": time.time()
    })

@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "uptime": time.time(),
        "environment": os.getenv("RENDER_ENV", "production")
    })

@app.route("/api/aptos/ledger", methods=["GET"])
def aptos_ledger():
    try:
        res = requests.get(f"{APTOS_NODE_URL}/", timeout=8)
        if res.status_code == 200:
            return jsonify({"success": True, "network": "mainnet", "data": res.json()})
        return jsonify({"success": False, "error": f"Aptos node returned {res.status_code}"}), 502
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/telegram/status", methods=["GET"])
def telegram_status():
    has_token = bool(TELEGRAM_BOT_TOKEN)
    return jsonify({
        "success": True,
        "bot_configured": has_token,
        "mini_app_url": "https://go.botcaza.ai",
        "webhook_url": "https://go.botcaza.ai/api/telegram/webhook"
    })

@app.route("/api/telegram/webhook", methods=["POST"])
def telegram_webhook():
    update = request.get_json(silent=True) or {}
    message = update.get("message", {})
    text = message.get("text", "")
    chat = message.get("chat", {})
    chat_id = chat.get("id")

    if not chat_id:
        return jsonify({"ok": True, "notice": "No chat ID provided"})

    reply_text = "🤖 *Botcaza & Neuraforge AI Mini App*\n\n¡Bienvenido al ecosistema Web3 en Telegram!\nAccede a tu wallet, consulta ballenas en Aptos y monetiza tráfico."
    
    # If a bot token is provided, reply back to Telegram
    if TELEGRAM_BOT_TOKEN:
        try:
            tg_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": reply_text,
                "parse_mode": "Markdown",
                "reply_markup": {
                    "inline_keyboard": [
                        [
                            {
                                "text": "🚀 Abrir Botcaza Mini App",
                                "web_app": {"url": "https://go.botcaza.ai"}
                            }
                        ],
                        [
                            {
                                "text": "💳 Mi Wallet",
                                "web_app": {"url": "https://go.botcaza.ai?tab=wallet-gateway"}
                            },
                            {
                                "text": "🐋 Alertas Aptos",
                                "web_app": {"url": "https://go.botcaza.ai?tab=data-agent"}
                            }
                        ]
                    ]
                }
            }
            requests.post(tg_url, json=payload, timeout=5)
        except Exception as err:
            print(f"[Telegram Webhook Error] {err}")

    return jsonify({"ok": True, "chat_id": chat_id, "received_text": text})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)
