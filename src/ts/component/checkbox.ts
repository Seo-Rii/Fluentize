import {Form} from './common/form';

class Checkbox extends Form {
    checkbox: HTMLElement;

    constructor(el) {
        super(el);
        this.checkbox = el.querySelector('input[type=checkbox]');
        this.el.classList.add('--fluent-checkbox-container');
        this.checkbox.addEventListener('change', (e) => {
            if ((e.target as HTMLInputElement).checked) this.el.classList.add('--fluent-checkbox-checked')
            else this.el.classList.remove('--fluent-checkbox-checked')
        });
    }
}

function Checkbox_init() {
    document.querySelectorAll('label').forEach((el) => {
        if (el.querySelector('input[type=checkbox]')) new Checkbox(el);
    })
}

export {Checkbox, Checkbox_init};