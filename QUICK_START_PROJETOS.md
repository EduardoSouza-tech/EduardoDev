# 🎯 QUICK START - Adicionar Projetos

## ⚡ 3 Passos Rápidos

### 1️⃣ Adicionar Imagens (5 minutos)

Crie a pasta se não existir:
```
assets/img/portfolio/
```

Adicione 5 imagens com estes nomes:
- `projeto-1.jpg`
- `projeto-2.jpg`
- `projeto-3.jpg`
- `projeto-4.jpg`
- `projeto-5.jpg`

**Sem imagens ainda?** Use placeholder temporário:
- Vá em [Placeholder.com](https://placeholder.com/)
- Baixe imagens 800x600px
- Ou use Canva para criar thumbnails

---

### 2️⃣ Editar Informações (10 minutos)

Abra `index.html` e procure por `<!-- ======= Seção Projetos ======= -->`

Para cada card de projeto, edite:

```html
<h4>Nome do Projeto 1</h4>  <!-- ✏️ MUDE AQUI -->
<p>Breve descrição...</p>   <!-- ✏️ MUDE AQUI -->

<!-- ✏️ Edite as tags -->
<span class="tag">HTML</span>
<span class="tag">CSS</span>

<!-- ✏️ Adicione seus links -->
<a href="https://github.com/seu-usuario/projeto" ...>
```

---

### 3️⃣ Testar (2 minutos)

1. Abra `index.html` no navegador
2. Clique em "Projetos" no menu
3. Verifique se tudo aparece corretamente
4. Teste os links

---

## 🎨 Template de Projeto Preenchido

Copie e cole este exemplo:

```html
<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
  <div class="project-card">
    <div class="project-img">
      <img src="assets/img/portfolio/meu-projeto.jpg" alt="Meu Projeto" class="img-fluid">
      <div class="project-overlay">
        <div class="project-links">
          <a href="https://github.com/meu-usuario/meu-projeto" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ver código no GitHub">
            <i class="bx bxl-github"></i>
          </a>
          <a href="https://meu-projeto-demo.com" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ver demonstração">
            <i class="bx bx-link-external"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="project-info">
      <h4>Meu Super Projeto</h4>
      <p>Um sistema incrível que faz X, Y e Z. Desenvolvido com as melhores práticas e tecnologias modernas.</p>
      <div class="project-tags">
        <span class="tag">Python</span>
        <span class="tag">JavaScript</span>
        <span class="tag">SQL</span>
      </div>
    </div>
  </div>
</div>
```

---

## 📋 Lista de Verificação Rápida

Antes de publicar, verifique:

✅ As 5 imagens estão na pasta `assets/img/portfolio/`  
✅ Os nomes dos arquivos estão corretos (projeto-1.jpg, etc)  
✅ Mudei os títulos dos 5 projetos  
✅ Mudei as descrições dos 5 projetos  
✅ Atualizei as tags de tecnologia  
✅ Coloquei os links do GitHub corretos  
✅ Removi ou atualizei links de demo  
✅ Testei no navegador e está tudo funcionando  

---

## 🚨 Problemas Comuns

### Imagens não aparecem?
- Verifique se estão na pasta correta
- Use barras `/` não `\` nos caminhos
- Confira os nomes dos arquivos (case sensitive)

### Cards desalinhados?
- Cada projeto precisa estar dentro de `<div class="col-lg-4 col-md-6 mb-4">`
- Mantenha a estrutura HTML completa

### Links não funcionam?
- Verifique se incluiu `https://`
- Teste os links diretamente no navegador

---

## 💡 Dica de Ouro

**Não tem 5 projetos prontos?**

Opções:
1. Use apenas 3 cards (remova 2)
2. Adicione projetos que está desenvolvendo ("Em desenvolvimento")
3. Inclua exercícios/desafios bem feitos
4. Adicione este próprio portfólio como um projeto!

---

**Pronto! Seus projetos estão configurados! 🎉**

Salve o arquivo e atualize o navegador (F5) para ver as mudanças.
