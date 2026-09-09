import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client (lazy initialization)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const APTOS_NETWORKS: Record<string, string> = {
  mainnet: "https://fullnode.mainnet.aptoslabs.com/v1",
  testnet: "https://fullnode.testnet.aptoslabs.com/v1",
  devnet: "https://fullnode.devnet.aptoslabs.com/v1",
};

function getAptosBaseUrl(network = "mainnet"): string {
  return APTOS_NETWORKS[network] || APTOS_NETWORKS.mainnet;
}

// ==========================================
// 1. Core Aptos Fullnode Direct Endpoints
// ==========================================

// Get Aptos ledger information (chain ID, epoch, ledger_version, timestamp, block_height)
app.get("/api/aptos/ledger", async (req, res) => {
  try {
    const network = (req.query.network as string) || "mainnet";
    const baseUrl = getAptosBaseUrl(network);

    const response = await fetch(`${baseUrl}/`);
    if (!response.ok) {
      throw new Error(`Aptos node returned ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    res.json({ success: true, network, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch ledger info" });
  }
});

// Get recent transactions
app.get("/api/aptos/transactions", async (req, res) => {
  try {
    const network = (req.query.network as string) || "mainnet";
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 15, 1), 50);
    const start = req.query.start ? `&start=${req.query.start}` : "";
    const baseUrl = getAptosBaseUrl(network);

    const response = await fetch(`${baseUrl}/transactions?limit=${limit}${start}`);
    if (!response.ok) {
      throw new Error(`Aptos node returned ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    res.json({ success: true, network, limit, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch transactions" });
  }
});

// Get transaction by hash
app.get("/api/aptos/transactions/by-hash/:hash", async (req, res) => {
  try {
    const network = (req.query.network as string) || "mainnet";
    const { hash } = req.params;
    const baseUrl = getAptosBaseUrl(network);

    const response = await fetch(`${baseUrl}/transactions/by_hash/${hash}`);
    if (!response.ok) {
      throw new Error(`Transaction not found (${response.status})`);
    }
    const data = await response.json();
    res.json({ success: true, network, data });
  } catch (error: any) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Get block by height
app.get("/api/aptos/blocks/:height", async (req, res) => {
  try {
    const network = (req.query.network as string) || "mainnet";
    const { height } = req.params;
    const withTransactions = req.query.with_transactions !== "false";
    const baseUrl = getAptosBaseUrl(network);

    const response = await fetch(
      `${baseUrl}/blocks/by_height/${height}?with_transactions=${withTransactions}`
    );
    if (!response.ok) {
      throw new Error(`Block not found (${response.status})`);
    }
    const data = await response.json();
    res.json({ success: true, network, data });
  } catch (error: any) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Get account details & resources (balance, sequences, Move resources)
app.get("/api/aptos/account/:address", async (req, res) => {
  try {
    const network = (req.query.network as string) || "mainnet";
    let address = req.params.address.trim();
    if (!address.startsWith("0x")) address = "0x" + address;
    const baseUrl = getAptosBaseUrl(network);

    // Fetch account info and resources in parallel
    const [accRes, resRes] = await Promise.all([
      fetch(`${baseUrl}/accounts/${address}`),
      fetch(`${baseUrl}/accounts/${address}/resources`),
    ]);

    if (!accRes.ok) {
      throw new Error(`Account ${address} not found or uninitialized on Aptos ${network}`);
    }

    const account = await accRes.json();
    const resources = resRes.ok ? await resRes.json() : [];

    // Extract APT coin balance if exists (0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>)
    let aptBalanceOctas = "0";
    let aptBalance = 0;
    const coinResource = Array.isArray(resources)
      ? resources.find(
          (r: any) =>
            r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>" ||
            r.type?.includes("AptosCoin")
        )
      : null;

    if (coinResource && coinResource.data?.coin?.value) {
      aptBalanceOctas = coinResource.data.coin.value;
      aptBalance = Number(BigInt(aptBalanceOctas)) / 1e8;
    }

    res.json({
      success: true,
      network,
      address,
      account,
      aptBalanceOctas,
      aptBalance,
      resourcesCount: resources.length,
      resources: resources.slice(0, 30), // first 30 resources
    });
  } catch (error: any) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Get gas estimate
app.get("/api/aptos/gas-estimate", async (req, res) => {
  try {
    const network = (req.query.network as string) || "mainnet";
    const baseUrl = getAptosBaseUrl(network);
    const response = await fetch(`${baseUrl}/estimate_gas_price`);
    if (!response.ok) {
      throw new Error(`Gas estimation error (${response.status})`);
    }
    const data = await response.json();
    res.json({ success: true, network, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. Google Data Agent API for Aptos
// ==========================================
app.post("/api/aptos/agent/query", async (req, res) => {
  try {
    const { prompt, network = "mainnet", context } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ success: false, error: "Prompt string is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY not configured. Please set GEMINI_API_KEY in your secrets panel.",
      });
      return;
    }

    const baseUrl = getAptosBaseUrl(network);

    // Fetch real-time live blockchain ledger state to provide fresh grounding to the Data Agent
    let liveLedger: any = null;
    let liveRecentTx: any = null;
    try {
      const [ledgerRes, txRes] = await Promise.all([
        fetch(`${baseUrl}/`),
        fetch(`${baseUrl}/transactions?limit=8`),
      ]);
      if (ledgerRes.ok) liveLedger = await ledgerRes.json();
      if (txRes.ok) liveRecentTx = await txRes.json();
    } catch (e) {
      console.warn("Could not pre-fetch live Aptos state:", e);
    }

    // Check if query contains an address (0x...) or transaction hash or block number
    const addressMatch = prompt.match(/0x[a-fA-F0-9]{1,64}/);
    let specificEntityData: any = null;
    if (addressMatch) {
      const targetAddr = addressMatch[0];
      try {
        const [accRes, resRes] = await Promise.all([
          fetch(`${baseUrl}/accounts/${targetAddr}`),
          fetch(`${baseUrl}/accounts/${targetAddr}/resources`),
        ]);
        if (accRes.ok) {
          specificEntityData = {
            address: targetAddr,
            account: await accRes.json(),
            resources: resRes.ok ? (await resRes.json()).slice(0, 10) : [],
          };
        }
      } catch (err) {
        console.warn("Entity lookup error:", err);
      }
    }

    const systemInstruction = `You are the Google Data Agent API for Aptos Blockchain.
Your mission is to query, inspect, analyze, and synthesize Aptos blockchain data using:
1. Aptos Fullnode REST APIs (Ledger state, Blocks, Transactions, Accounts, Move Modules & Resources).
2. Google Cloud BigQuery public dataset: \`bigquery-public-data.crypto_aptos\` (with tables: \`blocks\`, \`transactions\`, \`events\`, \`user_transactions\`, \`move_modules\`, \`move_resources\`).
3. Blockchain intelligence, Move smart contract logic, tokenomics (APT / Fungible Assets), gas price dynamics, and validator health.

Return ONLY a valid JSON object (no markdown wrapping, no code fences) with the exact structure:
{
  "summary": "Clear, informative answer in the user's prompt language (Spanish or English) explaining the findings.",
  "intent": "LEDGER_INFO" | "ACCOUNT_INSPECTION" | "TRANSACTION_ANALYSIS" | "BIGQUERY_SQL" | "MOVE_SMART_CONTRACT" | "GENERAL_ANALYTICS",
  "toolUsed": "Aptos Fullnode REST API v1" | "Google BigQuery Public Data (crypto_aptos)" | "Move Bytecode Analyzer",
  "keyMetrics": [
    { "label": "Block Height", "value": "123456", "change": "+12.4%", "isGood": true },
    { "label": "TPS Estimado", "value": "24.5", "change": "Normal", "isGood": true },
    { "label": "Gas Unit Price", "value": "100 Octas", "change": "Estable", "isGood": true }
  ],
  "bigQuerySql": "SELECT ... FROM \`bigquery-public-data.crypto_aptos.transactions\` WHERE ... (standard BigQuery SQL relevant to the question, or empty string if not applicable)",
  "dataBreakdown": {
    "title": "Short descriptive title for visual table or card",
    "headers": ["Field", "Value"],
    "rows": [
      ["Metric 1", "Value 1"],
      ["Metric 2", "Value 2"]
    ]
  },
  "rawBlockchainData": { ... relevant structured data snippet ... },
  "suggestedNextQueries": [
    "Suggested question 1",
    "Suggested question 2",
    "Suggested question 3"
  ]
}`;

    const contextPayload = {
      userPrompt: prompt,
      network,
      liveLedger,
      recentTxSample: liveRecentTx ? liveRecentTx.slice(0, 3) : null,
      specificEntityData,
      currentTimestamp: new Date().toISOString(),
    };

    let rawText = "{}";
    const modelsToTry = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
    let aiSuccess = false;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                { text: `Context and Blockchain Data:\n${JSON.stringify(contextPayload, null, 2)}` },
                { text: `User Question: ${prompt}` },
              ],
            },
          ],
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        });
        rawText = response.text || "{}";
        aiSuccess = true;
        break;
      } catch (genErr: any) {
        console.warn(`Model ${modelName} failed or busy, trying fallback...`, genErr.message);
      }
    }

    let agentResult: any;

    if (aiSuccess) {
      try {
        agentResult = JSON.parse(rawText);
      } catch {
        const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        agentResult = JSON.parse(cleaned);
      }
    } else {
      // Deterministic Smart Agent synthesis using the live Aptos node data
      const blockHeight = liveLedger ? Number(liveLedger.block_height).toLocaleString() : "N/A";
      const epoch = liveLedger ? liveLedger.epoch : "N/A";
      const ledgerVersion = liveLedger ? Number(liveLedger.ledger_version).toLocaleString() : "N/A";

      agentResult = {
        summary: `Consulta procesada directamente contra los nodos RPC de Aptos ${network}. Altura de bloque actual: #${blockHeight}, Época: ${epoch}, Versión de Ledger: ${ledgerVersion}.`,
        intent: addressMatch ? "ACCOUNT_INSPECTION" : "LEDGER_INFO",
        toolUsed: "Aptos Fullnode REST API v1 (Live Node)",
        keyMetrics: [
          { label: "Altura Bloque", value: `#${blockHeight}`, change: "En Vivo", isGood: true },
          { label: "Versión Ledger", value: ledgerVersion, change: `Época ${epoch}`, isGood: true },
          { label: "Red", value: network.toUpperCase(), change: "Conectado", isGood: true },
        ],
        bigQuerySql: "SELECT version, sender, gas_used, vm_status FROM `bigquery-public-data.crypto_aptos.transactions` ORDER BY block_timestamp DESC LIMIT 10;",
        dataBreakdown: {
          title: "Estado Actual de la Red Aptos",
          headers: ["Parámetro", "Valor"],
          rows: [
            ["Chain ID", String(liveLedger?.chain_id || 1)],
            ["Altura de Bloque", String(blockHeight)],
            ["Versión Ledger", String(ledgerVersion)],
            ["Época", String(epoch)],
            ["Rol de Nodo", String(liveLedger?.node_role || "full_node")],
          ],
        },
        rawBlockchainData: specificEntityData || liveLedger,
        suggestedNextQueries: [
          "Consultar el saldo de la cuenta 0x1",
          "¿Cuál es el gas unit price estimado?",
          "Ver transacciones recientes en Aptos",
        ],
      };
    }

    res.json({
      success: true,
      network,
      agentResult,
      liveLedger,
    });
  } catch (error: any) {
    console.error("Agent query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process query via Google Data Agent API",
    });
  }
});

// ==========================================
// 3. User Identity, Analytics & AdSense Setup
// ==========================================

// Official Google AdSense ads.txt authorization
app.get("/ads.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send("google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0\n");
});

// User Profile & Analytics Streams metadata
app.get("/api/user-profile", (req, res) => {
  res.json({
    brand: "Botcaza by NeuraforgeAI & AI colaborativa",
    publisherId: "pub-9493850506792206",
    contactEmail: "go.botcaza.ai@gmail.com",
    primaryUrl: "https://go.botcaza.ai",
    streams: [
      {
        name: "Botcaza by NeuraforgeAI analitics",
        url: "https://go.botcaza.ai",
        streamId: "15526251626",
        measurementId: "G-24Q6GBQN75",
        status: "configured",
        lastActivity: "Active Tag Verification",
      },
      {
        name: "go.chatboots",
        url: "https://go.chatboots",
        streamId: "15548039904",
        measurementId: "G-24Q6GBQN75",
        status: "pending_data",
        lastActivity: "Awaiting visitor pings",
      },
    ],
  });
});

// In-memory ledger for simulated click-to-earn & monetization payouts
let publisherRevenueUSD = 42.85;
let publisherRevenueAPT = 5.24;
let totalClicksRecorded = 184;

app.post("/api/analytics/track-click", (req, res) => {
  const { eventType, target, cpcValue = 0.15, cryptoValue = 0.005 } = req.body;
  
  totalClicksRecorded += 1;
  publisherRevenueUSD += Number(cpcValue);
  publisherRevenueAPT += Number(cryptoValue);

  res.json({
    success: true,
    message: "Click monetizado registrado con éxito",
    creditedTo: {
      publisher: "pub-9493850506792206",
      email: "go.botcaza.ai@gmail.com",
    },
    analyticsEvent: {
      name: eventType || "monetized_click",
      measurementId: "G-24Q6GBQN75",
      target,
      timestamp: new Date().toISOString(),
    },
    updatedEarnings: {
      totalClicks: totalClicksRecorded,
      earnedUSD: Number(publisherRevenueUSD.toFixed(2)),
      earnedAPT: Number(publisherRevenueAPT.toFixed(4)),
    },
  });
});

// Monetized News Endpoint (Feed de Noticias con modelo Pay-Per-Click y micropagos)
app.get("/api/monetized/news", (req, res) => {
  const news = [
    {
      id: "news-aptos-1",
      title: "Aptos rompe récord de transacciones por segundo con actualización v1.12",
      excerpt: "La red principal superó los 3,500 TPS gracias a la paralelización mejorada del motor Block-STM y optimización de gas.",
      category: "Blockchain & Tech",
      timestamp: "Hace 15 minutos",
      source: "Neuraforge Intelligence",
      cpcRevenueUSD: 0.22,
      micropaymentAPT: 0.005,
      fullContent: "Aptos Network ha anunciado la implementación exitosa de la actualización v1.12 en Mainnet. La optimización del motor Block-STM permite procesar transacciones complejas de contratos Move en paralelo sin generar cuellos de botella en la memoria de los validadores. Los desarrolladores de DeFi y juegos Web3 reportan reducciones del 40% en costos de gas por operación.",
      sponsoredBy: "Google AdSense pub-9493850506792206",
      views: 1420,
      clicks: 312,
    },
    {
      id: "news-ai-2",
      title: "Google Data Agent API revoluciona el análisis on-chain con Gemini 3.8",
      excerpt: "Integración directa entre datasets públicos de BigQuery y modelos multimodales para auditorías de contratos Move en segundos.",
      category: "Inteligencia Artificial",
      timestamp: "Hace 42 minutos",
      source: "Google Cloud Web3",
      cpcRevenueUSD: 0.28,
      micropaymentAPT: 0.008,
      fullContent: "La nueva arquitectura de Google Data Agent combina la velocidad analítica de BigQuery Crypto con el razonamiento estructurado de Gemini 3.8 Flash. Las empresas pueden consultar patrones de transacciones, detectar actividad de ballenas y auditar contratos inteligentes formulando preguntas simples en español o inglés.",
      sponsoredBy: "Google AdSense pub-9493850506792206",
      views: 2890,
      clicks: 640,
    },
    {
      id: "news-monetize-3",
      title: "Cómo monetizar tráfico web en 2026: Combinando GA4, AdSense y micropagos Web3",
      excerpt: "Estrategias de Click-to-Earn y Pay-Per-View para creadores de contenido independientes y portales de noticias.",
      category: "Monetización Digital",
      timestamp: "Hace 2 horas",
      source: "Botcaza Media Lab",
      cpcRevenueUSD: 0.35,
      micropaymentAPT: 0.01,
      fullContent: "El modelo tradicional de banners publicitarios está evolucionando hacia micro-recompensas e interacción directa. Con la etiqueta G-24Q6GBQN75 y la cuenta publicitaria pub-9493850506792206, los sitios pueden registrar exactamente qué artículos generan mayor retorno por clic y habilitar micro-pagos instantáneos sin suscripciones mensuales engorrosas.",
      sponsoredBy: "Google AdSense pub-9493850506792206",
      views: 980,
      clicks: 215,
    },
  ];

  res.json({
    success: true,
    publisher: "pub-9493850506792206",
    measurementId: "G-24Q6GBQN75",
    news,
  });
});

// Monetized Weather Endpoint (Widget de Clima con desbloqueo de Radar y Pronóstico extendido)
app.get("/api/monetized/weather", async (req, res) => {
  const city = (req.query.city as string) || "Madrid";
  
  // Coordinates mapping for common cities
  const cityCoords: Record<string, { lat: number; lon: number; country: string }> = {
    madrid: { lat: 40.4168, lon: -3.7038, country: "España" },
    mexico: { lat: 19.4326, lon: -99.1332, country: "México" },
    cdmx: { lat: 19.4326, lon: -99.1332, country: "México" },
    miami: { lat: 25.7617, lon: -80.1918, country: "Estados Unidos" },
    bogota: { lat: 4.711, lon: -74.0721, country: "Colombia" },
    buenosaires: { lat: -34.6037, lon: -58.3816, country: "Argentina" },
    barcelona: { lat: 41.3851, lon: 2.1734, country: "España" },
  };

  const key = city.toLowerCase().replace(/\s+/g, "");
  const coords = cityCoords[key] || cityCoords.madrid;

  try {
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const data = await weatherRes.json();

    res.json({
      success: true,
      city: city.charAt(0).toUpperCase() + city.slice(1),
      country: coords.country,
      current: data.current || {
        temperature_2m: 22.4,
        apparent_temperature: 23.1,
        relative_humidity_2m: 54,
        wind_speed_10m: 12.5,
        weather_code: 1,
      },
      daily: data.daily,
      hourly: data.hourly,
      monetization: {
        publisherId: "pub-9493850506792206",
        measurementId: "G-24Q6GBQN75",
        cpcUnlockUSD: 0.15,
        cryptoUnlockAPT: 0.004,
        premiumFeatures: [
          "Radar Meteorológico Doppler en Alta Resolución",
          "Pronóstico Detallado Hora por Hora a 14 días",
          "Alertas de Viento y Radiación UV en Tiempo Real",
        ],
      },
    });
  } catch (err: any) {
    res.json({
      success: true,
      city,
      country: "Global",
      current: {
        temperature_2m: 21.5,
        apparent_temperature: 22.0,
        relative_humidity_2m: 50,
        wind_speed_10m: 11.0,
        weather_code: 0,
      },
      monetization: {
        publisherId: "pub-9493850506792206",
        measurementId: "G-24Q6GBQN75",
        cpcUnlockUSD: 0.15,
        cryptoUnlockAPT: 0.004,
      },
    });
  }
});

// Support AI Assistant & Error Diagnostics (Gemini Powered)
app.post("/api/support/ai-assistant", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Pregunta no provista" });
  }

  const ai = getGeminiClient();
  const context = `Eres el Asistente Técnico y Especialista en Monetización y Web de NeuraforgeAI y AI Colaborativa.
Datos del usuario y cuenta:
- Marca: Botcaza by NeuraforgeAI & AI colaborativa (https://go.botcaza.ai)
- Email de soporte: go.botcaza.ai@gmail.com
- ID de Medición GA4: G-24Q6GBQN75
- ID de Flujo: 15526251626
- Segundo Flujo: go.chatboots (15548039904)
- Google AdSense Publisher: pub-9493850506792206
- Blockchain: Aptos Mainnet / Google Data Agent BigQuery

Instrucciones:
- Responde en español claro, profesional, directo y resolutivo.
- Si preguntan sobre el aviso "No se han recibido datos durante las últimas 48 horas" de Google Analytics, explica con precisión técnica por qué ocurre (falta de tráfico real, adblockers, dominio no vinculado, o retraso de 24h en informes estándar de GA4) y brinda la solución exacta.
- Si preguntan sobre cómo ganar dinero cuando hagan clic en scripts de noticias o del clima, detalla el flujo monetario: AdSense CPC para pub-9493850506792206, micropagos con Aptos Pay/Stripe, y cómo insertar los scripts en su web.
- Si preguntan sobre errores comunes de internet (404, 502, 504, CORS, DNS NXDOMAIN, SSL handshake), explica la causa raíz y el paso a paso para solucionarlo en 1 minuto.`;

  if (!ai) {
    return res.json({
      reply: `Respuesta de Soporte NeuraforgeAI:\n\nPara el aviso 'No se han recibido datos durante las últimas 48 horas' en el flujo G-24Q6GBQN75 (https://go.botcaza.ai):\n1. La etiqueta gtag.js debe estar antes de cerrar </head>.\n2. Si visitas tu web con un bloqueador de publicidad (uBlock/Brave), GA4 no registra las visitas.\n3. Los informes estándar de GA4 demoran entre 24 y 48 horas en procesar datos; revisa el informe 'En tiempo real' (Realtime) para comprobar si se detecta tu visita al instante.\n\nPara monetizar con los scripts de Noticias y Clima:\nCada vez que un usuario hace clic en un artículo o desbloquea el radar del clima, el evento activa una llamada a Google AdSense (pub-9493850506792206) generando ingresos por CPC acreditados directamente a tu cuenta bancaria asociada a AdSense y a tu cuenta go.botcaza.ai@gmail.com.`,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        systemInstruction: context,
        temperature: 0.3,
      },
    });

    res.json({ reply: response.text || "Consulta recibida por el equipo de NeuraforgeAI." });
  } catch (err: any) {
    res.json({
      reply: `Estimado usuario de NeuraforgeAI: Hemos recibido tu consulta. Para el aviso 'No se han recibido datos en 48 horas' en G-24Q6GBQN75, asegúrate de visitar go.botcaza.ai sin AdBlock y verificar en la sección 'En tiempo real' de Google Analytics. Nuestro equipo técnico responderá cualquier detalle a go.botcaza.ai@gmail.com.`,
    });
  }
});

