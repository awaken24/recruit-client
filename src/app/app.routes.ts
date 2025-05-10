import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginEmpresaComponent } from './authentication/login-empresa/login-empresa.component';
import { LoginCandidatoComponent } from './authentication/login-candidato/login-candidato.component';
import { RegisterEmpresaComponent } from './authentication/register-empresa/register-empresa.component';
import { RegisterCandidatoComponent } from './authentication/register-candidato/register-candidato.component';
import { UpdateProfileEmpresaComponent } from './update-profile-empresa/update-profile-empresa.component';
import { EmpresaProfileComponent } from './empresa-profile/empresa-profile.component';
import { CadastroVagaComponent } from './cadastro-vaga/cadastro-vaga.component';
import { EmpresaDashboardComponent } from './empresa-dashboard/empresa-dashboard.component';
import { ListaVagasComponent } from './lista-vagas/lista-vagas.component';
import { DetalhesVagaComponent } from './detalhes-vaga/detalhes-vaga.component';
import { UpdateProfileCandidatoComponent } from './update-profile-candidato/update-profile-candidato.component';
import { CandidatoDashboardComponent } from './candidato-dashboard/candidato-dashboard.component';
import { GerenciarCandidaturasComponent } from './gerenciar-candidaturas/gerenciar-candidaturas.component';
import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';
import { ConfiguracaoEmpresaComponent } from './configuracao-empresa/configuracao-empresa.component';
import { VagasCandidatoRecomendadasComponent } from './vagas-candidato-recomendadas/vagas-candidato-recomendadas.component';
import { CandidatoProfileComponent } from './candidato-profile/candidato-profile.component';
import { ConfiguracaoCandidatoComponent } from './configuracao-candidato/configuracao-candidato.component';

// Guards
import { candidatoGuard } from './guards/candidato.guard';
import { empresaGuard } from './guards/empresa.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'users/login', component: LoginCandidatoComponent },
    { path: 'users/register', component: RegisterCandidatoComponent },
    { path: 'companies/login', component: LoginEmpresaComponent },
    { path: 'companies/register', component: RegisterEmpresaComponent },
    { path: 'companies/profile/editar/:id', component: UpdateProfileEmpresaComponent, data: { mode: 'edit' } },
    { path: 'companies/profile/completar', component: UpdateProfileEmpresaComponent, canActivate: [authGuard, empresaGuard], data: { mode: 'create' } },
    { path: 'companies/profile', component: EmpresaProfileComponent },
    { path: 'companies/jobs/new', component: CadastroVagaComponent, canActivate: [authGuard, empresaGuard] },
    { path: 'vagas', component: ListaVagasComponent },
    { path: 'vagas/:id', component: DetalhesVagaComponent },
    { path: 'candidate/profile/editar/:id', component: UpdateProfileCandidatoComponent, canActivate: [authGuard, candidatoGuard], data: { mode: 'edit' } },
    { path: 'candidate/profile/completar', component: UpdateProfileCandidatoComponent, canActivate: [authGuard, candidatoGuard], data: { mode: 'create' } },
    { path: 'candidate/dashboard', component: CandidatoDashboardComponent, canActivate: [authGuard, candidatoGuard] },
    { path: 'companies/vagas/:id/candidaturas', component: GerenciarCandidaturasComponent, canActivate: [authGuard, empresaGuard] },
    { path: 'candidato/profile/:id', component: CandidatoProfileComponent, canActivate: [authGuard] },
    { path: 'acesso-negado', component: AcessoNegadoComponent },    
    {
        path: 'companies/dashboard',
        component: EmpresaDashboardComponent,
        canActivate: [authGuard, empresaGuard],
        children: [
            { path: '', redirectTo: 'vagas', pathMatch: 'full' },
            { path: 'configuracoes', component: ConfiguracaoEmpresaComponent }
        ]
    },
    {
        path: 'candidate/dashboard',
        component: CandidatoDashboardComponent,
        canActivate: [authGuard, candidatoGuard],
        children: [
            { path: '', redirectTo: 'oportunidades', pathMatch: 'full' },
            { path: 'oportunidades', component: VagasCandidatoRecomendadasComponent },
            { path: 'candidaturas', component: VagasCandidatoRecomendadasComponent },
            { path: 'configuracoes', component: ConfiguracaoCandidatoComponent }
        ]
    },
];
