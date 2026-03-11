import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'http://localhost:8080';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // si ya es absoluta, pasa
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }
  // si empieza con /api -> prefijar host del backend
  const url = req.url.startsWith('/api')
    ? `${API_BASE_URL}${req.url}`
    : req.url;

  return next(req.clone({ url }));
};
