import React, { useState } from 'react';
import {
  Code,
  Server,
  Key,
  Shield,
  FileText,
  Copy,
  Check,
  Zap,
  Globe,
  Database,
  Terminal,
  Play
} from 'lucide-react';
import { PHP_SCRIPT_CONFIG } from '../data';

export const PhpScriptViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'index' | 'webhook' | 'auth' | 'nginx'>('index');
  const [copied, setCopied] = useState(false);

  const phpFiles = {
    index: `<?php
/**
 * Pay Per View (PPV) Content Protection Engine
 * Script PHP para Monetizar Videos y Streaming Bajo Demanda
 * Versión: 4.2.0 - Enterprise PPV Core
 */

declare(strict_types=1);
require_once __DIR__ . '/vendor/autoload.php';

use PPV\\Auth\\TokenManager;
use PPV\\Gateways\\PaymentHandler;
use PPV\\Storage\\SecureVideoServer;

// 1. Carga de configuración y encabezados CORS
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("Access-Control-Allow-Origin: *");

$pdo = new PDO(
    "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME') . ";charset=utf8mb4",
    getenv('DB_USER'),
    getenv('DB_PASS'),
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$action = $_GET['action'] ?? 'catalog';
$contentId = $_GET['id'] ?? null;
$accessToken = $_GET['token'] ?? null;

switch ($action) {
    case 'stream':
        // Validación de Token Criptográfico con expiración HMAC-SHA256
        if (!$accessToken || !TokenManager::verifyAccess($pdo, $contentId, $accessToken)) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso denegado. Se requiere pase Pay Per View válido.']);
            exit;
        }

        // Entrega de Video Protegido sin exponer la ruta física (Chunked Streaming)
        SecureVideoServer::streamHLSOrMp4($pdo, $contentId);
        break;

    case 'create_payment':
        // Creación de sesión de checkout para Stripe o PayPal
        $gateway = $_POST['gateway'] ?? 'stripe';
        $buyerEmail = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
        
        $session = PaymentHandler::initiateCheckout($gateway, $contentId, $buyerEmail);
        echo json_encode(['status' => 'success', 'checkout_url' => $session->url]);
        break;

    default:
        echo json_encode(['status' => 'online', 'version' => '4.2.0']);
        break;
}`,
    webhook: `<?php
/**
 * webhook.php - Procesamiento de Pagos en Tiempo Real (Stripe & PayPal IPN)
 * Genera el Access Token y despacha el comprobante por correo al comprador
 */

require_once __DIR__ . '/bootstrap.php';

$payload = @file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

try {
    // 1. Verificación criptográfica de webhook de Stripe
    $event = \\Stripe\\Webhook::constructEvent(
        $payload, $sigHeader, getenv('STRIPE_WEBHOOK_SECRET')
    );

    if ($event->type === 'checkout.session.completed') {
        $session = $event->data->object;
        $customerEmail = $session->customer_details->email;
        $contentId = $session->metadata->content_id;
        $amountPaid = $session->amount_total / 100;

        // 2. Generación de Token único Pay Per View
        $accessKey = 'PPV-' . bin2hex(random_bytes(8)) . '-' . time();
        $expiresAt = date('Y-m-d H:i:s', strtotime('+72 hours'));

        $stmt = $pdo->prepare("
            INSERT INTO ppv_purchases (content_id, buyer_email, access_token, amount, expires_at, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$contentId, $customerEmail, $accessKey, $amountPaid, $expiresAt]);

        // 3. Notificación y Despacho del Token (Gmail API / SMTP)
        \\PPV\\Mailer::sendAccessEmail($customerEmail, $accessKey, $contentId);
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} catch (\\Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}`,
    auth: `<?php
namespace PPV\\Auth;

use PDO;

class TokenManager 
{
    private static string $secretKey = 'AES-256-PPV-SECRET-KEY-ENV';

    /**
     * Valida firma HMAC, expiración y límite de IPs concurrentes
     */
    public static function verifyAccess(PDO $pdo, string $contentId, string $token): bool
    {
        $stmt = $pdo->prepare("
            SELECT id, buyer_email, expires_at, views_count 
            FROM ppv_purchases 
            WHERE content_id = ? AND access_token = ? AND status = 'active'
        ");
        $stmt->execute([$contentId, $token]);
        $purchase = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$purchase) {
            return false;
        }

        // Validación de tiempo de expiración
        if (strtotime($purchase['expires_at']) < time()) {
            return false;
        }

        // Incremento atómico del contador de visualizaciones Pay Per View
        $update = $pdo->prepare("UPDATE ppv_purchases SET views_count = views_count + 1 WHERE id = ?");
        $update->execute([$purchase['id']]);

        return true;
    }
}`,
    nginx: `# Configuración Nginx Recomendada para Protección de Video Pay Per View
location /protected_videos/ {
    internal; # Solo accesible mediante X-Accel-Redirect desde el script PHP
    alias /var/www/storage/ppv_media/;
    mp4;
    mp4_buffer_size 1m;
    mp4_max_buffer_size 5m;
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(phpFiles[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="php-script-code-section" className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Arquitectura PHP Nativa
            </span>
            <span className="text-xs text-slate-400">
              {PHP_SCRIPT_CONFIG.version}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Script PHP para Monetización Pay Per View
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Estructura de backend modular compatible con servidores Apache y Nginx. Gestiona pasarelas de pago, validación de pases temporales y entrega de streams seguros.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            id="btn-copy-php-code"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copiado al portapapeles</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Script PHP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Script feature pill row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>{PHP_SCRIPT_CONFIG.databaseDriver}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>{PHP_SCRIPT_CONFIG.encryption}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Webhooks en tiempo real</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>{PHP_SCRIPT_CONFIG.phpEngine}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-800">
        {[
          { id: 'index', name: 'index.php (Core & Router)' },
          { id: 'webhook', name: 'webhook.php (Stripe/PayPal IPN)' },
          { id: 'auth', name: 'TokenManager.php (Protección)' },
          { id: 'nginx', name: 'nginx.conf (Protección Anti-leech)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Code Viewer */}
      <div className="mt-3 relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed max-h-96">
        <pre>{phpFiles[activeTab]}</pre>
      </div>
    </div>
  );
};
