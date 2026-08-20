# Casa Colorida · Tempo & Amor

Site das duas casas de férias **Casa Colorida** (T2) e **Tempo & Amor** (T1) em Vila do Bispo, Algarve. Donos: Andrea & Mató. Desenvolvido por [RedDune Solutions](https://reddunesolutions.pt) & Sacra Design.

**Live:** https://casas-coloridas.pt/

## Stack

HTML/CSS/JS estático puro, sem build. Deploy automático via GitHub Pages (branch `main`, raiz).

| Ficheiro | O que é |
|---|---|
| `index.html` | Home — hero + widget ("passo seguinte" leva à página da casa com a selecção), casas, lugares (Vila do Bispo), FAQ |
| `casa-colorida.html` / `tempo-amor.html` | Páginas de detalhe com galeria (lightbox em `casa.js`) **e o pedido de reserva** — envia por **FormSubmit** (AJAX, sem chave nem conta), com honeypot e cooldown, sem pagamento online |
| `privacidade.html` | Política de privacidade RGPD (noindex) |
| `styles.css` | Tokens + componentes |
| `i18n.js` | Bilingue PT/EN em runtime (`data-i18n*`, localStorage `cc_lang`) |
| `site.js` | Header, reveal, drawer mobile, dropdowns custom |

## Manutenção

- **Cache-busting:** ao alterar `styles.css` / `i18n.js` / `site.js` / `casa.js`, bumpar o `?v=` nas 5 páginas — senão os visitantes ficam presos à versão antiga.
- **Antes de commit:** `grep -l "omelette-injected" *.html` tem de devolver vazio (artefacto do preview do Claude Design; não pode ir para produção).
- **Imagens:** WebP (convertidas com sharp, q78-80). Os 3 JPG restantes (`hero`, `colorida-10`, `tempo-07`) são para og:image/JSON-LD — não apagar. O `hero.jpg` acumula os dois papéis: fundo do hero e og:image do index.
- **Ícones:** as amenities usam PNG, excepto 9 (`bbq`, `cooktop`, `dehumidifier`, `dishwasher`, `fan`, `games`, `heater`, `tv`, `wifi`) que já têm SVG idêntico ao PNG e foram migradas. Os restantes SVG do Figma desenhavam outra coisa e foram descartados.
- **Créditos:** fotos do local vêm do Wikimedia Commons (CC) — a linha de créditos no rodapé do index é obrigatória.
