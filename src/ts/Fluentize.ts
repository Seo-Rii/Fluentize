import {Button} from './component/button';
import {createClickEvent} from './api/click';

function Fluentize_init() {
    document.querySelectorAll('.button').forEach((el) => {
        createClickEvent();
        new Button(el);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    Fluentize_init();
})