/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/Fluentize.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/on-change/index.js":
/*!*****************************************!*\
  !*** ./node_modules/on-change/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {TARGET, UNSUBSCRIBE} = __webpack_require__(/*! ./lib/constants */ "./node_modules/on-change/lib/constants.js");
const isBuiltin = __webpack_require__(/*! ./lib/is-builtin */ "./node_modules/on-change/lib/is-builtin.js");
const path = __webpack_require__(/*! ./lib/path */ "./node_modules/on-change/lib/path.js");
const isArray = __webpack_require__(/*! ./lib/is-array */ "./node_modules/on-change/lib/is-array.js");
const isObject = __webpack_require__(/*! ./lib/is-object */ "./node_modules/on-change/lib/is-object.js");
const isSymbol = __webpack_require__(/*! ./lib/is-symbol */ "./node_modules/on-change/lib/is-symbol.js");
const ignoreProperty = __webpack_require__(/*! ./lib/ignore-property */ "./node_modules/on-change/lib/ignore-property.js");
const Cache = __webpack_require__(/*! ./lib/cache */ "./node_modules/on-change/lib/cache.js");
const SmartClone = __webpack_require__(/*! ./lib/smart-clone */ "./node_modules/on-change/lib/smart-clone.js");

const onChange = (object, onChange, options = {}) => {
	const proxyTarget = Symbol('ProxyTarget');
	const equals = options.equals || Object.is;
	const cache = new Cache(equals);
	const smartClone = new SmartClone();

	const handleChangeOnTarget = (target, property, previous, value) => {
		if (!ignoreProperty(cache, options, property)) {
			handleChange(cache.getPath(target), property, previous, value);
		}
	};

	// eslint-disable-next-line max-params
	const handleChange = (changePath, property, previous, value, name) => {
		if (smartClone.isCloning) {
			smartClone.update(changePath, property, previous);
		} else {
			onChange(path.concat(changePath, property), value, previous, name);
		}
	};

	const handler = {
		get(target, property, receiver) {
			if (isSymbol(property)) {
				if (property === proxyTarget || property === TARGET) {
					return target;
				}

				if (
					property === UNSUBSCRIBE &&
					!cache.isUnsubscribed &&
					cache.getPath(target).length === 0
				) {
					cache.unsubscribe();
					return target;
				}
			}

			const value = Reflect.get(target, property, receiver);
			if (
				isBuiltin.withoutMutableMethods(value) ||
				property === 'constructor' ||
				(options.isShallow === true && !smartClone.isHandledMethod(target, property)) ||
				ignoreProperty(cache, options, property) ||
				cache.isGetInvariant(target, property)
			) {
				return value;
			}

			return cache.getProxy(value, path.concat(cache.getPath(target), property), handler);
		},

		set(target, property, value, receiver) {
			if (value) {
				const valueProxyTarget = value[proxyTarget];

				if (valueProxyTarget !== undefined) {
					value = valueProxyTarget;
				}
			}

			const reflectTarget = target[proxyTarget] || target;
			const previous = Reflect.get(reflectTarget, property, receiver);
			const hasProperty = property in target;

			if (cache.setProperty(reflectTarget, property, value, receiver, previous)) {
				if (!equals(previous, value) || !hasProperty) {
					handleChangeOnTarget(target, property, previous, value);
				}

				return true;
			}

			return false;
		},

		defineProperty(target, property, descriptor) {
			if (!cache.isSameDescriptor(descriptor, target, property)) {
				if (!cache.defineProperty(target, property, descriptor)) {
					return false;
				}

				handleChangeOnTarget(target, property, undefined, descriptor.value);
			}

			return true;
		},

		deleteProperty(target, property) {
			if (!Reflect.has(target, property)) {
				return true;
			}

			const previous = Reflect.get(target, property);

			if (cache.deleteProperty(target, property, previous)) {
				handleChangeOnTarget(target, property, previous);

				return true;
			}

			return false;
		},

		apply(target, thisArg, argumentsList) {
			const isMutable = isBuiltin.withMutableMethods(thisArg);
			const thisProxyTarget = thisArg[proxyTarget] || thisArg;

			if (isMutable) {
				thisArg = thisProxyTarget;
			}

			if (smartClone.isCloning || cache.isUnsubscribed) {
				return Reflect.apply(target, thisArg, argumentsList);
			}

			const applyPath = path.initial(cache.getPath(target));

			if (isMutable || isArray(thisArg) || isObject(thisArg)) {
				smartClone.start(thisProxyTarget, applyPath);
			}

			const result = Reflect.apply(
				target,
				smartClone.preferredThisArg(target, thisArg, thisProxyTarget),
				argumentsList
			);

			if (smartClone.isChanged(isMutable, thisArg, equals)) {
				const clone = smartClone.done();
				handleChange(applyPath, '', clone, thisProxyTarget, target.name);
			}

			smartClone.done();

			if (
				(isArray(result) || isObject(result)) &&
				smartClone.isHandledMethod(thisProxyTarget, target.name)
			) {
				return cache.getProxy(result, applyPath, handler);
			}

			return result;
		}
	};

	const proxy = cache.getProxy(object, options.pathAsArray === true ? [] : '', handler);
	onChange = onChange.bind(proxy);

	return proxy;
};

onChange.target = proxy => proxy[TARGET] || proxy;
onChange.unsubscribe = proxy => proxy[UNSUBSCRIBE] || proxy;

module.exports = onChange;


/***/ }),

/***/ "./node_modules/on-change/lib/cache.js":
/*!*********************************************!*\
  !*** ./node_modules/on-change/lib/cache.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @class Cache
 * @private
 */
class Cache {
	constructor(equals) {
		this._equals = equals;
		this._proxyCache = new WeakMap();
		this._pathCache = new WeakMap();
		this.isUnsubscribed = false;
	}

	_getDescriptorCache() {
		if (this._descriptorCache === undefined) {
			this._descriptorCache = new WeakMap();
		}

		return this._descriptorCache;
	}

	_getProperties(target) {
		const descriptorCache = this._getDescriptorCache();
		let properties = descriptorCache.get(target);

		if (properties === undefined) {
			properties = {};
			descriptorCache.set(target, properties);
		}

		return properties;
	}

	_getOwnPropertyDescriptor(target, property) {
		if (this.isUnsubscribed) {
			return Reflect.getOwnPropertyDescriptor(target, property);
		}

		const properties = this._getProperties(target);
		let descriptor = properties[property];

		if (descriptor === undefined) {
			descriptor = Reflect.getOwnPropertyDescriptor(target, property);
			properties[property] = descriptor;
		}

		return descriptor;
	}

	getProxy(target, path, handler) {
		if (this.isUnsubscribed) {
			return target;
		}

		this._pathCache.set(target, path);

		let proxy = this._proxyCache.get(target);

		if (proxy === undefined) {
			proxy = new Proxy(target, handler);
			this._proxyCache.set(target, proxy);
		}

		return proxy;
	}

	getPath(target) {
		return this.isUnsubscribed ? undefined : this._pathCache.get(target);
	}

	defineProperty(target, property, descriptor) {
		if (!Reflect.defineProperty(target, property, descriptor)) {
			return false;
		}

		if (!this.isUnsubscribed) {
			this._getProperties(target)[property] = descriptor;
		}

		return true;
	}

