import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../footer/footer.component';
import { NotificationService } from '../../shared/notification.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule, RouterModule, FooterComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    standalone: true
})
export class RegisterComponent {
    formularioCadastro!: FormGroup;
    formularioEnviado = false;
    tipoUsuario: 'candidato' | 'empresa' = 'candidato';

    get configuracao() {
        return {
            candidato: {
                titulo: 'Crie sua conta como Candidato',
                descricao: 'Cadastre-se para encontrar as melhores oportunidades profissionais e gerenciar seu perfil.',
                icone: '../../../assets/icons/do-utilizador.png',
                textoBotao: 'Sou candidato',
                textoAlternativo: 'Sou empresa',
                rotaAlternativa: '/companies/register',
                rotaLogin: '/users/login',
                rotaSucesso: '/candidate/profile/completar'
            },
            empresa: {
                titulo: 'Cadastre sua Empresa',
                descricao: 'Registre-se para divulgar suas vagas e encontrar os melhores candidatos.',
                icone: '../../../assets/icons/companhia.png',
                textoBotao: 'Sou empresa',
                textoAlternativo: 'Sou candidato',
                rotaAlternativa: '/users/register',
                rotaLogin: '/companies/login',
                rotaSucesso: '/companies/updateProfile'
            }
        };
    }

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private notifier: NotificationService
    ) { }

    ngOnInit() {
        this.tipoUsuario = this.router.url.includes('/companies/') ? 'empresa' : 'candidato';
        this.inicializarFormulario();
    }


    private inicializarFormulario() {
        this.formularioCadastro = this.formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.email
            ]],
            senha: ['', [
                Validators.required,
                Validators.minLength(8),
                this.validadorComplexidadeSenha
            ]],
            confirmarSenha: ['', [Validators.required]]
        }, {
            validators: this.validadorSenhasIguais
        });
    }

    private validadorComplexidadeSenha(controle: any) {
        const valor = controle.value;
        if (!valor) return null;

        const temMaiuscula = /[A-Z]/.test(valor);
        const temMinuscula = /[a-z]/.test(valor);
        const temNumero = /[0-9]/.test(valor);
        const temEspecial = /[!@#$%^&*]/.test(valor);

        const valido = temMaiuscula && temMinuscula && temNumero && temEspecial;
        return valido ? null : { complexidadeSenha: true };
    }

    private validadorSenhasIguais(grupo: FormGroup) {
        const senha = grupo.get('senha');
        const confirmarSenha = grupo.get('confirmarSenha');

        return senha && confirmarSenha && senha.value === confirmarSenha.value
            ? null
            : { senhasNaoConferem: true };
    }

    get campos() {
        return this.formularioCadastro.controls;
    }

    get configuracaoAtual() {
        return this.configuracao[this.tipoUsuario];
    }

    onSubmit() {
        this.formularioEnviado = true;

        if (this.formularioCadastro.invalid) {
            this.marcarCamposComoTocados();
            return;
        }

        const dadosFormulario = this.formularioCadastro.value;

        this.authService.register(dadosFormulario, this.tipoUsuario).subscribe({
            next: (response) => {
                this.notifier.success(response.message);
                this.tratarCadastroSucesso(response);
            },
            error: (error) => {
                this.tratarErroCadastro(error.error.message);
            }
        });
    }

    private marcarCamposComoTocados() {
        Object.keys(this.formularioCadastro.controls).forEach(chave => {
            this.formularioCadastro.get(chave)?.markAsTouched();
        });
    }

    private tratarCadastroSucesso(resposta: any) {
        if (resposta.data?.token) {
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('user', JSON.stringify(resposta.data.user));

            this.authService.updateLoginState(true);
            setTimeout(() => {
                this.router.navigate([this.configuracaoAtual.rotaSucesso]);
            }, 100);
        }
    }

    private tratarErroCadastro(erro: any) {
        const mensagem = erro.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
        this.notifier.warning(mensagem);
        console.error(`Erro no registro ${this.tipoUsuario}:`, erro);
    }

    obterForcaSenha(): 'fraca' | 'media' | 'forte' {
        const senha = this.campos['senha'].value;
        if (!senha) return 'fraca';

        let pontuacao = 0;
        if (senha.length >= 8) pontuacao++;
        if (/[A-Z]/.test(senha)) pontuacao++;
        if (/[a-z]/.test(senha)) pontuacao++;
        if (/[0-9]/.test(senha)) pontuacao++;
        if (/[!@#$%^&*]/.test(senha)) pontuacao++;

        if (pontuacao < 3) return 'fraca';
        if (pontuacao < 5) return 'media';
        return 'forte';
    }

    obterTextoForcaSenha(): string {
        const forca = this.obterForcaSenha();
        const textos = {
            fraca: 'Fraca',
            media: 'Média',
            forte: 'Forte'
        };
        return textos[forca];
    }
}
