import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { EmpresaService } from '../services/empresa.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { RouterModule, Router } from '@angular/router';

interface FAQ {
    question: string;
    answer: string;
    isOpen: boolean;
}

@Component({
    selector: 'app-empresa-profile',
    imports: [CommonModule, FooterComponent, LoadingSpinnerComponent, RouterModule],
    templateUrl: './empresa-profile.component.html',
    styleUrl: './empresa-profile.component.css',
    standalone: true
})
export class EmpresaProfileComponent {
    company: any = null;
    isLoading: boolean = true;

    constructor(private empresaService: EmpresaService) { }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const id = user?.usuarioable_id;

        if (id) {
            this.empresaService.getDataEmpresa(id).subscribe(
                (response) => {
                    this.company = response.data;
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 1000);
                },
                (error) => {
                    console.error('Erro ao buscar os dados da empresa:', error);                }
            );
        } else {
            console.error('ID não encontrado no localStorage');
        }
    }

    formatCNPJ(cnpj: string): string {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length <= 14) {
            cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }
        return cnpj;
    }

    getTipoEmpresa(tipo: string): string {
        switch (tipo) {
            case 'pequena_media':
                return 'Pequena/média empresa';
            case 'startup':
                return 'Startup';
            case 'grande':
                return 'Grande empresa';
            default:
                return 'Tipo de empresa desconhecido';
        }
    }

    faqs: FAQ[] = [
        {
            question: 'Qual é a idade média dos funcionários da Empresa Teste?',
            answer: 'A idade média dos funcionários da Empresa Teste é de 23 anos.',
            isOpen: false
        },
        {
            question: 'Em que ano foi criado o Empresa Teste?',
            answer: 'A empresa foi criada em 2021.',
            isOpen: false
        },
        {
            question: 'Qual é o tamanho da equipe Empresa Teste?',
            answer: 'Atualmente contamos com 3 colaboradores.',
            isOpen: false
        }
    ];

}
