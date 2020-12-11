/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ts/Fluentize.ts":
/*!*****************************!*
  !*** ./src/ts/Fluentize.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var button_1 = __webpack_require__(/*! ./component/button */ "./src/ts/component/button.ts");
var checkbox_1 = __webpack_require__(/*! ./component/checkbox */ "./src/ts/component/checkbox.ts");
var click_1 = __webpack_require__(/*! ./api/click */ "./src/ts/api/click.ts");
function Fluentize_init() {
    click_1.createClickEvent();
    button_1.Button_init();
    checkbox_1.Checkbox_init();
}
document.addEventListener('DOMContentLoaded', function () {
    Fluentize_init();
});


/***/ }),

/***/ "./src/ts/api/click.ts":
/*!*****************************!*
  !*** ./src/ts/api/click.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createClickEvent = exports.isMouseDown = void 0;
var mouseDown = 0;
function createClickEvent() {
    document.addEventListener('mousedown', function () {
        ++mouseDown;
        document.dispatchEvent(new CustomEvent('mouseStateChange', { detail: mouseDown }));
    });
    document.addEventListener('mouseup', function () {
        --mouseDown;
        document.dispatchEvent(new CustomEvent('mouseStateChange', { detail: mouseDown }));
    });
}
exports.createClickEvent = createClickEvent;
function isMouseDown() {
    return mouseDown > 0;
}
exports.isMouseDown = isMouseDown;


/***/ }),

/***/ "./src/ts/component/button.ts":
/*!************************************!*
  !*** ./src/ts/component/button.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button_init = exports.Button = void 0;
var form_1 = __webpack_require__(/*! ./common/form */ "./src/ts/component/common/form.ts");
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(el) {
        var _this = _super.call(this, el) || this;
        _this.el.addEventListener('mousedown', function (e) {
            var deg = (-e.offsetY / _this.el.offsetHeight + 0.5) * 2 * 8;
            document.documentElement.style.setProperty('--fluent-btn-rotate', deg + "deg");
        });
        return _this;
    }
    return Button;
}(form_1.Form));
exports.Button = Button;
function Button_init() {
    document.querySelectorAll('.button').forEach(function (el) {
        new Button(el);
    });
}
exports.Button_init = Button_init;


/***/ }),

/***/ "./src/ts/component/checkbox.ts":
/*!**************************************!*
  !*** ./src/ts/component/checkbox.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Checkbox_init = exports.Checkbox = void 0;
var form_1 = __webpack_require__(/*! ./common/form */ "./src/ts/component/common/form.ts");
var Checkbox = /** @class */ (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox(el) {
        var _this = _super.call(this, el) || this;
        _this.checkbox = el.querySelector('input[type=checkbox]');
        if (_this.el.classList.contains('switch'))
            _this.el.classList.add('--fluent-switch-container');
        else
            _this.el.classList.add('--fluent-checkbox-container');
        _this.checkHandler();
        _this.checkbox.addEventListener('change', _this.checkHandler.bind(_this));
        if (_this.checkbox.disabled)
            _this.el.classList.add('--fluent-disabled');
        else
            _this.el.classList.remove('--fluent-disabled');
        var observer = new MutationObserver(function (mutations) {
            var self = _this;
            self.checkHandler();
            mutations.forEach(function (mutation) {
                if (mutation.type == "attributes") {
                    if (self.checkbox.disabled) {
                        if (!self.el.classList.contains('--fluent-disabled'))
                            self.el.classList.add('--fluent-disabled');
                    }
                    else {
                        if (self.el.classList.contains('--fluent-disabled'))
                            self.el.classList.remove('--fluent-disabled');
                    }
                }
            });
        });
        observer.observe(_this.el, { attributes: true });
        return _this;
    }
    Checkbox.prototype.checkHandler = function () {
        if (this.checkbox.checked) {
            if (!this.el.classList.contains('--fluent-checkbox-checked'))
                this.el.classList.add('--fluent-checkbox-checked');
        }
        else {
            if (this.el.classList.contains('--fluent-checkbox-checked'))
                this.el.classList.remove('--fluent-checkbox-checked');
        }
    };
    return Checkbox;
}(form_1.Form));
exports.Checkbox = Checkbox;
var checkbox_observer = function (mutationsList, observer) {
    for (var _i = 0, mutationsList_1 = mutationsList; _i < mutationsList_1.length; _i++) {
        var mutation = mutationsList_1[_i];
        console.log(mutation.attributeName);
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            console.log(mutation.target.disabled);
            if (mutation.target.disabled)
                mutation.target.parentNode.classList.add('--fluent-disabled');
            else
                mutation.target.parentNode.classList.remove('--fluent-disabled');
        }
    }
};
function Checkbox_init() {
    var observer = new MutationObserver(checkbox_observer);
    document.querySelectorAll('label').forEach(function (el) {
        if (el.querySelector('input[type=checkbox]')) {
            new Checkbox(el);
            observer.observe(el, { attributes: true, childList: true, subtree: true });
        }
    });
}
exports.Checkbox_init = Checkbox_init;


