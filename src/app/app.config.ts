import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        provideAnimations(),
        provideToastr({
            positionClass: 'toast-bottom-center',
            closeButton: true,
            timeOut: 10000,
            extendedTimeOut: 5000,
            enableHtml: true,
            progressBar: true,
            toastClass: 'ngx-toastr toast-override',
          })
    ]
};

export const API_BASE_URL = 'https://recruit-app-e980.onrender.com';