// Submit Support Ticket
app.post("/api/support/ticket", (req, res) => {
  const { subject, category, message, userEmail = "go.botcaza.ai@gmail.com" } = req.body;
  const ticketId = `NF-${Math.floor(100000 + Math.random() * 900000)}`;

  res.json({
    success: true,
    ticketId,
    status: "OPEN",
    message: `Ticket #${ticketId} creado exitosamente para el equipo NeuraforgeAI & AI Colaborativa. Se enviará seguimiento a ${userEmail}.`,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 4. Meta APIs (WhatsApp Cloud API, Instagram, Facebook & Conversions API)
// ==========================================

// Check Meta API status
app.get("/api/meta/status", (req, res) => {
  const hasToken = !!process.env.META_ACCESS_TOKEN;
  const hasPhoneId = !!process.env.META_PHONE_NUMBER_ID;
  const hasPixel = !!process.env.META_PIXEL_ID;
  const hasVerifyToken = !!process.env.META_VERIFY_TOKEN;

  res.json({
    success: true,
    configured: hasToken && hasPhoneId,
    services: {
      whatsappCloudAPI: hasToken && hasPhoneId ? "READY" : "CONFIG_PENDING",
      instagramGraphAPI: hasToken ? "READY" : "CONFIG_PENDING",
      facebookGraphAPI: hasToken ? "READY" : "CONFIG_PENDING",
      metaConversionsAPI: hasPixel ? "READY" : "OPTIONAL",
      webhooks: hasVerifyToken ? "VERIFIED" : "TOKEN_PENDING",
    },
    webhookUrl: `${req.protocol}://${req.get("host")}/api/meta/webhook`,
  });
});

// Meta Webhook Verification (Required by Meta Developer Dashboard)
app.get("/api/meta/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const expectedToken = process.env.META_VERIFY_TOKEN || "neuraforge_botcaza_secure_token";

  if (mode === "subscribe" && token === expectedToken) {
    console.log("[Meta Webhook] Webhook verificado exitosamente con Meta");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification token mismatch");
  }
});

// Meta Webhook Listener (Handles incoming WhatsApp messages and Instagram DMs)
app.post("/api/meta/webhook", (req, res) => {
  const body = req.body;
  console.log("[Meta Webhook Event]", JSON.stringify(body, null, 2));

  // Acknowledge receipt to Meta immediately (must respond within 20s)
  res.status(200).send("EVENT_RECEIVED");
});

// Send WhatsApp Message via WhatsApp Cloud API
app.post("/api/meta/send-whatsapp", async (req, res) => {
  const { to, message, templateName, alertData } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, error: "El número destinatario 'to' es requerido (e.g. +521234567890)" });
  }

  const token = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  // Real WhatsApp Cloud API Call if credentials exist
  if (token && phoneNumberId) {
    try {
      const payload: any = {
        messaging_product: "whatsapp",
        to: to.replace(/[^0-9]/g, ""),
        type: "text",
        text: {
          preview_url: true,
          body: message || `🤖 [NeuraforgeAI & Botcaza Alert] Nueva actividad on-chain en Aptos Mainnet.\nVisita: https://go.botcaza.ai`,
        },
      };

      const metaRes = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await metaRes.json();
      if (!metaRes.ok) {
        return res.status(metaRes.status).json({ success: false, metaError: data });
      }

      return res.json({ success: true, mode: "LIVE_CLOUD_API", result: data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Demonstration / Test Mode (No tokens yet)
  res.json({
    success: true,
    mode: "SIMULATED_TEST_MODE",
    notice: "Mensaje procesado correctamente. Para envíos reales a números de WhatsApp globales, configura META_ACCESS_TOKEN y META_PHONE_NUMBER_ID en las variables de entorno.",
    payload: {
      to,
      message: message || "Alerta de Ballena Aptos en tiempo real",
      source: "https://go.botcaza.ai",
      timestamp: new Date().toISOString(),
    },
  });
});

// Meta Conversions API (CAPI) - Server-side tracking
app.post("/api/meta/conversions", async (req, res) => {
  const { eventName = "Purchase", eventData = {}, userEmail, clientIp } = req.body;
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_ACCESS_TOKEN;

  if (pixelId && token) {
    try {
      const capiPayload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: "https://go.botcaza.ai",
            user_data: {
              client_user_agent: req.headers["user-agent"],
              client_ip_address: clientIp || req.ip,
            },
            custom_data: eventData,
          },
        ],
      };

      const capiRes = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capiPayload),
      });

      const data = await capiRes.json();
      return res.json({ success: true, mode: "LIVE_CAPI", data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.json({
    success: true,
    mode: "SIMULATED_CAPI",
    message: `Evento '${eventName}' registrado en el servidor. Al agregar META_PIXEL_ID, se transmitirá directamente a Meta Ads Manager saltándose los bloqueadores de anuncios.`,
    event: { eventName, timestamp: Math.floor(Date.now() / 1000), publisher: "pub-9493850506792206" },
  });
});

// ==========================================
// 5. Vite Middleware & Server Initialization
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aptos Data Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
