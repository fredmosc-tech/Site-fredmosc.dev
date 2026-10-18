# Worker do formulário de contato

Recebe o formulário de `/contato.html`, confere o Cloudflare Turnstile e envia a mensagem pelo Brevo (API transacional) para `contato@fredmosc.tech`, com reply-to no e-mail de quem escreveu.

```
site (contato.html) -> https://api.fredmosc.tech -> Turnstile (siteverify) -> Brevo /v3/smtp/email -> contato@fredmosc.tech -> Email Routing -> Gmail
```

## Deploy

Automático pelo **Workers Builds** da Cloudflare: todo push na `main` que mexe nesta pasta roda `npx wrangler deploy` com raiz em `worker/contato`. Não precisa rodar nada local.

## Configuração

- Variáveis (versionadas no `wrangler.toml`): `TO_EMAIL`, `SENDER_EMAIL`, `ALLOWED_ORIGINS`.
- Segredos (só no painel do Worker, em Settings > Variables and Secrets, tipo Secret):
  - `BREVO_API_KEY`: chave da API da conta Brevo do fredmosc.tech
  - `TURNSTILE_SECRET`: secret do widget Turnstile usado no site
- Endereço: domínio próprio `api.fredmosc.tech` (`workers_dev = false`, então não responde em `*.workers.dev`).

## Respostas

`{ ok: true }` em sucesso. Em erro, `{ ok: false, erro }` com `erro` em: `origem`, `formato`, `nome`, `email`, `mensagem`, `robo` (Turnstile falhou) ou `envio` (Brevo recusou; detalhe nos logs do Worker).
