import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { VagaService } from '../services/vaga.service';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { ActivatedRoute } from '@angular/router';
import { API_BASE_URL } from '../app.config';

@Component({
    selector: 'app-lista-vagas',
    imports: [CommonModule, FormsModule, FooterComponent, LoadingSpinnerComponent],
    templateUrl: './lista-vagas.component.html',
    styleUrl: './lista-vagas.component.css',
    standalone: true
})
export class ListaVagasComponent {
    isLoading: boolean = true;
    filtrosMobileAberto: boolean = false;

    vagas: any[] = [];
    habilidades: any[] = [];

    filtroSelecionado: string = '';
    vagasFiltradas: any[] = [];
    paginaAtual: number = 1;
    itensPorPagina: number = 6;
    totalPaginas: number = 1;
    Math = Math;

    gruposFiltros = [
        {
            titulo: 'Tipo de contrato',
            aberto: false,
            opcoes: [
                { texto: 'CLT', contador: 0, selecionado: false },
                { texto: 'PJ', contador: 0, selecionado: false },
                { texto: 'Estágio', contador: 0, selecionado: false }
            ]
        },
        {
            titulo: 'Nível de experiência',
            aberto: false,
            opcoes: [
                { texto: 'Júnior', contador: 0, selecionado: false },
                { texto: 'Pleno', contador: 0, selecionado: false },
                { texto: 'Sênior', contador: 0, selecionado: false }
            ]
        },
        {
            titulo: 'Tamanho da empresa',
            aberto: false,
            opcoes: [
                { texto: 'Startup', contador: 0, selecionado: false },
                { texto: 'Pequena/Média', contador: 0, selecionado: false },
                { texto: 'Grande', contador: 0, selecionado: false }
            ]
        },
        {
            titulo: 'Remoto',
            aberto: false,
            opcoes: [
                { texto: 'Sim', contador: 58, selecionado: false },
                { texto: 'Não', contador: 32, selecionado: false }
            ]
        }
    ];

    constructor(
        private notifier: NotificationService,
        private vagaservice: VagaService,
        private router: Router,
        private route: ActivatedRoute
    ) { }



    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const tecnologia = params['tecnologia'];

