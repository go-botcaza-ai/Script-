import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Send,
  Sparkles,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Bot,
  User,
  Clock,
  HelpCircle,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

interface SupportDeskProps {
  userEmail?: string;
}

export const NeuraforgeSupportDesk: React.FC<SupportDeskProps> = ({
  userEmail = 'go.botcaza.ai@gmail.com'
}) => {
  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('analytics');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketConfirmation, setTicketConfirmation] = useState<string | null>(null);

  // AI Assistant Chat state
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: '¡Hola equipo de NeuraforgeAI! Soy tu Asistente Técnico y de Monetización 24/7. ¿En qué te puedo ayudar hoy con respecto a Google Analytics (G-24Q6GBQN75), Google AdSense (pub-9493850506792206) o los scripts de noticias y clima?',
      time: 'Ahora',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Submit Ticket
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim() || ticketLoading) return;

    setTicketLoading(true);
    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          category: ticketCategory,
          message: ticketMessage,
          userEmail,
        }),
      });

      const data = await res.json();
      setTicketConfirmation(data.message || `Ticket #${data.ticketId} creado exitosamente.`);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err: any) {
      setTicketConfirmation('Error al registrar el ticket. Nuestro equipo atenderá tu consulta en ' + userEmail);
    } finally {
      setTicketLoading(false);
    }
  };

  // Send AI chat message
  const handleSendAiMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || chatLoading) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiChatMessages(prev => [...prev, { role: 'user', text, time: userMsgTime }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/support/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      const data = await res.json();
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAiChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.reply || 'Consulta procesada.', time: aiTime },
      ]);
    } catch (err: any) {
      setAiChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Disculpa, ha ocurrido un error al conectar con el asistente. Puedes enviar tu consulta directa a go.botcaza.ai@gmail.com.',
          time: 'Ahora',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    '¿Por qué dice "No se han recibido datos en las últimas 48 horas" en mi GA4?',
    '¿Cómo configuro el archivo ads.txt en go.botcaza.ai para pub-9493850506792206?',
    '¿Cómo se me transfieren los ingresos por clic de noticias y clima?',
    '¿Cómo solucionar el error 502 Bad Gateway y CORS?',
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Support Status Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              Soporte Técnico &bull; NeuraforgeAI &amp; AI Colaborativa
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Centro de Ayuda y Asistencia Técnica 24/7
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Atención personalizada para la integración de <strong className="text-white">Botcaza</strong>, Google Analytics GA4, Google AdSense y el Agente de Datos Aptos.
          </p>
        </div>

        {/* Quick User Identity Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 min-w-[290px] font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Cuenta vinculada:</span>
            <span className="text-emerald-400 font-bold">{userEmail}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Publisher AdSense:</span>
            <span className="text-white">pub-9493850506792206</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Flujo GA4:</span>
            <span className="text-emerald-400">G-24Q6GBQN75</span>
          </div>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: AI Support Assistant Chat */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Asistente de Soporte Inteligente (Gemini IA)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
              En Línea 24/7
            </span>
          </div>

          {/* Quick Questions Pills */}
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAiMessage(q)}
                className="text-left text-[11px] font-mono bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="h-[360px] rounded-xl bg-black border border-slate-800 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {aiChatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-black font-medium'
                      : 'bg-slate-900 text-slate-200 border border-slate-800'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[9px] mt-1 ${
                    msg.role === 'user' ? 'text-black/70 text-right' : 'text-slate-500'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2 items-center text-xs text-zinc-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span>Neuraforge Support está respondiendo...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendAiMessage()}
              placeholder="Haz una pregunta técnica sobre tus flujos, monetización o errores web..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
            />
            <button
              onClick={() => handleSendAiMessage()}
              disabled={chatLoading || !chatInput.trim()}
              className="px-4 py-2.5 rounded-lg bg-emerald-400 text-black font-mono font-bold text-xs hover:bg-emerald-300 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Submit Official Support Ticket */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Crear Ticket de Soporte Oficial
            </h3>
          </div>

          <form onSubmit={handleSubmitTicket} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Categoría del Caso:
              </label>
              <select
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value)}
                className="w-full bg-black border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              >
                <option value="analytics">Google Analytics 4 (G-24Q6GBQN75)</option>
                <option value="adsense">Google AdSense (pub-9493850506792206)</option>
                <option value="monetization_scripts">Scripts de Noticias &amp; Clima</option>
                <option value="aptos_blockchain">Aptos Blockchain &amp; BigQuery</option>
                <option value="domain_dns">Dominio https://go.botcaza.ai &amp; DNS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Asunto del Ticket:
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                placeholder="Ej. Revisión de etiqueta GA4 en go.botcaza.ai"
                className="w-full bg-black border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Mensaje o Descripción del Problema:
              </label>
              <textarea
                required
                rows={4}
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                placeholder="Describe los síntomas o lo que necesitas que configuremos..."
                className="w-full bg-black border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={ticketLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-400 text-black font-mono font-bold text-xs hover:bg-cyan-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{ticketLoading ? 'Enviando Ticket...' : 'Enviar Ticket a Soporte'}</span>
            </button>

            {ticketConfirmation && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ticketConfirmation}</span>
              </div>
            )}
          </form>

          {/* Direct Email Contact Box */}
          <div className="p-4 rounded-xl bg-black border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-400 block text-[11px]">Email de Contacto Directo:</span>
              <a
                href="mailto:go.botcaza.ai@gmail.com"
                className="text-emerald-400 font-bold hover:underline"
              >
                go.botcaza.ai@gmail.com
              </a>
            </div>
            <a
              href="mailto:go.botcaza.ai@gmail.com?subject=Consulta%20NeuraforgeAI"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs"
            >
              Escribir Email
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
