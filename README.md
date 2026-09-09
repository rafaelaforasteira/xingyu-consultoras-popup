# Xingyu Consultoras Popup

Central de Consultoras Xingyu: uma aplicação independente mobile-first e um widget reutilizável, com rodízio global justo, fallback local, WhatsApp dinâmico por origem e analytics próprio. A linguagem visual deriva da LinkPage oficial: fundo branco, coral, cinza quente, tipografia editorial e contornos suaves.

## Stack e arquitetura

- Vite + TypeScript no frontend, sem framework de UI.
- Node.js 24 + Express no backend.
- SQLite nativo (`node:sqlite`), WAL e transação `BEGIN IMMEDIATE`.
- Vitest, Supertest, ESLint e TypeScript.

```text
src/
  demo/       página local de demonstração
  widget/     modal isolado, fallback e analytics
  shared/     configuração e algoritmo compartilhados
  server/     API, banco e repositório transacional
data/         banco local ignorado pelo Git
```

## Instalar, executar, testar e compilar

Requer Node.js 24+. Rode `npm install` e `npm run dev`. A demo Vite fica em `http://localhost:5173` e a API em `http://localhost:5178`.

Para testar o build servido pelo backend: `npm run build`, `npm start` e abra `http://localhost:5178`. Qualidade: `npm test`, `npm run lint`, `npm run typecheck` e `npm run build`.

## Consultoras

Edite somente `src/shared/consultants.ts`. Ali ficam nome, telefone, `active` e ordem base. Use telefone internacional somente com dígitos. Adicione um objeto para incluir; use `active: false` para retirar do rodízio. A configuração atual contém Vane, May, Cris e Deise.

## UTMs e WhatsApp

A aplicação preserva e registra `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `document.referrer`. `src/shared/sources.ts` converte aliases técnicos sem alterar o valor armazenado: `instagram`/`ig` → “Instagram”, `tiktok`/`tt` → “TikTok” e `site`/`website` → “site da Xingyu”.

`src/shared/whatsapp.ts` gera e codifica a mensagem. Com `?utm_source=instagram`, Deise recebe “Olá, Deise! Tudo bem? Vim pelo Instagram e preciso de ajuda. Pode me ajudar?”. Sem origem reconhecida, a mensagem é neutra: “Olá, Cris! Tudo bem? Gostaria de falar com uma consultora da Xingyu. Pode me ajudar?”.

Exemplos locais:

- Instagram: `http://localhost:5173/?utm_source=instagram&utm_medium=social&utm_content=link_bio`
- TikTok: `http://localhost:5173/?utm_source=tiktok`
- Site: `http://localhost:5173/?utm_source=site`

## Rodízio e fallback

Cada `POST /api/rotation/next` reivindica atomicamente o contador, incrementa-o e devolve a rotação pelo offset `contador % quantidade ativa`. A transação garante o ciclo compartilhado entre dispositivos. Só uma transição fechada→aberta chama a API; resize, re-render, cliques internos e duplo clique não incrementam.

Se a API falhar, o widget aplica o mesmo algoritmo com contador em `localStorage`, sem erro técnico visível.

## Analytics, banco e rotas

O SQLite é criado automaticamente em `data/xingyu.sqlite`. `consultant_clicks` armazena consultora, posição, data ISO, UTMs e referrer. O envio usa `sendBeacon` (ou `fetch keepalive`) e não bloqueia o WhatsApp.

- `GET /api/health`
- `POST /api/rotation/next`
- `POST /api/events/click`

Variáveis em `.env.example`: `PORT`, `DATABASE_PATH`, `ALLOWED_ORIGINS` e `PUBLIC_API_URL`. Configure origens explicitamente em produção.

## API de incorporação

```ts
import { XingyuConsultantPopup } from './widget/ConsultantPopup';
XingyuConsultantPopup.init({ trigger: '#falar-com-consultora', apiUrl: 'https://api.seu-dominio.com' });
```

Também aceita `consultants` e `message`. O CSS usa namespace `xingyu-consultant-popup` e tokens prefixados `--xingyu-`.

## Integração futura com a LinkPage Xingyu

1. Hospede o backend com volume persistente e permita `https://consultoras.xingyujewelry.com.br` e `https://lp.xingyujewelry.com.br` em `ALLOWED_ORIGINS`.
2. Importe o widget no bundle da LinkPage ou publique seu build como asset.
3. Inicialize no botão real, passando seu seletor e a URL pública da API.
4. Valide CORS, UTMs, foco e WhatsApp em homologação.

Não há painel, CRM, WhatsApp API, autenticação ou credenciais neste projeto.
