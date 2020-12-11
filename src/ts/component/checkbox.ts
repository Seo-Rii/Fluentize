import {Form} from './common/form';

class Checkbox extends Form {
    checkbox: HTMLElement;

    checkHandler() {
        if ((this.checkbox as HTMLInputElement).checked) {
            if (!this.el.classList.contains('--fluent-checkbox-checked')) this.el.classList.add('--fluent-checkbox-checked');
        } else {
            if (this.el.classList.contains('--fluent-checkbox-checked')) this.el.classList.remove('--fluent-checkbox-checked');
        }
    }

    constructor(el) {
        super(el);
        this.checkbox = el.querySelector('input[type=checkbox]');
        if (this.el.classList.contains('switch')) this.el.classList.add('--fluent-switch-container');
        else this.el.classList.add('--fluent-checkbox-container');
        this.checkHandler();
        this.checkbox.addEventListener('change', this.checkHandler.bind(this));
        if ((this.checkbox as HTMLInputElement).disabled) this.el.classList.add('--fluent-disabled');
        else this.el.classList.remove('--fluent-disabled');
        let observer = new MutationObserver((mutations) => {
            let self: Checkbox = this;
            self.checkHandler();
            mutations.forEach((mutation) => {
                if (mutation.type == "attributes") {
                    if ((self.checkbox as HTMLInputElement).disabled) {
                        if (!self.el.classList.contains('--fluent-disabled')) self.el.classList.add('--fluent-disabled');
                    } else {
                        if (self.el.classList.contains('--fluent-disabled')) self.el.classList.remove('--fluent-disabled');
                    }
                }
            });
        });
        observer.observe(this.el, {attributes: true});
    }
}

const checkbox_observer = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        console.log(mutation.attributeName)
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            console.log(mutation.target.disabled)
            if (mutation.target.disabled) mutation.target.parentNode.classList.add('--fluent-disabled');
            else mutation.target.parentNode.classList.remove('--fluent-disabled');
        }
    }
};

function Checkbox_init() {
    const observer = new MutationObserver(checkbox_observer);
    document.querySelectorAll('label').forEach((el) => {
        if (el.querySelector('input[type=checkbox]')) {
            new Checkbox(el);
            observer.observe(el, {attributes: true, childList: true, subtree: true});
        }
    });
}

export {Checkbox, Checkbox_init};