/***/ }),

/***/ "./src/ts/component/common/form.ts":
/*!*****************************************!*
  !*** ./src/ts/component/common/form.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Form = void 0;
var Form = /** @class */ (function () {
    function Form(el) {
        var _this = this;
        this.el = el;
        this.isHover = false;
        this.isClicked = false;
        this.el.addEventListener('mouseenter', function () {
            _this.isHover = true;
            _this.el.classList.remove('--fluent-release');
            if (_this.isClicked)
                _this.el.classList.add('--fluent-click');
            _this.el.classList.add('--fluent-hover');
        });
        this.el.addEventListener('mouseleave', function () {
            _this.isHover = false;
            _this.el.classList.remove('--fluent-click');
            if (_this.isClicked)
                _this.el.classList.add('--fluent-release');
            _this.el.classList.remove('--fluent-hover');
        });
        this.el.addEventListener('mousedown', function (e) {
            _this.isClicked = true;
            _this.el.classList.add('--fluent-click');
            _this.el.classList.remove('--fluent-release');
        });
        document.addEventListener('mouseStateChange', function (e) {
            if (e.detail > 0)
                return;
            if (!_this.isClicked)
                return;
            _this.isClicked = false;
            _this.el.classList.remove('--fluent-click');
            _this.el.classList.add('--fluent-release');
        });
    }
    return Form;
}());
exports.Form = Form;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/ts/Fluentize.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbHVlbnRpemUvLi9zcmMvdHMvRmx1ZW50aXplLnRzIiwid2VicGFjazovL2ZsdWVudGl6ZS8uL3NyYy90cy9hcGkvY2xpY2sudHMiLCJ3ZWJwYWNrOi8vZmx1ZW50aXplLy4vc3JjL3RzL2NvbXBvbmVudC9idXR0b24udHMiLCJ3ZWJwYWNrOi8vZmx1ZW50aXplLy4vc3JjL3RzL2NvbXBvbmVudC9jaGVja2JveC50cyIsIndlYnBhY2s6Ly9mbHVlbnRpemUvLi9zcmMvdHMvY29tcG9uZW50L2NvbW1vbi9mb3JtLnRzIiwid2VicGFjazovL2ZsdWVudGl6ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mbHVlbnRpemUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDZGQUF1RDtBQUN2RCxtR0FBNkQ7QUFDN0QsOEVBQTZDO0FBRTdDLFNBQVMsY0FBYztJQUNuQix3QkFBZ0IsRUFBRSxDQUFDO0lBQ25CLG9CQUFXLEVBQUUsQ0FBQztJQUNkLHdCQUFhLEVBQUUsQ0FBQztBQUNwQixDQUFDO0FBRUQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO0lBQzFDLGNBQWMsRUFBRSxDQUFDO0FBQ3JCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNaRixJQUFJLFNBQVMsR0FBVyxDQUFDLENBQUM7QUFFMUIsU0FBUyxnQkFBZ0I7SUFDckIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRTtRQUNuQyxFQUFFLFNBQVMsQ0FBQztRQUNaLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFXLENBQUMsa0JBQWtCLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUMsQ0FBQztJQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUU7UUFDakMsRUFBRSxTQUFTLENBQUM7UUFDWixRQUFRLENBQUMsYUFBYSxD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QUM1QixLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixLQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUMzQyxLQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQztBQUVPLG9CQUFJOzs7Ozs7O1VDcENaO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiRmx1ZW50aXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCdXR0b24sIEJ1dHRvbl9pbml0fSBmcm9tICcuL2NvbXBvbmVudC9idXR0b24nO1xyXG5pbXBvcnQge0NoZWNrYm94LCBDaGVja2JveF9pbml0fSBmcm9tICcuL2NvbXBvbmVudC9jaGVja2JveCc7XHJcbmltcG9ydCB7Y3JlYXRlQ2xpY2tFdmVudH0gZnJvbSAnLi9hcGkvY2xpY2snO1xyXG5cclxuZnVuY3Rpb24gRmx1ZW50aXplX2luaXQoKSB7XHJcbiAgICBjcmVhdGVDbGlja0V2ZW50KCk7XHJcbiAgICBCdXR0b25faW5pdCgpO1xyXG4gICAgQ2hlY2tib3hfaW5pdCgpO1xyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgRmx1ZW50aXplX2luaXQoKTtcclxufSkiLCJsZXQgbW91c2VEb3duOiBudW1iZXIgPSAwO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ2xpY2tFdmVudCgpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcclxuICAgICAgICArK21vdXNlRG93bjtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbW91c2VTdGF0ZUNoYW5nZScsIHtkZXRhaWw6IG1vdXNlRG93bn0pKTtcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcclxuICAgICAgICAtLW1vdXNlRG93bjtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbW91c2VTdGF0ZUNoYW5nZScsIHtkZXRhaWw6IG1vdXNlRG93bn0pKTtcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzTW91c2VEb3duKCkge1xyXG4gICAgcmV0dXJuIG1vdXNlRG93biA+IDA7XHJcbn1cclxuXHJcbmV4cG9ydCB7aXNNb3VzZURvd24sIGNyZWF0ZUNsaWNrRXZlbnR9OyIsImltcG9ydCB7Rm9ybX0gZnJvbSAnLi9jb21tb24vZm9ybSc7XHJcblxyXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICAgICAgc3VwZXIoZWwpO1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRlZzogbnVtYmVyID0gKC1lLm9mZnNldFkgLyB0aGlzLmVsLm9mZnNldEhlaWdodCArIDAuNSkgKiAyICogODtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWZsdWVudC1idG4tcm90YXRlJywgYCR7ZGVnfWRlZ2ApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBCdXR0b25faW5pdCgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24nKS5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgIG5ldyBCdXR0b24oZWwpO1xyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IHtCdXR0b24sIEJ1dHRvbl9pbml0fTsiLCJpbXBvcnQge0Zvcm19IGZyb20gJy4vY29tbW9uL2Zvcm0nO1xyXG5cclxuY2xhc3MgQ2hlY2tib3ggZXh0ZW5kcyBGb3JtIHtcclxuICAgIGNoZWNrYm94OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjaGVja0hhbmRsZXIoKSB7XHJcbiAgICAgICAgaWYgKCh0aGlzLmNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnLS1mbHVlbnQtY2hlY2tib3gtY2hlY2tlZCcpKSB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LWNoZWNrYm94LWNoZWNrZWQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJy0tZmx1ZW50LWNoZWNrYm94LWNoZWNrZWQnKSkgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1jaGVja2JveC1jaGVja2VkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICAgICAgc3VwZXIoZWwpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3ggPSBlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpO1xyXG4gICAgICAgIGlmICh0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnc3dpdGNoJykpIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtc3dpdGNoLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIGVsc2UgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCctLWZsdWVudC1jaGVja2JveC1jb250YWluZXInKTtcclxuICAgICAgICB0aGlzLmNoZWNrSGFuZGxlcigpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5jaGVja0hhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgaWYgKCh0aGlzLmNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRpc2FibGVkKSB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LWRpc2FibGVkJyk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJy0tZmx1ZW50LWRpc2FibGVkJyk7XHJcbiAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZjogQ2hlY2tib3ggPSB0aGlzO1xyXG4gICAgICAgICAgICBzZWxmLmNoZWNrSGFuZGxlcigpO1xyXG4gICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09IFwiYXR0cmlidXRlc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzZWxmLmNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJy0tZmx1ZW50LWRpc2FibGVkJykpIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJy0tZmx1ZW50LWRpc2FibGVkJykpIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnLS1mbHVlbnQtZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcy5lbCwge2F0dHJpYnV0ZXM6IHRydWV9KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY2hlY2tib3hfb2JzZXJ2ZXIgPSBmdW5jdGlvbiAobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpIHtcclxuICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zTGlzdCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpXHJcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJyAmJiBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnZGlzYWJsZWQnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG11dGF0aW9uLnRhcmdldC5kaXNhYmxlZClcclxuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnRhcmdldC5kaXNhYmxlZCkgbXV0YXRpb24udGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgZWxzZSBtdXRhdGlvbi50YXJnZXQucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1kaXNhYmxlZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIENoZWNrYm94X2luaXQoKSB7XHJcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNoZWNrYm94X29ic2VydmVyKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xhYmVsJykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBpZiAoZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1jaGVja2JveF0nKSkge1xyXG4gICAgICAgICAgICBuZXcgQ2hlY2tib3goZWwpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsLCB7YXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7Q2hlY2tib3gsIENoZWNrYm94X2luaXR9OyIsImNsYXNzIEZvcm0ge1xyXG4gICAgZWw6IEhUTUxFbGVtZW50O1xyXG4gICAgaXNDbGlja2VkOiBCb29sZWFuO1xyXG4gICAgaXNIb3ZlcjogQm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSBlbDtcclxuICAgICAgICB0aGlzLmlzSG92ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzQ2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc0hvdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1yZWxlYXNlJyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ2xpY2tlZCkgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCctLWZsdWVudC1jbGljaycpO1xyXG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LWhvdmVyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlzSG92ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1jbGljaycpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NsaWNrZWQpIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtcmVsZWFzZScpO1xyXG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJy0tZmx1ZW50LWhvdmVyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlzQ2xpY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtY2xpY2snKTtcclxuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1yZWxlYXNlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VTdGF0ZUNoYW5nZScsIChlOiBDdXN0b21FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5kZXRhaWwgPiAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0NsaWNrZWQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5pc0NsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1jbGljaycpO1xyXG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LXJlbGVhc2UnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtGb3JtfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvdHMvRmx1ZW50aXplLnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==