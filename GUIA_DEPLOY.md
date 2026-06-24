# 🚀 Guia de Deploy - GitHub Pages

## Como publicar seu portfólio no GitHub Pages

### Passo 1: Preparar o Repositório

1. Certifique-se de que todos os arquivos estão commitados:
```bash
git add .
git commit -m "Melhorias de UI/UX - Design moderno e responsivo"
git push origin main
```

### Passo 2: Ativar GitHub Pages

1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione a branch `main`
5. Selecione a pasta `/ (root)`
6. Clique em **Save**

### Passo 3: Aguardar o Deploy

- O GitHub Pages levará alguns minutos para fazer o deploy
- Seu site estará disponível em: `https://seu-usuario.github.io/nome-do-repositorio/`

---

## 📋 Checklist Pré-Deploy

Antes de fazer o deploy, verifique:

- [ ] Todas as imagens estão no diretório `assets/img/`
- [ ] Os caminhos das imagens estão corretos (relativos, não absolutos)
- [ ] O arquivo `index.html` está na raiz do projeto
- [ ] Todos os links internos usam caminhos relativos
- [ ] Meta tags de SEO estão preenchidas
- [ ] Não há informações sensíveis no código

---

## 🔧 Solução de Problemas

### Imagens não aparecem?
- Verifique se os caminhos usam `/` e não `\`
- Use caminhos relativos: `assets/img/foto.jpg` em vez de `/assets/img/foto.jpg`

### CSS não carrega?
- Confirme que o arquivo `style.css` está em `assets/css/`
- Verifique o link no HTML: `<link href="assets/css/style.css">`

### JavaScript não funciona?
- Abra o Console do navegador (F12) e veja se há erros
- Verifique se todos os scripts vendor estão carregando

---

## 🎨 Customização de Cores

Para alterar as cores do tema, edite as variáveis CSS no arquivo `assets/css/style.css`:

```css
:root {
  --color-primary: #149ddd;        /* Cor principal */
  --color-primary-dark: #0d7ab8;   /* Cor escura */
  --color-primary-light: #37b3ed;  /* Cor clara */
  --color-secondary: #173b6c;      /* Cor secundária */
}
```

---

## 📱 Teste de Responsividade

Teste seu site em:
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (375x667, 414x896)

Use o DevTools do navegador (F12 > Toggle Device Toolbar)

---

## 🔍 SEO e Performance

### Google Search Console
1. Adicione seu site no [Google Search Console](https://search.google.com/search-console)
2. Envie o sitemap (se tiver)
3. Monitore indexação e erros

### PageSpeed Insights
1. Teste em [PageSpeed Insights](https://pagespeed.web.dev/)
2. Implemente sugestões de performance
3. Alvo: Score 90+ em Mobile e Desktop

### Lighthouse
1. Abra DevTools (F12)
2. Vá para a aba Lighthouse
3. Execute auditoria completa
4. Corrija problemas encontrados

---

## 📊 Analytics (Opcional)

### Google Analytics 4

Adicione antes do `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔐 Domínio Personalizado (Opcional)

### Configurar domínio próprio

1. Compre um domínio (ex: www.seunome.com.br)
2. No GitHub Pages, adicione o domínio custom
3. Configure os DNS:
   - Tipo A: apontar para IPs do GitHub:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - CNAME: www → seu-usuario.github.io

4. Ative "Enforce HTTPS" nas configurações

---

## 🛠️ Manutenção

### Atualizar conteúdo

1. Edite os arquivos localmente
2. Teste no navegador (abra `index.html`)
3. Commit e push:
```bash
git add .
git commit -m "Atualização de conteúdo"
git push origin main
```

### Backup

Mantenha backup do seu código:
- Clone em outro local
- Use múltiplos remotes (GitLab, Bitbucket)
- Faça download periódico do ZIP

---

## 📞 Links Úteis

- [GitHub Pages Docs](https://docs.github.com/pt/pages)
- [Markdown Guide](https://www.markdownguide.org/)
- [Can I Use](https://caniuse.com/) - Compatibilidade de recursos web
- [W3C Validator](https://validator.w3.org/) - Validar HTML
- [CSS Validator](https://jigsaw.w3.org/css-validator/) - Validar CSS

---

## ✅ Status do Projeto

- ✅ UI/UX modernizada
- ✅ Código traduzido para PT-BR
- ✅ Responsivo para todos os dispositivos
- ✅ SEO otimizado
- ✅ Acessibilidade implementada
- ✅ Performance otimizada
- ✅ Pronto para deploy!

---

**Boa sorte com seu portfólio! 🚀**
