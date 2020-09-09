class Button {
    el: HTMLElement;
    isHover: Boolean;
    isClicked: Boolean;


    constructor(el) {
        this.el = el;
        this.isHover = false;
        this.isClicked = false;
        this.el.addEventListener('mouseenter', () => {
            this.isHover = true;
            this.el.classList.remove('release');
            if (this.isClicked) this.el.classList.add('click');
        });
        this.el.addEventListener('mouseleave', () => {
            this.isHover = false;
            this.el.classList.remove('click');
            if (this.isClicked) this.el.classList.add('release');
        });
        this.el.addEventListener('mousedown', (e: MouseEvent) => {
            let deg: number = (-e.offsetY / this.el.offsetHeight + 0.5) * 2 * 8;
            this.isClicked = true;
            document.documentElement.style.setProperty('--btn-rotate', `${deg}deg`);
            this.el.classList.add('click');
            this.el.classList.remove('release');
        });
        document.addEventListener('mouseStateChange', (e: CustomEvent) => {
            if (e.detail > 0) return;
            if (!this.isClicked) return;
            this.isClicked = false;
            this.el.classList.remove('click');
            this.el.classList.add('release');
        });
    }
}

export {Button};