            this.vagaservice.getVagas().subscribe({
                next: (response: any) => {
                    if (response.status === 'success') {
                        this.habilidades = response.data.habilidades;

                        if (tecnologia) {
                            const habilidade = this.habilidades.find(h =>
                                h.nome.toLowerCase() === tecnologia.toLowerCase()
                            );

                            if (habilidade) {
                                this.filtroSelecionado = habilidade.id;
                            }
                        }

                        this.vagas = response.data.vagas
                            .map((vaga: any) => this.mapearVaga(vaga))
                            .sort((a: any, b: any) => b.compatibilidade - a.compatibilidade);

                        this.vagasFiltradas = [...this.vagas];

                        this.carregarVagas();

                        this.atualizarContadores();
                        this.calcularTotalPaginas();
                    }

                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Erro ao carregar vagas:', error);
                    this.isLoading = false;
                }
            });
        });
    }

    carregarVagas() {
        if (this.filtroSelecionado !== "") {
            const nomeHabilidade = this.obterNomeHabilidadePorId(parseInt(this.filtroSelecionado, 10));
            this.vagasFiltradas = this.vagas.filter(vaga =>
                vaga.tecnologias.some((tech: string) =>
                    tech.toLowerCase() === nomeHabilidade.toLowerCase()
                )
            );
        } else {
            this.vagasFiltradas = [...this.vagas];
        }
    
        this.calcularTotalPaginas();
    }
    
    obterNomeHabilidadePorId(id: number): string {
        const habilidade = this.habilidades.find(h => h.id === +id);
        return habilidade ? habilidade.nome : '';
    }

    mapearVaga(vaga: any) {
        return {
            id: vaga.id,
            empresa: vaga.empresa.nome_fantasia,
            cargo: vaga.titulo,
            localizacao: vaga.modelo_trabalho,
            tamanhoEmpresa: this.formatarTamanhoEmpresa(vaga.empresa.tipo_empresa),
            nivel: this.formatarNivel(vaga.nivel_experiencia),
            tipoContrato: this.formatarTipoContrato(vaga.tipo_contrato),
            tecnologias: vaga.habilidades?.map((h: any) => h.nome) || [],
            logo: vaga.empresa.logo_path ? `${API_BASE_URL}/${vaga.empresa.logo_path}` : null,
            nova: this.isVagaNova(vaga),
            compatibilidade: vaga.compatibilidade || 0,
            descricao: vaga.descricao,
            faixaSalarial: vaga.divulgar_salario ? vaga.faixa_salarial : null,
            habilidadesCompletas: vaga.habilidades || []
        };
    }

    formatarTamanhoEmpresa(tipo: string): string {
        const tipos: any = {
            'pequena_media': 'Pequena/Média',
            'startup': 'Startup',
            'grande': 'Grande'
        };
        return tipos[tipo] || tipo;
    }

    formatarNivel(nivel: string): string {
        const niveis: any = {
            'junior': 'Júnior',
            'pleno': 'Pleno',
            'senior': 'Sênior'
        };
        return niveis[nivel] || nivel;
    }

    formatarTipoContrato(tipo: string): string {
        const tipos: any = {
            'clt': 'CLT',
            'pj': 'PJ',
            'estagio': 'Estágio'
        };
        return tipos[tipo] || tipo;
    }

    isVagaNova(vaga: any): boolean {
        return false;
    }

    calcularCompatibilidade(): number {
        return Math.floor(Math.random() * 100);
    }

    atualizarContadores() {
        this.gruposFiltros.forEach(grupo => {
            grupo.opcoes.forEach(opcao => {
                opcao.contador = this.vagas.filter(vaga => {
                    switch (grupo.titulo) {
                        case 'Tipo de contrato':
                            return vaga.tipoContrato === opcao.texto;
                        case 'Nível de experiência':
                            return vaga.nivel === opcao.texto;
                        case 'Tamanho da empresa':
                            return vaga.tamanhoEmpresa === opcao.texto;
                        case 'Remoto':
                            return (opcao.texto === 'Sim' && vaga.localizacao == 'remoto') || (opcao.texto === 'Não' && vaga.localizacao !== 'remoto');
                        default:
                            return false;
                    }
                }).length;
            });
        });
    }

    selecionarFiltro(grupoSelecionado: any, opcaoSelecionada: any) {
        grupoSelecionado.opcoes.forEach((opcao: any) => {
            if (opcao !== opcaoSelecionada) {
                opcao.selecionado = false;
            }
        });

        opcaoSelecionada.selecionado = !opcaoSelecionada.selecionado;

        this.atualizarFiltros();
    }

    atualizarFiltros() {
        const filtrosAtivos = this.gruposFiltros.flatMap(grupo =>
            grupo.opcoes.filter(opcao => opcao.selecionado)
                .map(opcao => ({ grupo: grupo.titulo, valor: opcao.texto }))
        );

        if (filtrosAtivos.length === 0) {
            this.vagasFiltradas = [...this.vagas];
        } else {
            this.vagasFiltradas = this.vagas.filter(vaga => {
                return filtrosAtivos.every(filtro => {
                    switch (filtro.grupo) {
                        case 'Tipo de contrato':
                            return vaga.tipoContrato === filtro.valor;
                        case 'Nível de experiência':
                            return vaga.nivel === filtro.valor;
                        case 'Tamanho da empresa':
                            return vaga.tamanhoEmpresa === filtro.valor;
                        case 'Remoto':
                            return (filtro.valor === 'Sim' && vaga.localizacao === 'remoto') ||
                                (filtro.valor === 'Não' && vaga.localizacao !== 'remoto');
                        default:
                            return false;
                    }
                });
            });
        }

        this.paginaAtual = 1;
        this.calcularTotalPaginas();
    }

    limparFiltros() {
        this.gruposFiltros.forEach(grupo => {
            grupo.opcoes.forEach(opcao => {
                opcao.selecionado = false;
            });
        });
        this.atualizarFiltros();
    }

    get vagasPaginadas() {
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        return this.vagasFiltradas.slice(inicio, fim);
    }

    calcularTotalPaginas() {
        this.totalPaginas = Math.ceil(this.vagasFiltradas.length / this.itensPorPagina);
        console.log(this.totalPaginas);
    }

    mudarPagina(pagina: number) {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaAtual = pagina;
        }
    }

    get paginas() {
        const paginas = [];
        for (let i = 1; i <= this.totalPaginas; i++) {
            paginas.push(i);
        }
        return paginas;
    }

    toggleFiltrosMobile() {
        this.filtrosMobileAberto = !this.filtrosMobileAberto;
    }

    toggleGrupo(grupo: any) {
        grupo.aberto = !grupo.aberto;
    }

    navegarParaDetalhes(vagaId: any) {
        // console.log(vagaId);
        this.router.navigate(['/vagas', vagaId]);
    }

    buscarVagas(): void {
        this.isLoading = true;
        this.limparFiltros();
        this.vagaservice.getVagas(this.filtroSelecionado ? Number(this.filtroSelecionado) : undefined).subscribe({
            next: (response: any) => {
                if (response.status === 'success') {
                    this.vagas = response.data.vagas.map((vaga: any) => this.mapearVaga(vaga));
                    this.vagasFiltradas = [...this.vagas];
                    this.atualizarContadores();
                    this.calcularTotalPaginas();
                }
            },
            error: (error) => {
                console.error('Erro ao buscar vagas:', error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }


    formatarSalario(salario: string): string {
        if (!salario) return '';

        const [min, max] = salario.split('-');

        const formatarValor = (valor: string) => {
            const numero = parseFloat(valor.trim());
            return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        return `${formatarValor(min)} - ${formatarValor(max)}`;
    }
}
