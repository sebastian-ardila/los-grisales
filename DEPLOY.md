# Deploy — Café Los Grisales

Vite SPA. Build emite a `dist/`. El workflow en `.github/workflows/deploy.yml`
sincroniza a S3 e invalida CloudFront en cada push a `main` (también
disponible con `workflow_dispatch` desde la UI de Actions).

## Infraestructura AWS

Toda en la cuenta `339712768913`, región `us-east-1`.

| | |
|---|---|
| Dominio | `cafelosgrisales.com` (apex) + `www.cafelosgrisales.com` |
| S3 bucket | `cafelosgrisales-prod` (privado, acceso solo vía OAC) |
| CloudFront distribution | `ECQDQ3QWZ2QH5` |
| CloudFront origin domain | `d1u0mibbsb7u0j.cloudfront.net` |
| OAC | `E1JU6X1YWGKRZH` |
| ACM cert (us-east-1) | `arn:aws:acm:us-east-1:339712768913:certificate/d230304e-91cc-4a05-b273-63938697be39` |
| Route 53 hosted zone | `cafelosgrisales.com` |
| OIDC role (GitHub Actions) | `arn:aws:iam::339712768913:role/GitHubActionsCafeLosGrisalesDeployRole` |
| Tags | `Project=cafe-los-grisales`, `Environment=production`, `Owner=cafe-los-grisales` |

## CloudFront — configuración clave

- **Origin**: S3 bucket vía OAC (Origin Access Control). El bucket es privado;
  sólo CloudFront puede leer, condición `AWS:SourceArn = <distribution ARN>`.
- **Default Root Object**: `index.html`.
- **Custom Error Responses**:
  - 403 → `/index.html` con 200 (HashRouter no genera 403 normalmente, pero
    sirve de cinturón).
  - 404 → `/index.html` con 200 (cualquier URL desconocida sirve el SPA;
    React Router toma el control y enseña la home si no hay match).
- **Viewer protocol**: redirect-to-https (todo HTTP fuerza a HTTPS).
- **TLS**: TLSv1.2_2021 mínimo, SNI-only.
- **HTTP version**: HTTP/2 + HTTP/3.
- **Cache policy**: `Managed-CachingOptimized` (default).
- **Price class**: `PriceClass_100` (US/Canada/Europe — más barato; latencia
  desde Colombia ~50ms vs ~30ms en PriceClass_All, aceptable y ahorra ~30%).
- **Compress**: on.

## DNS

Apex y `www` viven en Route 53 (zona `cafelosgrisales.com`). GoDaddy queda
como registrador, pero los NS apuntan a Route 53. Apex usa A-alias a la
distribution (no CNAME — apex no puede tener CNAME). `www` también es
A-alias a la misma distribution.

Cuando renueve ACM (automático cada ~13 meses), añade dos CNAME validation
records a la zona; ya están y son permanentes.

## Build local + preview

```bash
npm install
npm run build       # vite build → dist/
npm run preview     # http://localhost:4173
```

## Deploy manual (fuera del workflow)

```bash
npm ci
npm run build

# Hashed assets — long cache
aws s3 sync dist/ s3://cafelosgrisales-prod/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "*.pdf" \
  --exclude "og-image.jpg" \
  --exclude "favicon*" \
  --exclude "apple-touch-icon*"

# HTML + root files — short cache
aws s3 sync dist/ s3://cafelosgrisales-prod/ \
  --cache-control "public, max-age=60, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.pdf" \
  --include "og-image.jpg" \
  --include "favicon*" \
  --include "apple-touch-icon*"

# Invalida CloudFront
aws cloudfront create-invalidation \
  --distribution-id ECQDQ3QWZ2QH5 \
  --paths "/*"
```

## Cache strategy

- **Hashed assets** (`assets/index-XYZ.js`, etc.): `max-age=31536000, immutable`.
  Vite emite nombres con hash de contenido, así que un archivo nunca cambia
  contenido sin cambiar nombre. Inmutable es seguro.
- **HTML + recursos sin hash** (`index.html`, `og-image.jpg`, PDFs, favicons):
  `max-age=60, must-revalidate`. Cambios llegan en ~1 min sin invalidación.
- **Invalidación CloudFront**: `/*` después de cada deploy para forzar refresh
  inmediato. 1000 invalidaciones gratis al mes; con un deploy diario sobran.

## Rollback

```bash
git checkout <commit-anterior>
npm ci && npm run build
# Repetir el deploy manual de arriba
```

O simplemente revertir el commit en GitHub — el workflow re-despliega.

## Costos esperados

Tráfico típico de portafolio pequeño (~5 GB/mes egress + ~50K requests):
- S3: ~$0.10/mes (storage 200 MB + requests)
- CloudFront: ~$0.50/mes (egress PriceClass_100)
- Route 53: $0.50/mes (hosted zone) + queries ($0.40 por millón, despreciable)
- ACM cert: gratis
- **Total**: ~$1-2/mes

## Migración histórica

Migrado de **GitHub Pages + GoDaddy DNS** a **S3 + CloudFront + Route 53**
el 2026-06-03. Documentación de la migración (referencias DNS, CAA, etc.)
en el historial git.
