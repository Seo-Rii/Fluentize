import {Button, Button_init} from './component/button';
import {Checkbox, Checkbox_init} from './component/checkbox';
import {createClickEvent} from './api/click';

function Fluentize_init() {
    createClickEvent();
    Button_init();
    Checkbox_init();
}

document.addEventListener('DOMContentLoaded', () => {
    Fluentize_init();
})