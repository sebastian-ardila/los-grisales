# CloudFront — reescritura a index.html (prerender SEO)

`rewrite-index.js` es una CloudFront Function (viewer-request) que reescribe las
rutas de página (`/es/blog/slug`) a su archivo prerenderizado
(`/es/blog/slug/index.html`). Sin ella, CloudFront/S3 no resuelve el index.html
de subdirectorios y cae al shell del SPA, ocultando el HTML con meta/JSON-LD.

Ya está aplicada a la distribución `ECQDQ3QWZ2QH5` (viewer-request del
DefaultCacheBehavior).

## Actualizar la función
    aws cloudfront describe-function --name los-grisales-rewrite-index   # ver ETag DEV
    aws cloudfront update-function --name los-grisales-rewrite-index \
      --if-match <ETag> --function-config Comment="...",Runtime=cloudfront-js-2.0 \
      --function-code fileb://infra/cloudfront/rewrite-index.js
    aws cloudfront publish-function --name los-grisales-rewrite-index --if-match <ETag>
    aws cloudfront create-invalidation --distribution-id ECQDQ3QWZ2QH5 --paths "/*"

## Revertir (quitar la asociación)
    aws cloudfront get-distribution-config --id ECQDQ3QWZ2QH5 > d.json
    jq '.DistributionConfig | .DefaultCacheBehavior.FunctionAssociations={"Quantity":0}' d.json > m.json
    aws cloudfront update-distribution --id ECQDQ3QWZ2QH5 \
      --if-match $(jq -r .ETag d.json) --distribution-config file://m.json