	setProperty(target, property, value, receiver, previous) { // eslint-disable-line max-params
		if (!this._equals(previous, value) || !(property in target)) {
			const descriptor = this._getOwnPropertyDescriptor(target, property);

			if (descriptor !== undefined && 'set' in descriptor) {
				return Reflect.set(target, property, value, receiver);
			}

			return Reflect.set(target, property, value);
		}

		return true;
	}

	deleteProperty(target, property, previous) {
		if (Reflect.deleteProperty(target, property)) {
			if (!this.isUnsubscribed) {
				const properties = this._getDescriptorCache().get(target);

				if (properties) {
					delete properties[property];
					this._pathCache.delete(previous);
				}
			}

			return true;
		}

		return false;
	}

	isSameDescriptor(a, target, property) {
		const b = this._getOwnPropertyDescriptor(target, property);

		return a !== undefined &&
			b !== undefined &&
			Object.is(a.value, b.value) &&
			(a.writable || false) === (b.writable || false) &&
			(a.enumerable || false) === (b.enumerable || false) &&
			(a.configurable || false) === (b.configurable || false) &&
			a.get === b.get &&
			a.set === b.set;
	}

	isGetInvariant(target, property) {
		const descriptor = this._getOwnPropertyDescriptor(target, property);

		return descriptor !== undefined &&
			descriptor.configurable !== true &&
			descriptor.writable !== true;
	}

	unsubscribe() {
		this._descriptorCache = null;
		this._pathCache = null;
		this._proxyCache = null;
		this.isUnsubscribed = true;
	}
}

module.exports = Cache;


/***/ }),

/***/ "./node_modules/on-change/lib/constants.js":
/*!*************************************************!*\
  !*** ./node_modules/on-change/lib/constants.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
	PATH_SEPARATOR: '.',
	TARGET: Symbol('target'),
	UNSUBSCRIBE: Symbol('unsubscribe')
};


/***/ }),

/***/ "./node_modules/on-change/lib/ignore-property.js":
/*!*******************************************************!*\
  !*** ./node_modules/on-change/lib/ignore-property.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const isSymbol = __webpack_require__(/*! ./is-symbol */ "./node_modules/on-change/lib/is-symbol.js");

module.exports = (cache, options, property) => {
	return cache.isUnsubscribed ||
		(options.ignoreSymbols === true && isSymbol(property)) ||
		(options.ignoreUnderscores === true && property.charAt(0) === '_') ||
		('ignoreKeys' in options && options.ignoreKeys.includes(property));
};


/***/ }),

/***/ "./node_modules/on-change/lib/is-array.js":
/*!************************************************!*\
  !*** ./node_modules/on-change/lib/is-array.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Array.isArray;


/***/ }),

/***/ "./node_modules/on-change/lib/is-builtin.js":
/*!**************************************************!*\
  !*** ./node_modules/on-change/lib/is-builtin.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	withMutableMethods: value => value instanceof Date,
	withoutMutableMethods: value =>
		value === null ||
		(typeof value !== 'object' && typeof value !== 'function') ||
		value instanceof RegExp
};


/***/ }),

/***/ "./node_modules/on-change/lib/is-object.js":
/*!*************************************************!*\
  !*** ./node_modules/on-change/lib/is-object.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = value => toString.call(value) === '[object Object]';


/***/ }),

/***/ "./node_modules/on-change/lib/is-symbol.js":
/*!*************************************************!*\
  !*** ./node_modules/on-change/lib/is-symbol.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = value => typeof value === 'symbol';


/***/ }),

/***/ "./node_modules/on-change/lib/path.js":
/*!********************************************!*\
  !*** ./node_modules/on-change/lib/path.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {PATH_SEPARATOR} = __webpack_require__(/*! ./constants */ "./node_modules/on-change/lib/constants.js");
const isArray = __webpack_require__(/*! ./is-array */ "./node_modules/on-change/lib/is-array.js");
const isSymbol = __webpack_require__(/*! ./is-symbol */ "./node_modules/on-change/lib/is-symbol.js");

module.exports = {
	after: (path, subPath) => {
		if (isArray(path)) {
			return path.slice(subPath.length);
		}

		if (subPath === '') {
			return path;
		}

		return path.slice(subPath.length + 1);
	},
	concat: (path, key) => {
		if (isArray(path)) {
			path = path.slice();

			if (key) {
				path.push(key);
			}

			return path;
		}

		if (key && key.toString !== undefined) {
			if (path !== '') {
				path += PATH_SEPARATOR;
			}

			if (isSymbol(key)) {
				return path + 'Symbol(' + key.description + ')';
			}

			return path + key;
		}

		return path;
	},
	initial: path => {
		if (isArray(path)) {
			return path.slice(0, -1);
		}

		if (path === '') {
			return path;
		}

		const index = path.lastIndexOf(PATH_SEPARATOR);

		if (index === -1) {
			return '';
		}

		return path.slice(0, index);
	},
	walk: (path, callback) => {
		if (isArray(path)) {
			path.forEach(key => callback(key));
		} else if (path !== '') {
			let position = 0;
			let index = path.indexOf(PATH_SEPARATOR);

			if (index === -1) {
				callback(path);
			} else {
				while (position < path.length) {
					if (index === -1) {
						index = path.length;
					}

					callback(path.slice(position, index));

					position = index + 1;
					index = path.indexOf(PATH_SEPARATOR, position);
				}
			}
		}
	}
};


/***/ }),

/***/ "./node_modules/on-change/lib/smart-clone.js":
/*!***************************************************!*\
  !*** ./node_modules/on-change/lib/smart-clone.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(/*! ./path */ "./node_modules/on-change/lib/path.js");
const isArray = __webpack_require__(/*! ./is-array */ "./node_modules/on-change/lib/is-array.js");
const isObject = __webpack_require__(/*! ./is-object */ "./node_modules/on-change/lib/is-object.js");

const shallowEqual = (clone, value) => {
	return clone.length !== value.length || clone.some((item, index) => value[index] !== item);
};

const IMMUTABLE_OBJECT_METHODS = new Set([
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'toLocaleString',
	'toString',
	'valueOf'
]);

const IMMUTABLE_ARRAY_METHODS = new Set([
	'includes',
	'indexOf',
	'join',
	'keys',
	'lastIndexOf'
]);

const SHALLOW_MUTABLE_ARRAY_METHODS = {
	push: () => true,
	pop: () => true,
	shift: () => true,
	unshift: () => true,
	concat: (clone, value) => clone.length !== value.length,
	copyWithin: shallowEqual,
	reverse: shallowEqual,
	sort: shallowEqual,
	splice: shallowEqual,
	flat: shallowEqual,
	fill: shallowEqual
};

class smartClone {
	constructor() {
		this.done();
	}

	shallowClone(value) {
		let clone;

		if (isArray(value)) {
			clone = [...value];
		} else if (value instanceof Date) {
			clone = new Date(value);
		} else {
			clone = {...value};
		}

		this._cache.add(clone);

		return clone;
	}

	start(value, path) {
		if (this._cache === undefined) {
			this._cache = new Set();
		}

		this.clone = path === undefined ? value : this.shallowClone(value);
		this._path = path;
		this.isCloning = true;
	}

