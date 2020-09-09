"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var Button = /** @class */ (function () {
    function Button(el) {
        var _this = this;
        this.el = el;
        this.el.addEventListener('mouseup', function () {
            _this.el.classList.add('release');
        });
    }
    return Button;
}());
exports.Button = Button;
//# sourceMappingURL=button.js.map