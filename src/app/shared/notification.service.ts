import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { NotificationComponent } from './notification/notification.component';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector
    ) { }

    private show(message: string, type: 'success' | 'error' | 'info' | 'warning', duration = 3000) {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(NotificationComponent)
            .create(this.injector);

        componentRef.instance.message = message;
        componentRef.instance.type = type;
        componentRef.instance.duration = duration;

        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        setTimeout(() => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }, duration + 100);
    }

    success(message: string, duration?: number) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.show(message, 'error', duration);
    }

    info(message: string, duration?: number) {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration?: number) {
        this.show(message, 'warning', duration);
    }
}