	isHandledMethod(target, name) {
		if (isArray(target) && (IMMUTABLE_OBJECT_METHODS.has(name) ||
			IMMUTABLE_ARRAY_METHODS.has(name) ||
			name in SHALLOW_MUTABLE_ARRAY_METHODS)) {
			return true;
		}

		return isObject(target) && IMMUTABLE_OBJECT_METHODS.has(name);
	}

	preferredThisArg(target, thisArg, thisProxyTarget) {
		const {name} = target;

		if (this.isHandledMethod(thisProxyTarget, name)) {
			if (isArray(thisProxyTarget)) {
				this._onIsChanged = SHALLOW_MUTABLE_ARRAY_METHODS[name];
			}

			return thisProxyTarget;
		}

		return thisArg;
	}

	update(fullPath, property, value) {
		if (value !== undefined && property !== 'length') {
			let object = this.clone;

			path.walk(path.after(fullPath, this._path), key => {
				if (!this._cache.has(object[key])) {
					object[key] = this.shallowClone(object[key]);
				}

				object = object[key];
			});

			object[property] = value;
		}

		this._isChanged = true;
	}

	done() {
		const {clone} = this;

		if (this._cache !== undefined) {
			this._cache.clear();
		}

		this.clone = null;
		this.isCloning = false;
		this._path = null;
		this._onIsChanged = null;
		this._isChanged = false;

		return clone;
	}

	isChanged(isMutable, value, equals) {
		if (isMutable) {
			return !equals(this.clone.valueOf(), value.valueOf());
		}

		return this._onIsChanged ?
			this._onIsChanged(this.clone, value) :
			this._isChanged;
	}
}

module.exports = smartClone;


/***/ }),

/***/ "./src/ts/Fluentize.ts":
/*!*****************************!*\
  !*** ./src/ts/Fluentize.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
/*!*****************************!*\
  !*** ./src/ts/api/click.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
/*!************************************!*\
  !*** ./src/ts/component/button.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
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
/*!**************************************!*\
  !*** ./src/ts/component/checkbox.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox_init = exports.Checkbox = void 0;
var form_1 = __webpack_require__(/*! ./common/form */ "./src/ts/component/common/form.ts");
var onChange = __webpack_require__(/*! on-change */ "./node_modules/on-change/index.js");
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
        //observer.observe(this.el, {attributes: true});
        onChange(_this.checkbox, function (path, value, previousValue, name) {
            console.log('this:', this);
            console.log('path:', path);
            console.log('value:', value);
            console.log('previousValue:', previousValue);
            console.log('name:', name);
        });
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
function Checkbox_init() {
    document.querySelectorAll('label').forEach(function (el) {
        if (el.querySelector('input[type=checkbox]'))
            new Checkbox(el);
    });
}
exports.Checkbox_init = Checkbox_init;


/***/ }),

