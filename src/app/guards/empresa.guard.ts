import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const empresaGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const usuario = authService.getUser();

    if (usuario && usuario.usuarioable_type === 'App\\Models\\Empresa') {
        return true;
    }

    return router.createUrlTree(['/acesso-negado']);
};

