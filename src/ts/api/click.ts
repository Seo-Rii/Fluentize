let mouseDown: number = 0;

function createClickEvent() {
    document.addEventListener('mousedown', () => {
        ++mouseDown;
        document.dispatchEvent(new CustomEvent('mouseStateChange', {detail: mouseDown}));
    })

    document.addEventListener('mouseup', () => {
        --mouseDown;
        document.dispatchEvent(new CustomEvent('mouseStateChange', {detail: mouseDown}));
    })
}

function isMouseDown() {
    return mouseDown > 0;
}

export {isMouseDown, createClickEvent};