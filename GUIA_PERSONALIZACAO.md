# 🎨 Guia de Personalização do Portfólio

## Como personalizar seu portfólio de forma fácil

---

## 🖼️ Trocar Imagens

### Foto de Perfil
1. Substitua `assets/img/profile-img.jpg` pela sua foto
2. Formato recomendado: JPG ou PNG
3. Tamanho ideal: 400x400px (quadrado)
4. Peso máximo: 200KB

### Foto "Sobre Mim"
1. Substitua `assets/img/profile2.jpg`
2. Tamanho recomendado: 800x600px
3. Formato: JPG ou PNG

### Background do Hero
1. Substitua `assets/img/hero-bg.jpg`
2. Tamanho recomendado: 1920x1080px
3. Escolha imagem escura ou use overlay

---

## ✏️ Editar Textos

### Nome e Título
Arquivo: `index.html`, linha ~42-65

```html
<h1 class="text-light"><a href="index.html">SEU NOME AQUI</a></h1>

<!-- Na seção Hero -->
<h1>Seu Nome</h1>
<p>Estudando <span class="typed" data-typed-items="Sua, Lista, De, Habilidades"></span></p>
```

### Sobre Você
Arquivo: `index.html`, linha ~75-86

Edite o parágrafo dentro da `<section id="sobre">`:
```html
<p>Seu texto sobre você aqui...</p>
```

### Informações de Contato
Arquivo: `index.html`, linha ~100-114

```html
<li><i class="bi bi-chevron-right"></i> <strong>Telefone:</strong> <span>Seu telefone</span></li>
<li><i class="bi bi-chevron-right"></i> <strong>E-mail:</strong> <span>seu@email.com</span></li>
<li><i class="bi bi-chevron-right"></i> <strong>Cidade:</strong> <span>Sua Cidade</span></li>
```

---

## 🎯 Ajustar Habilidades

Arquivo: `index.html`, seção Skills (linha ~130-170)

### Adicionar nova habilidade:
```html
<div class="progress">
  <span class="skill">Nome da Skill <i class="val">80%</i></span>
  <div class="progress-bar-wrap">
    <div class="progress-bar" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" aria-label="Habilidade em [Nome]: 80%"></div>
  </div>
</div>
```

### Remover habilidade:
Delete o bloco `<div class="progress">...</div>` correspondente

---

## 🔗 Links Sociais

Arquivo: `index.html`, linha ~47-50

### Adicionar Instagram:
```html
<a href="https://www.instagram.com/seu_usuario/" class="instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
  <i class="bx bxl-instagram"></i>
</a>
```

### Adicionar GitHub:
```html
<a href="https://github.com/seu-usuario" class="github" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
  <i class="bx bxl-github"></i>
</a>
```

### Outros ícones disponíveis:
- Twitter: `bxl-twitter`
- Facebook: `bxl-facebook`
- WhatsApp: `bxl-whatsapp`
- YouTube: `bxl-youtube`
- TikTok: `bxl-tiktok`

