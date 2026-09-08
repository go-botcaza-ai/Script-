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
