import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Skip loader for specific endpoints if needed
  const skipLoader = req.headers.has('X-Skip-Loading');

  if (skipLoader) {
    const newReq = req.clone({
      headers: req.headers.delete('X-Skip-Loading'),
    });
    return next(newReq);
  }

  console.log('Loading Interceptor: Request started', req.url);
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      console.log('Loading Interceptor: Request finished', req.url);
      loadingService.hide();
    })
  );
};
