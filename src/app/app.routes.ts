import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
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
import { SobreNosComponent } from './pages/sobre-nos/sobre-nos.component';
import { TermosComponent } from './pages/termos/termos.component';
import { PoliticaPrivacidadeComponent } from './pages/politica-privacidade/politica-privacidade.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';

// Guards
import { candidatoGuard } from './guards/candidato.guard';
import { empresaGuard } from './guards/empresa.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'users/login', component: LoginComponent },
    { path: 'users/register', component: RegisterComponent },
    { path: 'companies/login', component: LoginComponent },
    { path: 'companies/register', component: RegisterComponent },
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
    { path: 'sobre-nos', component: SobreNosComponent },
    { path: 'termos', component: TermosComponent },
    { path: 'politica-de-privacidade', component: PoliticaPrivacidadeComponent },
    { path: 'contato', component: ContatoComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
];
