# Amplia — Plataforma de livros independentes

## Stack
- **Next.js 14** (App Router)
- **Supabase** (auth + banco de dados)
- **Asaas** (pagamentos — Pix e cartão)
- **Resend** (e-mails transacionais)
- **Tailwind CSS**
- **PWA** pronta para gerar APK via PWABuilder

---

## Deploy no Vercel

### 1. Suba no GitHub
```bash
git init
git add .
git commit -m "feat: projeto inicial"
git remote add origin https://github.com/SEU_USUARIO/amplia.git
git push -u origin main
```

### 2. Importe no Vercel
- Acesse [vercel.com/new](https://vercel.com/new)
- Importe o repositório do GitHub
- Configure as variáveis de ambiente (veja `.env.example`)

### 3. Variáveis de ambiente obrigatórias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ASAAS_ENV=sandbox        # troque para "production" em produção
ASAAS_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@seudominio.com
NEXT_PUBLIC_APP_URL=https://seudominio.com
```

---

## Gerar APK para Play Store (TWA via PWABuilder)

1. Faça o deploy na Vercel e confirme que o site está no ar
2. Acesse [pwabuilder.com](https://www.pwabuilder.com)
3. Cole a URL do seu site (ex: `https://amplia.vercel.app`)
4. Clique em **Package for stores → Android**
5. Gere o APK e a **keystore** (guarde o arquivo keystore.jks com segurança!)
6. Pegue o SHA-256 da keystore:
   ```bash
   keytool -list -v -keystore keystore.jks -alias android | grep SHA256
   ```
7. Cole o SHA-256 em `public/.well-known/assetlinks.json` substituindo `SUBSTITUA_PELA_SHA256_DA_SUA_KEYSTORE`
8. Faça commit e aguarde o redeploy
9. Suba o APK no Google Play Console

---

## Desenvolvimento local
```bash
npm install
cp .env.example .env.local
# Preencha as variáveis em .env.local
npm run dev
```
