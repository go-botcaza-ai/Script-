# NeuraforgeAI & Botcaza &bull; Aptos AI Data Agent & Monetization Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![Blockchain: Aptos](https://img.shields.io/badge/Blockchain-Aptos%20Mainnet-00ff9d.svg)](https://aptosfoundation.org/)
[![Google Data Agent](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-4285F4.svg)](https://ai.google.dev/)
[![AdSense Verified](https://img.shields.io/badge/AdSense-pub--9493850506792206-34A853.svg)](https://go.botcaza.ai/ads.txt)
[![GA4 Tracking](https://img.shields.io/badge/GA4-G--24Q6GBQN75-FBBC05.svg)](https://analytics.google.com/)

Plataforma integral de inteligencia artificial on-chain, análisis de datos en tiempo real de la blockchain **Aptos**, estudio de consultas **Google BigQuery**, monetización con **Google AdSense** y scripts de autoservicio de noticias y clima.

- **URL de Producción:** [https://go.botcaza.ai](https://go.botcaza.ai)
- **Email de Contacto:** [go.botcaza.ai@gmail.com](mailto:go.botcaza.ai@gmail.com)
- **ID de Editor Google AdSense:** `pub-9493850506792206`
- **ID de Medición GA4:** `G-24Q6GBQN75`

---

## ⚙️ Variables de Entorno (Environment Variables)

Configura las siguientes variables en tu panel de Render.com o en tu archivo `.env` local (copiado desde `.env.example`):

### 🔴 Variables Críticas / Requeridas
| Variable | Tipo | Descripción | Ejemplo / Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Requerida | Clave de API de Google Gemini para el Agente AI y Diagnósticos. | `AIzaSy...` ([Google AI Studio](https://aistudio.google.com/app/apikey)) |
| `PORT` | Requerida | Puerto TCP donde escucha el servidor web (asignado por Render/Cloud Run). | `3000` |
| `NODE_ENV` | Requerida | Entorno de ejecución (`production` o `development`). | `production` |

### 🟢 Variables Opcionales (Con Valores por Defecto Seguros)
| Variable | Tipo | Descripción | Default |
| :--- | :--- | :--- | :--- |
| `APTOS_NODE_URL` | Opcional | URL del Fullnode oficial de Aptos Mainnet. | `https://fullnode.mainnet.aptoslabs.com/v1` |
| `APP_URL` | Opcional | URL canónica pública para Webhook de Telegram y CORS. | `https://go.botcaza.ai` |
| `ADSENSE_PUBLISHER_ID` | Opcional | ID de editor AdSense para CPC y ads.txt. | `pub-9493850506792206` |
| `GA4_MEASUREMENT_ID` | Opcional | ID de medición de Google Analytics 4. | `G-24Q6GBQN75` |
| `TELEGRAM_BOT_TOKEN` | Opcional | Token de @BotFather para alertas automáticas y webhook del bot. | `123456:ABC...` |
| `META_ACCESS_TOKEN` | Opcional | Token Graph API para WhatsApp Cloud API y Conversions API. | `EAAG...` |
| `META_PHONE_NUMBER_ID` | Opcional | ID del número telefónico de WhatsApp Cloud API. | `1029384756` |
| `META_PIXEL_ID` | Opcional | ID del Píxel de Meta Ads para eventos server-side (CAPI). | `987654321` |

---

## 🧪 Pruebas Automatizadas (Testing)

El proyecto cuenta con una suite completa de pruebas unitarias automatizadas con **Vitest**:

```bash
# Ejecutar todas las pruebas una vez
npm test

# Ejecutar pruebas en modo observador (watch)
npm run test:watch
```

Las pruebas validan:
1. **Validación de Variables de Entorno (`envValidation.test.ts`):** Comprueba modos producción vs desarrollo, valores por defecto y detección de servicios.
2. **Seguridad del Servidor & Rate Limiting (`serverSecurity.test.ts`):** Comprueba cabeceras HTTP de seguridad (CSP, nosniff, CORS) y bloqueo por rate limit (HTTP 429).
3. **Criptografía & Formato Aptos (`aptosWallet.test.ts`):** Valida direcciones hexadecimales `0x`, conversión de Octas a APT y enlaces al explorador.
4. **Telegram Mini App SDK (`telegramMiniApp.test.ts`):** Comprueba detección de entorno Telegram y lectura de datos de usuario.

---

## 🚀 Despliegue en Producción (Render.com Paso a Paso)

El repositorio incluye `render.yaml` pre-configurado para desplegar con cero fricción:

### Opción A: Despliegue de la Plataforma Web Completa (Recomendado)
1. Inicia sesión en [Render.com](https://dashboard.render.com).
2. Haz clic en **New +** &rarr; **Web Service**.
3. Conecta tu repositorio de GitHub.
4. Configura los siguientes campos:
   - **Name:** `neuraforge-botcaza-web`
   - **Environment:** `Node`
   - **Region:** Elige la más cercana a tu audiencia (ej. `Frankfurt` o `Ohio`).
   - **Branch:** `main` (o `master`)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. En la sección **Environment Variables**, añade al menos:
   - `GEMINI_API_KEY`: tu clave de API.
   - `NODE_ENV`: `production`
6. Haz clic en **Create Web Service**.

### Opción B: Despliegue de la API Python Opcional (FastAPI / Gunicorn)
Si creaste un servicio con entorno **Python 3**:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
*(Tanto `gunicorn` como `app.py` ya están integrados en el código).*

---

## 🔍 Monitoreo, Logs y Diagnóstico en Vivo

### Endpoints de Salud y Diagnóstico
* `GET /api/health` &rarr; Devuelve estado básico (`healthy`), uptime del proceso y timestamp.
* `GET /api/health/ready` &rarr; Auditoría en tiempo real de preparación para producción: valida variables de entorno, servicios configurados y emite advertencias estructuradas.
* `GET /api/telegram/status` &rarr; Estado de la integración con Telegram Mini App y bot.

### Registro Centralizado (Structured Logging)
El servidor utiliza logging estructurado con marcas de tiempo ISO y niveles de severidad (`[INFO]`, `[WARN]`, `[ERROR]`):
```bash
# Ver logs en vivo en Render.com
render logs -s neuraforge-botcaza-web --tail
```

### Procedimiento de Rollback Inmediato
Si un despliegue presenta inconvenientes en producción:
1. **En Render.com:** Ve a la pestaña **Events** o **Deploys** de tu servicio y haz clic en **Rollback to this deploy** en la versión estable previa.
2. **Vía Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```
   El flujo de CI/CD ejecutará los tests y activará el redespliegue automático.

---

## ✅ Checklist de Producción (Go-Live Audit)

- [x] **1. Variables de Entorno Validadas:** Módulo `src/lib/envValidation.ts` y `.env.example` documentado.
- [x] **2. Pruebas Unitarias Automatizadas:** Configurado Vitest con 4 suites y ejecución en CI (`npm test`).
- [x] **3. CI/CD Automatizado:** Workflows `.github/workflows/ci.yml` y `deploy.yml`.
- [x] **4. Gestión de Secretos:** `.gitignore` ignora `firebase-applet-config.json`, `.env*`, `*.pem`, `*.key`.
- [x] **5. Unificación de Package Manager:** Eliminado `bun.lock`, estandarizado en `npm` y `package.json`.
- [x] **6. Rate Limiting & Seguridad:** Middleware `createRateLimiter` (120 req/min) y cabeceras de seguridad activas.
- [x] **7. Logging Estructurado:** Registros con ISO timestamp y contexto JSON en `serverSecurity.ts`.
- [x] **8. Telegram Mini App (TMA):** SDK integrado, soporte de Haptic Feedback, MainButton y Webhook.
- [x] **9. Botcaza Wallet Gateway:** Conexión nativa a colecciones de Firebase y nodo Aptos Mainnet.
- [x] **10. Verificación de Build:** `npm run build` genera limpiamente `dist/index.html` y `dist/server.cjs`.

---

## 🛠️ Tecnologías y Lenguajes Empleados

Este repositorio combina múltiples capas tecnológicas diseñadas para alto rendimiento, seguridad y analítica a escala:

| Lenguaje / Tecnología | Rol en la Arquitectura | Propósito |
| :--- | :--- | :--- |
| **Move / Rust** | Capa Blockchain & Smart Contracts | Los contratos inteligentes de Aptos se desarrollan en **Move** (lenguaje seguro de tipado lineal y recursos de primera clase) cuyo runtime y compilador están desarrollados en **Rust**. |
| **TypeScript / Node.js** | Backend API & Servidor Express | Servidor REST en `server.ts`, procesamiento de endpoints `/api/*`, proxies para la API de Gemini, gestión de clicks y validaciones de tokens. |
| **HTML5 & React 19** | Capa de Presentación (Frontend) | Interfaz reactiva en tiempo real con Tailwind CSS v4, gráficos con Recharts y componentes interactivos de diagnósticos. |
| **Python & SQL** | Analítica & BigQuery Pipeline | Scripts para consultar el dataset público de Google Cloud `bigquery-public-data.crypto_aptos` y transformar telemetría on-chain. |
| **PHP** | Integración Drop-in para Terceros | Scripts de distribución (`aptos-payperview.php` y widgets de noticias/clima) compatibles con WordPress y servidores cPanel/Apache. |

---

## 🚀 Guía Rápida de Puesta en Producción

### 1. Despliegue en la Nube (Cloud Run, Vercel o VPS)
El proyecto está preparado para ejecutarse como servidor Node.js full-stack en el puerto `3000`:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/neuraforge-botcaza-aptos.git
cd neuraforge-botcaza-aptos

# 2. Instalar dependencias
npm install

# 3. Compilar tanto el frontend como el servidor bundle CJS
npm run build

# 4. Iniciar en producción
npm start
```

### 2. Configuración de Dominio y DNS (`https://go.botcaza.ai`)
1. En tu registrador o panel de Cloudflare/DNS, apunta un registro `CNAME` o `A`:
   - **Tipo:** `CNAME`
   - **Nombre:** `go` (o `@` para raíz)
   - **Destino:** La IP o URL de tu servicio Cloud Run / VPS.
2. Activa el certificado SSL/TLS (HTTPS) para evitar advertencias de contenido mixto.
3. Verifica que `https://go.botcaza.ai/ads.txt` devuelva:
   ```text
   google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0
   ```

---

## 📈 Estrategia de Tráfico y Monetización (Meta, TikTok & YouTube)

Para monetizar con éxito el tráfico desde tus cuentas de **Meta Ads / Instagram**, **TikTok Business** y **YouTube**, aplica este embudo de conversión:

### 1. Meta (Instagram Reels & Facebook Ads)
- **Formato:** Reels cortos (15-30 seg) y Anuncios de Tráfico / Clientes Potenciales.
- **Gancho (Hook):** *"¿Quieres ver qué están comprando las ballenas de Aptos en este minuto? Le preguntamos a la IA."*
- **Llamado a la acción (CTA):** *"Toca el enlace en nuestra bio o pulsa 'Más información' para usar el Agente de Inteligencia gratis en go.botcaza.ai"*.
- **Enlace con UTM:**
  `https://go.botcaza.ai/?utm_source=meta&utm_medium=instagram_reels&utm_campaign=aptos_ai_agent`

### 2. TikTok Business
- **Formato:** Video en pantalla dividida mostrando la terminal cyber en vivo respondiendo con datos reales on-chain.
- **Gancho (Hook):** *"Herramienta secreta de IA para la blockchain de Aptos que casi nadie conoce."*
- **CTA:** *"Link en bio para probarlo."*
- **Enlace con UTM:**
  `https://go.botcaza.ai/?utm_source=tiktok&utm_medium=tiktok_business&utm_campaign=whale_tracker`

### 3. YouTube (Shorts & Videos Largos)
- **Formato Shorts:** Muestra una consulta SQL en BigQuery o el monitor en tiempo real.
- **Descripción & Comentario Fijado:** Coloca el enlace directo hacia la herramienta y hacia el catálogo Pay Per View.
- **Enlace con UTM:**
  `https://go.botcaza.ai/?utm_source=youtube&utm_medium=shorts&utm_campaign=aptos_analytics`

---

## 📜 Licencia & Consideraciones Legales (Sin Riesgo de Copyright)

Este proyecto se distribuye bajo la **Licencia MIT** (ver archivo [LICENSE](./LICENSE)).

### ¿Por qué la Licencia MIT es la mejor opción?
1. **Uso Comercial Libre:** Te permite vender suscripciones, cobrar por Pay-Per-View, mostrar anuncios de Google AdSense y comercializar tus scripts sin pagar regalías a terceros.
2. **Exención Total de Responsabilidad:** Incluye la cláusula estándar `AS IS` que te protege ante reclamos legales derivados del comportamiento del software o de fluctuaciones en el precio de criptoactivos.
3. **Aviso de No Asesoramiento Financiero:** Todo el contenido es educativo y analítico; no constituye asesoría financiera ni de inversión.

### Menciones y Créditos Oficiales
- **Aptos Labs:** Por el desarrollo de la red Aptos y el lenguaje Move.
- **Google Cloud:** Por la infraestructura de BigQuery, el dataset público `crypto_aptos` y la tecnología de Gemini API.
- **NeuraforgeAI & Botcaza:** Por la arquitectura del Agente de Inteligencia, scripts de monetización y plataforma integral.
