# Casa Colorida · Tempo & Amor — Vila do Bispo

Site estático de duas casas de férias em Vila do Bispo, Algarve. Implementado a partir do design Claude/Figma ("Slow Stays"). Fiel aos tokens e estrutura do design original.

## Páginas
| Ficheiro | Descrição |
|---|---|
| `index.html` | Home — hero + widget de reserva (com calendário), intro, as duas casas sobre o mural de azulejos, Discover (mosaico), FAQ |
| `booking.html` | Pedido de reserva — página única: estadia (datas/hóspedes/casa/extras) + contacto. Sem pagamento online; envia por `mailto:` |
| `styles.css` | Design tokens (CSS vars) + componentes partilhados |
| `site.js` | Header sticky, reveal-on-scroll, drawer mobile |
| `assets/fig/` | Fotografia real (já redimensionada para web) |

## Marca
- **Vozes:** calma, morna, PT + acentos EN ("stay slow, feel at home").
- **Donos:** Andrea & Mató. **Casas:** Casa Colorida (até 4), Tempo & Amor (T1, 2 hóspedes, +20€ pet).
- **Tipos:** Inter (UI/títulos) + Bad Script (acentos emocionais).
- **Cores:** sage `#82B8B5`, terracotta `#D2976E`, peach `#FFB583`, danger `#C00F0C`.

## Correr localmente
```
python -m http.server 4555
```
Abrir http://127.0.0.1:4555/

## Formulário de reserva
`booking.html` envia via **Web3Forms** (POST a `https://api.web3forms.com/submit`) — sem servidor próprio. Email cai em `reddunesolutions@gmail.com`. Inclui honeypot anti-spam. A `access_key` está inline no JS (não é segredo: vive no frontend por design). Nota: site estático não lê `.env.local`; esse ficheiro é só registo para uma futura versão com build (Vite/Next).

## Por fazer (produção)
- **Pagamento:** se for preciso cobrar online, integrar provedor externo (Stripe/Adyen/Mollie — Mollie cobre Bizum/MB WAY/SEPA). Atualmente não há pagamento (só pedido de disponibilidade).
- **Disponibilidade/preços:** sazonalidade e mínimo de noites por implementar no backend.
- **Imagens responsivas:** servir `srcset` e formatos modernos (webp/avif).
- **i18n:** copy PT-first com acentos EN; estruturar para toggle PT/EN se necessário.
