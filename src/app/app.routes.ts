import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginEmpresaComponent } from './authentication/login-empresa/login-empresa.component';
import { LoginCandidatoComponent } from './authentication/login-candidato/login-candidato.component';
import { RegisterEmpresaComponent } from './authentication/register-empresa/register-empresa.component';
import { RegisterCandidatoComponent } from './authentication/register-candidato/register-candidato.component';
import { UpdateProfileEmpresaComponent } from './update-profile-empresa/update-profile-empresa.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'users/login', component: LoginCandidatoComponent },
    { path: 'users/register', component: RegisterCandidatoComponent },
    { path: 'companies/login', component: LoginEmpresaComponent },
    { path: 'companies/register', component: RegisterEmpresaComponent},
    { path: 'companies/updateProfile', component: UpdateProfileEmpresaComponent},
];
