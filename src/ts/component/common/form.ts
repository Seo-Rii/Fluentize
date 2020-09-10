class Form {
    el: HTMLElement;
    isClicked: Boolean;
    isHover: Boolean;

    constructor(el) {
        this.el = el;
        this.isHover = false;
        this.isClicked = false;
        this.el.addEventListener('mouseenter', () => {
            this.isHover = true;
            this.el.classList.remove('--fluent-release');
            if (this.isClicked) this.el.classList.add('--fluent-click');
            this.el.classList.add('--fluent-hover');
        });
        this.el.addEventListener('mouseleave', () => {
            this.isHover = false;
            this.el.classList.remove('--fluent-click');
            if (this.isClicked) this.el.classList.add('--fluent-release');
            this.el.classList.remove('--fluent-hover');
        });
        this.el.addEventListener('mousedown', (e: MouseEvent) => {
            this.isClicked = true;
            this.el.classList.add('--fluent-click');
            this.el.classList.remove('--fluent-release');
        });
        document.addEventListener('mouseStateChange', (e: CustomEvent) => {
            if (e.detail > 0) return;
            if (!this.isClicked) return;
            this.isClicked = false;
            this.el.classList.remove('--fluent-click');
            this.el.classList.add('--fluent-release');
        });
    }
}

export {Form};