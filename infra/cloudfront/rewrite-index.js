// CloudFront Function (viewer-request): sirve el index.html prerenderizado de
// cada ruta de página. Sin esto, CloudFront/S3 no resuelve /es/blog/slug ->
// /es/blog/slug/index.html y cae al shell del SPA, ocultando el HTML SEO.
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
