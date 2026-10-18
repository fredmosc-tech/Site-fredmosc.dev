// Worker do formulário de contato do fredmosc.tech
// Fluxo: site (/contato.html) -> este Worker -> valida Turnstile -> Brevo (API transacional) -> contato@fredmosc.tech
//
// Segredos (Settings > Variables and Secrets, tipo "Secret"):
//   BREVO_API_KEY     chave da API do Brevo (conta fredmosc.tech)
//   TURNSTILE_SECRET  secret do widget Turnstile usado no site
// Variáveis (texto simples):
//   TO_EMAIL          destino (contato@fredmosc.tech)
//   SENDER_EMAIL      remetente autenticado no Brevo (fred@news.fredmosc.tech)
//   ALLOWED_ORIGINS   origens aceitas, separadas por vírgula

const json = (body, status, cors) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
  });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || 'https://fredmosc.tech').split(',').map((s) => s.trim());
    const origin = request.headers.get('Origin') || '';
    const cors = allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' }
      : {};

    if (request.method === 'OPTIONS') return new Response(null, { status: cors['Access-Control-Allow-Origin'] ? 204 : 403, headers: cors });
    if (request.method !== 'POST') return json({ ok: false, erro: 'metodo' }, 405, cors);
    if (!cors['Access-Control-Allow-Origin']) return json({ ok: false, erro: 'origem' }, 403, cors);

    let d;
    try { d = await request.json(); } catch { return json({ ok: false, erro: 'formato' }, 400, cors); }

    const nome = String(d.nome || '').trim();
    const email = String(d.email || '').trim();
    const mensagem = String(d.mensagem || '').trim();

    // honeypot: robô preencheu o campo escondido -> finge sucesso e descarta
    if (d.hp) return json({ ok: true }, 200, cors);

    if (!nome || nome.length > 100) return json({ ok: false, erro: 'nome' }, 400, cors);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) return json({ ok: false, erro: 'email' }, 400, cors);
    if (mensagem.length < 10 || mensagem.length > 5000) return json({ ok: false, erro: 'mensagem' }, 400, cors);

    // Turnstile: confere o token no servidor
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const tv = new FormData();
    tv.append('secret', env.TURNSTILE_SECRET);
    tv.append('response', String(d.token || ''));
    if (ip) tv.append('remoteip', ip);
    const ts = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: tv })
      .then((r) => r.json()).catch(() => ({ success: false }));
    if (!ts.success) return json({ ok: false, erro: 'robo' }, 403, cors);

    const quando = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const corpo =
      `<p><b>Nome:</b> ${esc(nome)}<br><b>E-mail:</b> ${esc(email)}<br><b>Enviado em:</b> ${esc(quando)}</p>` +
      `<p style="white-space:pre-wrap">${esc(mensagem)}</p>` +
      `<hr><p style="color:#777;font-size:12px">Formulário de contato do fredmosc.tech. Responda este e-mail para falar direto com a pessoa.</p>`;

    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Site fredmosc.tech', email: env.SENDER_EMAIL },
        to: [{ email: env.TO_EMAIL, name: 'Fred' }],
        replyTo: { email, name: nome },
        subject: `[Contato site] ${nome.slice(0, 60)}`,
        htmlContent: corpo,
        textContent: `Nome: ${nome}\nE-mail: ${email}\nEnviado em: ${quando}\n\n${mensagem}`,
        tags: ['contato-site'],
      }),
    });

    if (!r.ok) {
      console.log('brevo', r.status, await r.text());
      return json({ ok: false, erro: 'envio' }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  },
};