/***/ "./src/ts/component/common/form.ts":
/*!*****************************************!*\
  !*** ./src/ts/component/common/form.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL29uLWNoYW5nZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb24tY2hhbmdlL2xpYi9jYWNoZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb24tY2hhbmdlL2xpYi9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL29uLWNoYW5nZS9saWIvaWdub3JlLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9vbi1jaGFuZ2UvbGliL2lzLWFycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9vbi1jaGFuZ2UvbGliL2lzLWJ1aWx0aW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL29uLWNoYW5nZS9saWIvaXMtb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9vbi1jaGFuZ2UvbGliL2lzLXN5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb24tY2hhbmdlL2xpYi9wYXRoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9vbi1jaGFuZ2UvbGliL3NtYXJ0LWNsb25lLmpzIiwid2VicGFjazovLy8uL3NyYy90cy9GbHVlbnRpemUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2FwaS9jbGljay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50L2J1dHRvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50L2NoZWNrYm94LnRzIiwid2VicGFjazovLy8uL3NyYy90cy9jb21wb25lbnQvY29tbW9uL2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGYTs7QUFFYixPQUFPLG9CQUFvQixHQUFHLG1CQUFPLENBQUMsa0VBQWlCO0FBQ3ZELGtCQUFrQixtQkFBTyxDQUFDLG9FQUFrQjtBQUM1QyxhQUFhLG1CQUFPLENBQUMsd0RBQVk7QUFDakMsZ0JBQWdCLG1CQUFPLENBQUMsZ0VBQWdCO0FBQ3hDLGlCQUFpQixtQkFBTyxDQUFDLGtFQUFpQjtBQUMxQyxpQkFBaUIsbUJBQU8sQ0FBQyxrRUFBaUI7QUFDMUMsdUJBQXVCLG1CQUFPLENBQUMsOEVBQXVCO0FBQ3RELGNBQWMsbUJBQU8sQ0FBQywwREFBYTtBQUNuQyxtQkFBbUIsbUJBQU8sQ0FBQyxzRUFBbUI7O0FBRTlDLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FDdkthOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMkRBQTJEO0FBQzNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNB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QUFLLENBQUM7WUFDdkIsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDM0MsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUM7QUFFTyxvQkFBSSIsImZpbGUiOiJGbHVlbnRpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy90cy9GbHVlbnRpemUudHNcIik7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtUQVJHRVQsIFVOU1VCU0NSSUJFfSA9IHJlcXVpcmUoJy4vbGliL2NvbnN0YW50cycpO1xuY29uc3QgaXNCdWlsdGluID0gcmVxdWlyZSgnLi9saWIvaXMtYnVpbHRpbicpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJy4vbGliL3BhdGgnKTtcbmNvbnN0IGlzQXJyYXkgPSByZXF1aXJlKCcuL2xpYi9pcy1hcnJheScpO1xuY29uc3QgaXNPYmplY3QgPSByZXF1aXJlKCcuL2xpYi9pcy1vYmplY3QnKTtcbmNvbnN0IGlzU3ltYm9sID0gcmVxdWlyZSgnLi9saWIvaXMtc3ltYm9sJyk7XG5jb25zdCBpZ25vcmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vbGliL2lnbm9yZS1wcm9wZXJ0eScpO1xuY29uc3QgQ2FjaGUgPSByZXF1aXJlKCcuL2xpYi9jYWNoZScpO1xuY29uc3QgU21hcnRDbG9uZSA9IHJlcXVpcmUoJy4vbGliL3NtYXJ0LWNsb25lJyk7XG5cbmNvbnN0IG9uQ2hhbmdlID0gKG9iamVjdCwgb25DaGFuZ2UsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRjb25zdCBwcm94eVRhcmdldCA9IFN5bWJvbCgnUHJveHlUYXJnZXQnKTtcblx0Y29uc3QgZXF1YWxzID0gb3B0aW9ucy5lcXVhbHMgfHwgT2JqZWN0LmlzO1xuXHRjb25zdCBjYWNoZSA9IG5ldyBDYWNoZShlcXVhbHMpO1xuXHRjb25zdCBzbWFydENsb25lID0gbmV3IFNtYXJ0Q2xvbmUoKTtcblxuXHRjb25zdCBoYW5kbGVDaGFuZ2VPblRhcmdldCA9ICh0YXJnZXQsIHByb3BlcnR5LCBwcmV2aW91cywgdmFsdWUpID0+IHtcblx0XHRpZiAoIWlnbm9yZVByb3BlcnR5KGNhY2hlLCBvcHRpb25zLCBwcm9wZXJ0eSkpIHtcblx0XHRcdGhhbmRsZUNoYW5nZShjYWNoZS5nZXRQYXRoKHRhcmdldCksIHByb3BlcnR5LCBwcmV2aW91cywgdmFsdWUpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LXBhcmFtc1xuXHRjb25zdCBoYW5kbGVDaGFuZ2UgPSAoY2hhbmdlUGF0aCwgcHJvcGVydHksIHByZXZpb3VzLCB2YWx1ZSwgbmFtZSkgPT4ge1xuXHRcdGlmIChzbWFydENsb25lLmlzQ2xvbmluZykge1xuXHRcdFx0c21hcnRDbG9uZS51cGRhdGUoY2hhbmdlUGF0aCwgcHJvcGVydHksIHByZXZpb3VzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b25DaGFuZ2UocGF0aC5jb25jYXQoY2hhbmdlUGF0aCwgcHJvcGVydHkpLCB2YWx1ZSwgcHJldmlvdXMsIG5hbWUpO1xuXHRcdH1cblx0fTtcblxuXHRjb25zdCBoYW5kbGVyID0ge1xuXHRcdGdldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikge1xuXHRcdFx0aWYgKGlzU3ltYm9sKHByb3BlcnR5KSkge1xuXHRcdFx0XHRpZiAocHJvcGVydHkgPT09IHByb3h5VGFyZ2V0IHx8IHByb3BlcnR5ID09PSBUQVJHRVQpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGFyZ2V0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHByb3BlcnR5ID09PSBVTlNVQlNDUklCRSAmJlxuXHRcdFx0XHRcdCFjYWNoZS5pc1Vuc3Vic2NyaWJlZCAmJlxuXHRcdFx0XHRcdGNhY2hlLmdldFBhdGgodGFyZ2V0KS5sZW5ndGggPT09IDBcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y2FjaGUudW5zdWJzY3JpYmUoKTtcblx0XHRcdFx0XHRyZXR1cm4gdGFyZ2V0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRpc0J1aWx0aW4ud2l0aG91dE11dGFibGVNZXRob2RzKHZhbHVlKSB8fFxuXHRcdFx0XHRwcm9wZXJ0eSA9PT0gJ2NvbnN0cnVjdG9yJyB8fFxuXHRcdFx0XHQob3B0aW9ucy5pc1NoYWxsb3cgPT09IHRydWUgJiYgIXNtYXJ0Q2xvbmUuaXNIYW5kbGVkTWV0aG9kKHRhcmdldCwgcHJvcGVydHkpKSB8fFxuXHRcdFx0XHRpZ25vcmVQcm9wZXJ0eShjYWNoZSwgb3B0aW9ucywgcHJvcGVydHkpIHx8XG5cdFx0XHRcdGNhY2hlLmlzR2V0SW52YXJpYW50KHRhcmdldCwgcHJvcGVydHkpXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2FjaGUuZ2V0UHJveHkodmFsdWUsIHBhdGguY29uY2F0KGNhY2hlLmdldFBhdGgodGFyZ2V0KSwgcHJvcGVydHkpLCBoYW5kbGVyKTtcblx0XHR9LFxuXG5cdFx0c2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlLCByZWNlaXZlcikge1xuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlUHJveHlUYXJnZXQgPSB2YWx1ZVtwcm94eVRhcmdldF07XG5cblx0XHRcdFx0aWYgKHZhbHVlUHJveHlUYXJnZXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHZhbHVlID0gdmFsdWVQcm94eVRhcmdldDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZWZsZWN0VGFyZ2V0ID0gdGFyZ2V0W3Byb3h5VGFyZ2V0XSB8fCB0YXJnZXQ7XG5cdFx0XHRjb25zdCBwcmV2aW91cyA9IFJlZmxlY3QuZ2V0KHJlZmxlY3RUYXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcik7XG5cdFx0XHRjb25zdCBoYXNQcm9wZXJ0eSA9IHByb3BlcnR5IGluIHRhcmdldDtcblxuXHRcdFx0aWYgKGNhY2hlLnNldFByb3BlcnR5KHJlZmxlY3RUYXJnZXQsIHByb3BlcnR5LCB2YWx1ZSwgcmVjZWl2ZXIsIHByZXZpb3VzKSkge1xuXHRcdFx0XHRpZiAoIWVxdWFscyhwcmV2aW91cywgdmFsdWUpIHx8ICFoYXNQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdGhhbmRsZUNoYW5nZU9uVGFyZ2V0KHRhcmdldCwgcHJvcGVydHksIHByZXZpb3VzLCB2YWx1ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XG5cdFx0XHRpZiAoIWNhY2hlLmlzU2FtZURlc2NyaXB0b3IoZGVzY3JpcHRvciwgdGFyZ2V0LCBwcm9wZXJ0eSkpIHtcblx0XHRcdFx0aWYgKCFjYWNoZS5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGhhbmRsZUNoYW5nZU9uVGFyZ2V0KHRhcmdldCwgcHJvcGVydHksIHVuZGVmaW5lZCwgZGVzY3JpcHRvci52YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSB7XG5cdFx0XHRpZiAoIVJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHkpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBwcmV2aW91cyA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHkpO1xuXG5cdFx0XHRpZiAoY2FjaGUuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwgcHJldmlvdXMpKSB7XG5cdFx0XHRcdGhhbmRsZUNoYW5nZU9uVGFyZ2V0KHRhcmdldCwgcHJvcGVydHksIHByZXZpb3VzKTtcblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHRhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpIHtcblx0XHRcdGNvbnN0IGlzTXV0YWJsZSA9IGlzQnVpbHRpbi53aXRoTXV0YWJsZU1ldGhvZHModGhpc0FyZyk7XG5cdFx0XHRjb25zdCB0aGlzUHJveHlUYXJnZXQgPSB0aGlzQXJnW3Byb3h5VGFyZ2V0XSB8fCB0aGlzQXJnO1xuXG5cdFx0XHRpZiAoaXNNdXRhYmxlKSB7XG5cdFx0XHRcdHRoaXNBcmcgPSB0aGlzUHJveHlUYXJnZXQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzbWFydENsb25lLmlzQ2xvbmluZyB8fCBjYWNoZS5pc1Vuc3Vic2NyaWJlZCkge1xuXHRcdFx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBhcHBseVBhdGggPSBwYXRoLmluaXRpYWwoY2FjaGUuZ2V0UGF0aCh0YXJnZXQpKTtcblxuXHRcdFx0aWYgKGlzTXV0YWJsZSB8fCBpc0FycmF5KHRoaXNBcmcpIHx8IGlzT2JqZWN0KHRoaXNBcmcpKSB7XG5cdFx0XHRcdHNtYXJ0Q2xvbmUuc3RhcnQodGhpc1Byb3h5VGFyZ2V0LCBhcHBseVBhdGgpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KFxuXHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdHNtYXJ0Q2xvbmUucHJlZmVycmVkVGhpc0FyZyh0YXJnZXQsIHRoaXNBcmcsIHRoaXNQcm94eVRhcmdldCksXG5cdFx0XHRcdGFyZ3VtZW50c0xpc3Rcblx0XHRcdCk7XG5cblx0XHRcdGlmIChzbWFydENsb25lLmlzQ2hhbmdlZChpc011dGFibGUsIHRoaXNBcmcsIGVxdWFscykpIHtcblx0XHRcdFx0Y29uc3QgY2xvbmUgPSBzbWFydENsb25lLmRvbmUoKTtcblx0XHRcdFx0aGFuZGxlQ2hhbmdlKGFwcGx5UGF0aCwgJycsIGNsb25lLCB0aGlzUHJveHlUYXJnZXQsIHRhcmdldC5uYW1lKTtcblx0XHRcdH1cblxuXHRcdFx0c21hcnRDbG9uZS5kb25lKCk7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KGlzQXJyYXkocmVzdWx0KSB8fCBpc09iamVjdChyZXN1bHQpKSAmJlxuXHRcdFx0XHRzbWFydENsb25lLmlzSGFuZGxlZE1ldGhvZCh0aGlzUHJveHlUYXJnZXQsIHRhcmdldC5uYW1lKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiBjYWNoZS5nZXRQcm94eShyZXN1bHQsIGFwcGx5UGF0aCwgaGFuZGxlcik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnN0IHByb3h5ID0gY2FjaGUuZ2V0UHJveHkob2JqZWN0LCBvcHRpb25zLnBhdGhBc0FycmF5ID09PSB0cnVlID8gW10gOiAnJywgaGFuZGxlcik7XG5cdG9uQ2hhbmdlID0gb25DaGFuZ2UuYmluZChwcm94eSk7XG5cblx0cmV0dXJuIHByb3h5O1xufTtcblxub25DaGFuZ2UudGFyZ2V0ID0gcHJveHkgPT4gcHJveHlbVEFSR0VUXSB8fCBwcm94eTtcbm9uQ2hhbmdlLnVuc3Vic2NyaWJlID0gcHJveHkgPT4gcHJveHlbVU5TVUJTQ1JJQkVdIHx8IHByb3h5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9uQ2hhbmdlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzcyBDYWNoZVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgQ2FjaGUge1xuXHRjb25zdHJ1Y3RvcihlcXVhbHMpIHtcblx0XHR0aGlzLl9lcXVhbHMgPSBlcXVhbHM7XG5cdFx0dGhpcy5fcHJveHlDYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cdFx0dGhpcy5fcGF0aENhY2hlID0gbmV3IFdlYWtNYXAoKTtcblx0XHR0aGlzLmlzVW5zdWJzY3JpYmVkID0gZmFsc2U7XG5cdH1cblxuXHRfZ2V0RGVzY3JpcHRvckNhY2hlKCkge1xuXHRcdGlmICh0aGlzLl9kZXNjcmlwdG9yQ2FjaGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fZGVzY3JpcHRvckNhY2hlID0gbmV3IFdlYWtNYXAoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fZGVzY3JpcHRvckNhY2hlO1xuXHR9XG5cblx0X2dldFByb3BlcnRpZXModGFyZ2V0KSB7XG5cdFx0Y29uc3QgZGVzY3JpcHRvckNhY2hlID0gdGhpcy5fZ2V0RGVzY3JpcHRvckNhY2hlKCk7XG5cdFx0bGV0IHByb3BlcnRpZXMgPSBkZXNjcmlwdG9yQ2FjaGUuZ2V0KHRhcmdldCk7XG5cblx0XHRpZiAocHJvcGVydGllcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwcm9wZXJ0aWVzID0ge307XG5cdFx0XHRkZXNjcmlwdG9yQ2FjaGUuc2V0KHRhcmdldCwgcHJvcGVydGllcyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb3BlcnRpZXM7XG5cdH1cblxuXHRfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHkpIHtcblx0XHRpZiAodGhpcy5pc1Vuc3Vic2NyaWJlZCkge1xuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLl9nZXRQcm9wZXJ0aWVzKHRhcmdldCk7XG5cdFx0bGV0IGRlc2NyaXB0b3IgPSBwcm9wZXJ0aWVzW3Byb3BlcnR5XTtcblxuXHRcdGlmIChkZXNjcmlwdG9yID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGRlc2NyaXB0b3IgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5KTtcblx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHldID0gZGVzY3JpcHRvcjtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVzY3JpcHRvcjtcblx0fVxuXG5cdGdldFByb3h5KHRhcmdldCwgcGF0aCwgaGFuZGxlcikge1xuXHRcdGlmICh0aGlzLmlzVW5zdWJzY3JpYmVkKSB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0O1xuXHRcdH1cblxuXHRcdHRoaXMuX3BhdGhDYWNoZS5zZXQodGFyZ2V0LCBwYXRoKTtcblxuXHRcdGxldCBwcm94eSA9IHRoaXMuX3Byb3h5Q2FjaGUuZ2V0KHRhcmdldCk7XG5cblx0XHRpZiAocHJveHkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cHJveHkgPSBuZXcgUHJveHkodGFyZ2V0LCBoYW5kbGVyKTtcblx0XHRcdHRoaXMuX3Byb3h5Q2FjaGUuc2V0KHRhcmdldCwgcHJveHkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm94eTtcblx0fVxuXG5cdGdldFBhdGgodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIHRoaXMuaXNVbnN1YnNjcmliZWQgPyB1bmRlZmluZWQgOiB0aGlzLl9wYXRoQ2FjaGUuZ2V0KHRhcmdldCk7XG5cdH1cblxuXHRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XG5cdFx0aWYgKCFSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIGRlc2NyaXB0b3IpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmlzVW5zdWJzY3JpYmVkKSB7XG5cdFx0XHR0aGlzLl9nZXRQcm9wZXJ0aWVzKHRhcmdldClbcHJvcGVydHldID0gZGVzY3JpcHRvcjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHNldFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIHZhbHVlLCByZWNlaXZlciwgcHJldmlvdXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtcGFyYW1zXG5cdFx0aWYgKCF0aGlzLl9lcXVhbHMocHJldmlvdXMsIHZhbHVlKSB8fCAhKHByb3BlcnR5IGluIHRhcmdldCkpIHtcblx0XHRcdGNvbnN0IGRlc2NyaXB0b3IgPSB0aGlzLl9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eSk7XG5cblx0XHRcdGlmIChkZXNjcmlwdG9yICE9PSB1bmRlZmluZWQgJiYgJ3NldCcgaW4gZGVzY3JpcHRvcikge1xuXHRcdFx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIHJlY2VpdmVyKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIHByZXZpb3VzKSB7XG5cdFx0aWYgKFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSkpIHtcblx0XHRcdGlmICghdGhpcy5pc1Vuc3Vic2NyaWJlZCkge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5fZ2V0RGVzY3JpcHRvckNhY2hlKCkuZ2V0KHRhcmdldCk7XG5cblx0XHRcdFx0aWYgKHByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRkZWxldGUgcHJvcGVydGllc1twcm9wZXJ0eV07XG5cdFx0XHRcdFx0dGhpcy5fcGF0aENhY2hlLmRlbGV0ZShwcmV2aW91cyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aXNTYW1lRGVzY3JpcHRvcihhLCB0YXJnZXQsIHByb3BlcnR5KSB7XG5cdFx0Y29uc3QgYiA9IHRoaXMuX2dldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5KTtcblxuXHRcdHJldHVybiBhICE9PSB1bmRlZmluZWQgJiZcblx0XHRcdGIgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0T2JqZWN0LmlzKGEudmFsdWUsIGIudmFsdWUpICYmXG5cdFx0XHQoYS53cml0YWJsZSB8fCBmYWxzZSkgPT09IChiLndyaXRhYmxlIHx8IGZhbHNlKSAmJlxuXHRcdFx0KGEuZW51bWVyYWJsZSB8fCBmYWxzZSkgPT09IChiLmVudW1lcmFibGUgfHwgZmFsc2UpICYmXG5cdFx0XHQoYS5jb25maWd1cmFibGUgfHwgZmFsc2UpID09PSAoYi5jb25maWd1cmFibGUgfHwgZmFsc2UpICYmXG5cdFx0XHRhLmdldCA9PT0gYi5nZXQgJiZcblx0XHRcdGEuc2V0ID09PSBiLnNldDtcblx0fVxuXG5cdGlzR2V0SW52YXJpYW50KHRhcmdldCwgcHJvcGVydHkpIHtcblx0XHRjb25zdCBkZXNjcmlwdG9yID0gdGhpcy5fZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHkpO1xuXG5cdFx0cmV0dXJuIGRlc2NyaXB0b3IgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0ZGVzY3JpcHRvci5jb25maWd1cmFibGUgIT09IHRydWUgJiZcblx0XHRcdGRlc2NyaXB0b3Iud3JpdGFibGUgIT09IHRydWU7XG5cdH1cblxuXHR1bnN1YnNjcmliZSgpIHtcblx0XHR0aGlzLl9kZXNjcmlwdG9yQ2FjaGUgPSBudWxsO1xuXHRcdHRoaXMuX3BhdGhDYWNoZSA9IG51bGw7XG5cdFx0dGhpcy5fcHJveHlDYWNoZSA9IG51bGw7XG5cdFx0dGhpcy5pc1Vuc3Vic2NyaWJlZCA9IHRydWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYWNoZTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRQQVRIX1NFUEFSQVRPUjogJy4nLFxuXHRUQVJHRVQ6IFN5bWJvbCgndGFyZ2V0JyksXG5cdFVOU1VCU0NSSUJFOiBTeW1ib2woJ3Vuc3Vic2NyaWJlJylcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pcy1zeW1ib2wnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2FjaGUsIG9wdGlvbnMsIHByb3BlcnR5KSA9PiB7XG5cdHJldHVybiBjYWNoZS5pc1Vuc3Vic2NyaWJlZCB8fFxuXHRcdChvcHRpb25zLmlnbm9yZVN5bWJvbHMgPT09IHRydWUgJiYgaXNTeW1ib2wocHJvcGVydHkpKSB8fFxuXHRcdChvcHRpb25zLmlnbm9yZVVuZGVyc2NvcmVzID09PSB0cnVlICYmIHByb3BlcnR5LmNoYXJBdCgwKSA9PT0gJ18nKSB8fFxuXHRcdCgnaWdub3JlS2V5cycgaW4gb3B0aW9ucyAmJiBvcHRpb25zLmlnbm9yZUtleXMuaW5jbHVkZXMocHJvcGVydHkpKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHdpdGhNdXRhYmxlTWV0aG9kczogdmFsdWUgPT4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlLFxuXHR3aXRob3V0TXV0YWJsZU1ldGhvZHM6IHZhbHVlID0+XG5cdFx0dmFsdWUgPT09IG51bGwgfHxcblx0XHQodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHx8XG5cdFx0dmFsdWUgaW5zdGFuY2VvZiBSZWdFeHBcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWUgPT4gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtQQVRIX1NFUEFSQVRPUn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuY29uc3QgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXMtYXJyYXknKTtcbmNvbnN0IGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pcy1zeW1ib2wnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGFmdGVyOiAocGF0aCwgc3ViUGF0aCkgPT4ge1xuXHRcdGlmIChpc0FycmF5KHBhdGgpKSB7XG5cdFx0XHRyZXR1cm4gcGF0aC5zbGljZShzdWJQYXRoLmxlbmd0aCk7XG5cdFx0fVxuXG5cdFx0aWYgKHN1YlBhdGggPT09ICcnKSB7XG5cdFx0XHRyZXR1cm4gcGF0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGF0aC5zbGljZShzdWJQYXRoLmxlbmd0aCArIDEpO1xuXHR9LFxuXHRjb25jYXQ6IChwYXRoLCBrZXkpID0+IHtcblx0XHRpZiAoaXNBcnJheShwYXRoKSkge1xuXHRcdFx0cGF0aCA9IHBhdGguc2xpY2UoKTtcblxuXHRcdFx0aWYgKGtleSkge1xuXHRcdFx0XHRwYXRoLnB1c2goa2V5KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0fVxuXG5cdFx0aWYgKGtleSAmJiBrZXkudG9TdHJpbmcgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aWYgKHBhdGggIT09ICcnKSB7XG5cdFx0XHRcdHBhdGggKz0gUEFUSF9TRVBBUkFUT1I7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpc1N5bWJvbChrZXkpKSB7XG5cdFx0XHRcdHJldHVybiBwYXRoICsgJ1N5bWJvbCgnICsga2V5LmRlc2NyaXB0aW9uICsgJyknO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcGF0aCArIGtleTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGF0aDtcblx0fSxcblx0aW5pdGlhbDogcGF0aCA9PiB7XG5cdFx0aWYgKGlzQXJyYXkocGF0aCkpIHtcblx0XHRcdHJldHVybiBwYXRoLnNsaWNlKDAsIC0xKTtcblx0XHR9XG5cblx0XHRpZiAocGF0aCA9PT0gJycpIHtcblx0XHRcdHJldHVybiBwYXRoO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZihQQVRIX1NFUEFSQVRPUik7XG5cblx0XHRpZiAoaW5kZXggPT09IC0xKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhdGguc2xpY2UoMCwgaW5kZXgpO1xuXHR9LFxuXHR3YWxrOiAocGF0aCwgY2FsbGJhY2spID0+IHtcblx0XHRpZiAoaXNBcnJheShwYXRoKSkge1xuXHRcdFx0cGF0aC5mb3JFYWNoKGtleSA9PiBjYWxsYmFjayhrZXkpKTtcblx0XHR9IGVsc2UgaWYgKHBhdGggIT09ICcnKSB7XG5cdFx0XHRsZXQgcG9zaXRpb24gPSAwO1xuXHRcdFx0bGV0IGluZGV4ID0gcGF0aC5pbmRleE9mKFBBVEhfU0VQQVJBVE9SKTtcblxuXHRcdFx0aWYgKGluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRjYWxsYmFjayhwYXRoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlIChwb3NpdGlvbiA8IHBhdGgubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRcdFx0aW5kZXggPSBwYXRoLmxlbmd0aDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjYWxsYmFjayhwYXRoLnNsaWNlKHBvc2l0aW9uLCBpbmRleCkpO1xuXG5cdFx0XHRcdFx0cG9zaXRpb24gPSBpbmRleCArIDE7XG5cdFx0XHRcdFx0aW5kZXggPSBwYXRoLmluZGV4T2YoUEFUSF9TRVBBUkFUT1IsIHBvc2l0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJy4vcGF0aCcpO1xuY29uc3QgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXMtYXJyYXknKTtcbmNvbnN0IGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcblxuY29uc3Qgc2hhbGxvd0VxdWFsID0gKGNsb25lLCB2YWx1ZSkgPT4ge1xuXHRyZXR1cm4gY2xvbmUubGVuZ3RoICE9PSB2YWx1ZS5sZW5ndGggfHwgY2xvbmUuc29tZSgoaXRlbSwgaW5kZXgpID0+IHZhbHVlW2luZGV4XSAhPT0gaXRlbSk7XG59O1xuXG5jb25zdCBJTU1VVEFCTEVfT0JKRUNUX01FVEhPRFMgPSBuZXcgU2V0KFtcblx0J2hhc093blByb3BlcnR5Jyxcblx0J2lzUHJvdG90eXBlT2YnLFxuXHQncHJvcGVydHlJc0VudW1lcmFibGUnLFxuXHQndG9Mb2NhbGVTdHJpbmcnLFxuXHQndG9TdHJpbmcnLFxuXHQndmFsdWVPZidcbl0pO1xuXG5jb25zdCBJTU1VVEFCTEVfQVJSQVlfTUVUSE9EUyA9IG5ldyBTZXQoW1xuXHQnaW5jbHVkZXMnLFxuXHQnaW5kZXhPZicsXG5cdCdqb2luJyxcblx0J2tleXMnLFxuXHQnbGFzdEluZGV4T2YnXG5dKTtcblxuY29uc3QgU0hBTExPV19NVVRBQkxFX0FSUkFZX01FVEhPRFMgPSB7XG5cdHB1c2g6ICgpID0+IHRydWUsXG5cdHBvcDogKCkgPT4gdHJ1ZSxcblx0c2hpZnQ6ICgpID0+IHRydWUsXG5cdHVuc2hpZnQ6ICgpID0+IHRydWUsXG5cdGNvbmNhdDogKGNsb25lLCB2YWx1ZSkgPT4gY2xvbmUubGVuZ3RoICE9PSB2YWx1ZS5sZW5ndGgsXG5cdGNvcHlXaXRoaW46IHNoYWxsb3dFcXVhbCxcblx0cmV2ZXJzZTogc2hhbGxvd0VxdWFsLFxuXHRzb3J0OiBzaGFsbG93RXF1YWwsXG5cdHNwbGljZTogc2hhbGxvd0VxdWFsLFxuXHRmbGF0OiBzaGFsbG93RXF1YWwsXG5cdGZpbGw6IHNoYWxsb3dFcXVhbFxufTtcblxuY2xhc3Mgc21hcnRDbG9uZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuZG9uZSgpO1xuXHR9XG5cblx0c2hhbGxvd0Nsb25lKHZhbHVlKSB7XG5cdFx0bGV0IGNsb25lO1xuXG5cdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRjbG9uZSA9IFsuLi52YWx1ZV07XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcblx0XHRcdGNsb25lID0gbmV3IERhdGUodmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbG9uZSA9IHsuLi52YWx1ZX07XG5cdFx0fVxuXG5cdFx0dGhpcy5fY2FjaGUuYWRkKGNsb25lKTtcblxuXHRcdHJldHVybiBjbG9uZTtcblx0fVxuXG5cdHN0YXJ0KHZhbHVlLCBwYXRoKSB7XG5cdFx0aWYgKHRoaXMuX2NhY2hlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX2NhY2hlID0gbmV3IFNldCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuY2xvbmUgPSBwYXRoID09PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHRoaXMuc2hhbGxvd0Nsb25lKHZhbHVlKTtcblx0XHR0aGlzLl9wYXRoID0gcGF0aDtcblx0XHR0aGlzLmlzQ2xvbmluZyA9IHRydWU7XG5cdH1cblxuXHRpc0hhbmRsZWRNZXRob2QodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKGlzQXJyYXkodGFyZ2V0KSAmJiAoSU1NVVRBQkxFX09CSkVDVF9NRVRIT0RTLmhhcyhuYW1lKSB8fFxuXHRcdFx0SU1NVVRBQkxFX0FSUkFZX01FVEhPRFMuaGFzKG5hbWUpIHx8XG5cdFx0XHRuYW1lIGluIFNIQUxMT1dfTVVUQUJMRV9BUlJBWV9NRVRIT0RTKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGlzT2JqZWN0KHRhcmdldCkgJiYgSU1NVVRBQkxFX09CSkVDVF9NRVRIT0RTLmhhcyhuYW1lKTtcblx0fVxuXG5cdHByZWZlcnJlZFRoaXNBcmcodGFyZ2V0LCB0aGlzQXJnLCB0aGlzUHJveHlUYXJnZXQpIHtcblx0XHRjb25zdCB7bmFtZX0gPSB0YXJnZXQ7XG5cblx0XHRpZiAodGhpcy5pc0hhbmRsZWRNZXRob2QodGhpc1Byb3h5VGFyZ2V0LCBuYW1lKSkge1xuXHRcdFx0aWYgKGlzQXJyYXkodGhpc1Byb3h5VGFyZ2V0KSkge1xuXHRcdFx0XHR0aGlzLl9vbklzQ2hhbmdlZCA9IFNIQUxMT1dfTVVUQUJMRV9BUlJBWV9NRVRIT0RTW25hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpc1Byb3h5VGFyZ2V0O1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzQXJnO1xuXHR9XG5cblx0dXBkYXRlKGZ1bGxQYXRoLCBwcm9wZXJ0eSwgdmFsdWUpIHtcblx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0eSAhPT0gJ2xlbmd0aCcpIHtcblx0XHRcdGxldCBvYmplY3QgPSB0aGlzLmNsb25lO1xuXG5cdFx0XHRwYXRoLndhbGsocGF0aC5hZnRlcihmdWxsUGF0aCwgdGhpcy5fcGF0aCksIGtleSA9PiB7XG5cdFx0XHRcdGlmICghdGhpcy5fY2FjaGUuaGFzKG9iamVjdFtrZXldKSkge1xuXHRcdFx0XHRcdG9iamVjdFtrZXldID0gdGhpcy5zaGFsbG93Q2xvbmUob2JqZWN0W2tleV0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b2JqZWN0ID0gb2JqZWN0W2tleV07XG5cdFx0XHR9KTtcblxuXHRcdFx0b2JqZWN0W3Byb3BlcnR5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHRoaXMuX2lzQ2hhbmdlZCA9IHRydWU7XG5cdH1cblxuXHRkb25lKCkge1xuXHRcdGNvbnN0IHtjbG9uZX0gPSB0aGlzO1xuXG5cdFx0aWYgKHRoaXMuX2NhY2hlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX2NhY2hlLmNsZWFyKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jbG9uZSA9IG51bGw7XG5cdFx0dGhpcy5pc0Nsb25pbmcgPSBmYWxzZTtcblx0XHR0aGlzLl9wYXRoID0gbnVsbDtcblx0XHR0aGlzLl9vbklzQ2hhbmdlZCA9IG51bGw7XG5cdFx0dGhpcy5faXNDaGFuZ2VkID0gZmFsc2U7XG5cblx0XHRyZXR1cm4gY2xvbmU7XG5cdH1cblxuXHRpc0NoYW5nZWQoaXNNdXRhYmxlLCB2YWx1ZSwgZXF1YWxzKSB7XG5cdFx0aWYgKGlzTXV0YWJsZSkge1xuXHRcdFx0cmV0dXJuICFlcXVhbHModGhpcy5jbG9uZS52YWx1ZU9mKCksIHZhbHVlLnZhbHVlT2YoKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX29uSXNDaGFuZ2VkID9cblx0XHRcdHRoaXMuX29uSXNDaGFuZ2VkKHRoaXMuY2xvbmUsIHZhbHVlKSA6XG5cdFx0XHR0aGlzLl9pc0NoYW5nZWQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzbWFydENsb25lO1xuIiwiaW1wb3J0IHtCdXR0b24sIEJ1dHRvbl9pbml0fSBmcm9tICcuL2NvbXBvbmVudC9idXR0b24nO1xyXG5pbXBvcnQge0NoZWNrYm94LCBDaGVja2JveF9pbml0fSBmcm9tICcuL2NvbXBvbmVudC9jaGVja2JveCc7XHJcbmltcG9ydCB7Y3JlYXRlQ2xpY2tFdmVudH0gZnJvbSAnLi9hcGkvY2xpY2snO1xyXG5cclxuZnVuY3Rpb24gRmx1ZW50aXplX2luaXQoKSB7XHJcbiAgICBjcmVhdGVDbGlja0V2ZW50KCk7XHJcbiAgICBCdXR0b25faW5pdCgpO1xyXG4gICAgQ2hlY2tib3hfaW5pdCgpO1xyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgRmx1ZW50aXplX2luaXQoKTtcclxufSkiLCJsZXQgbW91c2VEb3duOiBudW1iZXIgPSAwO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ2xpY2tFdmVudCgpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcclxuICAgICAgICArK21vdXNlRG93bjtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbW91c2VTdGF0ZUNoYW5nZScsIHtkZXRhaWw6IG1vdXNlRG93bn0pKTtcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcclxuICAgICAgICAtLW1vdXNlRG93bjtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbW91c2VTdGF0ZUNoYW5nZScsIHtkZXRhaWw6IG1vdXNlRG93bn0pKTtcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzTW91c2VEb3duKCkge1xyXG4gICAgcmV0dXJuIG1vdXNlRG93biA+IDA7XHJcbn1cclxuXHJcbmV4cG9ydCB7aXNNb3VzZURvd24sIGNyZWF0ZUNsaWNrRXZlbnR9OyIsImltcG9ydCB7Rm9ybX0gZnJvbSAnLi9jb21tb24vZm9ybSc7XHJcblxyXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICAgICAgc3VwZXIoZWwpO1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRlZzogbnVtYmVyID0gKC1lLm9mZnNldFkgLyB0aGlzLmVsLm9mZnNldEhlaWdodCArIDAuNSkgKiAyICogODtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWZsdWVudC1idG4tcm90YXRlJywgYCR7ZGVnfWRlZ2ApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBCdXR0b25faW5pdCgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24nKS5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgIG5ldyBCdXR0b24oZWwpO1xyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IHtCdXR0b24sIEJ1dHRvbl9pbml0fTsiLCJpbXBvcnQge0Zvcm19IGZyb20gJy4vY29tbW9uL2Zvcm0nO1xyXG5pbXBvcnQgKiBhcyBvbkNoYW5nZSBmcm9tICdvbi1jaGFuZ2UnO1xyXG5cclxuY2xhc3MgQ2hlY2tib3ggZXh0ZW5kcyBGb3JtIHtcclxuICAgIGNoZWNrYm94OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjaGVja0hhbmRsZXIoKSB7XHJcbiAgICAgICAgaWYgKCh0aGlzLmNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnLS1mbHVlbnQtY2hlY2tib3gtY2hlY2tlZCcpKSB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LWNoZWNrYm94LWNoZWNrZWQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoJy0tZmx1ZW50LWNoZWNrYm94LWNoZWNrZWQnKSkgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1jaGVja2JveC1jaGVja2VkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsKSB7XHJcbiAgICAgICAgc3VwZXIoZWwpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3ggPSBlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpO1xyXG4gICAgICAgIGlmICh0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucygnc3dpdGNoJykpIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtc3dpdGNoLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIGVsc2UgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCctLWZsdWVudC1jaGVja2JveC1jb250YWluZXInKTtcclxuICAgICAgICB0aGlzLmNoZWNrSGFuZGxlcigpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5jaGVja0hhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgaWYgKCh0aGlzLmNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRpc2FibGVkKSB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LWRpc2FibGVkJyk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJy0tZmx1ZW50LWRpc2FibGVkJyk7XHJcbiAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZjogQ2hlY2tib3ggPSB0aGlzO1xyXG4gICAgICAgICAgICBzZWxmLmNoZWNrSGFuZGxlcigpO1xyXG4gICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09IFwiYXR0cmlidXRlc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzZWxmLmNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJy0tZmx1ZW50LWRpc2FibGVkJykpIHNlbGYuZWwuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5lbC5jbGFzc0xpc3QuY29udGFpbnMoJy0tZmx1ZW50LWRpc2FibGVkJykpIHNlbGYuZWwuY2xhc3NMaXN0LnJlbW92ZSgnLS1mbHVlbnQtZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsLCB7YXR0cmlidXRlczogdHJ1ZX0pO1xyXG4gICAgICAgIG9uQ2hhbmdlKCh0aGlzLmNoZWNrYm94IGFzIEhUTUxJbnB1dEVsZW1lbnQpLCBmdW5jdGlvbiAocGF0aCwgdmFsdWUsIHByZXZpb3VzVmFsdWUsIG5hbWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXM6JywgdGhpcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYXRoOicsIHBhdGgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmFsdWU6JywgdmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJldmlvdXNWYWx1ZTonLCBwcmV2aW91c1ZhbHVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25hbWU6JywgbmFtZSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gQ2hlY2tib3hfaW5pdCgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xhYmVsJykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBpZiAoZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1jaGVja2JveF0nKSkgbmV3IENoZWNrYm94KGVsKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQge0NoZWNrYm94LCBDaGVja2JveF9pbml0fTsiLCJjbGFzcyBGb3JtIHtcclxuICAgIGVsOiBIVE1MRWxlbWVudDtcclxuICAgIGlzQ2xpY2tlZDogQm9vbGVhbjtcclxuICAgIGlzSG92ZXI6IEJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWwpIHtcclxuICAgICAgICB0aGlzLmVsID0gZWw7XHJcbiAgICAgICAgdGhpcy5pc0hvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc0NsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNIb3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnLS1mbHVlbnQtcmVsZWFzZScpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NsaWNrZWQpIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnLS1mbHVlbnQtY2xpY2snKTtcclxuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCctLWZsdWVudC1ob3ZlcicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc0hvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnLS1mbHVlbnQtY2xpY2snKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDbGlja2VkKSB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LXJlbGVhc2UnKTtcclxuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCctLWZsdWVudC1ob3ZlcicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc0NsaWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJy0tZmx1ZW50LWNsaWNrJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnLS1mbHVlbnQtcmVsZWFzZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlU3RhdGVDaGFuZ2UnLCAoZTogQ3VzdG9tRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuZGV0YWlsID4gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNDbGlja2VkKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNDbGlja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnLS1mbHVlbnQtY2xpY2snKTtcclxuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCctLWZsdWVudC1yZWxlYXNlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7Rm9ybX07Il0sInNvdXJjZVJvb3QiOiIifQ==