Veja mais em: [Boxicons](https://boxicons.com/)

---

## 🎨 Mudar Cores do Tema

Arquivo: `assets/css/style.css`, linhas ~8-22

```css
:root {
  --color-primary: #149ddd;        /* Azul principal - mude aqui */
  --color-primary-dark: #0d7ab8;   /* Versão escura */
  --color-primary-light: #37b3ed;  /* Versão clara */
  --color-secondary: #173b6c;      /* Cor secundária */
}
```

### Sugestões de paletas:

**Verde Profissional:**
```css
--color-primary: #10b981;
--color-primary-dark: #059669;
--color-primary-light: #34d399;
```

**Roxo Moderno:**
```css
--color-primary: #8b5cf6;
--color-primary-dark: #7c3aed;
--color-primary-light: #a78bfa;
```

**Laranja Energético:**
```css
--color-primary: #f59e0b;
--color-primary-dark: #d97706;
--color-primary-light: #fbbf24;
```

**Rosa Criativo:**
```css
--color-primary: #ec4899;
--color-primary-dark: #db2777;
--color-primary-light: #f472b6;
```

---

## 📝 Experiência Profissional

Arquivo: `index.html`, seção Resume (linha ~240-280)

### Adicionar novo trabalho:
```html
<div class="resume-item">
  <h4>Cargo</h4>
  <h5>Ano Início - Ano Fim</h5>
  <h6>Nome da Empresa</h6>
  <p><em>Cidade, Estado</em></p>
  <ul>
    <li>Responsabilidade 1</li>
    <li>Responsabilidade 2</li>
    <li>Responsabilidade 3</li>
  </ul>
</div>
```

---

## 🎓 Educação e Certificados

Arquivo: `index.html`, seção Educação (linha ~150-210)

### Adicionar certificado com imagem:
```html
<div class="card" style="width: 18rem;">
  <a href="assets/img/seu-certificado.png" data-lightbox="certificado" data-title="Nome do Certificado">
    <img src="assets/img/seu-certificado.png" class="card-img-top" alt="Nome do Certificado">
  </a>
  <div class="card-body">
    <h5 class="card-title">Título</h5>
    <p class="card-text">Descrição do curso</p>
    <p>Instituição</p>
    <p><time datetime="2024-01-15">Obtido em 15 Jan-2024</time></p>
  </div>
</div>
```

---

## 🚀 Menu de Navegação

Arquivo: `index.html`, linha ~52-57

### Adicionar novo item:
```html
<li>
  <a href="#nome-secao" class="nav-link scrollto">
    <i class="bx bx-icone"></i> <span>Nome do Item</span>
  </a>
</li>
```

Ícones disponíveis:
- Home: `bx-home`
- Sobre: `bx-user`
- Currículo: `bx-file-blank`
- Portfólio: `bx-book-content`
- Serviços: `bx-server`
- Contato: `bx-envelope`

---

## 🌐 Idioma do Site

Arquivo: `index.html`, linha 2

```html
<html lang="pt-BR">  <!-- Português Brasil -->
<html lang="en">     <!-- Inglês -->
<html lang="es">     <!-- Espanhol -->
```

---

## ⚙️ Meta Tags e SEO

Arquivo: `index.html`, linha ~7-14

```html
<title>Seu Nome - Seu Título Profissional</title>
<meta content="Descrição curta e atrativa sobre você e suas habilidades" name="description">
<meta content="palavra-chave1, palavra-chave2, palavra-chave3" name="keywords">
<meta name="author" content="Seu Nome">
```

---

## 🎭 Fontes

Para mudar a fonte do site, edite em `index.html`, linha ~17:

### Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
```

Depois em `assets/css/style.css`:
```css
body {
  font-family: "Poppins", sans-serif;
}
```

Fontes recomendadas:
- **Moderna**: Inter, Poppins, Montserrat
- **Profissional**: Roboto, Open Sans, Lato
- **Criativa**: Playfair Display, Raleway, Nunito

---

## 📐 Espaçamentos

Para ajustar espaçamentos gerais, edite `assets/css/style.css`:

```css
section {
  padding: 60px 0;  /* Ajuste este valor */
}

.section-title {
  padding-bottom: 30px;  /* Espaço após títulos */
}
```

---

## 🔄 Velocidade de Animações

Arquivo: `assets/css/style.css`, linha ~15:

```css
:root {
  --transition-base: all 0.3s ease;  /* Mude para 0.5s para mais lento */
}
```

Ou em `assets/js/main.js`, linha ~253:
```javascript
AOS.init({
  duration: 1000,  /* Duração em ms */
  easing: 'ease-in-out',
  once: true,
})
```

---

## 💡 Dicas Importantes

1. **Sempre faça backup** antes de grandes mudanças
2. **Teste em diferentes navegadores** (Chrome, Firefox, Safari, Edge)
3. **Valide seu HTML** em [W3C Validator](https://validator.w3.org/)
4. **Otimize imagens** com [TinyPNG](https://tinypng.com/) antes de adicionar
5. **Use Git** para controle de versão:
   ```bash
   git add .
   git commit -m "Descrição da mudança"
   git push
   ```

---

## 🆘 Ajuda e Suporte

### Recursos úteis:
- [MDN Web Docs](https://developer.mozilla.org/) - Documentação HTML/CSS/JS
- [Stack Overflow](https://stackoverflow.com/) - Comunidade de desenvolvedores
- [CSS-Tricks](https://css-tricks.com/) - Dicas e truques de CSS
- [Can I Use](https://caniuse.com/) - Compatibilidade de recursos

### Vídeos tutoriais:
- Busque por "HTML CSS portfolio tutorial" no YouTube
- Canais recomendados: Traversy Media, freeCodeCamp, Web Dev Simplified

---

**Personalize com criatividade e boa sorte! 🌟**
