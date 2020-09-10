import {Form} from './common/form';

class Button extends Form {
    constructor(el) {
        super(el);
        this.el.addEventListener('mousedown', (e: MouseEvent) => {
            let deg: number = (-e.offsetY / this.el.offsetHeight + 0.5) * 2 * 8;
            document.documentElement.style.setProperty('--fluent-btn-rotate', `${deg}deg`);
        });
    }
}

function Button_init() {
    document.querySelectorAll('.button').forEach((el) => {
        new Button(el);
    })
}

export {Button, Button_init};