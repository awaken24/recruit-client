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

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'users/login', component: LoginCandidatoComponent },
    { path: 'users/register', component: RegisterCandidatoComponent },
    { path: 'companies/login', component: LoginEmpresaComponent },
    { path: 'companies/register', component: RegisterEmpresaComponent},
    { path: 'companies/updateProfile', component: UpdateProfileEmpresaComponent},
    { path: 'companies/profile', component: EmpresaProfileComponent },
    { path: 'companies/jobs/new', component: CadastroVagaComponent },
    { path: 'companies/dashboard', component: EmpresaDashboardComponent},
    { path: 'vagas', component: ListaVagasComponent },
    { path: 'vagas/:id', component: DetalhesVagaComponent },
    { path: 'candidate/update-profile', component: UpdateProfileCandidatoComponent },
    { path: 'candidate/dashboard', component: CandidatoDashboardComponent },
    { path: 'companies/vagas/:id/candidaturas', component: GerenciarCandidaturasComponent
    }
];
