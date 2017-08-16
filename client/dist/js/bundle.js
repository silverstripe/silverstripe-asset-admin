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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 161);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = ReactRedux;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = ReactDom;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = Redux;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(123);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(51),
    isLength = __webpack_require__(74);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(105),
    baseKeys = __webpack_require__(114),
    isArrayLike = __webpack_require__(11);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  ACTIONS: {
    CREATE_FOLDER: 'create-folder',
    EDIT_FILE: 'edit'
  },
  MOVE_SUCCESS_DURATION: 3000,
  CSS_TRANSITION_TIME: 300,
  SMALL_THUMBNAIL_HEIGHT: 60,
  SMALL_THUMBNAIL_WIDTH: 60,
  THUMBNAIL_HEIGHT: 150,
  THUMBNAIL_WIDTH: 200,
  BULK_ACTIONS: [{
    value: 'delete',
    label: _i18n2.default._t('AssetAdmin.BULK_ACTIONS_DELETE', 'Delete'),
    className: 'font-icon-trash',
    destructive: true,
    callback: null,
    canApply: function canApply(items) {
      return items.reduce(function (current, item) {
        return item && item.canDelete && current;
      }, true);
    },
    confirm: function (_confirm) {
      function confirm(_x) {
        return _confirm.apply(this, arguments);
      }

      confirm.toString = function () {
        return _confirm.toString();
      };

      return confirm;
    }(function (items) {
      return new Promise(function (resolve, reject) {
        var foldersInUse = items.filter(function (item) {
          return item.type === 'folder' && item.filesInUseCount > 0;
        });

        if (foldersInUse.length) {
          alert(_i18n2.default._t('AssetAdmin.BULK_ACTIONS_DELETE_FOLDER', 'These folders contain files which are currently in use, you must move or ' + 'delete their contents before you can delete the folder.'));

          reject('cancelled');
          return;
        }
        var filesInUse = items.filter(function (item) {
          return item.type !== 'folder' && item.inUseCount > 0;
        });

        var msg = _i18n2.default._t('AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM', 'Are you sure you want to delete these files?');
        if (items.length === 1 && filesInUse.length === 1) {
          msg = _i18n2.default.sprintf(_i18n2.default._t('AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_CONFIRM', 'This file is currently in use in %s places, are you sure you want to delete it?'), items[0].inUseCount);
        }
        if (filesInUse.length > 1) {
          _i18n2.default.sprintf(_i18n2.default._t('AssetAdmin.BULK_ACTIONS_DELETE_MULTI_CONFIRM', 'There are %s files currently in use, are you sure you want to delete these files?'), filesInUse.length);
        }

        if (confirm(msg)) {
          resolve();
        } else {
          reject('cancelled');
        }
      });
    })
  }, {
    value: 'edit',
    label: _i18n2.default._t('AssetAdmin.BULK_ACTIONS_EDIT', 'Edit'),
    className: 'font-icon-edit',
    destructive: false,

    canApply: function canApply(items) {
      return items.length === 1;
    },
    callback: null }],
  BULK_ACTIONS_PLACEHOLDER: _i18n2.default._t('AssetAdmin.BULK_ACTIONS_PLACEHOLDER'),
  SPACE_KEY_CODE: 32,
  RETURN_KEY_CODE: 13,
  DEFAULT_PREVIEW: 'framework/client/dist/images/app_icons/generic_92.png'
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = SilverStripeComponent;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(22),
    getRawTag = __webpack_require__(269),
    objectToString = __webpack_require__(297);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(28),
    baseAssignValue = __webpack_require__(107);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(229),
    getValue = __webpack_require__(270);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(25);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = InsertMediaModal;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(10);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(33),
    overRest = __webpack_require__(131),
    setToString = __webpack_require__(133);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(2),
    isKey = __webpack_require__(70),
    stringToPath = __webpack_require__(134),
    toString = __webpack_require__(77);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isObjectLike = __webpack_require__(15);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = GraphQLTag;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var map = __webpack_require__(141);
var filter = __webpack_require__(136);
var find = __webpack_require__(72);
var sortBy = __webpack_require__(330);
var difference = __webpack_require__(312);

var ColumnProperties = (function () {
  function ColumnProperties() {
    var allColumns = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var filteredColumns = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var childrenColumnName = arguments.length <= 2 || arguments[2] === undefined ? "children" : arguments[2];
    var columnMetadata = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
    var metadataColumns = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

    _classCallCheck(this, ColumnProperties);

    this.allColumns = allColumns;
    this.filteredColumns = filteredColumns;
    this.childrenColumnName = childrenColumnName;
    this.columnMetadata = columnMetadata;
    this.metadataColumns = metadataColumns;
  }

  _createClass(ColumnProperties, [{
    key: 'getMetadataColumns',
    value: function getMetadataColumns() {
      var meta = map(filter(this.columnMetadata, { visible: false }), function (item) {
        return item.columnName;
      });
      if (meta.indexOf(this.childrenColumnName) < 0) {
        meta.push(this.childrenColumnName);
      }
      return meta.concat(this.metadataColumns);
    }
  }, {
    key: 'getVisibleColumnCount',
    value: function getVisibleColumnCount() {
      return this.getColumns().length;
    }
  }, {
    key: 'getColumnMetadataByName',
    value: function getColumnMetadataByName(name) {
      return find(this.columnMetadata, { columnName: name });
    }
  }, {
    key: 'hasColumnMetadata',
    value: function hasColumnMetadata() {
      return this.columnMetadata !== null && this.columnMetadata.length > 0;
    }
  }, {
    key: 'getMetadataColumnProperty',
    value: function getMetadataColumnProperty(columnName, propertyName, defaultValue) {
      var meta = this.getColumnMetadataByName(columnName);

      //send back the default value if meta isn't there
      if (typeof meta === "undefined" || meta === null) return defaultValue;

      return meta.hasOwnProperty(propertyName) ? meta[propertyName] : defaultValue;
    }
  }, {
    key: 'orderColumns',
    value: function orderColumns(cols) {
      var _this = this;

      var ORDER_MAX = 100;

      var orderedColumns = sortBy(cols, function (item) {
        var metaItem = find(_this.columnMetadata, { columnName: item });

        if (typeof metaItem === 'undefined' || metaItem === null || isNaN(metaItem.order)) {
          return ORDER_MAX;
        }

        return metaItem.order;
      });

      return orderedColumns;
    }
  }, {
    key: 'getColumns',
    value: function getColumns() {
      //if we didn't set default or filter
      var filteredColumns = this.filteredColumns.length === 0 ? this.allColumns : this.filteredColumns;

      filteredColumns = difference(filteredColumns, this.metadataColumns);

      filteredColumns = this.orderColumns(filteredColumns);

      return filteredColumns;
    }
  }]);

  return ColumnProperties;
})();

module.exports = ColumnProperties;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(107),
    eq = __webpack_require__(32);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(232),
    baseMatchesProperty = __webpack_require__(233),
    identity = __webpack_require__(33),
    isArray = __webpack_require__(2),
    property = __webpack_require__(142);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(333);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = DataFormat;

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = FormBuilderModal;

/***/ }),
/* 37 */,
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var configShape = _react.PropTypes.shape({
  url: _react.PropTypes.string,
  limit: _react.PropTypes.number,
  imageRetry: _react.PropTypes.shape({
    minRetry: _react.PropTypes.number,
    maxRetry: _react.PropTypes.number,
    expiry: _react.PropTypes.number
  }),
  form: _react.PropTypes.object,
  dropzoneOptions: _react.PropTypes.object
});

exports.default = configShape;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.folder = exports.file = exports.fileInterface = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n  }\n'], ['\n  fragment FileInterfaceFields on FileInterface {\n    canDelete\n    canEdit\n    canView\n    category\n    exists\n    filename\n    id\n    lastEdited\n    name\n    parentId\n    title\n    type\n    url\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n  }\n'], ['\n  fragment FileFields on File {\n    draft\n    extension\n    height\n    published\n    size\n    smallThumbnail\n    thumbnail\n    width\n    inUseCount\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  fragment FolderFields on Folder {\n    filesInUseCount\n  }\n'], ['\n  fragment FolderFields on Folder {\n    filesInUseCount\n  }\n']);

var _graphqlTag = __webpack_require__(26);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fileInterface = (0, _graphqlTag2.default)(_templateObject);

var file = (0, _graphqlTag2.default)(_templateObject2);

var folder = (0, _graphqlTag2.default)(_templateObject3);

exports.fileInterface = fileInterface;
exports.file = file;
exports.folder = folder;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(283),
    listCacheDelete = __webpack_require__(284),
    listCacheGet = __webpack_require__(285),
    listCacheHas = __webpack_require__(286),
    listCacheSet = __webpack_require__(287);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(32);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(24),
    toKey = __webpack_require__(20);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(281);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(209),
    Map = __webpack_require__(59),
    Promise = __webpack_require__(211),
    Set = __webpack_require__(212),
    WeakMap = __webpack_require__(213),
    baseGetTag = __webpack_require__(17),
    toSource = __webpack_require__(135);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(19);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(28),
    copyObject = __webpack_require__(18),
    createAssigner = __webpack_require__(119),
    isArrayLike = __webpack_require__(11),
    isPrototype = __webpack_require__(31),
    keys = __webpack_require__(13);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(225),
    isObjectLike = __webpack_require__(15);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(10),
    stubFalse = __webpack_require__(331);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(52)(module)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isObject = __webpack_require__(12);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = DeepFreezeStrict;

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = ReactDND;

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = SchemaActions;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _dropzone = __webpack_require__(198);

var _dropzone2 = _interopRequireDefault(_dropzone);

var _jquery = __webpack_require__(7);

var _jquery2 = _interopRequireDefault(_jquery);

var _DataFormat = __webpack_require__(35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var idCounter = 0;

var AssetDropzone = function (_SilverStripeComponen) {
  _inherits(AssetDropzone, _SilverStripeComponen);

  function AssetDropzone(props) {
    _classCallCheck(this, AssetDropzone);

    var _this = _possibleConstructorReturn(this, (AssetDropzone.__proto__ || Object.getPrototypeOf(AssetDropzone)).call(this, props));

    _this.dropzone = null;
    _this.dragging = false;

    _this.handleAccept = _this.handleAccept.bind(_this);
    _this.handleAddedFile = _this.handleAddedFile.bind(_this);
    _this.handleDragEnter = _this.handleDragEnter.bind(_this);
    _this.handleDragLeave = _this.handleDragLeave.bind(_this);
    _this.handleDrop = _this.handleDrop.bind(_this);
    _this.handleUploadProgress = _this.handleUploadProgress.bind(_this);
    _this.handleError = _this.handleError.bind(_this);
    _this.handleSending = _this.handleSending.bind(_this);
    _this.handleSuccess = _this.handleSuccess.bind(_this);
    _this.loadImage = _this.loadImage.bind(_this);
    _this.handleMaxFilesExceeded = _this.handleMaxFilesExceeded.bind(_this);
    return _this;
  }

  _createClass(AssetDropzone, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _get(AssetDropzone.prototype.__proto__ || Object.getPrototypeOf(AssetDropzone.prototype), 'componentDidMount', this).call(this);

      var defaultOptions = this.getDefaultOptions();

      var uploadSelector = this.props.uploadSelector;
      if (!uploadSelector && this.props.uploadButton) {
        uploadSelector = '.asset-dropzone__upload-button';
      }

      if (uploadSelector) {
        var found = (0, _jquery2.default)(_reactDom2.default.findDOMNode(this)).find(uploadSelector);
        if (found && found.length) {
          defaultOptions.clickable = found.toArray();
        }
      }

      this.dropzone = new _dropzone2.default(_reactDom2.default.findDOMNode(this), Object.assign({}, defaultOptions, this.props.options));

      var name = this.props.name;
      if (name) {
        this.dropzone.hiddenFileInput.classList.add('dz-input-' + name);
      }

      if (typeof this.props.promptOnRemove !== 'undefined') {
        this.setPromptOnRemove(this.props.promptOnRemove);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _get(AssetDropzone.prototype.__proto__ || Object.getPrototypeOf(AssetDropzone.prototype), 'componentWillUnmount', this).call(this);

      this.dropzone.disable();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.canUpload) {
        if (this.dropzone) {
          this.dropzone.enable();
        }
      } else {
        this.dropzone.disable();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var className = ['asset-dropzone'];

      if (this.props.className) {
        className.push(this.props.className);
      }

      var buttonProps = {
        className: 'asset-dropzone__upload-button ss-ui-button font-icon-upload',
        type: 'button'
      };

      if (!this.props.canUpload) {
        buttonProps.disabled = true;
      }

      if (this.dragging === true) {
        className.push('dragging');
      }

      return _react2.default.createElement(
        'div',
        { className: className.join(' ') },
        this.props.uploadButton && _react2.default.createElement(
          'button',
          buttonProps,
          _i18n2.default._t('AssetAdmin.DROPZONE_UPLOAD')
        ),
        this.props.children
      );
    }
  }, {
    key: 'getDefaultOptions',
    value: function getDefaultOptions() {
      return {
        accept: this.handleAccept,

        addedfile: this.handleAddedFile,

        dragenter: this.handleDragEnter,

        dragleave: this.handleDragLeave,

        drop: this.handleDrop,

        maxfilesexceeded: this.handleMaxFilesExceeded,

        uploadprogress: this.handleUploadProgress,

        dictDefaultMessage: _i18n2.default._t('AssetAdmin.DROPZONE_DEFAULT_MESSAGE', 'Drop files here to upload'),

        dictFallbackMessage: _i18n2.default._t('AssetAdmin.DROPZONE_FALLBACK_MESSAGE', 'Your browser does not support drag\'n\'drop file uploads.'),

        dictFallbackText: _i18n2.default._t('AssetAdmin.DROPZONE_FALLBACK_TEXT', 'Please use the fallback form below to upload your files like in the olden days.'),

        dictInvalidFileType: _i18n2.default._t('AssetAdmin.DROPZONE_INVALID_FILE_TYPE', 'You can\'t upload files of this type.'),

        dictResponseError: _i18n2.default._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.'),

        dictCancelUpload: _i18n2.default._t('AssetAdmin.DROPZONE_CANCEL_UPLOAD', 'Cancel upload'),

        dictCancelUploadConfirmation: _i18n2.default._t('AssetAdmin.DROPZONE_CANCEL_UPLOAD_CONFIRMATION', 'Are you sure you want to cancel this upload?'),

        dictRemoveFile: _i18n2.default._t('AssetAdmin.DROPZONE_REMOVE_FILE', 'Remove file'),

        dictMaxFilesExceeded: _i18n2.default._t('AssetAdmin.DROPZONE_MAX_FILES_EXCEEDED', 'You can not upload any more files.'),

        error: this.handleError,

        sending: this.handleSending,

        success: this.handleSuccess,

        thumbnailHeight: 150,

        thumbnailWidth: 200
      };
    }
  }, {
    key: 'getFileCategory',
    value: function getFileCategory(fileType) {
      return fileType.split('/')[0];
    }
  }, {
    key: 'handleDragEnter',
    value: function handleDragEnter(event) {
      if (!this.props.canUpload) {
        return;
      }

      this.dragging = true;
      this.forceUpdate();

      if (typeof this.props.handleDragEnter === 'function') {
        this.props.handleDragEnter(event);
      }
    }
  }, {
    key: 'handleDragLeave',
    value: function handleDragLeave(event) {
      var componentNode = _reactDom2.default.findDOMNode(this);

      if (!this.props.canUpload) {
        return;
      }

      if (event.target !== componentNode) {
        return;
      }

      this.dragging = false;
      this.forceUpdate();

      if (typeof this.props.handleDragLeave === 'function') {
        this.props.handleDragLeave(event, componentNode);
      }
    }
  }, {
    key: 'handleUploadProgress',
    value: function handleUploadProgress(file, progress, bytesSent) {
      if (typeof this.props.handleUploadProgress === 'function') {
        this.props.handleUploadProgress(file, progress, bytesSent);
      }
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop(event) {
      this.dragging = false;
      this.forceUpdate();

      if (typeof this.props.handleDrop === 'function') {
        this.props.handleDrop(event);
      }
    }
  }, {
    key: 'handleSending',
    value: function handleSending(file, xhr, formData) {
      var _this2 = this;

      if (typeof this.props.updateFormData === 'function') {
        this.props.updateFormData(formData);
      }
      formData.append('SecurityID', this.props.securityID);
      formData.append('ParentID', this.props.folderId);

      var newXhr = Object.assign({}, xhr, {
        abort: function abort() {
          _this2.dropzone.cancelUpload(file);
          xhr.abort();
        }
      });
      if (typeof this.props.handleSending === 'function') {
        this.props.handleSending(file, newXhr, formData);
      }
    }
  }, {
    key: 'handleMaxFilesExceeded',
    value: function handleMaxFilesExceeded(file) {
      if (typeof this.props.handleMaxFilesExceeded === 'function') {
        return this.props.handleMaxFilesExceeded(file);
      }

      return true;
    }
  }, {
    key: 'generateQueuedId',
    value: function generateQueuedId() {
      return ++idCounter;
    }
  }, {
    key: 'handleAccept',
    value: function handleAccept(file, done) {
      if (typeof this.props.canFileUpload === 'function' && !this.props.canFileUpload(file)) {
        return done(_i18n2.default._t('AssetAdmin.DROPZONE_CANNOT_UPLOAD', 'Uploading not permitted.'));
      }

      if (!this.props.canUpload) {
        return done(_i18n2.default._t('AssetAdmin.DROPZONE_CANNOT_UPLOAD', 'Uploading not permitted.'));
      }

      return done();
    }
  }, {
    key: 'handleAddedFile',
    value: function handleAddedFile(file) {
      var _this3 = this;

      file._queuedId = this.generateQueuedId();
      var details = {
        category: this.getFileCategory(file.type),
        filename: file.name,
        queuedId: file._queuedId,
        size: file.size,
        title: this.getFileTitle(file.name),
        extension: (0, _DataFormat.getFileExtension)(file.name),
        type: file.type
      };

      this.props.handleAddedFile(details);

      var loadPreview = this.getLoadPreview(file);

      return loadPreview.then(function (preview) {
        var previewDetails = {
          height: preview.height,
          width: preview.width,
          url: preview.thumbnailURL,
          thumbnail: preview.thumbnailURL,
          smallThumbnail: preview.thumbnailURL
        };
        if (typeof _this3.props.handlePreviewLoaded === 'function') {
          _this3.props.handlePreviewLoaded(details, previewDetails);
        }

        return _extends({}, details, previewDetails);
      });
    }
  }, {
    key: 'getLoadPreview',
    value: function getLoadPreview(file) {
      var _this4 = this;

      return new Promise(function (resolve) {
        var reader = new FileReader();

        reader.onload = function (event) {

          if (_this4.getFileCategory(file.type) === 'image') {
            var img = new Image();

            resolve(_this4.loadImage(img, event.target.result));
          } else {
            resolve({});
          }
        };

        reader.readAsDataURL(file);
      });
    }
  }, {
    key: 'getFileTitle',
    value: function getFileTitle(filename) {
      return filename.replace(/[.][^.]+$/, '').replace(/-_/, ' ');
    }
  }, {
    key: 'loadImage',
    value: function loadImage(img, newSource) {
      var _this5 = this;

      return new Promise(function (resolve) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        img.onload = function () {
          var previewWidth = _this5.props.preview.width * 2;
          var previewHeight = _this5.props.preview.height * 2;
          var ratio = img.naturalWidth / img.naturalHeight;

          if (img.naturalWidth < previewWidth || img.naturalHeight < previewHeight) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          } else if (ratio < 1) {
            canvas.width = previewWidth;
            canvas.height = previewWidth / ratio;
          } else {
            canvas.width = previewHeight * ratio;
            canvas.height = previewHeight;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var thumbnailURL = canvas.toDataURL('image/png');

          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
            thumbnailURL: thumbnailURL
          });
        };

        img.src = newSource;
      });
    }
  }, {
    key: 'handleError',
    value: function handleError(file, message) {
      this.dropzone.removeFile(file);

      if (typeof this.props.handleError === 'function') {
        this.props.handleError(file, message);
      }
    }
  }, {
    key: 'handleSuccess',
    value: function handleSuccess(file) {
      this.dropzone.removeFile(file);

      this.props.handleSuccess(file);
    }
  }, {
    key: 'setPromptOnRemove',
    value: function setPromptOnRemove(userPrompt) {
      this.dropzone.options.dictRemoveFileConfirmation = userPrompt;
    }
  }]);

  return AssetDropzone;
}(_SilverStripeComponent2.default);

AssetDropzone.propTypes = {
  folderId: _react2.default.PropTypes.number.isRequired,
  handleAccept: _react2.default.PropTypes.func,
  handleAddedFile: _react2.default.PropTypes.func.isRequired,
  handleDragEnter: _react2.default.PropTypes.func,
  handleDragLeave: _react2.default.PropTypes.func,
  handleDrop: _react2.default.PropTypes.func,
  handleError: _react2.default.PropTypes.func.isRequired,
  handlePreviewLoaded: _react2.default.PropTypes.func,
  handleSending: _react2.default.PropTypes.func,
  updateFormData: _react2.default.PropTypes.func,
  handleSuccess: _react2.default.PropTypes.func.isRequired,
  handleMaxFilesExceeded: _react2.default.PropTypes.func,
  canFileUpload: _react2.default.PropTypes.func,
  options: _react2.default.PropTypes.shape({
    url: _react2.default.PropTypes.string.isRequired
  }),
  promptOnRemove: _react2.default.PropTypes.string,
  securityID: _react2.default.PropTypes.string.isRequired,
  uploadButton: _react2.default.PropTypes.bool,
  uploadSelector: _react2.default.PropTypes.string,
  canUpload: _react2.default.PropTypes.bool.isRequired,
  preview: _react2.default.PropTypes.shape({
    width: _react2.default.PropTypes.number,
    height: _react2.default.PropTypes.number
  }),
  className: _react2.default.PropTypes.string
};

AssetDropzone.defaultProps = {
  uploadButton: true
};

exports.default = AssetDropzone;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.galleryViewDefaultProps = exports.galleryViewPropTypes = exports.sorters = exports.Gallery = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(7);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsTestUtils = __webpack_require__(148);

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _reactAddonsCssTransitionGroup = __webpack_require__(346);

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _reactRedux = __webpack_require__(4);

var _redux = __webpack_require__(8);

var _AssetDropzone = __webpack_require__(56);

var _AssetDropzone2 = _interopRequireDefault(_AssetDropzone);

var _BulkActions = __webpack_require__(163);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

var _ThumbnailView = __webpack_require__(176);

var _ThumbnailView2 = _interopRequireDefault(_ThumbnailView);

var _TableView = __webpack_require__(175);

var _TableView2 = _interopRequireDefault(_TableView);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _FormAlert = __webpack_require__(345);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

var _BackButton = __webpack_require__(162);

var _BackButton2 = _interopRequireDefault(_BackButton);

var _GalleryActions = __webpack_require__(88);

var galleryActions = _interopRequireWildcard(_GalleryActions);

var _QueuedFilesActions = __webpack_require__(93);

var queuedFilesActions = _interopRequireWildcard(_QueuedFilesActions);

var _createFolderMutation = __webpack_require__(180);

var _createFolderMutation2 = _interopRequireDefault(_createFolderMutation);

var _moveFilesMutation = __webpack_require__(182);

var _moveFilesMutation2 = _interopRequireDefault(_moveFilesMutation);

var _reactApollo = __webpack_require__(3);

var _GalleryDND = __webpack_require__(172);

var _GalleryDND2 = _interopRequireDefault(_GalleryDND);

var _configShape = __webpack_require__(38);

var _configShape2 = _interopRequireDefault(_configShape);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sorters = [{
  field: 'title',
  direction: 'asc',
  label: _i18n2.default._t('AssetAdmin.FILTER_TITLE_ASC', 'title a-z')
}, {
  field: 'title',
  direction: 'desc',
  label: _i18n2.default._t('AssetAdmin.FILTER_TITLE_DESC', 'title z-a')
}, {
  field: 'lastEdited',
  direction: 'desc',
  label: _i18n2.default._t('AssetAdmin.FILTER_DATE_DESC', 'newest')
}, {
  field: 'lastEdited',
  direction: 'asc',
  label: _i18n2.default._t('AssetAdmin.FILTER_DATE_ASC', 'oldest')
}];

var Gallery = function (_Component) {
  _inherits(Gallery, _Component);

  function Gallery(props) {
    _classCallCheck(this, Gallery);

    var _this = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, props));

    _this.handleOpenFolder = _this.handleOpenFolder.bind(_this);
    _this.handleOpenFile = _this.handleOpenFile.bind(_this);
    _this.handleSelect = _this.handleSelect.bind(_this);
    _this.handleSelectSort = _this.handleSelectSort.bind(_this);
    _this.handleAddedFile = _this.handleAddedFile.bind(_this);
    _this.handlePreviewLoaded = _this.handlePreviewLoaded.bind(_this);
    _this.handleCancelUpload = _this.handleCancelUpload.bind(_this);
    _this.handleRemoveErroredUpload = _this.handleRemoveErroredUpload.bind(_this);
    _this.handleUploadProgress = _this.handleUploadProgress.bind(_this);
    _this.handleSending = _this.handleSending.bind(_this);
    _this.handleBackClick = _this.handleBackClick.bind(_this);
    _this.handleSort = _this.handleSort.bind(_this);
    _this.handleSetPage = _this.handleSetPage.bind(_this);
    _this.handleSuccessfulUpload = _this.handleSuccessfulUpload.bind(_this);
    _this.handleFailedUpload = _this.handleFailedUpload.bind(_this);
    _this.handleCreateFolder = _this.handleCreateFolder.bind(_this);
    _this.handleViewChange = _this.handleViewChange.bind(_this);
    _this.handleClearSearch = _this.handleClearSearch.bind(_this);
    _this.handleEnableDropzone = _this.handleEnableDropzone.bind(_this);
    _this.handleMoveFiles = _this.handleMoveFiles.bind(_this);
    _this.handleBulkDelete = _this.handleBulkDelete.bind(_this);
    _this.handleBulkEdit = _this.handleBulkEdit.bind(_this);
    return _this;
  }

  _createClass(Gallery, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initSortDropdown();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.view !== 'tile') {
        var $select = this.getSortElement();

        $select.off('change');
      }

      if (!this.compareFiles(this.props.files, nextProps.files)) {
        nextProps.actions.queuedFiles.purgeUploadQueue();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.initSortDropdown();
    }
  }, {
    key: 'getSortElement',
    value: function getSortElement() {
      return (0, _jquery2.default)(_reactDom2.default.findDOMNode(this)).find('.gallery__sort .dropdown');
    }
  }, {
    key: 'getSearchMessage',
    value: function getSearchMessage(filters) {
      var messages = [];
      if (filters.name) {
        messages.push(_i18n2.default._t('AssetAdmin.SEARCHRESULTSMESSAGEKEYWORDS', 'with keywords \'{name}\''));
      }

      if (filters.lastEditedFrom && filters.lastEditedTo) {
        messages.push(_i18n2.default._t('AssetAdmin.SEARCHRESULTSMESSAGEEDITEDBETWEEN', 'last edited between \'{lastEditedFrom}\' and \'{lastEditedTo}\''));
      } else if (filters.lastEditedFrom) {
        messages.push(_i18n2.default._t('AssetAdmin.SEARCHRESULTSMESSAGEEDITEDFROM', 'last edited after \'{lastEditedFrom}\''));
      } else if (filters.lastEditedTo) {
        messages.push(_i18n2.default._t('AssetAdmin.SEARCHRESULTSMESSAGEEDITEDTO', 'last edited before \'{lastEditedTo}\''));
      }

      if (filters.appCategory) {
        messages.push(_i18n2.default._t('AssetAdmin.SEARCHRESULTSMESSAGECATEGORY', 'categorised as \'{appCategory}\''));
      }

      if (filters.currentFolderOnly) {
        messages.push(_i18n2.default._t('AssetAdmin.SEARCHRESULTSMESSAGELIMIT', 'limited to the folder \'{folder}\''));
      }

      var parts = [messages.slice(0, -1).join(_i18n2.default._t('AssetAdmin.JOIN', ',') + ' '), messages.slice(-1)].filter(function (part) {
        return part;
      }).join(' ' + _i18n2.default._t('AssetAdmin.JOINLAST', 'and') + ' ');

      if (parts === '') {
        return '';
      }

      var searchResults = {
        parts: _i18n2.default.inject(parts, Object.assign({ folder: this.props.folder.title }, filters, { appCategory: filters.appCategory ? filters.appCategory.toLowerCase() : undefined }))
      };

      return _i18n2.default.inject(_i18n2.default._t('AssetAdmin.SEARCHRESULTSMESSAGE', 'Search results {parts}'), searchResults);
    }
  }, {
    key: 'compareFiles',
    value: function compareFiles(left, right) {
      if (left && !right || !left && right) {
        return false;
      }
      if (left.length !== right.length) {
        return false;
      }
      for (var i = 0; i < left.length; i++) {
        if (left[i].id !== right[i].id) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'initSortDropdown',
    value: function initSortDropdown() {
      if (this.props.view === 'tile') {
        var $select = this.getSortElement();

        $select.chosen({
          allow_single_deselect: true,
          disable_search_threshold: 20
        });

        $select.on('change', function () {
          return _reactAddonsTestUtils2.default.Simulate.click($select.find(':selected')[0]);
        });
      }
    }
  }, {
    key: 'handleSort',
    value: function handleSort(value) {
      this.props.actions.queuedFiles.purgeUploadQueue();
      this.props.onSort(value);
    }
  }, {
    key: 'handleSelectSort',
    value: function handleSelectSort(event) {
      this.handleSort(event.currentTarget.value);
    }
  }, {
    key: 'handleSetPage',
    value: function handleSetPage(page) {
      this.props.onSetPage(page);
    }
  }, {
    key: 'handleCancelUpload',
    value: function handleCancelUpload(fileData) {
      fileData.xhr.abort();
      this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedId);
    }
  }, {
    key: 'handleRemoveErroredUpload',
    value: function handleRemoveErroredUpload(fileData) {
      this.props.actions.queuedFiles.removeQueuedFile(fileData.queuedId);
    }
  }, {
    key: 'handleAddedFile',
    value: function handleAddedFile(fileData) {
      this.props.actions.queuedFiles.addQueuedFile(fileData);
    }
  }, {
    key: 'handlePreviewLoaded',
    value: function handlePreviewLoaded(fileData, previewData) {
      this.props.actions.queuedFiles.updateQueuedFile(fileData.queuedId, previewData);
    }
  }, {
    key: 'handleSending',
    value: function handleSending(file, xhr) {
      this.props.actions.queuedFiles.updateQueuedFile(file._queuedId, { xhr: xhr });
    }
  }, {
    key: 'handleUploadProgress',
    value: function handleUploadProgress(file, progress) {
      this.props.actions.queuedFiles.updateQueuedFile(file._queuedId, { progress: progress });
    }
  }, {
    key: 'handleCreateFolder',
    value: function handleCreateFolder(event) {
      if (typeof this.props.onCreateFolder === 'function') {
        this.props.onCreateFolder();
      }

      event.preventDefault();
    }
  }, {
    key: 'handleSuccessfulUpload',
    value: function handleSuccessfulUpload(fileXhr) {
      var json = JSON.parse(fileXhr.xhr.response);

      if (typeof json[0].error !== 'undefined') {
        this.handleFailedUpload(fileXhr);
        return;
      }

      this.props.actions.queuedFiles.succeedUpload(fileXhr._queuedId, json[0]);

      if (this.props.onSuccessfulUpload) {
        this.props.onSuccessfulUpload(json);
      }

      if (this.props.type !== 'admin' && !this.props.fileId && this.props.queuedFiles.items.length === 0) {
        var lastFile = json.pop();
        this.props.onOpenFile(lastFile.id);
      }
    }
  }, {
    key: 'handleFailedUpload',
    value: function handleFailedUpload(fileXhr, response) {
      this.props.actions.queuedFiles.failUpload(fileXhr._queuedId, response);
    }
  }, {
    key: 'itemIsSelected',
    value: function itemIsSelected(id) {
      return this.props.selectedFiles.indexOf(id) > -1;
    }
  }, {
    key: 'itemIsHighlighted',
    value: function itemIsHighlighted(id) {
      return this.props.fileId === id;
    }
  }, {
    key: 'hasOpenedItem',
    value: function hasOpenedItem() {
      return !!this.props.fileId;
    }
  }, {
    key: 'handleClearSearch',
    value: function handleClearSearch(event) {
      this.handleOpenFolder(event, this.props.folder);
    }
  }, {
    key: 'handleOpenFolder',
    value: function handleOpenFolder(event, folder) {
      event.preventDefault();
      this.props.actions.gallery.setErrorMessage(null);
      this.props.actions.gallery.setNoticeMessage(null);
      this.props.onOpenFolder(folder.id);
    }
  }, {
    key: 'handleOpenFile',
    value: function handleOpenFile(event, file) {
      event.preventDefault();

      if (file.created === null) {
        return;
      }

      this.props.onOpenFile(file.id, file);
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(event, item) {
      if (this.props.selectedFiles.indexOf(item.id) === -1) {
        this.props.actions.gallery.selectFiles([item.id]);
      } else {
        this.props.actions.gallery.deselectFiles([item.id]);
      }
    }
  }, {
    key: 'handleBackClick',
    value: function handleBackClick(event) {
      event.preventDefault();
      this.props.onOpenFolder(this.props.folder.parentId);
    }
  }, {
    key: 'handleViewChange',
    value: function handleViewChange(event) {
      var view = event.currentTarget.value;

      this.props.onViewChange(view);
    }
  }, {
    key: 'handleEnableDropzone',
    value: function handleEnableDropzone(enabled) {
      this.props.actions.gallery.setEnableDropzone(enabled);
    }
  }, {
    key: 'handleMoveFiles',
    value: function handleMoveFiles(folderId, fileIds) {
      var _this2 = this;

      this.props.actions.files.moveFiles(folderId, fileIds).then(function () {
        var duration = _index2.default.MOVE_SUCCESS_DURATION;
        var message = '+' + fileIds.length;

        _this2.props.actions.gallery.setFileBadge(folderId, message, 'success', duration);

        if (typeof _this2.props.onMoveFilesSuccess === 'function') {
          _this2.props.onMoveFilesSuccess(folderId, fileIds);
        }
      });
    }
  }, {
    key: 'handleBulkDelete',
    value: function handleBulkDelete(items) {
      var _this3 = this;

      return Promise.all(items.map(function (item) {
        if (item.queuedId) {
          _this3.props.actions.queuedFiles.removeQueuedFile(item.queuedId);
          return Promise.resolve(true);
        }

        return _this3.props.onDelete(item.id).then(function () {
          return true;
        }).catch(function () {
          return false;
        });
      })).then(function (deletes) {
        var successes = deletes.filter(function (result) {
          return result;
        }).length;

        if (successes !== deletes.length) {
          _this3.props.actions.gallery.setErrorMessage(_i18n2.default.sprintf(_i18n2.default._t('AssetAdmin.BULK_ACTIONS_DELETE_FAIL'), successes, deletes.length - successes));
          _this3.props.actions.gallery.setNoticeMessage(null);
        } else {
          _this3.props.actions.gallery.setNoticeMessage(_i18n2.default.sprintf(_i18n2.default._t('AssetAdmin.BULK_ACTIONS_DELETE_SUCCESS'), successes));
          _this3.props.actions.gallery.setErrorMessage(null);
        }
      });
    }
  }, {
    key: 'handleBulkEdit',
    value: function handleBulkEdit(items) {
      this.props.onOpenFile(items[0].id);
    }
  }, {
    key: 'renderSort',
    value: function renderSort() {
      var _this4 = this;

      if (this.props.view !== 'tile') {
        return null;
      }
      return _react2.default.createElement(
        'div',
        { className: 'gallery__sort fieldholder-small' },
        _react2.default.createElement(
          'select',
          {
            className: 'dropdown no-change-track no-chzn',
            tabIndex: '0',
            style: { width: '160px' },
            defaultValue: this.props.sort
          },
          sorters.map(function (sorter, i) {
            return _react2.default.createElement(
              'option',
              {
                key: i,
                onClick: _this4.handleSelectSort,
                'data-field': sorter.field,
                'data-direction': sorter.direction,
                value: sorter.field + ',' + sorter.direction
              },
              sorter.label
            );
          })
        )
      );
    }
  }, {
    key: 'renderToolbar',
    value: function renderToolbar() {
      var canEdit = this.props.folder.canEdit;

      return _react2.default.createElement(
        'div',
        { className: 'toolbar--content toolbar--space-save' },
        _react2.default.createElement(
          'div',
          { className: 'fill-width' },
          _react2.default.createElement(
            'div',
            { className: 'flexbox-area-grow' },
            _react2.default.createElement(
              'div',
              { className: 'btn-toolbar' },
              this.renderBackButton(),
              _react2.default.createElement(
                'button',
                {
                  id: 'upload-button',
                  className: 'btn btn-secondary font-icon-upload btn--icon-xl',
                  type: 'button',
                  disabled: !canEdit
                },
                _react2.default.createElement(
                  'span',
                  { className: 'btn__text' },
                  _i18n2.default._t('AssetAdmin.DROPZONE_UPLOAD')
                )
              ),
              _react2.default.createElement(
                'button',
                {
                  id: 'add-folder-button',
                  className: 'btn btn-secondary font-icon-folder-add btn--icon-xl',
                  type: 'button',
                  onClick: this.handleCreateFolder,
                  disabled: !canEdit
                },
                _react2.default.createElement(
                  'span',
                  { className: 'btn__text' },
                  _i18n2.default._t('AssetAdmin.ADD_FOLDER_BUTTON')
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'gallery__state-buttons' },
            this.renderSort(),
            _react2.default.createElement(
              'div',
              { className: 'btn-group', role: 'group', 'aria-label': 'View mode' },
              this.renderViewChangeButtons()
            )
          )
        )
      );
    }
  }, {
    key: 'renderSearchAlert',
    value: function renderSearchAlert() {
      var filters = this.props.filters;
      if (!filters || Object.keys(filters).length === 0) {
        return null;
      }

      var message = this.getSearchMessage(filters);

      if (message === '') {
        return null;
      }

      var body = _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'button',
          {
            onClick: this.handleClearSearch,
            className: 'btn btn-info font-icon-cancel form-alert__btn--right'
          },
          _i18n2.default._t('AssetAdmin.SEARCHCLEARRESULTS', 'Clear results')
        ),
        message
      );

      return _react2.default.createElement(_FormAlert2.default, { value: { react: body }, type: 'warning' });
    }
  }, {
    key: 'renderViewChangeButtons',
    value: function renderViewChangeButtons() {
      var _this5 = this;

      var views = ['tile', 'table'];
      return views.map(function (view, index) {
        var icon = view === 'table' ? 'list' : 'thumbnails';
        var classNames = ['gallery__view-change-button', 'btn btn-secondary', 'btn--icon-sm', 'btn--no-text'];

        if (view === _this5.props.view) {
          return null;
        }
        classNames.push('font-icon-' + icon);
        return _react2.default.createElement('button', {
          id: 'button-view-' + view,
          key: index,
          className: classNames.join(' '),
          type: 'button',
          title: 'Change view gallery/list',
          onClick: _this5.handleViewChange,
          value: view
        });
      });
    }
  }, {
    key: 'renderBackButton',
    value: function renderBackButton() {
      var itemId = this.props.folder.parentId;
      if (itemId !== null) {
        var badge = this.props.badges.find(function (item) {
          return item.id === itemId;
        });
        return _react2.default.createElement(
          'div',
          { className: 'gallery__back-container' },
          _react2.default.createElement(_BackButton2.default, {
            item: { id: itemId },
            onClick: this.handleBackClick,
            onDropFiles: this.handleMoveFiles,
            badge: badge
          })
        );
      }
      return null;
    }
  }, {
    key: 'renderTransitionBulkActions',
    value: function renderTransitionBulkActions() {
      if (this.props.type === 'admin') {
        return _react2.default.createElement(
          _reactAddonsCssTransitionGroup2.default,
          {
            transitionName: 'bulk-actions',
            transitionEnterTimeout: _index2.default.CSS_TRANSITION_TIME,
            transitionLeaveTimeout: _index2.default.CSS_TRANSITION_TIME
          },
          this.renderBulkActions()
        );
      }

      return null;
    }
  }, {
    key: 'renderBulkActions',
    value: function renderBulkActions() {
      var _this6 = this;

      var actions = _index2.default.BULK_ACTIONS.map(function (action) {
        if (!action.callback) {
          switch (action.value) {
            case 'delete':
              {
                return Object.assign({}, action, { callback: _this6.handleBulkDelete });
              }
            case 'edit':
              {
                return Object.assign({}, action, { callback: _this6.handleBulkEdit });
              }
            default:
              {
                return action;
              }
          }
        }
        return action;
      });

      var allFiles = [].concat(_toConsumableArray(this.props.files), _toConsumableArray(this.props.queuedFiles.items));
      var selectedFileObjs = this.props.selectedFiles.map(function (id) {
        return allFiles.find(function (file) {
          return file && id === file.id;
        });
      });

      if (selectedFileObjs.length > 0 && this.props.type === 'admin') {
        return _react2.default.createElement(_BulkActions2.default, {
          actions: actions,
          items: selectedFileObjs,
          key: selectedFileObjs.length > 0
        });
      }

      return null;
    }
  }, {
    key: 'renderGalleryView',
    value: function renderGalleryView() {
      var _this7 = this;

      var GalleryView = this.props.view === 'table' ? _TableView2.default : _ThumbnailView2.default;

      var queuedFiles = this.props.queuedFiles.items.filter(function (file) {
        return !file.id || !_this7.props.files.find(function (next) {
          return next.id === file.id;
        });
      }).map(function (file) {
        return Object.assign({}, file, {
          uploading: !(file.id > 0)
        });
      });
      var files = [].concat(_toConsumableArray(queuedFiles), _toConsumableArray(this.props.files)).map(function (file) {
        return Object.assign({}, file || {}, {
          selected: _this7.itemIsSelected(file.id),
          highlighted: _this7.itemIsHighlighted(file.id)
        });
      });
      var _props = this.props,
          type = _props.type,
          loading = _props.loading,
          page = _props.page,
          totalCount = _props.totalCount,
          limit = _props.limit,
          sort = _props.sort,
          selectedFiles = _props.selectedFiles,
          badges = _props.badges;


      var props = {
        selectableItems: type === 'admin',
        files: files,
        loading: loading,
        page: page,
        totalCount: totalCount,
        limit: limit,
        sort: sort,
        selectedFiles: selectedFiles,
        badges: badges,
        onSort: this.handleSort,
        onSetPage: this.handleSetPage,
        onOpenFile: this.handleOpenFile,
        onOpenFolder: this.handleOpenFolder,
        onSelect: this.handleSelect,
        onCancelUpload: this.handleCancelUpload,
        onDropFiles: this.handleMoveFiles,
        onRemoveErroredUpload: this.handleRemoveErroredUpload,
        onEnableDropzone: this.handleEnableDropzone,
        sectionConfig: this.props.sectionConfig
      };

      return _react2.default.createElement(GalleryView, props);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.folder) {
        if (this.props.errorMessage) {
          return _react2.default.createElement(
            'div',
            { className: 'gallery__error flexbox-area-grow' },
            _react2.default.createElement(
              'div',
              { className: 'gallery__error-message' },
              _react2.default.createElement(
                'h3',
                null,
                _i18n2.default._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.')
              ),
              _react2.default.createElement(
                'p',
                null,
                this.props.errorMessage
              )
            )
          );
        }
        if (this.props.loading) {
          return _react2.default.createElement(
            'div',
            { className: 'flexbox-area-grow' },
            _react2.default.createElement('div', { key: 'overlay', className: 'cms-content-loading-overlay ui-widget-overlay-light' }),
            _react2.default.createElement('div', { key: 'spinner', className: 'cms-content-loading-spinner' })
          );
        }
        return _react2.default.createElement(
          'div',
          { className: 'flexbox-area-grow' },
          _react2.default.createElement(
            'div',
            { className: 'editor__file-preview-message--file-missing m-t-3' },
            _i18n2.default._t('AssetAdmin.FOLDER_MISSING', 'Folder cannot be found')
          )
        );
      }

      var messages = _react2.default.createElement(
        'div',
        { className: 'gallery_messages' },
        this.props.errorMessage && _react2.default.createElement(_FormAlert2.default, { value: this.props.errorMessage, type: 'danger' }),
        this.props.noticeMessage && _react2.default.createElement(_FormAlert2.default, { value: this.props.noticeMessage, type: 'success' }),
        this.renderSearchAlert()
      );

      var dimensions = {
        height: _index2.default.THUMBNAIL_HEIGHT,
        width: _index2.default.THUMBNAIL_WIDTH
      };
      var dropzoneOptions = _extends({
        url: this.props.createFileApiUrl,
        method: this.props.createFileApiMethod,
        paramName: 'Upload',
        clickable: '#upload-button'
      }, this.props.sectionConfig.dropzoneOptions);

      var securityID = this.props.securityId;
      var canEdit = this.props.folder.canEdit && this.props.enableDropzone;

      var galleryClasses = ['panel', 'panel--padded', 'panel--scrollable', 'gallery__main'];
      if (this.props.type === 'insert') {
        galleryClasses.push('insert-media-modal__main');
      }

      var cssClasses = galleryClasses;
      if (this.hasOpenedItem()) {
        cssClasses.push('gallery__main--has-opened-item');
      }

      return _react2.default.createElement(
        'div',
        { className: 'flexbox-area-grow gallery__outer' },
        this.renderTransitionBulkActions(),
        _react2.default.createElement(
          _AssetDropzone2.default,
          {
            name: 'gallery-container',
            canUpload: canEdit,
            handleAddedFile: this.handleAddedFile,
            handlePreviewLoaded: this.handlePreviewLoaded,
            handleError: this.handleFailedUpload,
            handleSuccess: this.handleSuccessfulUpload,
            handleSending: this.handleSending,
            handleUploadProgress: this.handleUploadProgress,
            preview: dimensions,
            folderId: this.props.folderId,
            options: dropzoneOptions,
            securityID: securityID,
            uploadButton: false
          },
          _react2.default.createElement(
            _GalleryDND2.default,
            { className: galleryClasses.join(' ') },
            this.renderToolbar(),
            messages,
            this.renderGalleryView()
          )
        ),
        this.props.loading && [_react2.default.createElement('div', { key: 'overlay', className: 'cms-content-loading-overlay ui-widget-overlay-light' }), _react2.default.createElement('div', { key: 'spinner', className: 'cms-content-loading-spinner' })]
      );
    }
  }]);

  return Gallery;
}(_react.Component);

var sharedDefaultProps = {
  page: 1,
  limit: 15,
  sort: sorters[0].field + ',' + sorters[0].direction
};

var sharedPropTypes = {
  sectionConfig: _configShape2.default,
  loading: _react.PropTypes.bool,
  sort: _react.PropTypes.string,
  files: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    id: _react.PropTypes.number,
    parent: _react.PropTypes.shape({
      id: _react.PropTypes.number
    })
  })).isRequired,
  selectedFiles: _react.PropTypes.arrayOf(_react.PropTypes.number),
  totalCount: _react.PropTypes.number,
  page: _react.PropTypes.number,
  limit: _react.PropTypes.number,
  badges: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    id: _react.PropTypes.number,
    message: _react.PropTypes.node,
    status: _react.PropTypes.string
  })),
  onOpenFile: _react.PropTypes.func.isRequired,
  onOpenFolder: _react.PropTypes.func.isRequired,
  onSort: _react.PropTypes.func.isRequired,
  onSetPage: _react.PropTypes.func.isRequired
};

var galleryViewDefaultProps = Object.assign({}, sharedDefaultProps, {
  selectableItems: false
});

var galleryViewPropTypes = Object.assign({}, sharedPropTypes, {
  selectableItems: _react.PropTypes.bool,
  onSelect: _react.PropTypes.func,
  onCancelUpload: _react.PropTypes.func,
  onDelete: _react2.default.PropTypes.func,
  onRemoveErroredUpload: _react.PropTypes.func,
  onEnableDropzone: _react.PropTypes.func
});

Gallery.defaultProps = Object.assign({}, sharedDefaultProps, {
  type: 'admin',
  view: 'tile',
  enableDropzone: true
});

Gallery.propTypes = Object.assign({}, sharedPropTypes, {
  onUploadSuccess: _react2.default.PropTypes.func,
  onCreateFolder: _react2.default.PropTypes.func,
  onMoveFilesSuccess: _react2.default.PropTypes.func,
  onDelete: _react2.default.PropTypes.func,
  type: _react.PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
  view: _react.PropTypes.oneOf(['tile', 'table']),
  dialog: _react.PropTypes.bool,
  fileId: _react.PropTypes.number,
  folderId: _react.PropTypes.number.isRequired,
  folder: _react.PropTypes.shape({
    id: _react.PropTypes.number,
    title: _react.PropTypes.string,
    parentId: _react.PropTypes.number,
    canView: _react.PropTypes.bool,
    canEdit: _react.PropTypes.bool
  }),
  queuedFiles: _react.PropTypes.shape({
    items: _react.PropTypes.array.isRequired
  }),
  errorMessage: _react.PropTypes.string,
  actions: _react.PropTypes.object,
  securityId: _react.PropTypes.string,
  onViewChange: _react.PropTypes.func.isRequired,
  createFileApiUrl: _react.PropTypes.string,
  createFileApiMethod: _react.PropTypes.string,
  search: _react.PropTypes.object,
  enableDropzone: _react.PropTypes.bool
});

function mapStateToProps(state) {
  var _state$assetAdmin$gal = state.assetAdmin.gallery,
      selectedFiles = _state$assetAdmin$gal.selectedFiles,
      errorMessage = _state$assetAdmin$gal.errorMessage,
      noticeMessage = _state$assetAdmin$gal.noticeMessage,
      enableDropzone = _state$assetAdmin$gal.enableDropzone,
      badges = _state$assetAdmin$gal.badges;


  return {
    selectedFiles: selectedFiles,
    errorMessage: errorMessage,
    noticeMessage: noticeMessage,
    enableDropzone: enableDropzone,
    badges: badges,
    queuedFiles: state.assetAdmin.queuedFiles,
    securityId: state.config.SecurityID
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: (0, _redux.bindActionCreators)(galleryActions, dispatch),
      queuedFiles: (0, _redux.bindActionCreators)(queuedFilesActions, dispatch)
    }
  };
}

exports.Gallery = Gallery;
exports.sorters = sorters;
exports.galleryViewPropTypes = galleryViewPropTypes;
exports.galleryViewDefaultProps = galleryViewDefaultProps;
exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), _moveFilesMutation2.default, _createFolderMutation2.default, function (component) {
  return (0, _reactApollo.withApollo)(component);
})(Gallery);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileShape = _react2.default.PropTypes.shape({
  canEdit: _react2.default.PropTypes.bool,
  canDelete: _react2.default.PropTypes.bool,
  canView: _react2.default.PropTypes.bool,
  exists: _react2.default.PropTypes.bool,
  type: _react2.default.PropTypes.string,
  smallThumbnail: _react2.default.PropTypes.string,
  thumbnail: _react2.default.PropTypes.string,
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  category: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
  id: _react2.default.PropTypes.number,
  url: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  progress: _react2.default.PropTypes.number
});

exports.default = fileShape;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(19),
    root = __webpack_require__(10);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(288),
    mapCacheDelete = __webpack_require__(289),
    mapCacheGet = __webpack_require__(290),
    mapCacheHas = __webpack_require__(291),
    mapCacheSet = __webpack_require__(292);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(60),
    setCacheAdd = __webpack_require__(299),
    setCacheHas = __webpack_require__(300);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(40),
    stackClear = __webpack_require__(303),
    stackDelete = __webpack_require__(304),
    stackGet = __webpack_require__(305),
    stackHas = __webpack_require__(306),
    stackSet = __webpack_require__(307);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(110),
    createBaseEach = __webpack_require__(260);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(63),
    isFlattenable = __webpack_require__(280);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(99);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(130);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(102),
    stubArray = __webpack_require__(143);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(2),
    isSymbol = __webpack_require__(25);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var createFind = __webpack_require__(262),
    findIndex = __webpack_require__(315);

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(11),
    isObjectLike = __webpack_require__(15);

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(230),
    baseUnary = __webpack_require__(43),
    nodeUtil = __webpack_require__(296);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(105),
    baseKeysIn = __webpack_require__(231),
    isArrayLike = __webpack_require__(11);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(243);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 78 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = FormBuilderLoader;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = exports.Folder = exports.GalleryItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _fileShape = __webpack_require__(58);

var _fileShape2 = _interopRequireDefault(_fileShape);

var _draggable = __webpack_require__(165);

var _draggable2 = _interopRequireDefault(_draggable);

var _droppable = __webpack_require__(81);

var _droppable2 = _interopRequireDefault(_droppable);

var _Badge = __webpack_require__(146);

var _Badge2 = _interopRequireDefault(_Badge);

var _configShape = __webpack_require__(38);

var _configShape2 = _interopRequireDefault(_configShape);

var _reactRedux = __webpack_require__(4);

var _redux = __webpack_require__(8);

var _ImageLoadActions = __webpack_require__(187);

var imageLoadActions = _interopRequireWildcard(_ImageLoadActions);

var _ImageLoadStatus = __webpack_require__(90);

var _ImageLoadStatus2 = _interopRequireDefault(_ImageLoadStatus);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function shouldLoadImage(props) {
  return props.item.thumbnail && props.item.category === 'image' && props.item.exists && !props.item.uploading && props.sectionConfig.imageRetry.minRetry && props.sectionConfig.imageRetry.maxRetry;
}

var preventFocus = function preventFocus(event) {
  event.preventDefault();
};

var GalleryItem = function (_SilverStripeComponen) {
  _inherits(GalleryItem, _SilverStripeComponen);

  function GalleryItem(props) {
    _classCallCheck(this, GalleryItem);

    var _this = _possibleConstructorReturn(this, (GalleryItem.__proto__ || Object.getPrototypeOf(GalleryItem)).call(this, props));

    _this.handleSelect = _this.handleSelect.bind(_this);
    _this.handleActivate = _this.handleActivate.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    _this.handleCancelUpload = _this.handleCancelUpload.bind(_this);
    return _this;
  }

  _createClass(GalleryItem, [{
    key: 'handleActivate',
    value: function handleActivate(event) {
      event.stopPropagation();
      if (typeof this.props.onActivate === 'function') {
        this.props.onActivate(event, this.props.item);
      }
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(event) {
      event.stopPropagation();
      event.preventDefault();
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(event, this.props.item);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (shouldLoadImage(nextProps)) {
        nextProps.actions.imageLoad.loadImage(nextProps.item.thumbnail, nextProps.sectionConfig.imageRetry);
      }
    }
  }, {
    key: 'getThumbnailStyles',
    value: function getThumbnailStyles() {
      var thumbnail = this.props.item.thumbnail;
      if (!this.isImage() || !thumbnail || !(this.exists() || this.uploading())) {
        return {};
      }

      switch (this.props.loadState) {
        case _ImageLoadStatus2.default.SUCCESS:
        case _ImageLoadStatus2.default.DISABLED:
          return {
            backgroundImage: 'url(' + thumbnail + ')'
          };
        default:
          return {};
      }
    }
  }, {
    key: 'hasError',
    value: function hasError() {
      var hasError = false;

      if (this.props.item.message) {
        hasError = this.props.item.message.type === 'error';
      }

      return hasError;
    }
  }, {
    key: 'getErrorMessage',
    value: function getErrorMessage() {
      var message = null;

      if (this.hasError()) {
        message = this.props.item.message.value;
      } else if (!this.exists() && !this.uploading()) {
        message = _i18n2.default._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
      } else if (this.props.loadState === _ImageLoadStatus2.default.FAILED) {
        message = _i18n2.default._t('AssetAdmin.FILE_LOAD_ERROR', 'Thumbnail not available');
      }

      if (message !== null) {
        return _react2.default.createElement(
          'span',
          { className: 'gallery-item__error-message' },
          message
        );
      }

      return null;
    }
  }, {
    key: 'getThumbnailClassNames',
    value: function getThumbnailClassNames() {
      var thumbnailClassNames = ['gallery-item__thumbnail'];

      if (this.isImageSmallerThanThumbnail()) {
        thumbnailClassNames.push('gallery-item__thumbnail--small');
      }

      switch (this.props.loadState) {
        case _ImageLoadStatus2.default.LOADING:
        case _ImageLoadStatus2.default.WAITING:
          thumbnailClassNames.push('gallery-item__thumbnail--loading');
          break;

        case _ImageLoadStatus2.default.FAILED:
          thumbnailClassNames.push('gallery-item__thumbnail--error');
          break;
        default:
          break;
      }

      return thumbnailClassNames.join(' ');
    }
  }, {
    key: 'canBatchSelect',
    value: function canBatchSelect() {
      return this.props.selectable && this.props.item.canEdit;
    }
  }, {
    key: 'getItemClassNames',
    value: function getItemClassNames() {
      var category = this.props.item.category || 'false';
      var itemClassNames = ['gallery-item gallery-item--' + category];

      if (!this.exists() && !this.uploading()) {
        itemClassNames.push('gallery-item--missing');
      }

      if (this.props.selectable) {
        itemClassNames.push('gallery-item--selectable');

        if (this.props.item.selected) {
          itemClassNames.push('gallery-item--selected');
        }
      }

      if (this.props.enlarged) {
        itemClassNames.push('gallery-item--enlarged');
      }

      if (this.props.item.highlighted) {
        itemClassNames.push('gallery-item--highlighted');
      }

      if (this.hasError()) {
        itemClassNames.push('gallery-item--error');
      }

      return itemClassNames.join(' ');
    }
  }, {
    key: 'getStatusFlags',
    value: function getStatusFlags() {
      var flags = [];
      if (this.props.item.type !== 'folder') {
        if (this.props.item.draft) {
          flags.push(_react2.default.createElement('span', {
            key: 'status-draft',
            title: _i18n2.default._t('File.DRAFT', 'Draft'),
            className: 'gallery-item--draft'
          }));
        } else if (this.props.item.modified) {
          flags.push(_react2.default.createElement('span', {
            key: 'status-modified',
            title: _i18n2.default._t('File.MODIFIED', 'Modified'),
            className: 'gallery-item--modified'
          }));
        }
      }
      return flags;
    }
  }, {
    key: 'isImage',
    value: function isImage() {
      return this.props.item.category === 'image';
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.props.item.exists;
    }
  }, {
    key: 'uploading',
    value: function uploading() {
      return this.props.item.uploading;
    }
  }, {
    key: 'complete',
    value: function complete() {
      return this.uploading() && this.props.item.id > 0;
    }
  }, {
    key: 'isImageSmallerThanThumbnail',
    value: function isImageSmallerThanThumbnail() {
      if (!this.isImage() || !this.exists() && !this.uploading()) {
        return false;
      }
      var width = this.props.item.width;
      var height = this.props.item.height;

      return height && width && height < _index2.default.THUMBNAIL_HEIGHT && width < _index2.default.THUMBNAIL_WIDTH;
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      event.stopPropagation();

      if (_index2.default.SPACE_KEY_CODE === event.keyCode) {
        event.preventDefault();
        if (this.canBatchSelect()) {
          this.handleSelect(event);
        }
      }

      if (_index2.default.RETURN_KEY_CODE === event.keyCode) {
        this.handleActivate(event);
      }
    }
  }, {
    key: 'handleCancelUpload',
    value: function handleCancelUpload(event) {
      event.stopPropagation();
      event.preventDefault();
      if (this.hasError()) {
        this.props.onRemoveErroredUpload(this.props.item);
      } else if (this.props.onCancelUpload) {
        this.props.onCancelUpload(this.props.item);
      }
    }
  }, {
    key: 'getProgressBar',
    value: function getProgressBar() {
      var progressBar = null;

      var progressBarProps = {
        className: 'gallery-item__progress-bar',
        style: {
          width: this.props.item.progress + '%'
        }
      };

      if (!this.hasError() && this.uploading() && !this.complete()) {
        progressBar = _react2.default.createElement(
          'div',
          { className: 'gallery-item__upload-progress' },
          _react2.default.createElement('div', progressBarProps)
        );
      }

      return progressBar;
    }
  }, {
    key: 'render',
    value: function render() {
      var action = null;
      var actionIcon = null;
      var overlay = null;
      var _props$item = this.props.item,
          id = _props$item.id,
          queuedId = _props$item.queuedId;

      var htmlID = id ? 'item-' + id : 'queued-' + queuedId;
      if (this.props.selectable) {
        if (this.canBatchSelect()) {
          action = this.handleSelect;
        }
        actionIcon = 'font-icon-tick';
      }

      if (this.uploading()) {
        action = this.handleCancelUpload;
        actionIcon = 'font-icon-cancel';
      } else if (this.exists()) {
        var label = _i18n2.default._t('AssetAdmin.DETAILS', 'Details');
        overlay = _react2.default.createElement(
          'div',
          { className: 'gallery-item--overlay font-icon-edit' },
          label
        );
      }

      var badge = this.props.badge;

      var inputProps = {
        className: 'gallery-item__checkbox',
        type: 'checkbox',
        title: _i18n2.default._t('AssetAdmin.SELECT', 'Select'),
        tabIndex: -1,
        onMouseDown: preventFocus,
        id: htmlID
      };
      var inputLabelClasses = ['gallery-item__checkbox-label', actionIcon];
      if (!this.canBatchSelect()) {
        inputProps.disabled = true;
        inputLabelClasses.push('gallery-item__checkbox-label--disabled');
      }
      var inputLabelProps = {
        className: inputLabelClasses.join(' '),
        htmlFor: htmlID,
        onClick: action
      };

      return _react2.default.createElement(
        'div',
        {
          className: this.getItemClassNames(),
          'data-id': this.props.item.id,
          tabIndex: '0',
          onKeyDown: this.handleKeyDown,
          onClick: this.handleActivate
        },
        !!badge && _react2.default.createElement(_Badge2.default, {
          className: 'gallery-item__badge',
          status: badge.status,
          message: badge.message
        }),
        _react2.default.createElement(
          'div',
          {
            ref: 'thumbnail',
            className: this.getThumbnailClassNames(),
            style: this.getThumbnailStyles()
          },
          overlay,
          this.getStatusFlags()
        ),
        this.getProgressBar(),
        this.getErrorMessage(),
        _react2.default.createElement(
          'div',
          { className: 'gallery-item__title', ref: 'title' },
          _react2.default.createElement(
            'label',
            inputLabelProps,
            _react2.default.createElement('input', inputProps)
          ),
          this.props.item.title
        )
      );
    }
  }]);

  return GalleryItem;
}(_SilverStripeComponent2.default);

GalleryItem.propTypes = {
  sectionConfig: _configShape2.default,
  item: _fileShape2.default,
  loadState: _react.PropTypes.oneOf(Object.values(_ImageLoadStatus2.default)),

  highlighted: _react.PropTypes.bool,

  selected: _react.PropTypes.bool,

  enlarged: _react.PropTypes.bool,
  message: _react.PropTypes.shape({
    value: _react.PropTypes.string,
    type: _react.PropTypes.string
  }),
  selectable: _react.PropTypes.bool,
  onActivate: _react.PropTypes.func,
  onSelect: _react.PropTypes.func,
  onCancelUpload: _react.PropTypes.func,
  onRemoveErroredUpload: _react.PropTypes.func
};

GalleryItem.defaultProps = {
  item: {},
  sectionConfig: {
    imageRetry: {}
  }
};
function mapStateToProps(state, ownprops) {
  if (shouldLoadImage(ownprops)) {
    var imageLoad = state.assetAdmin.imageLoad;
    var file = imageLoad.files.find(function (next) {
      return ownprops.item.thumbnail === next.url;
    });

    var loadState = file && file.status || _ImageLoadStatus2.default.NONE;
    return { loadState: loadState };
  }

  return { loadState: _ImageLoadStatus2.default.DISABLED };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      imageLoad: (0, _redux.bindActionCreators)(imageLoadActions, dispatch)
    }
  };
}

var ConnectedGalleryItem = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GalleryItem);
var type = 'GalleryItem';

var File = (0, _draggable2.default)(type)(ConnectedGalleryItem);
var Folder = (0, _droppable2.default)(type)(File);
exports.GalleryItem = GalleryItem;
exports.Folder = Folder;
exports.File = File;
exports.default = ConnectedGalleryItem;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = droppable;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDnd = __webpack_require__(54);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function droppable(types) {
  var spec = {
    drop: function drop(props, monitor) {
      if (monitor.canDrop()) {
        var item = monitor.getItem();
        props.onDropFiles(props.item.id, item.selected);
      }
    },
    canDrop: function canDrop(props, monitor) {
      var item = monitor.getItem();

      return item.selected.length !== 1 || item.selected[0] !== props.item.id;
    }
  };

  var collect = function collect(connect, monitor) {
    var over = monitor.isOver();
    return {
      enlarged: over && monitor.canDrop(),
      connectDropTarget: connect.dropTarget(),
      isOver: over
    };
  };

  var dropItem = (0, _reactDnd.DropTarget)(types, spec, collect);

  return function (Item) {
    var DroppableItem = function (_Component) {
      _inherits(DroppableItem, _Component);

      function DroppableItem() {
        _classCallCheck(this, DroppableItem);

        return _possibleConstructorReturn(this, (DroppableItem.__proto__ || Object.getPrototypeOf(DroppableItem)).apply(this, arguments));
      }

      _createClass(DroppableItem, [{
        key: 'render',
        value: function render() {
          var connectDropTarget = this.props.connectDropTarget;

          var item = _react2.default.createElement(Item, this.props);

          if (typeof item.type === 'string') {
            return connectDropTarget(item);
          }
          return connectDropTarget(_react2.default.createElement(
            'div',
            { className: 'gallery-item__droppable' },
            item
          ));
        }
      }]);

      return DroppableItem;
    }(_react.Component);

    DroppableItem.propTypes = {
      connectDropTarget: _react.PropTypes.func.isRequired,
      item: _react.PropTypes.shape({
        id: _react.PropTypes.number.isRequired
      }).isRequired
    };

    return dropItem(DroppableItem);
  };
}

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasFilters = exports.Search = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = __webpack_require__(8);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _FormBuilderLoader = __webpack_require__(79);

var _FormBuilderLoader2 = _interopRequireDefault(_FormBuilderLoader);

var _reactBootstrapSs = __webpack_require__(347);

var _SchemaActions = __webpack_require__(55);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _reduxForm = __webpack_require__(150);

var _getIn = __webpack_require__(340);

var _getIn2 = _interopRequireDefault(_getIn);

var _ClickOutComponent = __webpack_require__(168);

var _ClickOutComponent2 = _interopRequireDefault(_ClickOutComponent);

var _getFormState = __webpack_require__(151);

var _getFormState2 = _interopRequireDefault(_getFormState);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var identifier = 'AssetAdmin.SearchForm';
var view = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED'
};

function hasFilters(filters) {
  return filters && Object.keys(filters).length > 0;
}

var Search = function (_SilverStripeComponen) {
  _inherits(Search, _SilverStripeComponen);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

    _this.expand = _this.expand.bind(_this);
    _this.handleKeyUp = _this.handleKeyUp.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.doSearch = _this.doSearch.bind(_this);
    _this.focusInput = _this.focusInput.bind(_this);
    _this.focusFirstFormField = _this.focusFirstFormField.bind(_this);
    _this.hide = _this.hide.bind(_this);
    _this.show = _this.show.bind(_this);
    _this.toggle = _this.toggle.bind(_this);
    _this.open = _this.open.bind(_this);
    _this.state = {
      view: view.NONE,
      searchText: _this.props.filters && _this.props.filters.name || ''
    };
    return _this;
  }

  _createClass(Search, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setOverrides(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.setOverrides();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props && !hasFilters(props.filters) && hasFilters(this.props.filters)) {
        this.clearFormData(props);
      } else if (JSON.stringify(props.filters) !== JSON.stringify(this.props.filters)) {
        this.setOverrides(props);
      }
    }
  }, {
    key: 'focusInput',
    value: function focusInput() {
      if (this.state.view === view.NONE) {
        return;
      }

      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }

      var input = node.querySelector('.search__content-field');

      if (input !== document.activeElement) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, {
    key: 'focusFirstFormField',
    value: function focusFirstFormField() {
      if (this.state.view !== view.EXPANDED) {
        return;
      }

      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }

      var form = node.querySelector('.search__filter-panel form');
      if (!form) {
        return;
      }

      var input = form.querySelector('input, textarea, select');
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, {
    key: 'clearFormData',
    value: function clearFormData(props) {
      this.setState({ searchText: '' });

      var schemaUrl = props && props.searchFormSchemaUrl || this.props.searchFormSchemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
        this.props.actions.reduxForm.initialize(identifier, {}, Object.keys(this.props.formData));
        this.props.actions.reduxForm.reset(identifier);
      }
    }
  }, {
    key: 'setOverrides',
    value: function setOverrides(props) {
      if (props && (!hasFilters(props.filters) || this.props.searchFormSchemaUrl !== props.searchFormSchemaUrl)) {
        var schemaUrl = props && props.searchFormSchemaUrl || this.props.searchFormSchemaUrl;
        if (schemaUrl) {
          this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
        }
      }

      if (props && hasFilters(props.filters) && props.searchFormSchemaUrl) {
        var filters = props.filters || {};
        var overrides = {
          fields: Object.keys(filters).map(function (name) {
            var value = filters[name];
            return { name: name, value: value };
          })
        };

        this.props.actions.schema.setSchemaStateOverrides(props.searchFormSchemaUrl, overrides);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ searchText: event.target.value });
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(event) {
      if (event.keyCode === 13) {
        this.doSearch();
      }
    }
  }, {
    key: 'open',
    value: function open() {
      this.show();
      setTimeout(this.focusInput, 50);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.setState({ view: view.NONE });
    }
  }, {
    key: 'show',
    value: function show() {
      this.setState({ view: view.VISIBLE });
    }
  }, {
    key: 'expand',
    value: function expand() {
      this.setState({ view: view.EXPANDED });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      switch (this.state.view) {
        case view.VISIBLE:
          this.expand();
          setTimeout(this.focusFirstFormField, 50);
          break;
        case view.EXPANDED:
          this.show();
          break;
        default:
      }
    }
  }, {
    key: 'doSearch',
    value: function doSearch() {
      var _this2 = this;

      var data = {};

      if (this.state.searchText) {
        data.name = this.state.searchText;
      }

      Object.keys(this.props.formData).forEach(function (key) {
        var value = _this2.props.formData[key];
        if (value) {
          data[key] = value;
        }
      });

      this.show();
      this.props.onSearch(data);
    }
  }, {
    key: 'render',
    value: function render() {
      var formId = this.props.id + '_ExtraFields';
      var triggerId = this.props.id + '_Trigger';
      var searchText = this.state.searchText;

      var searchClasses = ['search'];
      var advancedButtonClasses = ['btn', 'btn-secondary', 'btn--icon-md', 'btn--no-text', 'font-icon-down-open', 'search__filter-trigger'];
      var expanded = false;
      switch (this.state.view) {
        case view.EXPANDED:
          expanded = true;
          searchClasses.push('search--active');
          break;
        case view.VISIBLE:
          advancedButtonClasses.push('collapsed');
          searchClasses.push('search--active');
          break;
        case view.NONE:
          advancedButtonClasses.push('collapsed');
          break;
        default:
      }

      return _react2.default.createElement(
        _ClickOutComponent2.default,
        { onClickOut: this.hide, callerComponent: this },
        _react2.default.createElement(
          'div',
          { className: searchClasses.join(' ') },
          _react2.default.createElement(
            'button',
            {
              className: 'btn btn--no-text btn-secondary search__trigger',
              type: 'button',
              title: _i18n2.default._t('AssetAdmin.SEARCH', 'Search'),
              'aria-owns': this.props.id,
              'aria-controls': this.props.id,
              'aria-expanded': 'false',
              onClick: this.open,
              id: triggerId
            },
            _react2.default.createElement('span', { className: 'font-icon-search btn--icon-large' })
          ),
          _react2.default.createElement(
            'div',
            { id: this.props.id, className: 'search__group' },
            _react2.default.createElement('input', {
              'aria-labelledby': triggerId,
              type: 'text',
              name: 'name',
              placeholder: _i18n2.default._t('AssetAdmin.SEARCH', 'Search'),
              className: 'form-control search__content-field',
              onKeyUp: this.handleKeyUp,
              onChange: this.handleChange,
              value: searchText,
              autoFocus: true
            }),
            _react2.default.createElement(
              'button',
              {
                'aria-expanded': expanded,
                'aria-controls': formId,
                onClick: this.toggle,
                className: advancedButtonClasses.join(' '),
                title: _i18n2.default._t('AssetAdmin.ADVANCED', 'Advanced')
              },
              _react2.default.createElement(
                'span',
                { className: 'search__filter-trigger-text' },
                _i18n2.default._t('AssetAdmin.ADVANCED', 'Advanced')
              )
            ),
            _react2.default.createElement('button', {
              className: 'btn btn-primary search__submit font-icon-search btn--icon-large btn--no-text',
              title: _i18n2.default._t('AssetAdmin.SEARCH', 'Search'),
              onClick: this.doSearch
            }),
            _react2.default.createElement('button', {
              onClick: this.hide,
              title: _i18n2.default._t('AssetAdmin.CLOSE', 'Close'),
              className: 'btn font-icon-cancel btn--no-text btn--icon-md search__cancel',
              'aria-controls': this.props.id,
              'aria-expanded': 'true'
            }),
            _react2.default.createElement(
              _reactBootstrapSs.Collapse,
              { 'in': expanded },
              _react2.default.createElement(
                'div',
                { id: formId, className: 'search__filter-panel' },
                _react2.default.createElement(_FormBuilderLoader2.default, {
                  identifier: identifier,
                  schemaUrl: this.props.searchFormSchemaUrl
                })
              )
            )
          )
        )
      );
    }
  }]);

  return Search;
}(_SilverStripeComponent2.default);

Search.propTypes = {
  searchFormSchemaUrl: _react.PropTypes.string.isRequired,
  id: _react.PropTypes.string.isRequired,
  data: _react.PropTypes.object,
  folderId: _react.PropTypes.number,
  onSearch: _react.PropTypes.func.isRequired,
  filters: _react.PropTypes.object,
  formData: _react.PropTypes.object
};

function mapStateToProps(state) {
  var formState = (0, _getFormState2.default)(state);
  var form = (0, _getIn2.default)(formState, identifier);

  var formData = form && form.values || {};

  return { formData: formData };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch),
      reduxForm: (0, _redux.bindActionCreators)({ reset: _reduxForm.reset, initialize: _reduxForm.initialize }, dispatch)
    }
  };
}

exports.Search = Search;
exports.hasFilters = hasFilters;
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Search);

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedUploadField = exports.UploadField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4);

var _redux = __webpack_require__(8);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _FieldHolder = __webpack_require__(343);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _UploadFieldItem = __webpack_require__(169);

var _UploadFieldItem2 = _interopRequireDefault(_UploadFieldItem);

var _AssetDropzone = __webpack_require__(56);

var _AssetDropzone2 = _interopRequireDefault(_AssetDropzone);

var _InsertMediaModal = __webpack_require__(21);

var _InsertMediaModal2 = _interopRequireDefault(_InsertMediaModal);

var _fileShape = __webpack_require__(58);

var _fileShape2 = _interopRequireDefault(_fileShape);

var _UploadFieldActions = __webpack_require__(193);

var uploadFieldActions = _interopRequireWildcard(_UploadFieldActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UploadField = function (_SilverStripeComponen) {
  _inherits(UploadField, _SilverStripeComponen);

  function UploadField(props) {
    _classCallCheck(this, UploadField);

    var _this = _possibleConstructorReturn(this, (UploadField.__proto__ || Object.getPrototypeOf(UploadField)).call(this, props));

    _this.renderChild = _this.renderChild.bind(_this);
    _this.handleAddShow = _this.handleAddShow.bind(_this);
    _this.handleAddHide = _this.handleAddHide.bind(_this);
    _this.handleAddInsert = _this.handleAddInsert.bind(_this);
    _this.handleAddedFile = _this.handleAddedFile.bind(_this);
    _this.handleSending = _this.handleSending.bind(_this);
    _this.handleUploadProgress = _this.handleUploadProgress.bind(_this);
    _this.handleFailedUpload = _this.handleFailedUpload.bind(_this);
    _this.handleSuccessfulUpload = _this.handleSuccessfulUpload.bind(_this);
    _this.handleItemRemove = _this.handleItemRemove.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);

    _this.state = { selecting: false };
    return _this;
  }

  _createClass(UploadField, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.actions.uploadField.setFiles(this.props.id, this.props.data.files);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var existingFiles = this.props.files || [];
      var newFiles = nextProps.files || [];
      var filesChanged = this.compareValues(existingFiles, newFiles);

      if (filesChanged) {
        this.handleChange(nextProps);
      }
    }
  }, {
    key: 'compareValues',
    value: function compareValues(left, right) {
      if (left.length !== right.length) {
        return true;
      }

      for (var i = 0; i < left.length; i++) {
        if (left[i].id !== right[i].id) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'handleAddedFile',
    value: function handleAddedFile(data) {
      var file = Object.assign({}, data, { uploaded: true });
      this.props.actions.uploadField.addFile(this.props.id, file);
    }
  }, {
    key: 'handleSending',
    value: function handleSending(file, xhr) {
      this.props.actions.uploadField.updateQueuedFile(this.props.id, file._queuedId, { xhr: xhr });
    }
  }, {
    key: 'handleUploadProgress',
    value: function handleUploadProgress(file, progress) {
      this.props.actions.uploadField.updateQueuedFile(this.props.id, file._queuedId, { progress: progress });
    }
  }, {
    key: 'handleSuccessfulUpload',
    value: function handleSuccessfulUpload(file) {
      var json = JSON.parse(file.xhr.response);

      if (typeof json[0].error !== 'undefined') {
        this.handleFailedUpload(file);
        return;
      }

      this.props.actions.uploadField.succeedUpload(this.props.id, file._queuedId, json[0]);
    }
  }, {
    key: 'handleFailedUpload',
    value: function handleFailedUpload(file, response) {
      this.props.actions.uploadField.failUpload(this.props.id, file._queuedId, response);
    }
  }, {
    key: 'handleItemRemove',
    value: function handleItemRemove(event, item) {
      this.props.actions.uploadField.removeFile(this.props.id, item);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(props) {
      if (typeof props.onChange === 'function') {
        var fileIds = props.files.filter(function (file) {
          return file.id;
        }).map(function (file) {
          return file.id;
        });
        var newValue = { Files: fileIds };
        props.onChange(newValue);
      }
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(event) {
      event.preventDefault();
    }
  }, {
    key: 'handleAddShow',
    value: function handleAddShow(event) {
      event.preventDefault();
      this.setState({ selecting: true });
    }
  }, {
    key: 'handleAddHide',
    value: function handleAddHide() {
      this.setState({ selecting: false });
    }
  }, {
    key: 'handleAddInsert',
    value: function handleAddInsert(data, file) {
      this.props.actions.uploadField.addFile(this.props.id, file);
      this.handleAddHide();

      return Promise.resolve({});
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'uploadfield' },
        this.renderDropzone(),
        this.props.files.map(this.renderChild),
        this.renderDialog()
      );
    }
  }, {
    key: 'canEdit',
    value: function canEdit() {
      return !this.props.disabled && !this.props.readOnly;
    }
  }, {
    key: 'renderDropzone',
    value: function renderDropzone() {
      if (!this.props.data.createFileEndpoint) {
        return null;
      }
      var dimensions = {
        height: _index2.default.SMALL_THUMBNAIL_HEIGHT,
        width: _index2.default.SMALL_THUMBNAIL_WIDTH
      };
      var name = this.props.name;
      var dropzoneOptions = {
        url: this.props.data.createFileEndpoint.url,
        method: this.props.data.createFileEndpoint.method,
        paramName: 'Upload',
        thumbnailWidth: _index2.default.SMALL_THUMBNAIL_WIDTH,
        thumbnailHeight: _index2.default.SMALL_THUMBNAIL_HEIGHT
      };
      if (!this.props.data.multi) {
        dropzoneOptions.maxFiles = 1;
      }

      if (!this.canEdit()) {
        if (this.props.files.length) {
          return null;
        }
        return _react2.default.createElement(
          'p',
          null,
          _i18n2.default._t('AssetAdmin.EMPTY', 'No files')
        );
      }

      var classNames = ['uploadfield__dropzone'];
      if (this.props.files.length && !this.props.data.multi) {
        classNames.push('uploadfield__dropzone--hidden');
      }

      var securityID = this.props.securityId;

      return _react2.default.createElement(
        _AssetDropzone2.default,
        {
          name: name,
          canUpload: true,
          uploadButton: false,
          uploadSelector: '.uploadfield__upload-button, .uploadfield__backdrop',
          folderId: this.props.data.parentid,
          handleAddedFile: this.handleAddedFile,
          handleError: this.handleFailedUpload,
          handleSuccess: this.handleSuccessfulUpload,
          handleSending: this.handleSending,
          handleUploadProgress: this.handleUploadProgress,
          preview: dimensions,
          options: dropzoneOptions,
          securityID: securityID,
          className: classNames.join(' ')
        },
        _react2.default.createElement('div', { className: 'uploadfield__backdrop' }),
        _react2.default.createElement(
          'span',
          { className: 'uploadfield__droptext' },
          _react2.default.createElement(
            'button',
            { onClick: this.handleSelect, className: 'uploadfield__upload-button' },
            _i18n2.default._t('AssetAdmin.BROWSE', 'Browse')
          ),
          ' ',
          _i18n2.default._t('AssetAdmin.OR', 'or'),
          ' ',
          _react2.default.createElement(
            'button',
            { onClick: this.handleAddShow, className: 'uploadfield__add-button' },
            _i18n2.default._t('AssetAdmin.ADD_FILES', 'Add from files')
          )
        )
      );
    }
  }, {
    key: 'renderDialog',
    value: function renderDialog() {
      return _react2.default.createElement(_InsertMediaModal2.default, {
        title: false,
        show: this.state.selecting,
        onInsert: this.handleAddInsert,
        onHide: this.handleAddHide,
        bodyClassName: 'modal__dialog',
        className: 'insert-media-react__dialog-wrapper',
        type: 'select'
      });
    }
  }, {
    key: 'renderChild',
    value: function renderChild(item, index) {
      var itemProps = {
        key: index,
        item: item,
        name: this.props.name,
        handleRemove: this.handleItemRemove,
        canEdit: this.canEdit()
      };
      return _react2.default.createElement(_UploadFieldItem2.default, itemProps);
    }
  }]);

  return UploadField;
}(_SilverStripeComponent2.default);

UploadField.propTypes = {
  extraClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string.isRequired,
  name: _react2.default.PropTypes.string.isRequired,
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.shape({
    Files: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number)
  }),
  files: _react2.default.PropTypes.arrayOf(_fileShape2.default),
  readOnly: _react2.default.PropTypes.bool,
  disabled: _react2.default.PropTypes.bool,
  data: _react2.default.PropTypes.shape({
    createFileEndpoint: _react2.default.PropTypes.shape({
      url: _react2.default.PropTypes.string.isRequired,
      method: _react2.default.PropTypes.string.isRequired,
      payloadFormat: _react2.default.PropTypes.string.isRequired
    }),
    multi: _react2.default.PropTypes.bool,
    parentid: _react2.default.PropTypes.number
  })
};

UploadField.defaultProps = {
  value: { Files: [] },
  extraClass: '',
  className: ''
};

function mapStateToProps(state, ownprops) {
  var id = ownprops.id;
  var files = [];
  if (state.assetAdmin && state.assetAdmin.uploadField && state.assetAdmin.uploadField.fields && state.assetAdmin.uploadField.fields[id]) {
    files = state.assetAdmin.uploadField.fields[id].files || [];
  }
  var securityId = state.config.SecurityID;
  return { files: files, securityId: securityId };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      uploadField: (0, _redux.bindActionCreators)(uploadFieldActions, dispatch)
    }
  };
}

var ConnectedUploadField = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(UploadField);

exports.UploadField = UploadField;
exports.ConnectedUploadField = ConnectedUploadField;
exports.default = (0, _FieldHolder2.default)(ConnectedUploadField);

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormSchema = exports.AssetAdmin = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4);

var _redux = __webpack_require__(8);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _Backend = __webpack_require__(145);

var _Backend2 = _interopRequireDefault(_Backend);

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _GalleryActions = __webpack_require__(88);

var galleryActions = _interopRequireWildcard(_GalleryActions);

var _BreadcrumbsActions = __webpack_require__(342);

var breadcrumbsActions = _interopRequireWildcard(_BreadcrumbsActions);

var _QueuedFilesActions = __webpack_require__(93);

var queuedFilesActions = _interopRequireWildcard(_QueuedFilesActions);

var _Editor = __webpack_require__(171);

var _Editor2 = _interopRequireDefault(_Editor);

var _Gallery = __webpack_require__(57);

var _Gallery2 = _interopRequireDefault(_Gallery);

var _Breadcrumb = __webpack_require__(341);

var _Breadcrumb2 = _interopRequireDefault(_Breadcrumb);

var _Toolbar = __webpack_require__(350);

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _reactApollo = __webpack_require__(3);

var _Search = __webpack_require__(82);

var _Search2 = _interopRequireDefault(_Search);

var _readFilesQuery = __webpack_require__(183);

var _readFilesQuery2 = _interopRequireDefault(_readFilesQuery);

var _deleteFileMutation = __webpack_require__(181);

var _deleteFileMutation2 = _interopRequireDefault(_deleteFileMutation);

var _unpublishFileMutation = __webpack_require__(184);

var _unpublishFileMutation2 = _interopRequireDefault(_unpublishFileMutation);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _configShape = __webpack_require__(38);

var _configShape2 = _interopRequireDefault(_configShape);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getFormSchema(_ref) {
  var config = _ref.config,
      viewAction = _ref.viewAction,
      folderId = _ref.folderId,
      fileId = _ref.fileId,
      type = _ref.type;

  var schemaUrl = null;
  var targetId = null;

  if (viewAction === _index2.default.ACTIONS.CREATE_FOLDER) {
    schemaUrl = config.form.folderCreateForm.schemaUrl;
    targetId = folderId;
  } else if (viewAction === _index2.default.ACTIONS.EDIT_FILE) {
    switch (type) {
      case 'insert-media':
        schemaUrl = config.form.fileInsertForm.schemaUrl;
        break;
      case 'insert-link':
        schemaUrl = config.form.fileEditorLinkForm.schemaUrl;
        break;
      case 'select':
        schemaUrl = config.form.fileSelectForm.schemaUrl;
        break;
      case 'admin':
      default:
        schemaUrl = config.form.fileEditForm.schemaUrl;
        break;
    }

    if (!fileId) {
      return {};
    }
    targetId = fileId;
  } else {
    return {};
  }
  return { schemaUrl: schemaUrl, targetId: targetId };
}

var AssetAdmin = function (_SilverStripeComponen) {
  _inherits(AssetAdmin, _SilverStripeComponen);

  function AssetAdmin(props) {
    _classCallCheck(this, AssetAdmin);

    var _this = _possibleConstructorReturn(this, (AssetAdmin.__proto__ || Object.getPrototypeOf(AssetAdmin)).call(this, props));

    _this.handleOpenFile = _this.handleOpenFile.bind(_this);
    _this.handleCloseFile = _this.handleCloseFile.bind(_this);
    _this.handleDelete = _this.handleDelete.bind(_this);
    _this.handleUnpublish = _this.handleUnpublish.bind(_this);
    _this.handleDoSearch = _this.handleDoSearch.bind(_this);
    _this.handleSubmitEditor = _this.handleSubmitEditor.bind(_this);
    _this.handleOpenFolder = _this.handleOpenFolder.bind(_this);
    _this.handleSort = _this.handleSort.bind(_this);
    _this.handleSetPage = _this.handleSetPage.bind(_this);
    _this.createEndpoint = _this.createEndpoint.bind(_this);
    _this.handleBackButtonClick = _this.handleBackButtonClick.bind(_this);
    _this.handleFolderIcon = _this.handleFolderIcon.bind(_this);
    _this.handleBrowse = _this.handleBrowse.bind(_this);
    _this.handleViewChange = _this.handleViewChange.bind(_this);
    _this.handleUpload = _this.handleUpload.bind(_this);
    _this.handleCreateFolder = _this.handleCreateFolder.bind(_this);
    _this.handleMoveFilesSuccess = _this.handleMoveFilesSuccess.bind(_this);
    _this.compare = _this.compare.bind(_this);
    _this.setBreadcrumbs = _this.setBreadcrumbs.bind(_this);
    return _this;
  }

  _createClass(AssetAdmin, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var config = this.props.sectionConfig;

      this.endpoints = {
        historyApi: this.createEndpoint(config.historyEndpoint)
      };
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var viewChanged = this.compare(this.props.folder, props.folder);
      if (viewChanged || (0, _Search.hasFilters)(props.query.filter) !== (0, _Search.hasFilters)(this.props.query.filter)) {
        this.setBreadcrumbs(props);
      }

      if (!props.loading && props.folder && props.folderId !== props.folder.id) {
        props.onReplaceUrl(props.folder.id, props.fileId, props.query, props.viewAction);
      }
    }
  }, {
    key: 'getFolderId',
    value: function getFolderId() {
      if (this.props.folderId !== null) {
        return this.props.folderId;
      }
      if (this.props.folder) {
        return this.props.folder.id;
      }
      return 0;
    }
  }, {
    key: 'handleBrowse',
    value: function handleBrowse(folderId, fileId, query) {
      if (typeof this.props.onBrowse === 'function') {
        this.props.onBrowse(folderId, fileId, query);
      }
      if (folderId !== this.getFolderId()) {
        this.props.actions.gallery.deselectFiles();
      }
    }
  }, {
    key: 'handleSetPage',
    value: function handleSetPage(page) {
      this.handleBrowse(this.getFolderId(), this.props.fileId, Object.assign({}, this.props.query, { page: page }));
    }
  }, {
    key: 'handleDoSearch',
    value: function handleDoSearch(data) {
      this.handleBrowse(data.currentFolderOnly ? this.getFolderId() : 0, null, { filter: data, view: this.props.query.view });
    }
  }, {
    key: 'handleSort',
    value: function handleSort(sort) {
      this.handleBrowse(this.getFolderId(), this.props.fileId, _extends({}, this.props.query, {
        sort: sort,

        limit: undefined,
        page: undefined
      }));
    }
  }, {
    key: 'handleViewChange',
    value: function handleViewChange(view) {
      this.handleBrowse(this.getFolderId(), this.props.fileId, Object.assign({}, this.props.query, { view: view }));
    }
  }, {
    key: 'createEndpoint',
    value: function createEndpoint(endpointConfig) {
      var includeToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return _Backend2.default.createEndpointFetcher(Object.assign({}, endpointConfig, includeToken ? { defaultData: { SecurityID: this.props.securityId } } : {}));
    }
  }, {
    key: 'handleBackButtonClick',
    value: function handleBackButtonClick(event) {
      event.preventDefault();
      if (this.props.folder) {
        this.handleOpenFolder(this.props.folder.parentId || 0);
      } else {
        this.handleOpenFolder(0);
      }
    }
  }, {
    key: 'setBreadcrumbs',
    value: function setBreadcrumbs(props) {
      var _this2 = this;

      var folder = props.folder;
      var query = props.query;

      var breadcrumbs = [{
        text: _i18n2.default._t('AssetAdmin.FILES', 'Files'),
        href: this.props.getUrl && this.props.getUrl(),
        onClick: function onClick(event) {
          event.preventDefault();
          _this2.handleBrowse();
        }
      }];

      if (folder && folder.id) {
        if (folder.parents) {
          folder.parents.forEach(function (parent) {
            breadcrumbs.push({
              text: parent.title,
              href: _this2.props.getUrl && _this2.props.getUrl(parent.id),
              onClick: function onClick(event) {
                event.preventDefault();
                _this2.handleBrowse(parent.id);
              }
            });
          });
        }

        breadcrumbs.push({
          text: folder.title,
          href: this.props.getUrl && this.props.getUrl(folder.id),
          onClick: function onClick(event) {
            event.preventDefault();
            _this2.handleBrowse(folder.id);
          },
          icon: {
            className: 'icon font-icon-edit-list',
            action: this.handleFolderIcon
          }
        });
      }

      if ((0, _Search.hasFilters)(query.filter)) {
        breadcrumbs.push({
          text: _i18n2.default._t('LeftAndMain.SEARCHRESULTS', 'Search results')
        });
      }

      this.props.actions.breadcrumbsActions.setBreadcrumbs(breadcrumbs);
    }
  }, {
    key: 'compare',
    value: function compare(left, right) {
      if (left && !right || right && !left) {
        return true;
      }

      return left && right && (left.id !== right.id || left.name !== right.name);
    }
  }, {
    key: 'handleFolderIcon',
    value: function handleFolderIcon(event) {
      event.preventDefault();
      this.handleOpenFile(this.getFolderId());
    }
  }, {
    key: 'handleOpenFile',
    value: function handleOpenFile(fileId) {
      this.handleBrowse(this.getFolderId(), fileId, this.props.query);
    }
  }, {
    key: 'handleSubmitEditor',
    value: function handleSubmitEditor(data, action, submitFn) {
      var _this3 = this;

      var promise = null;

      if (typeof this.props.onSubmitEditor === 'function') {
        var file = this.findFile(this.props.fileId);
        promise = this.props.onSubmitEditor(data, action, submitFn, file);
      } else {
        promise = submitFn();
      }

      if (!promise) {
        throw new Error('Promise was not returned for submitting');
      }
      return promise.then(function (response) {
        if (action === 'action_createfolder' && _this3.props.type === 'admin') {
          _this3.handleOpenFile(response.record.id);
        }

        return _this3.props.actions.files.readFiles().then(function () {
          if (action === 'action_createfolder' && _this3.props.type !== 'admin') {
            _this3.handleOpenFolder(_this3.getFolderId());
          } else if (action === 'action_publish') {
            _this3.handleCloseFile();
            _this3.handleOpenFile(response.record.id);
          }
          return response;
        });
      });
    }
  }, {
    key: 'handleCloseFile',
    value: function handleCloseFile() {
      this.handleBrowse(this.getFolderId(), null, this.props.query);
    }
  }, {
    key: 'handleOpenFolder',
    value: function handleOpenFolder(folderId) {
      var query = Object.assign({}, this.props.query);
      delete query.page;
      delete query.filter;
      this.handleBrowse(folderId, null, query);
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(fileId) {
      var _this4 = this;

      var file = this.findFile(fileId);
      if (!file && this.props.folder && this.props.folder.id === fileId) {
        file = this.props.folder;
      }

      if (!file) {
        throw new Error('File selected for deletion cannot be found: ' + fileId);
      }

      var dataId = this.props.client.dataId({
        __typename: file.__typename,
        id: file.id
      });

      return this.props.actions.files.deleteFile(file.id, dataId).then(function () {
        _this4.props.actions.gallery.deselectFiles([file.id]);

        if (file.queuedId) {
          _this4.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
        }

        if (file) {
          _this4.handleBrowse(file.parentId ? file.parentId : 0, null, _this4.props.query);
        }
      });
    }
  }, {
    key: 'handleUnpublish',
    value: function handleUnpublish(fileId) {
      var _this5 = this;

      var file = this.findFile(fileId);
      if (!file && this.props.folder && this.props.folder.id === fileId) {
        file = this.props.folder;
      }

      if (!file) {
        throw new Error('File selected for unpublish cannot be found: ' + fileId);
      }

      var dataId = this.props.client.dataId({
        __typename: file.__typename,
        id: file.id
      });

      this.props.actions.files.unpublishFile(file.id, dataId).then(function (response) {
        _this5.props.actions.files.readFiles().then(function () {
          _this5.handleCloseFile();
          _this5.handleOpenFile(response.data.unpublishFile.id);
        });
      });
    }
  }, {
    key: 'findFile',
    value: function findFile(fileId) {
      var allFiles = [].concat(_toConsumableArray(this.props.files), _toConsumableArray(this.props.queuedFiles.items));
      return allFiles.find(function (item) {
        return item.id === parseInt(fileId, 10);
      });
    }
  }, {
    key: 'handleUpload',
    value: function handleUpload() {}
  }, {
    key: 'handleCreateFolder',
    value: function handleCreateFolder() {
      this.props.onBrowse(this.getFolderId(), null, this.props.query, _index2.default.ACTIONS.CREATE_FOLDER);
    }
  }, {
    key: 'handleMoveFilesSuccess',
    value: function handleMoveFilesSuccess(folderId, fileIds) {
      var _this6 = this;

      var files = this.props.queuedFiles.items.filter(function (file) {
        return fileIds.includes(file.id);
      });

      files.forEach(function (file) {
        if (file.queuedId) {
          _this6.props.actions.queuedFiles.removeQueuedFile(file.queuedId);
        }
      });

      this.props.actions.gallery.deselectFiles();

      this.props.actions.files.readFiles();
    }
  }, {
    key: 'renderGallery',
    value: function renderGallery() {
      var config = this.props.sectionConfig;
      var createFileApiUrl = config.createFileEndpoint.url;
      var createFileApiMethod = config.createFileEndpoint.method;

      var limit = this.props.query && parseInt(this.props.query.limit || config.limit, 10);
      var page = this.props.query && parseInt(this.props.query.page || 1, 10);

      var sort = this.props.query && this.props.query.sort;
      var view = this.props.query && this.props.query.view;
      var filters = this.props.query.filter || {};

      return _react2.default.createElement(_Gallery2.default, {
        files: this.props.files,
        fileId: this.props.fileId,
        folderId: this.getFolderId(),
        folder: this.props.folder,
        type: this.props.type,
        limit: limit,
        page: page,
        totalCount: this.props.filesTotalCount,
        view: view,
        filters: filters,
        createFileApiUrl: createFileApiUrl,
        createFileApiMethod: createFileApiMethod,
        onDelete: this.handleDelete,
        onOpenFile: this.handleOpenFile,
        onOpenFolder: this.handleOpenFolder,
        onSuccessfulUpload: this.handleUpload,
        onCreateFolder: this.handleCreateFolder,
        onMoveFilesSuccess: this.handleMoveFilesSuccess,
        onSort: this.handleSort,
        onSetPage: this.handleSetPage,
        onViewChange: this.handleViewChange,
        sort: sort,
        sectionConfig: config,
        loading: this.props.loading
      });
    }
  }, {
    key: 'renderEditor',
    value: function renderEditor() {
      var config = this.props.sectionConfig;

      var _getFormSchema = getFormSchema({
        config: config,
        viewAction: this.props.viewAction,
        folderId: this.getFolderId(),
        type: this.props.type,
        fileId: this.props.fileId
      }),
          schemaUrl = _getFormSchema.schemaUrl,
          targetId = _getFormSchema.targetId;

      if (!schemaUrl) {
        return null;
      }

      return _react2.default.createElement(_Editor2.default, {
        className: this.props.dialog ? 'editor--dialog' : '',
        targetId: targetId,
        onClose: this.handleCloseFile,
        schemaUrl: schemaUrl,
        schemaUrlQueries: this.props.requireLinkText ? [{ name: 'requireLinkText', value: true }] : [],
        onSubmit: this.handleSubmitEditor,
        onDelete: this.handleDelete,
        onUnpublish: this.handleUnpublish,
        addToCampaignSchemaUrl: config.form.addToCampaignForm.schemaUrl
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var showBackButton = !!(this.props.folder && this.props.folder.id || (0, _Search.hasFilters)(this.props.query.filter));
      var searchFormSchemaUrl = this.props.sectionConfig.form.fileSearchForm.schemaUrl;
      var filters = this.props.query.filter || {};
      return _react2.default.createElement(
        'div',
        { className: 'fill-height' },
        _react2.default.createElement(
          _Toolbar2.default,
          {
            showBackButton: showBackButton,
            handleBackButtonClick: this.handleBackButtonClick
          },
          _react2.default.createElement(_Breadcrumb2.default, { multiline: true }),
          _react2.default.createElement(
            'div',
            { className: 'asset-admin__toolbar-extra pull-xs-right fill-width' },
            _react2.default.createElement(_Search2.default, { onSearch: this.handleDoSearch, id: 'AssetSearchForm',
              searchFormSchemaUrl: searchFormSchemaUrl, folderId: this.getFolderId(),
              filters: filters
            }),
            this.props.toolbarChildren
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'flexbox-area-grow fill-width fill-height gallery' },
          this.renderGallery(),
          this.renderEditor()
        )
      );
    }
  }]);

  return AssetAdmin;
}(_SilverStripeComponent2.default);

AssetAdmin.propTypes = {
  dialog: _react.PropTypes.bool,
  sectionConfig: _configShape2.default,
  fileId: _react.PropTypes.number,
  folderId: _react.PropTypes.number,
  onBrowse: _react.PropTypes.func,
  onReplaceUrl: _react.PropTypes.func,
  getUrl: _react.PropTypes.func,
  query: _react.PropTypes.shape({
    sort: _react.PropTypes.string,
    limit: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    page: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    filter: _react.PropTypes.object
  }),
  onSubmitEditor: _react.PropTypes.func,
  type: _react.PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
  files: _react.PropTypes.array,
  queuedFiles: _react.PropTypes.shape({
    items: _react.PropTypes.array.isRequired
  }),
  filesTotalCount: _react.PropTypes.number,
  folder: _react.PropTypes.shape({
    id: _react.PropTypes.number,
    title: _react.PropTypes.string,
    parents: _react.PropTypes.array,
    parentId: _react.PropTypes.number,
    canView: _react.PropTypes.bool,
    canEdit: _react.PropTypes.bool
  }),
  loading: _react.PropTypes.bool,
  actions: _react.PropTypes.object
};

AssetAdmin.defaultProps = {
  type: 'admin',
  query: {
    sort: '',
    limit: null,
    page: 0,
    filter: {}
  }
};

function mapStateToProps(state) {
  return {
    securityId: state.config.SecurityID,

    queuedFiles: state.assetAdmin.queuedFiles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: (0, _redux.bindActionCreators)(galleryActions, dispatch),
      breadcrumbsActions: (0, _redux.bindActionCreators)(breadcrumbsActions, dispatch),

      queuedFiles: (0, _redux.bindActionCreators)(queuedFilesActions, dispatch)
    }
  };
}

exports.AssetAdmin = AssetAdmin;
exports.getFormSchema = getFormSchema;
exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), _readFilesQuery2.default, _deleteFileMutation2.default, _unpublishFileMutation2.default, function (component) {
  return (0, _reactApollo.withApollo)(component);
})(AssetAdmin);

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUrl = exports.AssetAdminRouter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4);

var _reactRouter = __webpack_require__(349);

var _AssetAdmin = __webpack_require__(84);

var _AssetAdmin2 = _interopRequireDefault(_AssetAdmin);

var _DataFormat = __webpack_require__(35);

var _qs = __webpack_require__(352);

var _qs2 = _interopRequireDefault(_qs);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _configShape = __webpack_require__(38);

var _configShape2 = _interopRequireDefault(_configShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

var actions = Object.keys(_index2.default.ACTIONS).map(function (key) {
  return _index2.default.ACTIONS[key];
});

function buildUrl(_ref) {
  var base = _ref.base,
      folderId = _ref.folderId,
      fileId = _ref.fileId,
      query = _ref.query,
      action = _ref.action;

  if (action && actions.indexOf(action) === -1) {
    throw new Error('Invalid action provided: ' + action);
  }

  var url = null;
  if (fileId) {
    url = base + '/show/' + folderId + '/' + _index2.default.ACTIONS.EDIT_FILE + '/' + fileId;
  } else if (folderId) {
    url = base + '/show/' + folderId;
  } else {
    url = base + '/';
  }

  if (action === _index2.default.ACTIONS.CREATE_FOLDER) {
    url = base + '/show/' + (folderId || 0) + '/' + action;
  }

  var hasQuery = query && Object.keys(query).length > 0;
  if (hasQuery) {
    url = url + '?' + _qs2.default.stringify(query);
  }

  return url;
}

var AssetAdminRouter = function (_Component) {
  _inherits(AssetAdminRouter, _Component);

  function AssetAdminRouter(props) {
    _classCallCheck(this, AssetAdminRouter);

    var _this = _possibleConstructorReturn(this, (AssetAdminRouter.__proto__ || Object.getPrototypeOf(AssetAdminRouter)).call(this, props));

    _this.handleBrowse = _this.handleBrowse.bind(_this);
    _this.handleReplaceUrl = _this.handleReplaceUrl.bind(_this);
    _this.getUrl = _this.getUrl.bind(_this);
    return _this;
  }

  _createClass(AssetAdminRouter, [{
    key: 'getUrl',
    value: function getUrl() {
      var folderId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var fileId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var action = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _index2.default.ACTIONS.EDIT_FILE;

      var newFolderId = parseInt(folderId || 0, 10);
      var newFileId = parseInt(fileId || 0, 10);

      var hasFolderChanged = newFolderId !== this.getFolderId();
      var newQuery = Object.assign({}, query);
      if (hasFolderChanged || newQuery.page <= 1) {
        delete newQuery.page;
      }

      return buildUrl({
        base: this.props.sectionConfig.url,
        folderId: newFolderId,
        fileId: newFileId,
        query: newQuery,
        action: action
      });
    }
  }, {
    key: 'getFolderId',
    value: function getFolderId() {
      if (this.props.params && this.props.params.folderId) {
        return parseInt(this.props.params.folderId, 10);
      }
      return 0;
    }
  }, {
    key: 'getFileId',
    value: function getFileId() {
      if (this.props.params && this.props.params.fileId) {
        return parseInt(this.props.params.fileId, 10);
      }
      return 0;
    }
  }, {
    key: 'getViewAction',
    value: function getViewAction() {
      if (this.props.params && this.props.params.viewAction) {
        return this.props.params.viewAction;
      }
      return _index2.default.ACTIONS.EDIT_FILE;
    }
  }, {
    key: 'getSectionProps',
    value: function getSectionProps() {
      return {
        sectionConfig: this.props.sectionConfig,
        type: 'admin',
        folderId: this.getFolderId(),
        viewAction: this.getViewAction(),
        fileId: this.getFileId(),
        query: this.getQuery(),
        getUrl: this.getUrl,
        onBrowse: this.handleBrowse,
        onReplaceUrl: this.handleReplaceUrl
      };
    }
  }, {
    key: 'getQuery',
    value: function getQuery() {
      return (0, _DataFormat.decodeQuery)(this.props.location.search);
    }
  }, {
    key: 'handleBrowse',
    value: function handleBrowse(folderId, fileId, query, action) {
      var pathname = this.getUrl(folderId, fileId, query, action);

      this.props.router.push(pathname);
    }
  }, {
    key: 'handleReplaceUrl',
    value: function handleReplaceUrl(folderId, fileId, query, action) {
      var pathname = this.getUrl(folderId, fileId, query, action);

      this.props.router.replace(pathname);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.sectionConfig) {
        return null;
      }
      return _react2.default.createElement(_AssetAdmin2.default, this.getSectionProps());
    }
  }]);

  return AssetAdminRouter;
}(_react.Component);

AssetAdminRouter.propTypes = {
  sectionConfig: _configShape2.default,
  location: _react.PropTypes.shape({
    pathname: _react.PropTypes.string,
    query: _react.PropTypes.object,
    search: _react.PropTypes.string
  }),
  params: _react.PropTypes.object,
  router: _react.PropTypes.object
};

function mapStateToProps(state) {
  var sectionConfig = state.config.sections.find(function (section) {
    return section.name === sectionConfigKey;
  });

  return {
    sectionConfig: sectionConfig
  };
}

exports.AssetAdminRouter = AssetAdminRouter;
exports.buildUrl = buildUrl;
exports.default = (0, _reactRouter.withRouter)((0, _reactRedux.connect)(mapStateToProps)(AssetAdminRouter));

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(53);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileStructure = (0, _deepFreezeStrict2.default)({
  name: null,
  canDelete: false,
  canEdit: false,
  category: null,
  created: null,
  extension: null,
  filename: null,
  id: 0,
  lastEdited: null,
  messages: null,
  owner: {
    id: 0,
    title: null
  },
  parent: {
    filename: null,
    id: 0,
    title: null
  },
  queuedId: null,
  size: null,
  title: null,
  type: null,
  url: null,
  xhr: null,
  thumbnail: null,
  smallThumbnail: null,
  height: null,
  width: null
});

exports.default = fileStructure;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = ['DESELECT_FILES', 'SELECT_FILES', 'LOAD_FILE_REQUEST', 'LOAD_FILE_SUCCESS', 'HIGHLIGHT_FILES', 'UPDATE_BATCH_ACTIONS', 'SET_NOTICE_MESSAGE', 'SET_ERROR_MESSAGE', 'SET_ENABLE_DROPZONE', 'SET_FILE_BADGE', 'CLEAR_FILE_BADGE'].reduce(function (obj, item) {
  return Object.assign(obj, _defineProperty({}, item, 'GALLERY.' + item));
}, {});

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFile = loadFile;
exports.selectFiles = selectFiles;
exports.deselectFiles = deselectFiles;
exports.setNoticeMessage = setNoticeMessage;
exports.setErrorMessage = setErrorMessage;
exports.setEnableDropzone = setEnableDropzone;
exports.clearFileBadge = clearFileBadge;
exports.setFileBadge = setFileBadge;

var _GalleryActionTypes = __webpack_require__(87);

var _GalleryActionTypes2 = _interopRequireDefault(_GalleryActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadFile(id, file) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.LOAD_FILE_SUCCESS,
      payload: {
        id: id,
        file: file
      }
    });
  };
}

function selectFiles() {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.SELECT_FILES,
      payload: { ids: ids }
    });
  };
}

function deselectFiles() {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.DESELECT_FILES,
      payload: { ids: ids }
    });
  };
}

function setNoticeMessage(message) {
  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.SET_NOTICE_MESSAGE,
      payload: { message: message }
    });
  };
}

function setErrorMessage(message) {
  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.SET_ERROR_MESSAGE,
      payload: { message: message }
    });
  };
}

function setEnableDropzone(enableDropzone) {
  return function (dispatch) {
    return dispatch({
      type: _GalleryActionTypes2.default.SET_ENABLE_DROPZONE,
      payload: { enableDropzone: enableDropzone }
    });
  };
}

function clearFileBadge(id) {
  return function (dispatch) {
    dispatch({
      type: _GalleryActionTypes2.default.CLEAR_FILE_BADGE,
      payload: { id: id }
    });
  };
}

function setFileBadge(id, message, status, duration) {
  return function (dispatch, getState) {
    var _getState = getState(),
        assetAdmin = _getState.assetAdmin;

    var badge = assetAdmin.gallery.badges.find(function (item) {
      return item.id === id;
    });

    if (badge && badge.timer) {
      clearTimeout(badge.timer);
    }
    var timer = duration > 0 ? setTimeout(function () {
      return clearFileBadge(id)(dispatch);
    }, duration) : null;

    dispatch({
      type: _GalleryActionTypes2.default.SET_FILE_BADGE,
      payload: { id: id, message: message, status: status, timer: timer }
    });
  };
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  SET_STATUS: 'IMAGE_LOAD_SET_STATUS',
  RESET: 'IMAGE_LOAD_RESET' };

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  DISABLED: 'DISABLED',
  NONE: 'NONE',
  SUCCESS: 'SUCCESS',
  LOADING: 'LOADING',
  WAITING: 'WAITING',
  FAILED: 'FAILED' };

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  PREVIEWFIELD_ADD_FILE: 'PREVIEWFIELD_ADD_FILE',
  PREVIEWFIELD_REMOVE_FILE: 'PREVIEWFIELD_REMOVE_FILE',
  PREVIEWFIELD_UPDATE_FILE: 'PREVIEWFIELD_UPDATE_FILE',
  PREVIEWFIELD_FAIL_UPLOAD: 'PREVIEWFIELD_FAIL_UPLOAD'
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  ADD_QUEUED_FILE: 'ADD_QUEUED_FILE',
  FAIL_UPLOAD: 'FAIL_UPLOAD',
  PURGE_UPLOAD_QUEUE: 'PURGE_UPLOAD_QUEUE',
  REMOVE_QUEUED_FILE: 'REMOVE_QUEUED_FILE',
  SUCCEED_UPLOAD: 'SUCCEED_UPLOAD',
  UPDATE_QUEUED_FILE: 'UPDATE_QUEUED_FILE'
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addQueuedFile = addQueuedFile;
exports.failUpload = failUpload;
exports.purgeUploadQueue = purgeUploadQueue;
exports.removeQueuedFile = removeQueuedFile;
exports.succeedUpload = succeedUpload;
exports.updateQueuedFile = updateQueuedFile;

var _QueuedFilesActionTypes = __webpack_require__(92);

var _QueuedFilesActionTypes2 = _interopRequireDefault(_QueuedFilesActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addQueuedFile(file) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.ADD_QUEUED_FILE,
      payload: { file: file }
    });
  };
}

function failUpload(queuedId, response) {
  return function (dispatch) {
    var message = response.message;

    if (typeof response === 'string') {
      message = {
        value: response,
        type: 'error'
      };
    }
    return dispatch({
      type: _QueuedFilesActionTypes2.default.FAIL_UPLOAD,
      payload: {
        queuedId: queuedId,
        message: message
      }
    });
  };
}

function purgeUploadQueue() {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.PURGE_UPLOAD_QUEUE,
      payload: null
    });
  };
}

function removeQueuedFile(queuedId) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.REMOVE_QUEUED_FILE,
      payload: { queuedId: queuedId }
    });
  };
}

function succeedUpload(queuedId, json) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.SUCCEED_UPLOAD,
      payload: { queuedId: queuedId, json: json }
    });
  };
}

function updateQueuedFile(queuedId, updates) {
  return function (dispatch) {
    return dispatch({
      type: _QueuedFilesActionTypes2.default.UPDATE_QUEUED_FILE,
      payload: { queuedId: queuedId, updates: updates }
    });
  };
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  UPLOADFIELD_ADD_FILE: 'UPLOADFIELD_ADD_FILE',
  UPLOADFIELD_SET_FILES: 'UPLOADFIELD_SET_FILES',
  UPLOADFIELD_REMOVE_FILE: 'UPLOADFIELD_REMOVE_FILE',
  UPLOADFIELD_UPLOAD_FAILURE: 'UPLOADFIELD_UPLOAD_FAILURE',
  UPLOADFIELD_UPLOAD_SUCCESS: 'UPLOADFIELD_UPLOAD_SUCCESS',
  UPLOADFIELD_UPDATE_QUEUED_FILE: 'UPLOADFIELD_UPDATE_QUEUED_FILE'
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var forEach = __webpack_require__(137);
var isObject = __webpack_require__(12);
var isArray = __webpack_require__(2);
var isFunction = __webpack_require__(51);
var isPlainObject = __webpack_require__(140);
var forOwn = __webpack_require__(317);

// Credits: https://github.com/documentcloud/underscore-contrib
// Sub module: underscore.object.selectors
// License: MIT (https://github.com/documentcloud/underscore-contrib/blob/master/LICENSE)
// https://github.com/documentcloud/underscore-contrib/blob/master/underscore.object.selectors.js

// Will take a path like 'element[0][1].subElement["Hey!.What?"]["[hey]"]'
// and return ["element", "0", "1", "subElement", "Hey!.What?", "[hey]"]
function keysFromPath(path) {
  // from http://codereview.stackexchange.com/a/63010/8176
  /**
   * Repeatedly capture either:
   * - a bracketed expression, discarding optional matching quotes inside, or
   * - an unbracketed expression, delimited by a dot or a bracket.
   */
  var re = /\[("|')(.+)\1\]|([^.\[\]]+)/g;

  var elements = [];
  var result;
  while ((result = re.exec(path)) !== null) {
    elements.push(result[2] || result[3]);
  }
  return elements;
}

// Gets the value at any depth in a nested object based on the
// path described by the keys given. Keys may be given as an array
// or as a dot-separated string.
function getPath(obj, ks) {
  if (typeof ks == "string") {
    if (obj[ks] !== undefined) {
      return obj[ks];
    }
    ks = keysFromPath(ks);
  }

  var i = -1,
      length = ks.length;

  // If the obj is null or undefined we have to break as
  // a TypeError will result trying to access any property
  // Otherwise keep incrementally access the next property in
  // ks until complete
  while (++i < length && obj != null) {
    obj = obj[ks[i]];
  }
  return i === length ? obj : void 0;
}

// Based on the origin underscore _.pick function
// Credit: https://github.com/jashkenas/underscore/blob/master/underscore.js
function powerPick(object, keys) {
  var result = {},
      obj = object,
      iteratee;
  iteratee = function (key, obj) {
    return key in obj;
  };

  obj = Object(obj);

  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    if (iteratee(key, obj)) result[key] = getPath(obj, key);
  }

  return result;
}

// Gets all the keys for a flattened object structure.
// Doesn't flatten arrays.
// Input:
// {
//  a: {
//    x: 1,
//    y: 2
//  },
//  b: [3, 4],
//  c: 5
// }
// Output:
// [
//  "a.x",
//  "a.y",
//  "b",
//  "c"
// ]
function getKeys(obj, prefix) {
  var keys = [];

  forEach(obj, function (value, key) {
    var fullKey = prefix ? prefix + "." + key : key;
    if (isObject(value) && !isArray(value) && !isFunction(value) && !(value instanceof Date)) {
      keys = keys.concat(getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  });

  return keys;
}

// Recursivly traverse plain objects and arrays calling `fn` on each
// non-object/non-array leaf node.
function iterObject(thing, fn) {
  if (isArray(thing)) {
    forEach(thing, function (item) {
      iterObject(item, fn);
    });
  } else if (isPlainObject(thing)) {
    forOwn(thing, function (item) {
      iterObject(item, fn);
    });
  } else {
    fn(thing);
  }
}

// Recursivly traverse plain objects and arrays and build a list of all
// non-object/non-array leaf nodes.
//
// Input:
// { "array": [1, "two", {"tree": 3}], "string": "a string" }
//
// Output:
// [1, 'two', 3, 'a string']
//
function getObjectValues(thing) {
  var results = [];
  iterObject(thing, function (value) {
    results.push(value);
  });
  return results;
}

module.exports = {
  pick: powerPick,
  getAt: getPath,
  keys: getKeys,
  getObjectValues: getObjectValues
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);
var ColumnProperties = __webpack_require__(27);
var pick = __webpack_require__(329);

var GridRowContainer = React.createClass({
  displayName: 'GridRowContainer',

  getDefaultProps: function getDefaultProps() {
    return {
      "useGriddleStyles": true,
      "useGriddleIcons": true,
      "isSubGriddle": false,
      "columnSettings": null,
      "rowSettings": null,
      "paddingHeight": null,
      "rowHeight": null,
      "parentRowCollapsedClassName": "parent-row",
      "parentRowExpandedClassName": "parent-row expanded",
      "parentRowCollapsedComponent": "▶",
      "parentRowExpandedComponent": "▼",
      "onRowClick": null,
      "multipleSelectionSettings": null
    };
  },
  getInitialState: function getInitialState() {
    return {
      "data": {},
      "showChildren": false
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    this.setShowChildren(false);
  },
  toggleChildren: function toggleChildren() {
    this.setShowChildren(this.state.showChildren === false);
  },
  setShowChildren: function setShowChildren(visible) {
    this.setState({
      showChildren: visible
    });
  },
  verifyProps: function verifyProps() {
    if (this.props.columnSettings === null) {
      console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be");
    }
  },
  render: function render() {
    this.verifyProps();
    var that = this;
    if (typeof this.props.data === "undefined") {
      return React.createElement('tbody', null);
    }
    var arr = [];

    var columns = this.props.columnSettings.getColumns();

    arr.push(React.createElement(this.props.rowSettings.rowComponent, {
      useGriddleStyles: this.props.useGriddleStyles,
      isSubGriddle: this.props.isSubGriddle,
      data: this.props.rowSettings.isCustom ? pick(this.props.data, columns) : this.props.data,
      rowData: this.props.rowSettings.isCustom ? this.props.data : null,
      columnSettings: this.props.columnSettings,
      rowSettings: this.props.rowSettings,
      hasChildren: that.props.hasChildren,
      toggleChildren: that.toggleChildren,
      showChildren: that.state.showChildren,
      key: that.props.uniqueId + '_base_row',
      useGriddleIcons: that.props.useGriddleIcons,
      parentRowExpandedClassName: this.props.parentRowExpandedClassName,
      parentRowCollapsedClassName: this.props.parentRowCollapsedClassName,
      parentRowExpandedComponent: this.props.parentRowExpandedComponent,
      parentRowCollapsedComponent: this.props.parentRowCollapsedComponent,
      paddingHeight: that.props.paddingHeight,
      rowHeight: that.props.rowHeight,
      onRowClick: that.props.onRowClick,
      multipleSelectionSettings: this.props.multipleSelectionSettings }));

    var children = null;

    if (that.state.showChildren) {
      children = that.props.hasChildren && this.props.data["children"].map(function (row, index) {
        var key = that.props.rowSettings.getRowKey(row, index);

        if (typeof row["children"] !== "undefined") {
          var Griddle = that.constructor.Griddle;
          return React.createElement('tr', { key: key, style: { paddingLeft: 5 } }, React.createElement('td', { colSpan: that.props.columnSettings.getVisibleColumnCount(), className: 'griddle-parent', style: that.props.useGriddleStyles ? { border: "none", "padding": "0 0 0 5px" } : null }, React.createElement(Griddle, {
            rowMetadata: { key: 'id' },
            isSubGriddle: true,
            results: [row],
            columns: that.props.columnSettings.getColumns(),
            tableClassName: that.props.tableClassName,
            parentRowExpandedClassName: that.props.parentRowExpandedClassName,
            parentRowCollapsedClassName: that.props.parentRowCollapsedClassName,
            showTableHeading: false,
            showPager: false,
            columnMetadata: that.props.columnSettings.columnMetadata,
            parentRowExpandedComponent: that.props.parentRowExpandedComponent,
            parentRowCollapsedComponent: that.props.parentRowCollapsedComponent,
            paddingHeight: that.props.paddingHeight,
            rowHeight: that.props.rowHeight
          })));
        }

        return React.createElement(that.props.rowSettings.rowComponent, {
          useGriddleStyles: that.props.useGriddleStyles,
          isSubGriddle: that.props.isSubGriddle,
          data: row,
          columnSettings: that.props.columnSettings,
          isChildRow: true,
          columnMetadata: that.props.columnSettings.columnMetadata,
          key: key
        });
      });
    }

    return that.props.hasChildren === false ? arr[0] : React.createElement('tbody', null, that.state.showChildren ? arr.concat(children) : arr);
  }
});

module.exports = GridRowContainer;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

var React = __webpack_require__(0);
var GridTable = __webpack_require__(207);
var GridFilter = __webpack_require__(202);
var GridPagination = __webpack_require__(204);
var GridSettings = __webpack_require__(206);
var GridNoData = __webpack_require__(203);
var GridRow = __webpack_require__(205);
var GridRowContainer = __webpack_require__(96);
var CustomRowComponentContainer = __webpack_require__(201);
var CustomPaginationContainer = __webpack_require__(200);
var CustomFilterContainer = __webpack_require__(199);
var ColumnProperties = __webpack_require__(27);
var RowProperties = __webpack_require__(98);
var deep = __webpack_require__(95);

var drop = __webpack_require__(313);
var dropRight = __webpack_require__(314);
var find = __webpack_require__(72);
var first = __webpack_require__(332);
var forEach = __webpack_require__(137);
var initial = __webpack_require__(319);
var intersection = __webpack_require__(320);
var isArray = __webpack_require__(2);
var isEmpty = __webpack_require__(321);
var isNull = __webpack_require__(322);
var isUndefined = __webpack_require__(324);
var omit = __webpack_require__(327);
var map = __webpack_require__(141);
var extend = __webpack_require__(48);
var _filter = __webpack_require__(136);

var _orderBy = __webpack_require__(328);
var _property = __webpack_require__(142);
var _get = __webpack_require__(138);

var Griddle = React.createClass({
    displayName: 'Griddle',

    statics: {
        GridTable: GridTable,
        GridFilter: GridFilter,
        GridPagination: GridPagination,
        GridSettings: GridSettings,
        GridRow: GridRow
    },
    columnSettings: null,
    rowSettings: null,
    getDefaultProps: function getDefaultProps() {
        return {
            "columns": [],
            "gridMetadata": null,
            "columnMetadata": [],
            "rowMetadata": null,
            "results": [], // Used if all results are already loaded.
            "initialSort": "",
            "gridClassName": "",
            "tableClassName": "",
            "customRowComponentClassName": "",
            "settingsText": "Settings",
            "filterPlaceholderText": "Filter Results",
            "nextText": "Next",
            "previousText": "Previous",
            "maxRowsText": "Rows per page",
            "enableCustomFormatText": "Enable Custom Formatting",
            //this column will determine which column holds subgrid data
            //it will be passed through with the data object but will not be rendered
            "childrenColumnName": "children",
            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
            "metadataColumns": [],
            "showFilter": false,
            "showSettings": false,
            "useCustomRowComponent": false,
            "useCustomGridComponent": false,
            "useCustomPagerComponent": false,
            "useCustomFilterer": false,
            "useCustomFilterComponent": false,
            "useGriddleStyles": true,
            "useGriddleIcons": true,
            "customRowComponent": null,
            "customGridComponent": null,
            "customPagerComponent": {},
            "customFilterComponent": null,
            "customFilterer": null,
            "globalData": null,
            "enableToggleCustom": false,
            "noDataMessage": "There is no data to display.",
            "noDataClassName": "griddle-nodata",
            "customNoDataComponent": null,
            "customNoDataComponentProps": null,
            "allowEmptyGrid": false,
            "showTableHeading": true,
            "showPager": true,
            "useFixedHeader": false,
            "useExternal": false,
            "externalSetPage": null,
            "externalChangeSort": null,
            "externalSetFilter": null,
            "externalSetPageSize": null,
            "externalMaxPage": null,
            "externalCurrentPage": null,
            "externalSortColumn": null,
            "externalSortAscending": true,
            "externalLoadingComponent": null,
            "externalIsLoading": false,
            "enableInfiniteScroll": false,
            "bodyHeight": null,
            "paddingHeight": 5,
            "rowHeight": 25,
            "infiniteScrollLoadTreshold": 50,
            "useFixedLayout": true,
            "isSubGriddle": false,
            "enableSort": true,
            "onRowClick": null,
            /* css class names */
            "sortAscendingClassName": "sort-ascending",
            "sortDescendingClassName": "sort-descending",
            "parentRowCollapsedClassName": "parent-row",
            "parentRowExpandedClassName": "parent-row expanded",
            "settingsToggleClassName": "settings",
            "nextClassName": "griddle-next",
            "previousClassName": "griddle-previous",
            "headerStyles": {},
            /* icon components */
            "sortAscendingComponent": " ▲",
            "sortDescendingComponent": " ▼",
            "sortDefaultComponent": null,
            "parentRowCollapsedComponent": "▶",
            "parentRowExpandedComponent": "▼",
            "settingsIconComponent": "",
            "nextIconComponent": "",
            "previousIconComponent": "",
            "isMultipleSelection": false, //currently does not support subgrids
            "selectedRowIds": [],
            "uniqueIdentifier": "id",
            "onSelectionChange": null
        };
    },
    propTypes: {
        isMultipleSelection: React.PropTypes.bool,
        selectedRowIds: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.number), React.PropTypes.arrayOf(React.PropTypes.string)]),
        uniqueIdentifier: React.PropTypes.string,
        onSelectionChange: React.PropTypes.func
    },
    defaultFilter: function defaultFilter(results, filter) {
        var that = this;
        return _filter(results, function (item) {
            var arr = deep.keys(item);
            for (var i = 0; i < arr.length; i++) {
                var isFilterable = that.columnSettings.getMetadataColumnProperty(arr[i], "filterable", true);
                if (isFilterable && (deep.getAt(item, arr[i]) || "").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                    return true;
                }
            }
            return false;
        });
    },

    defaultColumnFilter: function defaultColumnFilter(value, filter) {
        return _filter(deep.getObjectValues(value), function (value) {
            return value.toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0;
        }).length > 0;
    },

    filterByColumnFilters: function filterByColumnFilters(columnFilters) {
        var filterFunction = this.defaultColumnFilter;
        var filteredResults = Object.keys(columnFilters).reduce(function (previous, current) {
            return _filter(previous, function (item) {
                var value = deep.getAt(item, current || "");
                var filter = columnFilters[current];
                return filterFunction(value, filter);
            });
        }, this.props.results);

        var newState = {
            columnFilters: columnFilters
        };

        if (columnFilters) {
            newState.filteredResults = filteredResults;
            newState.maxPage = this.getMaxPage(newState.filteredResults);
        } else if (this.state.filter) {
            newState.filteredResults = this.props.useCustomFilterer ? this.props.customFilterer(this.props.results, filter) : this.defaultFilter(this.props.results, filter);
        } else {
            newState.filteredResults = null;
        }

        this.setState(newState);
    },

    filterByColumn: function filterByColumn(filter, column) {
        var columnFilters = this.state.columnFilters;

        //if filter is "" remove it from the columnFilters object
        if (columnFilters.hasOwnProperty(column) && !filter) {
            columnFilters = omit(columnFilters, column);
        } else {
            var newObject = {};
            newObject[column] = filter;
            columnFilters = extend({}, columnFilters, newObject);
        }

        this.filterByColumnFilters(columnFilters);
    },

    /* if we have a filter display the max page and results accordingly */
    setFilter: function setFilter(filter) {
        if (this.props.useExternal) {
            this.props.externalSetFilter(filter);
            return;
        }

        var that = this,
            updatedState = {
            page: 0,
            filter: filter
        };

        // Obtain the state results.
        updatedState.filteredResults = this.props.useCustomFilterer ? this.props.customFilterer(this.props.results, filter) : this.defaultFilter(this.props.results, filter);

        // Update the max page.
        updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

        //if filter is null or undefined reset the filter.
        if (isUndefined(filter) || isNull(filter) || isEmpty(filter)) {
            updatedState.filter = filter;
            updatedState.filteredResults = null;
        }

        // Set the state.
        that.setState(updatedState);

        this._resetSelectedRows();
    },
    setPageSize: function setPageSize(size) {
        if (this.props.useExternal) {
            this.setState({
                resultsPerPage: size
            });
            this.props.externalSetPageSize(size);
            return;
        }
        //make this better.
        this.state.resultsPerPage = size;
        this.setMaxPage();
    },
    toggleColumnChooser: function toggleColumnChooser() {
        this.setState({
            showColumnChooser: !this.state.showColumnChooser
        });
    },
    isNullOrUndefined: function isNullOrUndefined(value) {
        return value === undefined || value === null;
    },
    shouldUseCustomRowComponent: function shouldUseCustomRowComponent() {
        return this.isNullOrUndefined(this.state.useCustomRowComponent) ? this.props.useCustomRowComponent : this.state.useCustomRowComponent;
    },
    shouldUseCustomGridComponent: function shouldUseCustomGridComponent() {
        return this.isNullOrUndefined(this.state.useCustomGridComponent) ? this.props.useCustomGridComponent : this.state.useCustomGridComponent;
    },
    toggleCustomComponent: function toggleCustomComponent() {
        if (this.state.customComponentType === "grid") {
            this.setState({
                useCustomGridComponent: !this.shouldUseCustomGridComponent()
            });
        } else if (this.state.customComponentType === "row") {
            this.setState({
                useCustomRowComponent: !this.shouldUseCustomRowComponent()
            });
        }
    },
    getMaxPage: function getMaxPage(results, totalResults) {
        if (this.props.useExternal) {
            return this.props.externalMaxPage;
        }

        if (!totalResults) {
            totalResults = (results || this.getCurrentResults()).length;
        }
        var maxPage = Math.ceil(totalResults / this.state.resultsPerPage);
        return maxPage;
    },
    setMaxPage: function setMaxPage(results) {
        var maxPage = this.getMaxPage(results);
        //re-render if we have new max page value
        if (this.state.maxPage !== maxPage) {
            this.setState({ page: 0, maxPage: maxPage, filteredColumns: this.columnSettings.filteredColumns });
        }
    },
    setPage: function setPage(number) {
        if (this.props.useExternal) {
            this.props.externalSetPage(number);
            return;
        }

        //check page size and move the filteredResults to pageSize * pageNumber
        if (number * this.state.resultsPerPage <= this.state.resultsPerPage * this.state.maxPage) {
            var that = this,
                state = {
                page: number
            };

            that.setState(state);
        }

        //When infinite scrolling is enabled, uncheck the "select all" checkbox, since more unchecked rows will be appended at the end
        if (this.props.enableInfiniteScroll) {
            this.setState({
                isSelectAllChecked: false
            });
        }
    },
    setColumns: function setColumns(columns) {
        this.columnSettings.filteredColumns = isArray(columns) ? columns : [columns];

        this.setState({
            filteredColumns: this.columnSettings.filteredColumns
        });
    },
    nextPage: function nextPage() {
        var currentPage = this.getCurrentPage();
        if (currentPage < this.getCurrentMaxPage() - 1) {
            this.setPage(currentPage + 1);
        }
    },
    previousPage: function previousPage() {
        var currentPage = this.getCurrentPage();
        if (currentPage > 0) {
            this.setPage(currentPage - 1);
        }
    },
    changeSort: function changeSort(column) {
        if (this.props.enableSort === false) {
            return;
        }

        if (this.props.useExternal) {
            var isAscending = this.props.externalSortColumn === column ? !this.props.externalSortAscending : true;
            this.setState({
                sortColumn: column,
                sortDirection: isAscending ? 'asc' : 'desc'
            });
            this.props.externalChangeSort(column, isAscending);
            return;
        }
        var columnMeta = find(this.props.columnMetadata, { columnName: column }) || {};
        var sortDirectionCycle = columnMeta.sortDirectionCycle ? columnMeta.sortDirectionCycle : [null, 'asc', 'desc'];
        var sortDirection = null;
        // Find the current position in the cycle (or -1).
        var i = sortDirectionCycle.indexOf(this.state.sortDirection && column === this.state.sortColumn ? this.state.sortDirection : null);

        // Proceed to the next position in the cycle (or start at the beginning).
        i = (i + 1) % sortDirectionCycle.length;

        if (sortDirectionCycle[i]) {
            sortDirection = sortDirectionCycle[i];
        } else {
            sortDirection = null;
        }

        var state = {
            page: 0,
            sortColumn: column,
            sortDirection: sortDirection
        };

        this.setState(state);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setMaxPage(nextProps.results);
        if (nextProps.resultsPerPage !== this.props.resultsPerPage) {
            this.setPageSize(nextProps.resultsPerPage);
        }
        //This will updaet the column Metadata
        this.columnSettings.columnMetadata = nextProps.columnMetadata;
        if (nextProps.results.length > 0) {
            var deepKeys = deep.keys(nextProps.results[0]);

            var is_same = this.columnSettings.allColumns.length == deepKeys.length && this.columnSettings.allColumns.every(function (element, index) {
                return element === deepKeys[index];
            });

            if (!is_same) {
                this.columnSettings.allColumns = deepKeys;
            }
        } else if (this.columnSettings.allColumns.length > 0) {
            this.columnSettings.allColumns = [];
        }

        if (nextProps.selectedRowIds) {
            var visibleRows = this.getDataForRender(this.getCurrentResults(nextProps.results), this.columnSettings.getColumns(), true);

            this.setState({
                isSelectAllChecked: this._getAreAllRowsChecked(nextProps.selectedRowIds, map(visibleRows, this.props.uniqueIdentifier)),
                selectedRowIds: nextProps.selectedRowIds
            });
        }
    },
    getInitialState: function getInitialState() {
        var state = {
            maxPage: 0,
            page: 0,
            filteredResults: null,
            filteredColumns: [],
            filter: "",
            //this sets the individual column filters
            columnFilters: {},
            resultsPerPage: this.props.resultsPerPage || 5,
            showColumnChooser: false,
            isSelectAllChecked: false,
            selectedRowIds: this.props.selectedRowIds
        };
        return state;
    },
    componentWillMount: function componentWillMount() {
        this.verifyExternal();
        this.verifyCustom();

        this.columnSettings = new ColumnProperties(this.props.results.length > 0 ? deep.keys(this.props.results[0]) : [], this.props.columns, this.props.childrenColumnName, this.props.columnMetadata, this.props.metadataColumns);

        this.rowSettings = new RowProperties(this.props.rowMetadata, this.props.useCustomTableRowComponent && this.props.customTableRowComponent ? this.props.customTableRowComponent : GridRow, this.props.useCustomTableRowComponent);

        if (this.props.initialSort) {
            // shouldn't change Sort on init for external
            if (this.props.useExternal) {
                this.setState({
                    sortColumn: this.props.externalSortColumn,
                    sortDirection: this.props.externalSortAscending ? 'asc' : 'desc'
                });
            } else {
                this.changeSort(this.props.initialSort);
            }
        }
        this.setMaxPage();

        //don't like the magic strings
        if (this.shouldUseCustomGridComponent()) {
            this.setState({
                customComponentType: "grid"
            });
        } else if (this.shouldUseCustomRowComponent()) {
            this.setState({
                customComponentType: "row"
            });
        } else {
            this.setState({
                filteredColumns: this.columnSettings.filteredColumns
            });
        }
    },
    componentDidMount: function componentDidMount() {
        if (this.props.componentDidMount && typeof this.props.componentDidMount === "function") {
            return this.props.componentDidMount();
        }
    },
    componentDidUpdate: function componentDidUpdate() {
        if (this.props.componentDidUpdate && typeof this.props.componentDidUpdate === "function") {
            return this.props.componentDidUpdate(this.state);
        }
    },
    //todo: clean these verify methods up
    verifyExternal: function verifyExternal() {
        if (this.props.useExternal === true) {
            //hooray for big ugly nested if
            if (this.props.externalSetPage === null) {
                console.error("useExternal is set to true but there is no externalSetPage function specified.");
            }

            if (this.props.externalChangeSort === null) {
                console.error("useExternal is set to true but there is no externalChangeSort function specified.");
            }

            if (this.props.externalSetFilter === null) {
                console.error("useExternal is set to true but there is no externalSetFilter function specified.");
            }

            if (this.props.externalSetPageSize === null) {
                console.error("useExternal is set to true but there is no externalSetPageSize function specified.");
            }

            if (this.props.externalMaxPage === null) {
                console.error("useExternal is set to true but externalMaxPage is not set.");
            }

            if (this.props.externalCurrentPage === null) {
                console.error("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data.");
            }
        }
    },
    //TODO: Do this with propTypes
    verifyCustom: function verifyCustom() {
        if (this.props.useCustomGridComponent === true && this.props.customGridComponent === null) {
            console.error("useCustomGridComponent is set to true but no custom component was specified.");
        }
        if (this.props.useCustomRowComponent === true && this.props.customRowComponent === null) {
            console.error("useCustomRowComponent is set to true but no custom component was specified.");
        }
        if (this.props.useCustomGridComponent === true && this.props.useCustomRowComponent === true) {
            console.error("Cannot currently use both customGridComponent and customRowComponent.");
        }
        if (this.props.useCustomFilterer === true && this.props.customFilterer === null) {
            console.error("useCustomFilterer is set to true but no custom filter function was specified.");
        }
        if (this.props.useCustomFilterComponent === true && this.props.customFilterComponent === null) {
            console.error("useCustomFilterComponent is set to true but no customFilterComponent was specified.");
        }
    },
    getDataForRender: function getDataForRender(data, cols, pageList) {
        var _this = this;

        var that = this;

        // get the correct page size
        if (this.state.sortColumn !== "") {
            var column = this.state.sortColumn;
            var sortColumn = _filter(this.props.columnMetadata, { columnName: column });
            var customCompareFn;
            var multiSort = {
                columns: [],
                orders: []
            };

            if (sortColumn.length > 0) {
                customCompareFn = sortColumn[0].hasOwnProperty("customCompareFn") && sortColumn[0]["customCompareFn"];
                if (sortColumn[0]["multiSort"]) {
                    multiSort = sortColumn[0]["multiSort"];
                }
            }

            if (this.state.sortDirection) {
                if (typeof customCompareFn === 'function') {
                    if (customCompareFn.length === 2) {
                        data = data.sort(function (a, b) {
                            return customCompareFn(_get(a, column), _get(b, column));
                        });

                        if (this.state.sortDirection === 'desc') {
                            data.reverse();
                        }
                    } else if (customCompareFn.length === 1) {
                        data = _orderBy(data, function (item) {
                            return customCompareFn(_get(item, column));
                        }, [this.state.sortDirection]);
                    }
                } else {
                    var iteratees = [function (row) {
                        return (_get(row, column) || '').toString().toLowerCase();
                    }];
                    var orders = [this.state.sortDirection];
                    multiSort.columns.forEach(function (col, i) {
                        iteratees.push(function (row) {
                            return (_get(row, col) || '').toString().toLowerCase();
                        });
                        if (multiSort.orders[i] === 'asc' || multiSort.orders[i] === 'desc') {
                            orders.push(multiSort.orders[i]);
                        } else {
                            orders.push(_this.state.sortDirection);
                        }
                    });

                    data = _orderBy(data, iteratees, orders);
                }
            }
        }

        var currentPage = this.getCurrentPage();

        if (!this.props.useExternal && pageList && this.state.resultsPerPage * (currentPage + 1) <= this.state.resultsPerPage * this.state.maxPage && currentPage >= 0) {
            if (this.isInfiniteScrollEnabled()) {
                // If we're doing infinite scroll, grab all results up to the current page.
                data = first(data, (currentPage + 1) * this.state.resultsPerPage);
            } else {
                //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
                var rest = drop(data, currentPage * this.state.resultsPerPage);
                data = (dropRight || initial)(rest, rest.length - this.state.resultsPerPage);
            }
        }

        var meta = this.columnSettings.getMetadataColumns;

        var transformedData = [];

        for (var i = 0; i < data.length; i++) {
            var mappedData = data[i];

            if (typeof mappedData[that.props.childrenColumnName] !== "undefined" && mappedData[that.props.childrenColumnName].length > 0) {
                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
                mappedData["children"] = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

                if (that.props.childrenColumnName !== "children") {
                    delete mappedData[that.props.childrenColumnName];
                }
            }

            transformedData.push(mappedData);
        }
        return transformedData;
    },
    getCurrentResults: function getCurrentResults(results) {
        return this.state.filteredResults || results || this.props.results;
    },
    getCurrentPage: function getCurrentPage() {
        return this.props.externalCurrentPage || this.state.page;
    },
    getCurrentSort: function getCurrentSort() {
        return this.props.useExternal ? this.props.externalSortColumn : this.state.sortColumn;
    },
    getCurrentSortAscending: function getCurrentSortAscending() {
        return this.props.useExternal ? this.props.externalSortAscending : this.state.sortDirection === 'asc';
    },
    getCurrentMaxPage: function getCurrentMaxPage() {
        return this.props.useExternal ? this.props.externalMaxPage : this.state.maxPage;
    },
    //This takes the props relating to sort and puts them in one object
    getSortObject: function getSortObject() {
        return {
            enableSort: this.props.enableSort,
            changeSort: this.changeSort,
            sortColumn: this.getCurrentSort(),
            sortAscending: this.getCurrentSortAscending(),
            sortDirection: this.state.sortDirection,
            sortAscendingClassName: this.props.sortAscendingClassName,
            sortDescendingClassName: this.props.sortDescendingClassName,
            sortAscendingComponent: this.props.sortAscendingComponent,
            sortDescendingComponent: this.props.sortDescendingComponent,
            sortDefaultComponent: this.props.sortDefaultComponent
        };
    },
    _toggleSelectAll: function _toggleSelectAll() {
        var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true),
            newIsSelectAllChecked = !this.state.isSelectAllChecked,
            newSelectedRowIds = JSON.parse(JSON.stringify(this.state.selectedRowIds));

        var self = this;
        forEach(visibleRows, function (row) {
            self._updateSelectedRowIds(row[self.props.uniqueIdentifier], newSelectedRowIds, newIsSelectAllChecked);
        }, this);

        this.setState({
            isSelectAllChecked: newIsSelectAllChecked,
            selectedRowIds: newSelectedRowIds
        });

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelectedRowIds, newIsSelectAllChecked);
        }
    },
    _toggleSelectRow: function _toggleSelectRow(row, isChecked) {
        var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true),
            newSelectedRowIds = JSON.parse(JSON.stringify(this.state.selectedRowIds));

        this._updateSelectedRowIds(row[this.props.uniqueIdentifier], newSelectedRowIds, isChecked);

        var newIsSelectAllChecked = this._getAreAllRowsChecked(newSelectedRowIds, map(visibleRows, this.props.uniqueIdentifier));

        this.setState({
            isSelectAllChecked: newIsSelectAllChecked,
            selectedRowIds: newSelectedRowIds
        });

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelectedRowIds, newIsSelectAllChecked);
        }
    },
    _updateSelectedRowIds: function _updateSelectedRowIds(id, selectedRowIds, isChecked) {

        var isFound;

        if (isChecked) {
            isFound = find(selectedRowIds, function (item) {
                return id === item;
            });

            if (isFound === undefined) {
                selectedRowIds.push(id);
            }
        } else {
            selectedRowIds.splice(selectedRowIds.indexOf(id), 1);
        }
    },
    _getIsSelectAllChecked: function _getIsSelectAllChecked() {

        return this.state.isSelectAllChecked;
    },
    _getAreAllRowsChecked: function _getAreAllRowsChecked(selectedRowIds, visibleRowIds) {

        return visibleRowIds.length === intersection(visibleRowIds, selectedRowIds).length;
    },
    _getIsRowChecked: function _getIsRowChecked(row) {

        return this.state.selectedRowIds.indexOf(row[this.props.uniqueIdentifier]) > -1 ? true : false;
    },
    getSelectedRowIds: function getSelectedRowIds() {

        return this.state.selectedRowIds;
    },
    _resetSelectedRows: function _resetSelectedRows() {

        this.setState({
            isSelectAllChecked: false,
            selectedRowIds: []
        });
    },
    //This takes the props relating to multiple selection and puts them in one object
    getMultipleSelectionObject: function getMultipleSelectionObject() {

        return {
            isMultipleSelection: find(this.props.results, function (result) {
                return 'children' in result;
            }) ? false : this.props.isMultipleSelection, //does not support subgrids
            toggleSelectAll: this._toggleSelectAll,
            getIsSelectAllChecked: this._getIsSelectAllChecked,
            toggleSelectRow: this._toggleSelectRow,
            getSelectedRowIds: this.getSelectedRowIds,
            getIsRowChecked: this._getIsRowChecked
        };
    },
    isInfiniteScrollEnabled: function isInfiniteScrollEnabled() {
        // If a custom pager is included, don't allow for infinite scrolling.
        if (this.props.useCustomPagerComponent) {
            return false;
        }

        // Otherwise, send back the property.
        return this.props.enableInfiniteScroll;
    },
    getClearFixStyles: function getClearFixStyles() {
        return {
            clear: "both",
            display: "table",
            width: "100%"
        };
    },
    getSettingsStyles: function getSettingsStyles() {
        return {
            "float": "left",
            width: "50%",
            textAlign: "right"
        };
    },
    getFilterStyles: function getFilterStyles() {
        return {
            "float": "left",
            width: "50%",
            textAlign: "left",
            color: "#222",
            minHeight: "1px"
        };
    },
    getFilter: function getFilter() {
        return this.props.showFilter && this.shouldUseCustomGridComponent() === false ? this.props.useCustomFilterComponent ? React.createElement(CustomFilterContainer, { changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText, customFilterComponent: this.props.customFilterComponent, results: this.props.results, currentResults: this.getCurrentResults() }) : React.createElement(GridFilter, { changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText }) : "";
    },
    getSettings: function getSettings() {
        return this.props.showSettings ? React.createElement('button', { type: 'button', className: this.props.settingsToggleClassName, onClick: this.toggleColumnChooser,
            style: this.props.useGriddleStyles ? { background: "none", border: "none", padding: 0, margin: 0, fontSize: 14 } : null }, this.props.settingsText, this.props.settingsIconComponent) : "";
    },
    getTopSection: function getTopSection(filter, settings) {
        if (this.props.showFilter === false && this.props.showSettings === false) {
            return "";
        }

        var filterStyles = null,
            settingsStyles = null,
            topContainerStyles = null;

        if (this.props.useGriddleStyles) {
            filterStyles = this.getFilterStyles();
            settingsStyles = this.getSettingsStyles();

            topContainerStyles = this.getClearFixStyles();
        }

        return React.createElement('div', { className: 'top-section', style: topContainerStyles }, React.createElement('div', { className: 'griddle-filter', style: filterStyles }, filter), React.createElement('div', { className: 'griddle-settings-toggle', style: settingsStyles }, settings));
    },
    getPagingSection: function getPagingSection(currentPage, maxPage) {
        if ((this.props.showPager && !this.isInfiniteScrollEnabled() && !this.shouldUseCustomGridComponent()) === false) {
            return undefined;
        }

        return React.createElement('div', { className: 'griddle-footer' }, this.props.useCustomPagerComponent ? React.createElement(CustomPaginationContainer, { customPagerComponentOptions: this.props.customPagerComponentOptions, next: this.nextPage, previous: this.previousPage, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText, customPagerComponent: this.props.customPagerComponent }) : React.createElement(GridPagination, { useGriddleStyles: this.props.useGriddleStyles, next: this.nextPage, previous: this.previousPage, nextClassName: this.props.nextClassName, nextIconComponent: this.props.nextIconComponent, previousClassName: this.props.previousClassName, previousIconComponent: this.props.previousIconComponent, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText }));
    },
    getColumnSelectorSection: function getColumnSelectorSection(keys, cols) {
        return this.state.showColumnChooser ? React.createElement(GridSettings, { columns: keys, selectedColumns: cols, setColumns: this.setColumns, settingsText: this.props.settingsText,
            settingsIconComponent: this.props.settingsIconComponent, maxRowsText: this.props.maxRowsText, setPageSize: this.setPageSize,
            showSetPageSize: !this.shouldUseCustomGridComponent(), resultsPerPage: this.state.resultsPerPage, enableToggleCustom: this.props.enableToggleCustom,
            toggleCustomComponent: this.toggleCustomComponent, useCustomComponent: this.shouldUseCustomRowComponent() || this.shouldUseCustomGridComponent(),
            useGriddleStyles: this.props.useGriddleStyles, enableCustomFormatText: this.props.enableCustomFormatText, columnMetadata: this.props.columnMetadata }) : "";
    },
    getCustomGridSection: function getCustomGridSection() {
        return React.createElement(this.props.customGridComponent, _extends({ data: this.props.results, className: this.props.customGridComponentClassName }, this.props.gridMetadata));
    },
    getCustomRowSection: function getCustomRowSection(data, cols, meta, pagingContent, globalData) {
        return React.createElement('div', null, React.createElement(CustomRowComponentContainer, { data: data, columns: cols, metadataColumns: meta, globalData: globalData,
            className: this.props.customRowComponentClassName, customComponent: this.props.customRowComponent,
            style: this.props.useGriddleStyles ? this.getClearFixStyles() : null }), this.props.showPager && pagingContent);
    },
    getStandardGridSection: function getStandardGridSection(data, cols, meta, pagingContent, hasMorePages) {
        var sortProperties = this.getSortObject();
        var multipleSelectionProperties = this.getMultipleSelectionObject();

        // no data section
        var showNoData = this.shouldShowNoDataSection(data);
        var noDataSection = this.getNoDataSection();

        return React.createElement('div', { className: 'griddle-body' }, React.createElement(GridTable, { useGriddleStyles: this.props.useGriddleStyles,
            noDataSection: noDataSection,
            showNoData: showNoData,
            columnSettings: this.columnSettings,
            rowSettings: this.rowSettings,
            sortSettings: sortProperties,
            multipleSelectionSettings: multipleSelectionProperties,
            filterByColumn: this.filterByColumn,
            isSubGriddle: this.props.isSubGriddle,
            useGriddleIcons: this.props.useGriddleIcons,
            useFixedLayout: this.props.useFixedLayout,
            showPager: this.props.showPager,
            pagingContent: pagingContent,
            data: data,
            className: this.props.tableClassName,
            enableInfiniteScroll: this.isInfiniteScrollEnabled(),
            nextPage: this.nextPage,
            showTableHeading: this.props.showTableHeading,
            useFixedHeader: this.props.useFixedHeader,
            parentRowCollapsedClassName: this.props.parentRowCollapsedClassName,
            parentRowExpandedClassName: this.props.parentRowExpandedClassName,
            parentRowCollapsedComponent: this.props.parentRowCollapsedComponent,
            parentRowExpandedComponent: this.props.parentRowExpandedComponent,
            bodyHeight: this.props.bodyHeight,
            paddingHeight: this.props.paddingHeight,
            rowHeight: this.props.rowHeight,
            infiniteScrollLoadTreshold: this.props.infiniteScrollLoadTreshold,
            externalLoadingComponent: this.props.externalLoadingComponent,
            externalIsLoading: this.props.externalIsLoading,
            hasMorePages: hasMorePages,
            onRowClick: this.props.onRowClick }));
    },
    getContentSection: function getContentSection(data, cols, meta, pagingContent, hasMorePages, globalData) {
        if (this.shouldUseCustomGridComponent() && this.props.customGridComponent !== null) {
            return this.getCustomGridSection();
        } else if (this.shouldUseCustomRowComponent()) {
            return this.getCustomRowSection(data, cols, meta, pagingContent, globalData);
        } else {
            return this.getStandardGridSection(data, cols, meta, pagingContent, hasMorePages);
        }
    },
    getNoDataSection: function getNoDataSection() {
        if (this.props.customNoDataComponent != null) {
            return React.createElement('div', { className: this.props.noDataClassName }, React.createElement(this.props.customNoDataComponent, this.props.customNoDataComponentProps));
        }
        return React.createElement(GridNoData, { noDataMessage: this.props.noDataMessage });
    },
    shouldShowNoDataSection: function shouldShowNoDataSection(results) {
        if (this.props.allowEmptyGrid) {
            return false;
        }

        return this.props.useExternal === false && (typeof results === 'undefined' || results.length === 0) || this.props.useExternal === true && this.props.externalIsLoading === false && results.length === 0;
    },
    render: function render() {
        var that = this,
            results = this.getCurrentResults(); // Attempt to assign to the filtered results, if we have any.

        var headerTableClassName = this.props.tableClassName + " table-header";

        //figure out if we want to show the filter section
        var filter = this.getFilter();
        var settings = this.getSettings();

        //if we have neither filter or settings don't need to render this stuff
        var topSection = this.getTopSection(filter, settings);

        var keys = [];
        var cols = this.columnSettings.getColumns();
        //figure out which columns are displayed and show only those
        var data = this.getDataForRender(results, cols, true);

        var meta = this.columnSettings.getMetadataColumns();

        if (this.props.columnMetadata) {
            // Get column keys from column metadata
            forEach(this.props.columnMetadata, function (meta) {
                if (!(typeof meta.visible === 'boolean' && meta.visible === false)) {
                    keys.push(meta.columnName);
                }
            });
        } else {
            // Grab the column keys from the first results
            keys = deep.keys(omit(results[0], meta));
        }

        // sort keys by order
        keys = this.columnSettings.orderColumns(keys);

        // Grab the current and max page values.
        var currentPage = this.getCurrentPage();
        var maxPage = this.getCurrentMaxPage();

        // Determine if we need to enable infinite scrolling on the table.
        var hasMorePages = currentPage + 1 < maxPage;

        // Grab the paging content if it's to be displayed
        var pagingContent = this.getPagingSection(currentPage, maxPage);

        var resultContent = this.getContentSection(data, cols, meta, pagingContent, hasMorePages, this.props.globalData);

        var columnSelector = this.getColumnSelectorSection(keys, cols);

        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
        //add custom to the class name so we can style it differently
        gridClassName += this.shouldUseCustomRowComponent() ? " griddle-custom" : "";

        return React.createElement('div', { className: gridClassName }, topSection, columnSelector, React.createElement('div', { className: 'griddle-container', style: this.props.useGriddleStyles && !this.props.isSubGriddle ? { border: "1px solid #DDD" } : null }, resultContent));
    }
});

GridRowContainer.Griddle = module.exports = Griddle;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _uniqueId = __webpack_require__(337);

var RowProperties = (function () {
  function RowProperties() {
    var rowMetadata = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var rowComponent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var isCustom = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, RowProperties);

    this.rowMetadata = rowMetadata;
    this.rowComponent = rowComponent;
    this.isCustom = isCustom;
    // assign unique Id to each griddle instance
  }

  _createClass(RowProperties, [{
    key: 'getRowKey',
    value: function getRowKey(row, key) {
      var uniqueId;

      if (this.hasRowMetadataKey()) {
        uniqueId = row[this.rowMetadata.key];
      } else {
        uniqueId = _uniqueId("grid_row");
      }

      //todo: add error handling

      return uniqueId;
    }
  }, {
    key: 'hasRowMetadataKey',
    value: function hasRowMetadataKey() {
      return this.hasRowMetadata() && this.rowMetadata.key !== null && this.rowMetadata.key !== undefined;
    }
  }, {
    key: 'getBodyRowMetadataClass',
    value: function getBodyRowMetadataClass(rowData) {
      if (this.hasRowMetadata() && this.rowMetadata.bodyCssClassName !== null && this.rowMetadata.bodyCssClassName !== undefined) {
        if (typeof this.rowMetadata.bodyCssClassName === 'function') {
          return this.rowMetadata.bodyCssClassName(rowData);
        } else {
          return this.rowMetadata.bodyCssClassName;
        }
      }
      return null;
    }
  }, {
    key: 'getHeaderRowMetadataClass',
    value: function getHeaderRowMetadataClass() {
      return this.hasRowMetadata() && this.rowMetadata.headerCssClassName !== null && this.rowMetadata.headerCssClassName !== undefined ? this.rowMetadata.headerCssClassName : null;
    }
  }, {
    key: 'hasRowMetadata',
    value: function hasRowMetadata() {
      return this.rowMetadata !== null;
    }
  }]);

  return RowProperties;
})();

module.exports = RowProperties;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(10);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 100 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 101 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),
/* 102 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(112);

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),
/* 104 */
/***/ (function(module, exports) {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(241),
    isArguments = __webpack_require__(49),
    isArray = __webpack_require__(2),
    isBuffer = __webpack_require__(50),
    isIndex = __webpack_require__(46),
    isTypedArray = __webpack_require__(75);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 106 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(120);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(61),
    arrayIncludes = __webpack_require__(103),
    arrayIncludesWith = __webpack_require__(104),
    arrayMap = __webpack_require__(9),
    baseUnary = __webpack_require__(43),
    cacheHas = __webpack_require__(66);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;


/***/ }),
/* 109 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(222),
    keys = __webpack_require__(13);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(63),
    isArray = __webpack_require__(2);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(109),
    baseIsNaN = __webpack_require__(228),
    strictIndexOf = __webpack_require__(308);

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(226),
    isObjectLike = __webpack_require__(15);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(31),
    nativeKeys = __webpack_require__(294);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(64),
    isArrayLike = __webpack_require__(11);

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(9),
    baseIteratee = __webpack_require__(29),
    baseMap = __webpack_require__(115),
    baseSortBy = __webpack_require__(240),
    baseUnary = __webpack_require__(43),
    compareMultiple = __webpack_require__(256),
    identity = __webpack_require__(33);

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(33);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),
/* 118 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(23),
    isIterateeCall = __webpack_require__(127);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(19);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(61),
    arraySome = __webpack_require__(216),
    cacheHas = __webpack_require__(66);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var flatten = __webpack_require__(316),
    overRest = __webpack_require__(131),
    setToString = __webpack_require__(133);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(78)))

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(111),
    getSymbols = __webpack_require__(69),
    keys = __webpack_require__(13);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(111),
    getSymbolsIn = __webpack_require__(126),
    keysIn = __webpack_require__(76);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(63),
    getPrototype = __webpack_require__(68),
    getSymbols = __webpack_require__(69),
    stubArray = __webpack_require__(143);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(32),
    isArrayLike = __webpack_require__(11),
    isIndex = __webpack_require__(46),
    isObject = __webpack_require__(12);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),
/* 129 */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),
/* 130 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(100);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 132 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(239),
    shortOut = __webpack_require__(302);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(293);

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 135 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(102),
    baseFilter = __webpack_require__(221),
    baseIteratee = __webpack_require__(29),
    isArray = __webpack_require__(2);

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(101),
    baseEach = __webpack_require__(64),
    castFunction = __webpack_require__(117),
    isArray = __webpack_require__(2);

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(42);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(223),
    hasPath = __webpack_require__(271);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    getPrototype = __webpack_require__(68),
    isObjectLike = __webpack_require__(15);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(9),
    baseIteratee = __webpack_require__(29),
    baseMap = __webpack_require__(115),
    isArray = __webpack_require__(2);

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(236),
    basePropertyDeep = __webpack_require__(237),
    isKey = __webpack_require__(70),
    toKey = __webpack_require__(20);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),
/* 143 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(108),
    baseRest = __webpack_require__(23),
    isArrayLikeObject = __webpack_require__(73);

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

module.exports = without;


/***/ }),
/* 145 */
/***/ (function(module, exports) {

module.exports = Backend;

/***/ }),
/* 146 */
/***/ (function(module, exports) {

module.exports = Badge;

/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports = Config;

/***/ }),
/* 148 */
/***/ (function(module, exports) {

module.exports = ReactAddonsTestUtils;

/***/ }),
/* 149 */
/***/ (function(module, exports) {

module.exports = ReactDNDHtml5Backend;

/***/ }),
/* 150 */
/***/ (function(module, exports) {

module.exports = ReduxForm;

/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = getFormState;

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Config = __webpack_require__(147);

var _Config2 = _interopRequireDefault(_Config);

var _ReactRouteRegister = __webpack_require__(348);

var _ReactRouteRegister2 = _interopRequireDefault(_ReactRouteRegister);

var _AssetAdminRouter = __webpack_require__(85);

var _AssetAdminRouter2 = _interopRequireDefault(_AssetAdminRouter);

var _applyTransform = __webpack_require__(158);

var _applyTransform2 = _interopRequireDefault(_applyTransform);

var _registerReducers = __webpack_require__(160);

var _registerReducers2 = _interopRequireDefault(_registerReducers);

var _registerComponents = __webpack_require__(159);

var _registerComponents2 = _interopRequireDefault(_registerComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  (0, _registerComponents2.default)();

  (0, _applyTransform2.default)();

  var sectionConfig = _Config2.default.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin');

  _ReactRouteRegister2.default.add({
    path: sectionConfig.url,
    component: _AssetAdminRouter2.default,
    indexRoute: { component: _AssetAdminRouter2.default },
    childRoutes: [{
      path: 'show/:folderId/:viewAction/:fileId',
      component: _AssetAdminRouter2.default
    }, {
      path: 'show/:folderId/:viewAction',
      component: _AssetAdminRouter2.default
    }, {
      path: 'show/:folderId',
      component: _AssetAdminRouter2.default
    }]
  });

  (0, _registerReducers2.default)();
});

/***/ }),
/* 153 */,
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jquery = __webpack_require__(7);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactApollo = __webpack_require__(3);

var _schemaFieldValues = __webpack_require__(354);

var _UploadField = __webpack_require__(83);

var _Injector = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InjectableUploadField = (0, _Injector.provideInjector)(_UploadField.ConnectedUploadField);

_jquery2.default.entwine('ss', function ($) {
  $('.js-react-boot input.entwine-uploadfield:visible').entwine({
    onunmatch: function onunmatch() {
      this._super();

      _reactDom2.default.unmountComponentAtNode(this[0]);
    },
    onmatch: function onmatch() {
      this._super();
      this.refresh();
    },
    refresh: function refresh() {
      var store = window.ss.store;
      var client = window.ss.apolloClient;
      var props = this.getAttributes();
      var form = $(this).closest('form');
      var onChange = function onChange() {
        setTimeout(function () {
          form.trigger('change');
        }, 0);
      };

      _reactDom2.default.render(_react2.default.createElement(
        _reactApollo.ApolloProvider,
        { store: store, client: client },
        _react2.default.createElement(InjectableUploadField, _extends({}, props, { onChange: onChange }))
      ), this.parent()[0]);
    },
    getAttributes: function getAttributes() {
      var state = $(this).data('state');
      var schema = $(this).data('schema');
      return (0, _schemaFieldValues.schemaMerge)(schema, state);
    }
  });
});

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["InsertEmbedModal"] = __webpack_require__(195);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(78)))

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["InsertMediaModal"] = __webpack_require__(196);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(78)))

/***/ }),
/* 157 */,
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _Injector = __webpack_require__(6);

var _Injector2 = _interopRequireDefault(_Injector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var insertTransform = function insertTransform(form) {
  var schema = form.getState();

  var schemaName = schema.schema.name;
  if (schemaName !== 'fileInsertForm') {
    return schema;
  }
  var overrides = schema.stateOverride && schema.stateOverride.fields;
  var customTitle = overrides && overrides.length > 0 ? _i18n2.default._t('AssetAdmin.UPDATE_FILE', 'Update file') : _i18n2.default._t('AssetAdmin.INSERT_FILE', 'Insert file');

  if (form.getFieldByName('UnembedableMessage')) {
    customTitle = _i18n2.default._t('AssetAdmin.INSERT_LINK', 'Insert link');
  }

  form.mutateField('action_insert', function (field) {
    return _extends({}, field, {
      title: customTitle || field.title
    });
  });

  return form.getState();
};

var applyTransform = function applyTransform() {
  _Injector2.default.transform('insert-media-modal', function (updater) {
    updater.form.alterSchema('AssetAdmin.EditForm', insertTransform);
  });
};

exports.default = applyTransform;

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Injector = __webpack_require__(6);

var _Injector2 = _interopRequireDefault(_Injector);

var _UploadField = __webpack_require__(83);

var _UploadField2 = _interopRequireDefault(_UploadField);

var _PreviewImageField = __webpack_require__(166);

var _PreviewImageField2 = _interopRequireDefault(_PreviewImageField);

var _ProportionConstraintField = __webpack_require__(167);

var _ProportionConstraintField2 = _interopRequireDefault(_ProportionConstraintField);

var _HistoryList = __webpack_require__(174);

var _HistoryList2 = _interopRequireDefault(_HistoryList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registerComponents = function registerComponents() {
  _Injector2.default.component.register('UploadField', _UploadField2.default);
  _Injector2.default.component.register('PreviewImageField', _PreviewImageField2.default);
  _Injector2.default.component.register('HistoryList', _HistoryList2.default);
  _Injector2.default.component.register('ProportionConstraintField', _ProportionConstraintField2.default);
};

exports.default = registerComponents;

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Injector = __webpack_require__(6);

var _Injector2 = _interopRequireDefault(_Injector);

var _redux = __webpack_require__(8);

var _GalleryReducer = __webpack_require__(185);

var _GalleryReducer2 = _interopRequireDefault(_GalleryReducer);

var _QueuedFilesReducer = __webpack_require__(192);

var _QueuedFilesReducer2 = _interopRequireDefault(_QueuedFilesReducer);

var _UploadFieldReducer = __webpack_require__(194);

var _UploadFieldReducer2 = _interopRequireDefault(_UploadFieldReducer);

var _PreviewFieldReducer = __webpack_require__(191);

var _PreviewFieldReducer2 = _interopRequireDefault(_PreviewFieldReducer);

var _ImageLoadReducer = __webpack_require__(189);

var _ImageLoadReducer2 = _interopRequireDefault(_ImageLoadReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registerReducers = function registerReducers() {
  _Injector2.default.reducer.register('assetAdmin', (0, _redux.combineReducers)({
    gallery: _GalleryReducer2.default,
    queuedFiles: _QueuedFilesReducer2.default,
    uploadField: _UploadFieldReducer2.default,
    previewField: _PreviewFieldReducer2.default,
    imageLoad: _ImageLoadReducer2.default
  }));
};

exports.default = registerReducers;

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(156);
__webpack_require__(155);

__webpack_require__(152);
__webpack_require__(154);

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BackButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _droppable = __webpack_require__(81);

var _droppable2 = _interopRequireDefault(_droppable);

var _Badge = __webpack_require__(146);

var _Badge2 = _interopRequireDefault(_Badge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BackButton = function (_Component) {
  _inherits(BackButton, _Component);

  function BackButton() {
    _classCallCheck(this, BackButton);

    return _possibleConstructorReturn(this, (BackButton.__proto__ || Object.getPrototypeOf(BackButton)).apply(this, arguments));
  }

  _createClass(BackButton, [{
    key: 'render',
    value: function render() {
      var classList = ['btn', 'btn-secondary', 'btn--no-text', 'font-icon-level-up', 'btn--icon-large', 'gallery__back'];

      if (this.props.enlarged) {
        classList.push('z-depth-1');
        classList.push('gallery__back--droppable-hover');
      }

      var badge = this.props.badge;

      return _react2.default.createElement(
        'button',
        {
          className: classList.join(' '),
          title: 'Navigate up a level',
          onClick: this.props.onClick
        },
        !!badge && _react2.default.createElement(_Badge2.default, {
          className: 'gallery__back-badge',
          status: badge.status,
          message: badge.message
        })
      );
    }
  }]);

  return BackButton;
}(_react.Component);

BackButton.propTypes = {
  onClick: _react.PropTypes.func,
  enlarged: _react.PropTypes.bool,
  badge: _react.PropTypes.shape(_Badge2.default.propTypes)
};

exports.BackButton = BackButton;
exports.default = (0, _droppable2.default)('GalleryItem')(BackButton);

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulkActions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(7);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactAddonsTestUtils = __webpack_require__(148);

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _reactRedux = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BulkActions = exports.BulkActions = function (_SilverStripeComponen) {
  _inherits(BulkActions, _SilverStripeComponen);

  function BulkActions(props) {
    _classCallCheck(this, BulkActions);

    var _this = _possibleConstructorReturn(this, (BulkActions.__proto__ || Object.getPrototypeOf(BulkActions)).call(this, props));

    _this.onChangeValue = _this.onChangeValue.bind(_this);
    return _this;
  }

  _createClass(BulkActions, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var $select = (0, _jquery2.default)(_reactDom2.default.findDOMNode(this)).find('.dropdown');

      $select.chosen({
        allow_single_deselect: true,
        disable_search_threshold: 20
      });

      $select.change(function () {
        return _reactAddonsTestUtils2.default.Simulate.click($select.find(':selected')[0]);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var children = this.props.actions.map(function (action, i) {
        var canApply = _this2.props.items.length && (!action.canApply || action.canApply(_this2.props.items));
        if (!canApply) {
          return '';
        }

        var className = ['bulk-actions__action', 'ss-ui-button', 'ui-corner-all', action.className || 'font-icon-info-circled'].join(' ');
        return _react2.default.createElement(
          'button',
          {
            type: 'button',
            className: className,
            key: i,
            onClick: _this2.onChangeValue,
            value: action.value
          },
          action.label
        );
      });

      return _react2.default.createElement(
        'div',
        { className: 'bulk-actions fieldholder-small' },
        _react2.default.createElement(
          'div',
          { className: 'bulk-actions-counter' },
          this.props.items.length
        ),
        children
      );
    }
  }, {
    key: 'getOptionByValue',
    value: function getOptionByValue(value) {
      return this.props.actions.find(function (action) {
        return action.value === value;
      });
    }
  }, {
    key: 'onChangeValue',
    value: function onChangeValue(event) {
      var _this3 = this;

      var promise = null;

      var option = this.getOptionByValue(event.target.value);
      if (option === null) {
        return null;
      }

      if (typeof option.confirm === 'function') {
        promise = option.confirm(this.props.items).then(function () {
          return option.callback(_this3.props.items);
        }).catch(function (reason) {
          if (reason !== 'cancelled') {
            throw reason;
          }
        });
      } else {
        promise = option.callback(this.props.items) || Promise.resolve();
      }

      (0, _jquery2.default)(_reactDom2.default.findDOMNode(this)).find('.dropdown').val('').trigger('liszt:updated');

      return promise;
    }
  }]);

  return BulkActions;
}(_SilverStripeComponent2.default);

BulkActions.propTypes = {
  items: _react2.default.PropTypes.array,
  actions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    value: _react2.default.PropTypes.string.isRequired,
    label: _react2.default.PropTypes.string.isRequired,
    className: _react2.default.PropTypes.string,
    destructive: _react2.default.PropTypes.bool,
    callback: _react2.default.PropTypes.func,
    canApply: _react2.default.PropTypes.func,
    confirm: _react2.default.PropTypes.func
  }))
};

function mapStateToProps(state) {
  return {
    gallery: state.assetAdmin.gallery
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(BulkActions);

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDnd = __webpack_require__(54);

var _GalleryItem = __webpack_require__(80);

var _GalleryItem2 = _interopRequireDefault(_GalleryItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GalleryItemDragLayer = function (_Component) {
  _inherits(GalleryItemDragLayer, _Component);

  function GalleryItemDragLayer() {
    _classCallCheck(this, GalleryItemDragLayer);

    return _possibleConstructorReturn(this, (GalleryItemDragLayer.__proto__ || Object.getPrototypeOf(GalleryItemDragLayer)).apply(this, arguments));
  }

  _createClass(GalleryItemDragLayer, [{
    key: 'getOffset',
    value: function getOffset() {
      var offset = this.props.offset;
      return {
        transform: offset && 'translate(' + offset.x + 'px, ' + offset.y + 'px)'
      };
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.isDragging) {
        return null;
      }
      var item = this.props.item;
      if (!item.selected) {
        return null;
      }
      var selected = item.selected.length;

      return _react2.default.createElement(
        'div',
        { className: 'gallery-item__drag-layer' },
        _react2.default.createElement(
          'div',
          { className: 'gallery-item__drag-layer-item', style: this.getOffset() },
          selected > 1 && [_react2.default.createElement('div', { key: '1', className: 'gallery-item__drag-shadow' }), _react2.default.createElement('div', { key: '2', className: 'gallery-item__drag-shadow gallery-item__drag-shadow--second' }), _react2.default.createElement('div', { key: '3', className: 'gallery-item__drag-shadow gallery-item__drag-shadow--third' })],
          _react2.default.createElement(_GalleryItem2.default, item.props),
          selected > 1 && _react2.default.createElement(
            'span',
            { className: 'gallery-item__drag-layer-count label label-primary label-pill' },
            selected
          )
        )
      );
    }
  }]);

  return GalleryItemDragLayer;
}(_react.Component);

GalleryItemDragLayer.propTypes = {
  item: _react.PropTypes.object,
  offset: _react.PropTypes.shape({
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired
  }),
  isDragging: _react.PropTypes.bool.isRequired
};

var collect = function collect(monitor) {
  return {
    item: monitor.getItem(),
    offset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
};

exports.default = (0, _reactDnd.DragLayer)(collect)(GalleryItemDragLayer);

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = draggable;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDnd = __webpack_require__(54);

var _reactDndHtml5Backend = __webpack_require__(149);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function draggable(type) {
  var spec = {
    beginDrag: function beginDrag(props) {
      if (typeof props.onDrag === 'function') {
        props.onDrag(true);
      }
      var selected = props.selectedFiles.concat([]);
      if (selected.length === 0) {
        selected.push(props.item.id);
      }

      return { selected: selected, props: props };
    },
    endDrag: function endDrag(props) {
      if (typeof props.onDrag === 'function') {
        props.onDrag(false);
      }
    }
  };

  var collect = function collect(connect, monitor) {
    return {
      connectDragPreview: connect.dragPreview(),
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  };

  var dragItem = (0, _reactDnd.DragSource)(type, spec, collect);

  return function (Item) {
    var DraggableItem = function (_Component) {
      _inherits(DraggableItem, _Component);

      function DraggableItem() {
        _classCallCheck(this, DraggableItem);

        return _possibleConstructorReturn(this, (DraggableItem.__proto__ || Object.getPrototypeOf(DraggableItem)).apply(this, arguments));
      }

      _createClass(DraggableItem, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.props.connectDragPreview((0, _reactDndHtml5Backend.getEmptyImage)(), {
            captureDraggingState: true
          });
        }
      }, {
        key: 'render',
        value: function render() {
          var connectDragSource = this.props.connectDragSource;

          var item = _react2.default.createElement(Item, this.props);

          if (typeof item.type === 'string') {
            return connectDragSource(item);
          }
          return connectDragSource(_react2.default.createElement(
            'div',
            { className: 'gallery-item__draggable' },
            item
          ));
        }
      }]);

      return DraggableItem;
    }(_react.Component);

    DraggableItem.propTypes = {
      connectDragSource: _react.PropTypes.func.isRequired,
      connectDragPreview: _react.PropTypes.func.isRequired,
      item: _react.PropTypes.shape({
        id: _react.PropTypes.number.isRequired
      }).isRequired,
      onDrag: _react.PropTypes.func,
      selectedFiles: _react.PropTypes.arrayOf(_react.PropTypes.number)
    };

    return dragItem(DraggableItem);
  };
}

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PreviewImageField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _AssetDropzone = __webpack_require__(56);

var _AssetDropzone2 = _interopRequireDefault(_AssetDropzone);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _reactRedux = __webpack_require__(4);

var _redux = __webpack_require__(8);

var _reduxForm = __webpack_require__(150);

var _PreviewFieldActions = __webpack_require__(190);

var previewFieldActions = _interopRequireWildcard(_PreviewFieldActions);

var _DataFormat = __webpack_require__(35);

var _getFormState = __webpack_require__(151);

var _getFormState2 = _interopRequireDefault(_getFormState);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PreviewImageField = function (_Component) {
  _inherits(PreviewImageField, _Component);

  function PreviewImageField(props) {
    _classCallCheck(this, PreviewImageField);

    var _this = _possibleConstructorReturn(this, (PreviewImageField.__proto__ || Object.getPrototypeOf(PreviewImageField)).call(this, props));

    _this.handleAddedFile = _this.handleAddedFile.bind(_this);
    _this.handleFailedUpload = _this.handleFailedUpload.bind(_this);
    _this.handleSuccessfulUpload = _this.handleSuccessfulUpload.bind(_this);
    _this.handleSending = _this.handleSending.bind(_this);
    _this.handleUploadProgress = _this.handleUploadProgress.bind(_this);
    _this.handleCancelUpload = _this.handleCancelUpload.bind(_this);
    _this.handleRemoveErroredUpload = _this.handleRemoveErroredUpload.bind(_this);
    _this.canFileUpload = _this.canFileUpload.bind(_this);
    _this.updateFormData = _this.updateFormData.bind(_this);
    return _this;
  }

  _createClass(PreviewImageField, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.data.url && nextProps.data.url !== this.props.data.url || this.props.data.version && nextProps.data.version !== this.props.data.version) {
        this.props.actions.previewField.removeFile(this.props.id);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.actions.previewField.removeFile(this.props.id);
    }
  }, {
    key: 'getDropzoneProps',
    value: function getDropzoneProps() {
      var endpoint = this.props.data.uploadFileEndpoint;
      var name = this.props.name;
      var options = {
        url: endpoint && endpoint.url,
        method: endpoint && endpoint.method,
        paramName: 'Upload',
        clickable: '#preview-replace-button',
        maxFiles: 1
      };
      var preview = {
        height: _index2.default.THUMBNAIL_HEIGHT,
        width: _index2.default.THUMBNAIL_WIDTH
      };
      var securityID = this.props.securityID;

      var classNames = ['asset-dropzone--button', 'preview-image-field__container', this.props.className, this.props.extraClass];

      return {
        name: name,
        className: classNames.join(' '),
        canUpload: endpoint && this.canEdit(),
        preview: preview,
        folderId: this.props.data.parentid,
        options: options,
        securityID: securityID,
        uploadButton: false,
        handleAddedFile: this.handleAddedFile,
        handleError: this.handleFailedUpload,
        handleSuccess: this.handleSuccessfulUpload,
        handleSending: this.handleSending,
        handleUploadProgress: this.handleUploadProgress,
        canFileUpload: this.canFileUpload,
        updateFormData: this.updateFormData
      };
    }
  }, {
    key: 'canEdit',
    value: function canEdit() {
      return !this.props.readOnly && !this.props.disabled && this.props.data.category !== 'folder';
    }
  }, {
    key: 'preventDefault',
    value: function preventDefault(e) {
      e.preventDefault();
    }
  }, {
    key: 'canFileUpload',
    value: function canFileUpload(file) {
      var prevName = this.props.data.initialValues.FileFilename;
      var prevExt = (0, _DataFormat.getFileExtension)(prevName);
      var nextExt = (0, _DataFormat.getFileExtension)(file.name);

      if (!prevExt || prevExt === nextExt) {
        return true;
      }

      var message = _i18n2.default._t('AssetAdmin.CONFIRM_CHANGE_EXTENSION', 'Are you sure you want upload a file with a different extension?');

      return this.props.confirm(message);
    }
  }, {
    key: 'handleCancelUpload',
    value: function handleCancelUpload() {
      if (this.props.upload.xhr) {
        this.props.upload.xhr.abort();
      }
      this.handleRemoveErroredUpload();
    }
  }, {
    key: 'handleRemoveErroredUpload',
    value: function handleRemoveErroredUpload() {
      if (typeof this.props.onAutofill === 'function') {
        var initial = this.props.data.initialValues;

        this.props.onAutofill('FileFilename', initial.FileFilename);
        this.props.onAutofill('FileHash', initial.FileHash);
        this.props.onAutofill('FileVariant', initial.FileVariant);
      }

      this.props.actions.previewField.removeFile(this.props.id);
    }
  }, {
    key: 'handleAddedFile',
    value: function handleAddedFile(data) {
      this.props.actions.previewField.addFile(this.props.id, data);
    }
  }, {
    key: 'handleFailedUpload',
    value: function handleFailedUpload(file, response) {
      this.props.actions.previewField.failUpload(this.props.id, response);
    }
  }, {
    key: 'handleSuccessfulUpload',
    value: function handleSuccessfulUpload(fileXhr) {
      var json = JSON.parse(fileXhr.xhr.response);

      if (typeof this.props.onAutofill === 'function') {
        this.props.onAutofill('FileFilename', json.Filename);
        this.props.onAutofill('FileHash', json.Hash);
        this.props.onAutofill('FileVariant', json.Variant);

        if (json.Name) {
          this.props.onAutofill(this.props.data.nameField, json.Name);
        }
      }
    }
  }, {
    key: 'handleSending',
    value: function handleSending(file, xhr) {
      this.props.actions.previewField.updateFile(this.props.id, { xhr: xhr });
    }
  }, {
    key: 'updateFormData',
    value: function updateFormData(formData) {
      formData.append('ID', this.props.data.id);
      formData.append('Name', this.props.nameValue);
    }
  }, {
    key: 'handleUploadProgress',
    value: function handleUploadProgress(file, progress) {
      this.props.actions.previewField.updateFile(this.props.id, { progress: progress });
    }
  }, {
    key: 'renderImage',
    value: function renderImage() {
      var data = this.props.data;

      if (!data.mock && !data.exists && !this.props.upload.url) {
        return _react2.default.createElement(
          'div',
          { className: 'editor__file-preview-message--file-missing' },
          _i18n2.default._t('AssetAdmin.FILE_MISSING', 'File cannot be found')
        );
      }

      var category = this.props.upload.category;
      var preview = category && category !== 'image' ? _index2.default.DEFAULT_PREVIEW : this.props.upload.url || data.preview || data.url;
      var image = _react2.default.createElement('img', { alt: 'preview', src: preview, className: 'editor__thumbnail' });
      var progress = this.props.upload.progress;
      var linkedImage = data.url && !progress ? _react2.default.createElement(
        'a',
        { className: 'editor__file-preview-link', href: data.url, target: '_blank' },
        image
      ) : null;
      var progressBar = progress > 0 && progress < 100 ? _react2.default.createElement(
        'div',
        { className: 'preview-image-field__progress' },
        _react2.default.createElement('div', { className: 'preview-image-field__progress-bar', style: { width: progress + '%' } })
      ) : null;
      var message = this.props.upload.message;
      var messageBox = null;

      if (message) {
        messageBox = _react2.default.createElement(
          'div',
          { className: 'preview-image-field__message preview-image-field__message--' + message.type },
          message.value
        );
      } else if (progress === 100) {
        messageBox = _react2.default.createElement(
          'div',
          { className: 'preview-image-field__message preview-image-field__message--success' },
          _i18n2.default._t('AssetAdmin.REPlACE_FILE_SUCCESS', 'Upload successful, the file will be replaced when you Save.')
        );
      }

      return _react2.default.createElement(
        'div',
        { className: 'editor__thumbnail-container' },
        linkedImage || image,
        progressBar,
        messageBox
      );
    }
  }, {
    key: 'renderToolbar',
    value: function renderToolbar() {
      var canEdit = this.canEdit();
      if (!this.props.data.url && !canEdit) {
        return null;
      }
      return _react2.default.createElement(
        'div',
        { className: 'preview-image-field__toolbar fill-height' },
        this.props.data.url ? _react2.default.createElement(
          'a',
          {
            href: this.props.data.url,
            target: '_blank',
            className: 'preview-image-field__toolbar-button--link preview-image-field__toolbar-button'
          },
          'Open'
        ) : null,
        canEdit ? _react2.default.createElement(
          'button',
          {
            id: 'preview-replace-button',
            onClick: this.preventDefault,
            className: 'preview-image-field__toolbar-button--replace preview-image-field__toolbar-button'
          },
          'Replace'
        ) : null,
        this.props.upload.progress || this.props.upload.message ? _react2.default.createElement(
          'button',
          {
            onClick: this.handleCancelUpload,
            className: 'preview-image-field__toolbar-button--remove preview-image-field__toolbar-button'
          },
          'Remove'
        ) : null
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var dropzoneProps = this.getDropzoneProps();

      if (this.canEdit()) {
        return _react2.default.createElement(
          _AssetDropzone2.default,
          dropzoneProps,
          this.renderImage(),
          this.renderToolbar()
        );
      }
      var classNames = ['preview-image-field__container', this.props.className, this.props.extraClass];

      return _react2.default.createElement(
        'div',
        { className: classNames.join(' ') },
        this.renderImage(),
        this.renderToolbar()
      );
    }
  }]);

  return PreviewImageField;
}(_react.Component);

PreviewImageField.propTypes = {
  id: _react.PropTypes.string.isRequired,
  name: _react.PropTypes.string,
  className: _react.PropTypes.string,
  extraClass: _react.PropTypes.string,
  readOnly: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,
  onAutofill: _react.PropTypes.func,
  formid: _react.PropTypes.string,
  nameValue: _react.PropTypes.string,
  data: _react.PropTypes.shape({
    id: _react.PropTypes.number,
    parentid: _react.PropTypes.number,
    version: _react.PropTypes.number,
    url: _react.PropTypes.string,
    mock: _react.PropTypes.bool,
    exists: _react.PropTypes.bool,
    preview: _react.PropTypes.string,
    category: _react.PropTypes.string,
    nameField: _react.PropTypes.string,
    uploadFileEndpoint: _react.PropTypes.shape({
      url: _react.PropTypes.string.isRequired,
      method: _react.PropTypes.string.isRequired,
      payloadFormat: _react.PropTypes.string
    }),
    initialValues: _react.PropTypes.object
  }).isRequired,
  upload: _react.PropTypes.shape({
    url: _react.PropTypes.string,
    progress: _react.PropTypes.number,
    xhr: _react.PropTypes.object,
    category: _react.PropTypes.string,
    message: _react.PropTypes.shape({
      type: _react.PropTypes.string.isRequired,
      value: _react.PropTypes.string.isRequired
    })
  }),
  actions: _react.PropTypes.object,
  securityID: _react.PropTypes.string,
  confirm: _react.PropTypes.func
};

PreviewImageField.defaultProps = {
  extraClass: '',
  className: '',
  data: {},
  upload: {},

  confirm: function confirm(msg) {
    return window.confirm(msg);
  }
};

function mapStateToProps(state, ownProps) {
  var securityID = state.config.SecurityID;
  var id = ownProps.id;
  var upload = state.assetAdmin.previewField[id] || {};
  var selector = (0, _reduxForm.formValueSelector)(ownProps.formid, _getFormState2.default);

  return {
    securityID: securityID,
    upload: upload,
    nameValue: selector(state, 'Name')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      previewField: (0, _redux.bindActionCreators)(previewFieldActions, dispatch)
    }
  };
}

exports.PreviewImageField = PreviewImageField;
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(PreviewImageField);

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProportionConstraintField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Injector = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProportionConstraintField = function (_Component) {
  _inherits(ProportionConstraintField, _Component);

  function ProportionConstraintField(props) {
    _classCallCheck(this, ProportionConstraintField);

    var _this = _possibleConstructorReturn(this, (ProportionConstraintField.__proto__ || Object.getPrototypeOf(ProportionConstraintField)).call(this, props));

    var childrenArray = _react.Children.toArray(props.children);

    if (childrenArray.length !== 2) {
      throw new Error('ProportionConstraintField must be passed two children -- one field for each value');
    }
    return _this;
  }

  _createClass(ProportionConstraintField, [{
    key: 'handleChange',
    value: function handleChange(childIndex, e) {
      var _props = this.props,
          children = _props.children,
          active = _props.active,
          onAutofill = _props.onAutofill,
          ratio = _props.data.ratio;

      var value = e.target.value;
      var peerIndex = childIndex === 0 ? 1 : 0;
      var currentName = children[childIndex].props.name;
      var peerName = children[peerIndex].props.name;
      var multiplier = childIndex === 0 ? 1 / ratio : ratio;
      var round = Math.round;


      onAutofill(currentName, value);

      if (active) {
        onAutofill(peerName, round(value * multiplier));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var FieldGroup = this.props.FieldGroup;

      return _react2.default.createElement(
        FieldGroup,
        this.props,
        this.props.children.map(function (child, key) {
          return (0, _react.cloneElement)(child, {
            onChange: _this2.handleChange.bind(_this2, key),
            key: key
          }, child.props.children);
        })
      );
    }
  }]);

  return ProportionConstraintField;
}(_react.Component);

ProportionConstraintField.propTypes = {
  children: _react.PropTypes.array,
  onAutofill: _react.PropTypes.func,
  active: _react.PropTypes.bool,
  data: _react.PropTypes.shape({
    ratio: _react.PropTypes.number.isRequired
  }),
  FieldGroup: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]).isRequired
};

ProportionConstraintField.defaultProps = {
  active: true
};

exports.ProportionConstraintField = ProportionConstraintField;
exports.default = (0, _Injector.inject)(['FieldGroup'])(ProportionConstraintField);

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClickOutComponent = function (_React$Component) {
  _inherits(ClickOutComponent, _React$Component);

  function ClickOutComponent() {
    _classCallCheck(this, ClickOutComponent);

    return _possibleConstructorReturn(this, (ClickOutComponent.__proto__ || Object.getPrototypeOf(ClickOutComponent)).apply(this, arguments));
  }

  _createClass(ClickOutComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var elTouchIsClick = true;
      var documentTouchIsClick = true;
      var el = _reactDom2.default.findDOMNode(this);

      this.__documentTouchStarted = function () {
        el.removeEventListener('click', _this2.__elementClicked);
        document.removeEventListener('click', _this2.__documentClicked);
      };

      this.__documentTouchMoved = function () {
        documentTouchIsClick = false;
      };

      this.__documentTouchEnded = function (e) {
        if (documentTouchIsClick) _this2.__documentClicked(e);
        documentTouchIsClick = true;
      };

      this.__documentClicked = function (e) {
        if ((e.__clickedElements || []).indexOf(el) !== -1) return;

        var clickOutHandler = _this2.props.onClickOut;
        clickOutHandler.call(_this2.props.callerComponent, e);
      };

      this.__elementTouchMoved = function () {
        elTouchIsClick = false;
      };

      this.__elementTouchEnded = function (e) {
        if (elTouchIsClick) _this2.__elementClicked(e);
        elTouchIsClick = true;
      };

      this.__elementClicked = function (e) {
        e.__clickedElements = e.__clickedElements || [];
        e.__clickedElements.push(el);
      };

      setTimeout(function () {
        if (_this2.__unmounted) return;
        _this2.toggleListeners('addEventListener');
      }, 0);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.toggleListeners('removeEventListener');
      this.__unmounted = true;
    }
  }, {
    key: 'toggleListeners',
    value: function toggleListeners(listenerMethod) {
      var el = _reactDom2.default.findDOMNode(this);

      el[listenerMethod]('touchmove', this.__elementTouchMoved);
      el[listenerMethod]('touchend', this.__elementTouchEnded);
      el[listenerMethod]('click', this.__elementClicked);

      document[listenerMethod]('touchstart', this.__documentTouchStarted);
      document[listenerMethod]('touchmove', this.__documentTouchMoved);
      document[listenerMethod]('touchend', this.__documentTouchEnded);
      document[listenerMethod]('click', this.__documentClicked);
    }
  }, {
    key: 'render',
    value: function render() {
      return Array.isArray(this.props.children) ? _react2.default.createElement(
        'div',
        null,
        this.props.children
      ) : _react2.default.Children.only(this.props.children);
    }
  }]);

  return ClickOutComponent;
}(_react2.default.Component);

ClickOutComponent.propTypes = {
  children: _react.PropTypes.object,
  callerComponent: _react.PropTypes.object.isRequired,
  onClickOut: _react.PropTypes.func.isRequired
};

exports.default = ClickOutComponent;

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _constants = __webpack_require__(197);

var _constants2 = _interopRequireDefault(_constants);

var _fileShape = __webpack_require__(58);

var _fileShape2 = _interopRequireDefault(_fileShape);

var _DataFormat = __webpack_require__(35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UploadFieldItem = function (_SilverStripeComponen) {
  _inherits(UploadFieldItem, _SilverStripeComponen);

  function UploadFieldItem(props) {
    _classCallCheck(this, UploadFieldItem);

    var _this = _possibleConstructorReturn(this, (UploadFieldItem.__proto__ || Object.getPrototypeOf(UploadFieldItem)).call(this, props));

    _this.handleRemove = _this.handleRemove.bind(_this);
    return _this;
  }

  _createClass(UploadFieldItem, [{
    key: 'getThumbnailStyles',
    value: function getThumbnailStyles() {
      if (this.isImage() && (this.exists() || this.uploading())) {
        var thumbnail = this.props.item.smallThumbnail || this.props.item.url;
        return {
          backgroundImage: 'url(' + thumbnail + ')'
        };
      }

      return {};
    }
  }, {
    key: 'hasError',
    value: function hasError() {
      if (this.props.item.message) {
        return this.props.item.message.type === 'error';
      }

      return false;
    }
  }, {
    key: 'renderErrorMessage',
    value: function renderErrorMessage() {
      var message = null;

      if (this.hasError()) {
        message = this.props.item.message.value;
      } else if (!this.exists() && !this.uploading()) {
        message = _i18n2.default._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
      }

      if (message !== null) {
        return _react2.default.createElement(
          'div',
          { className: 'uploadfield-item__error-message' },
          message
        );
      }

      return null;
    }
  }, {
    key: 'getThumbnailClassNames',
    value: function getThumbnailClassNames() {
      var thumbnailClassNames = ['uploadfield-item__thumbnail'];

      if (this.isImageSmallerThanThumbnail()) {
        thumbnailClassNames.push('uploadfield-item__thumbnail--small');
      }

      return thumbnailClassNames.join(' ');
    }
  }, {
    key: 'getItemClassNames',
    value: function getItemClassNames() {
      var category = this.props.item.category || 'none';
      var itemClassNames = ['fill-width', 'uploadfield-item', 'uploadfield-item--' + category];

      if (!this.exists() && !this.uploading()) {
        itemClassNames.push('uploadfield-item--missing');
      }

      if (this.hasError()) {
        itemClassNames.push('uploadfield-item--error');
      }

      return itemClassNames.join(' ');
    }
  }, {
    key: 'isImage',
    value: function isImage() {
      return this.props.item.category === 'image';
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.props.item.exists;
    }
  }, {
    key: 'uploading',
    value: function uploading() {
      return !!this.props.item.uploaded;
    }
  }, {
    key: 'complete',
    value: function complete() {
      return this.uploading() && this.props.item.id > 0;
    }
  }, {
    key: 'isImageSmallerThanThumbnail',
    value: function isImageSmallerThanThumbnail() {
      if (!this.isImage() || !this.exists() && !this.uploading()) {
        return false;
      }
      var width = this.props.item.width;
      var height = this.props.item.height;

      return height && width && height < _constants2.default.SMALL_THUMBNAIL_HEIGHT && width < _constants2.default.SMALL_THUMBNAIL_WIDTH;
    }
  }, {
    key: 'preventFocus',
    value: function preventFocus(event) {
      event.preventDefault();
    }
  }, {
    key: 'handleRemove',
    value: function handleRemove(event) {
      event.preventDefault();
      if (this.props.handleRemove) {
        this.props.handleRemove(event, this.props.item);
      }
    }
  }, {
    key: 'renderProgressBar',
    value: function renderProgressBar() {
      var progressBarProps = {
        className: 'uploadfield-item__progress-bar',
        style: {
          width: this.props.item.progress + '%'
        }
      };

      if (!this.hasError() && this.uploading()) {
        if (this.complete()) {
          return _react2.default.createElement('div', { className: 'uploadfield-item__complete-icon' });
        }
        return _react2.default.createElement(
          'div',
          { className: 'uploadfield-item__upload-progress' },
          _react2.default.createElement('div', progressBarProps)
        );
      }

      return null;
    }
  }, {
    key: 'renderRemoveButton',
    value: function renderRemoveButton() {
      if (!this.props.canEdit) {
        return null;
      }
      var classes = ['btn', 'uploadfield-item__remove-btn', 'btn-secondary', 'btn--no-text', 'font-icon-cancel', 'btn--icon-md'].join(' ');
      return _react2.default.createElement('button', {
        className: classes,
        onClick: this.handleRemove,
        ref: 'backButton'
      });
    }
  }, {
    key: 'renderFileDetails',
    value: function renderFileDetails() {
      var size = '';
      if (this.props.item.size) {
        size = ', ' + (0, _DataFormat.fileSize)(this.props.item.size);
      }
      return _react2.default.createElement(
        'div',
        { className: 'uploadfield-item__details fill-width flexbox-area-grow' },
        _react2.default.createElement(
          'span',
          { className: 'uploadfield-item__title', ref: 'title' },
          this.props.item.title
        ),
        _react2.default.createElement(
          'span',
          { className: 'uploadfield-item__meta' },
          this.props.item.extension,
          size
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var fieldName = this.props.name + '[Files][]';
      return _react2.default.createElement(
        'div',
        { className: this.getItemClassNames() },
        _react2.default.createElement('input', { type: 'hidden', value: this.props.item.id, name: fieldName }),
        _react2.default.createElement('div', {
          ref: 'thumbnail',
          className: this.getThumbnailClassNames(),
          style: this.getThumbnailStyles()
        }),
        this.renderFileDetails(),
        this.renderProgressBar(),
        this.renderErrorMessage(),
        this.renderRemoveButton()
      );
    }
  }]);

  return UploadFieldItem;
}(_SilverStripeComponent2.default);

UploadFieldItem.propTypes = {
  canEdit: _react2.default.PropTypes.bool,
  name: _react2.default.PropTypes.string.isRequired,
  item: _fileShape2.default,
  handleRemove: _react2.default.PropTypes.func
};

exports.default = UploadFieldItem;

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetAdminStateRouter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4);

var _AssetAdminRouter = __webpack_require__(85);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

var initialState = {
  folderId: null,
  fileId: null,
  query: {},
  action: _index2.default.ACTIONS.EDIT_FILE
};

var AssetAdminStateRouter = function (_Component) {
  _inherits(AssetAdminStateRouter, _Component);

  function AssetAdminStateRouter(props) {
    _classCallCheck(this, AssetAdminStateRouter);

    var _this = _possibleConstructorReturn(this, (AssetAdminStateRouter.__proto__ || Object.getPrototypeOf(AssetAdminStateRouter)).call(this, props));

    _this.handleBrowse = _this.handleBrowse.bind(_this);
    _this.getUrl = _this.getUrl.bind(_this);

    _this.state = Object.assign({}, initialState);
    return _this;
  }

  _createClass(AssetAdminStateRouter, [{
    key: 'getUrl',
    value: function getUrl() {
      var folderId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var fileId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var action = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _index2.default.ACTIONS.EDIT_FILE;

      var newFolderId = parseInt(folderId || 0, 10);
      var newFileId = parseInt(fileId || 0, 10);
      var oldFolderId = this.getFolderId();

      var hasFolderChanged = newFolderId !== oldFolderId && oldFolderId !== null;
      var newQuery = Object.assign({}, query);
      if (hasFolderChanged || newQuery.page <= 1) {
        delete newQuery.page;
      }

      return (0, _AssetAdminRouter.buildUrl)({
        base: this.props.sectionConfig.url,
        folderId: newFolderId,
        fileId: newFileId,
        query: newQuery,
        action: action
      });
    }
  }, {
    key: 'getFolderId',
    value: function getFolderId() {
      if (this.state.folderId === null) {
        return null;
      }
      return parseInt(this.state.folderId || 0, 10);
    }
  }, {
    key: 'getFileId',
    value: function getFileId() {
      return parseInt(this.state.fileId || this.props.fileId || 0, 10);
    }
  }, {
    key: 'getViewAction',
    value: function getViewAction() {
      return this.state.action || _index2.default.ACTIONS.EDIT_FILE;
    }
  }, {
    key: 'getSectionProps',
    value: function getSectionProps() {
      var props = Object.assign({}, this.props, {
        folderId: this.getFolderId(),
        fileId: this.getFileId(),
        viewAction: this.getViewAction(),
        query: this.state.query,
        getUrl: this.getUrl,
        onBrowse: this.handleBrowse
      });

      delete props.Component;

      return props;
    }
  }, {
    key: 'handleBrowse',
    value: function handleBrowse(folderId, fileId) {
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var action = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _index2.default.ACTIONS.EDIT_FILE;

      if (action && Object.values(_index2.default.ACTIONS).indexOf(action) === -1) {
        throw new Error('Invalid action provided: ' + action);
      }

      this.setState({
        folderId: folderId,
        fileId: fileId,
        query: query,
        action: action
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var sectionProps = this.getSectionProps();
      var AssetAdmin = this.props.Component;

      return _react2.default.createElement(AssetAdmin, sectionProps);
    }
  }]);

  return AssetAdminStateRouter;
}(_react.Component);

AssetAdminStateRouter.propTypes = {
  Component: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
  sectionConfig: _react.PropTypes.shape({
    url: _react.PropTypes.string.isRequired
  }).isRequired,
  fileId: _react.PropTypes.number
};

function stateRouter(AssetAdmin) {
  function mapStateToProps(state) {
    var sectionConfig = state.config.sections.find(function (section) {
      return section.name === sectionConfigKey;
    });

    return {
      Component: AssetAdmin,
      sectionConfig: sectionConfig
    };
  }

  return (0, _reactRedux.connect)(mapStateToProps)(AssetAdminStateRouter);
}

exports.AssetAdminStateRouter = AssetAdminStateRouter;
exports.default = stateRouter;

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _reactRedux = __webpack_require__(4);

var _redux = __webpack_require__(8);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _FormBuilderLoader = __webpack_require__(79);

var _FormBuilderLoader2 = _interopRequireDefault(_FormBuilderLoader);

var _FormBuilderModal = __webpack_require__(36);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

var _UnsavedFormsActions = __webpack_require__(351);

var UnsavedFormsActions = _interopRequireWildcard(_UnsavedFormsActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Editor = function (_Component) {
  _inherits(Editor, _Component);

  function Editor(props) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

    _this.handleCancelKeyDown = _this.handleCancelKeyDown.bind(_this);
    _this.handleClose = _this.handleClose.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleAction = _this.handleAction.bind(_this);
    _this.handleLoadingSuccess = _this.handleLoadingSuccess.bind(_this);
    _this.handleLoadingError = _this.handleLoadingError.bind(_this);
    _this.handleFetchingSchema = _this.handleFetchingSchema.bind(_this);
    _this.closeModal = _this.closeModal.bind(_this);
    _this.openModal = _this.openModal.bind(_this);

    _this.state = {
      openModal: false,
      loadingForm: false,
      loadingError: null
    };
    return _this;
  }

  _createClass(Editor, [{
    key: 'handleAction',
    value: function handleAction(event, data) {
      var name = event.currentTarget.name;

      if (name === 'action_addtocampaign') {
        this.openModal();
        event.preventDefault();
        return;
      }

      if (name === 'action_unpublish') {
        if (confirm(_i18n2.default._t('AssetAdmin.CONFIRMUNPUBLISH'))) {
          this.props.onUnpublish(data.ID);
        }
        event.preventDefault();
        return;
      }

      if (name === 'action_delete') {
        if (confirm(_i18n2.default._t('AssetAdmin.CONFIRMDELETE'))) {
          this.props.actions.unsavedForms.removeFormChanged('AssetAdmin.EditForm');
          this.props.onDelete(data.ID);
        }
        event.preventDefault();
      }
    }
  }, {
    key: 'handleCancelKeyDown',
    value: function handleCancelKeyDown(event) {
      if (event.keyCode === _index2.default.SPACE_KEY_CODE || event.keyCode === _index2.default.RETURN_KEY_CODE) {
        this.handleClose(event);
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action, submitFn) {
      if (typeof this.props.onSubmit === 'function') {
        return this.props.onSubmit(data, action, submitFn);
      }

      return submitFn();
    }
  }, {
    key: 'handleClose',
    value: function handleClose(event) {
      this.props.onClose();
      this.closeModal();

      if (event) {
        event.preventDefault();
      }
    }
  }, {
    key: 'openModal',
    value: function openModal() {
      this.setState({
        openModal: true
      });
    }
  }, {
    key: 'closeModal',
    value: function closeModal() {
      this.setState({
        openModal: false
      });
    }
  }, {
    key: 'handleLoadingError',
    value: function handleLoadingError(exception) {
      this.setState({
        loadingForm: false,
        loadingError: exception.errors[0]
      });
    }
  }, {
    key: 'handleLoadingSuccess',
    value: function handleLoadingSuccess() {
      this.setState({
        loadingForm: false,
        loadingError: null
      });
    }
  }, {
    key: 'handleFetchingSchema',
    value: function handleFetchingSchema() {
      this.setState({
        loadingForm: true
      });
    }
  }, {
    key: 'renderCancelButton',
    value: function renderCancelButton() {
      return _react2.default.createElement('a', {
        tabIndex: '0',
        className: 'btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl',
        onClick: this.handleClose,
        onKeyDown: this.handleCancelKeyDown,
        type: 'button',
        'aria-label': _i18n2.default._t('AssetAdmin.CANCEL')
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var urlQueryString = this.props.schemaUrlQueries.map(function (query) {
        return query.name + '=' + query.value;
      }).join('&').trim();
      urlQueryString = urlQueryString ? '?' + urlQueryString : '';
      var formSchemaUrl = this.props.schemaUrl + '/' + this.props.targetId + urlQueryString;
      var modalSchemaUrl = this.props.addToCampaignSchemaUrl + '/' + this.props.targetId;
      var editorClasses = ['panel', 'form--no-dividers', 'editor'];
      if (this.props.className) {
        editorClasses.push(this.props.className);
      }

      var error = null;
      if (this.state.loadingError) {
        var message = this.state.loadingError.value;
        error = _react2.default.createElement(
          'div',
          { className: 'editor__file-preview-message--file-missing' },
          message.includes('Unexpected token < in JSON') ? _i18n2.default._t('AssetAdmin.FILE_MISSING', 'File cannot be found') : message
        );
      }

      return _react2.default.createElement(
        'div',
        { className: editorClasses.join(' ') },
        _react2.default.createElement(
          'div',
          { className: 'editor__details fill-height' },
          _react2.default.createElement(_FormBuilderLoader2.default, {
            identifier: 'AssetAdmin.EditForm',
            schemaUrl: formSchemaUrl,
            afterMessages: this.renderCancelButton(),
            handleSubmit: this.handleSubmit,
            handleAction: this.handleAction,
            onLoadingSuccess: this.handleLoadingSuccess,
            onLoadingError: this.handleLoadingError,
            onFetchingSchema: this.handleFetchingSchema
          }),
          error,
          _react2.default.createElement(_FormBuilderModal2.default, {
            identifier: 'AssetAdmin.AddToCampaign',
            show: this.state.openModal,
            handleHide: this.closeModal,
            schemaUrl: modalSchemaUrl,
            bodyClassName: 'modal__dialog',
            responseClassBad: 'modal__response modal__response--error',
            responseClassGood: 'modal__response modal__response--good'
          }),
          this.state.loadingForm && [_react2.default.createElement('div', { key: 'overlay', className: 'cms-content-loading-overlay ui-widget-overlay-light' }), _react2.default.createElement('div', { key: 'spinner', className: 'cms-content-loading-spinner' })]
        )
      );
    }
  }]);

  return Editor;
}(_react.Component);

Editor.propTypes = {
  dialog: _react.PropTypes.bool,
  className: _react.PropTypes.string,
  targetId: _react.PropTypes.number.isRequired,
  onClose: _react.PropTypes.func.isRequired,
  onSubmit: _react.PropTypes.func.isRequired,
  onDelete: _react.PropTypes.func.isRequired,
  onUnpublish: _react.PropTypes.func.isRequired,
  schemaUrl: _react.PropTypes.string.isRequired,
  schemaUrlQueries: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    name: _react.PropTypes.string,
    value: _react.PropTypes.any
  })),
  addToCampaignSchemaUrl: _react.PropTypes.string,
  openAddCampaignModal: _react.PropTypes.bool,
  actions: _react.PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      unsavedForms: (0, _redux.bindActionCreators)(UnsavedFormsActions, dispatch)
    }
  };
}

exports.Editor = Editor;
exports.default = (0, _reactRedux.connect)(function () {
  return {};
}, mapDispatchToProps)(Editor);

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDnd = __webpack_require__(54);

var _reactDndHtml5Backend = __webpack_require__(149);

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

var _GalleryItemDragLayer = __webpack_require__(164);

var _GalleryItemDragLayer2 = _interopRequireDefault(_GalleryItemDragLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var capturedManager = null;

var context = (0, _reactDnd.DragDropContext)(function (manager) {
  capturedManager = manager;

  return (0, _reactDndHtml5Backend2.default)(manager);
});

var GalleryDND = function (_Component) {
  _inherits(GalleryDND, _Component);

  function GalleryDND() {
    _classCallCheck(this, GalleryDND);

    return _possibleConstructorReturn(this, (GalleryDND.__proto__ || Object.getPrototypeOf(GalleryDND)).apply(this, arguments));
  }

  _createClass(GalleryDND, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('drop', this.handleDrop, true);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('drop', this.handleDrop, true);
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop() {
      var backend = capturedManager && capturedManager.backend;

      if (backend && backend.isDraggingNativeItem()) {
        backend.endDragNativeItem();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          children = _props.children;

      return _react2.default.createElement(
        'div',
        { className: className },
        children,
        _react2.default.createElement(_GalleryItemDragLayer2.default, null)
      );
    }
  }]);

  return GalleryDND;
}(_react.Component);

GalleryDND.propTypes = {
  className: _react.PropTypes.string,
  children: _react.PropTypes.arrayOf(_react.PropTypes.node)
};

exports.default = context(GalleryDND);

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(16);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HistoryItem = function (_SilverStripeComponen) {
  _inherits(HistoryItem, _SilverStripeComponen);

  function HistoryItem(props) {
    _classCallCheck(this, HistoryItem);

    var _this = _possibleConstructorReturn(this, (HistoryItem.__proto__ || Object.getPrototypeOf(HistoryItem)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(HistoryItem, [{
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      if (typeof this.props.onClick === 'function') {
        this.props.onClick(this.props.versionid);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var publishedLine = null;

      if (this.props.status === 'Published') {
        publishedLine = _react2.default.createElement(
          'p',
          null,
          _react2.default.createElement(
            'span',
            { className: 'history-item__status-flag' },
            this.props.status
          ),
          ' at ',
          this.props.date_formatted
        );
      }

      return _react2.default.createElement(
        'li',
        {
          className: 'list-group-item history-item',
          onClick: this.handleClick
        },
        _react2.default.createElement(
          'p',
          null,
          _react2.default.createElement(
            'span',
            { className: 'history-item__version' },
            'v.',
            this.props.versionid
          ),
          _react2.default.createElement(
            'span',
            { className: 'history-item__date' },
            this.props.date_ago,
            ' ',
            this.props.author
          ),
          this.props.summary
        ),
        publishedLine
      );
    }
  }]);

  return HistoryItem;
}(_SilverStripeComponent2.default);

HistoryItem.propTypes = {
  versionid: _react.PropTypes.number.isRequired,
  summary: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.string]).isRequired,
  status: _react.PropTypes.string,
  author: _react.PropTypes.string,
  date: _react.PropTypes.string,
  onClick: _react.PropTypes.func
};

exports.default = HistoryItem;

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HistoryList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4);

var _Backend = __webpack_require__(145);

var _Backend2 = _interopRequireDefault(_Backend);

var _Config = __webpack_require__(147);

var _Config2 = _interopRequireDefault(_Config);

var _HistoryItem = __webpack_require__(173);

var _HistoryItem2 = _interopRequireDefault(_HistoryItem);

var _FormBuilderLoader = __webpack_require__(79);

var _FormBuilderLoader2 = _interopRequireDefault(_FormBuilderLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

var createEndpoint = function createEndpoint(endpointConfig) {
  var includeToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return _Backend2.default.createEndpointFetcher(Object.assign({}, endpointConfig, includeToken ? { defaultData: { SecurityID: _Config2.default.get('SecurityID') } } : {}));
};

var HistoryList = function (_Component) {
  _inherits(HistoryList, _Component);

  function HistoryList(props) {
    _classCallCheck(this, HistoryList);

    var _this = _possibleConstructorReturn(this, (HistoryList.__proto__ || Object.getPrototypeOf(HistoryList)).call(this, props));

    _this.state = {
      detailView: null,
      history: [],
      loadedDetails: false
    };

    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleBack = _this.handleBack.bind(_this);

    _this.timer = null;

    _this.api = createEndpoint(props.sectionConfig.historyEndpoint);
    return _this;
  }

  _createClass(HistoryList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refreshHistoryIfNeeded();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.refreshHistoryIfNeeded(nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }, {
    key: 'refreshHistoryIfNeeded',
    value: function refreshHistoryIfNeeded(nextProps) {
      var _this2 = this;

      if (!nextProps && !this.state.loadedDetails || nextProps.data.fileId !== this.props.data.fileId || nextProps.data.latestVersionId !== this.props.data.latestVersionId) {
        this.setState({ loadedDetails: false });
        var fileId = nextProps ? nextProps.data.fileId : this.props.data.fileId;
        clearTimeout(this.timer);

        this.timer = setTimeout(function () {
          _this2.api({
            fileId: fileId
          }).then(function (history) {
            if (_this2.timer) {
              _this2.setState({ history: history, loadedDetails: true });
            }
          });
        }, 250);
      }
    }
  }, {
    key: 'handleClick',
    value: function handleClick(versionId) {
      this.setState({
        viewDetails: versionId
      });
    }
  }, {
    key: 'handleBack',
    value: function handleBack(event) {
      event.preventDefault();

      this.setState({
        viewDetails: null
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.state.loadedDetails) {
        return _react2.default.createElement(
          'div',
          { className: 'history-list history-list--loading' },
          'Loading...'
        );
      }

      if (this.state.viewDetails) {
        var schemaUrl = [this.props.historySchemaUrl, this.props.data.fileId, this.state.viewDetails].join('/');

        var buttonClasses = ['btn', 'btn-secondary', 'btn--icon-xl', 'btn--no-text', 'font-icon-left-open-big', 'history-list__back'].join(' ');

        return _react2.default.createElement(
          'div',
          { className: 'history-list' },
          _react2.default.createElement('a', { className: buttonClasses, onClick: this.handleBack }),
          _react2.default.createElement(_FormBuilderLoader2.default, { identifier: 'AssetAdmin.HistoryList', schemaUrl: schemaUrl })
        );
      }

      var historyList = this.state.history || [];
      return _react2.default.createElement(
        'div',
        { className: 'history-list' },
        _react2.default.createElement(
          'ul',
          { className: 'list-group list-group-flush history-list__list' },
          historyList.map(function (history) {
            return _react2.default.createElement(_HistoryItem2.default, _extends({
              key: history.versionid
            }, history, {
              onClick: _this3.handleClick
            }));
          })
        )
      );
    }
  }]);

  return HistoryList;
}(_react.Component);

HistoryList.propTypes = {
  sectionConfig: _react2.default.PropTypes.shape({
    form: _react2.default.PropTypes.object,
    historyEndpoint: _react2.default.PropTypes.shape({
      url: _react2.default.PropTypes.string,
      method: _react2.default.PropTypes.string,
      responseFormat: _react2.default.PropTypes.string
    })
  }),
  historySchemaUrl: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.object
};

HistoryList.defaultProps = {
  data: {
    fieldId: 0
  }
};

function mapStateToProps(state) {
  var sectionConfig = state.config.sections.find(function (section) {
    return section.name === sectionConfigKey;
  });
  return {
    sectionConfig: sectionConfig,
    historySchemaUrl: sectionConfig.form.fileHistoryForm.schemaUrl
  };
}

exports.HistoryList = HistoryList;
exports.default = (0, _reactRedux.connect)(mapStateToProps)(HistoryList);

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableView = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _griddleReact = __webpack_require__(97);

var _griddleReact2 = _interopRequireDefault(_griddleReact);

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _Gallery = __webpack_require__(57);

var _DataFormat = __webpack_require__(35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableView = function (_Component) {
  _inherits(TableView, _Component);

  function TableView(props) {
    _classCallCheck(this, TableView);

    var _this = _possibleConstructorReturn(this, (TableView.__proto__ || Object.getPrototypeOf(TableView)).call(this, props));

    _this.getColumns = _this.getColumns.bind(_this);
    _this.handleSort = _this.handleSort.bind(_this);
    _this.handleSetPage = _this.handleSetPage.bind(_this);
    _this.handleRowClick = _this.handleRowClick.bind(_this);
    _this.renderSelect = _this.renderSelect.bind(_this);
    _this.renderTitle = _this.renderTitle.bind(_this);
    _this.renderNoItemsNotice = _this.renderNoItemsNotice.bind(_this);

    _this.state = {
      enableSort: false
    };
    return _this;
  }

  _createClass(TableView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        enableSort: true
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.setState({
        enableSort: false
      });
    }
  }, {
    key: 'getColumns',
    value: function getColumns() {
      var columns = ['thumbnail', 'title', 'size', 'lastEdited'];

      if (this.props.selectableItems) {
        columns.unshift('selected');
      }

      return columns;
    }
  }, {
    key: 'getColumnConfig',
    value: function getColumnConfig() {
      return [{
        columnName: 'selected',
        sortable: false,
        displayName: '',
        cssClassName: 'gallery__table-column--select',
        customComponent: this.renderSelect
      }, {
        columnName: 'thumbnail',
        sortable: false,
        displayName: '',
        cssClassName: 'gallery__table-column--image',
        customComponent: this.renderThumbnail
      }, {
        columnName: 'title',
        customCompareFn: function customCompareFn() {
          return 0;
        },
        cssClassName: 'gallery__table-column--title',
        customComponent: this.renderTitle
      }, {
        columnName: 'lastEdited',
        displayName: 'Modified',
        customComponent: this.renderDate
      }, {
        columnName: 'size',
        sortable: false,
        displayName: 'Size',
        cssClassName: 'sort--disabled',
        customComponent: this.renderSize
      }];
    }
  }, {
    key: 'getRowMetadata',
    value: function getRowMetadata(rowData) {
      return 'gallery__table-row ' + (rowData.highlighted ? 'gallery__table-row--highlighted' : '');
    }
  }, {
    key: 'getTableProps',
    value: function getTableProps() {
      var _props$sort$split = this.props.sort.split(','),
          _props$sort$split2 = _slicedToArray(_props$sort$split, 2),
          sortColumn = _props$sort$split2[0],
          sortDirection = _props$sort$split2[1];

      return {
        tableClassName: 'gallery__table table table-hover',
        gridClassName: 'gallery__main-view--table',
        rowMetadata: {
          bodyCssClassName: this.getRowMetadata
        },
        sortAscendingComponent: '',
        sortDescendingComponent: '',
        useExternal: true,
        externalSetPage: this.handleSetPage,
        externalChangeSort: this.handleSort,

        externalSetFilter: function externalSetFilter() {
          return null;
        },
        externalSetPageSize: function externalSetPageSize() {
          return null;
        },
        externalCurrentPage: this.props.page - 1,
        externalMaxPage: Math.ceil(this.props.totalCount / this.props.limit),
        externalSortColumn: sortColumn,

        externalSortAscending: !this.state.enableSort ? sortDirection !== 'asc' : sortDirection === 'asc',
        initialSort: sortColumn,
        columns: this.getColumns(),
        columnMetadata: this.getColumnConfig(),
        useGriddleStyles: false,
        onRowClick: this.handleRowClick,

        results: this.props.files,
        customNoDataComponent: this.renderNoItemsNotice
      };
    }
  }, {
    key: 'handleActivate',
    value: function handleActivate(event, item) {
      if (item.type === 'folder') {
        this.props.onOpenFolder(event, item);
      } else {
        this.props.onOpenFile(event, item);
      }
    }
  }, {
    key: 'handleRowClick',
    value: function handleRowClick(row, event) {
      var item = row.props.data;

      if (event.currentTarget.classList.contains('gallery__table-column--select')) {
        event.stopPropagation();
        event.preventDefault();
        if (typeof this.props.onSelect === 'function') {
          this.props.onSelect(event, item);
          return;
        }
      }

      this.handleActivate(event, item);
    }
  }, {
    key: 'handleSort',
    value: function handleSort(column, ascending) {
      var direction = ascending ? 'asc' : 'desc';

      if (this.state.enableSort) {
        this.props.onSort(column + ',' + direction);
      }
    }
  }, {
    key: 'handleSetPage',
    value: function handleSetPage(page) {
      this.props.onSetPage(page + 1);
    }
  }, {
    key: 'preventFocus',
    value: function preventFocus(event) {
      event.preventDefault();
    }
  }, {
    key: 'renderNoItemsNotice',
    value: function renderNoItemsNotice() {
      if (this.props.files.length === 0 && !this.props.loading) {
        return _react2.default.createElement(
          'p',
          { className: 'gallery__no-item-notice' },
          _i18n2.default._t('AssetAdmin.NOITEMSFOUND')
        );
      }

      return null;
    }
  }, {
    key: 'renderSize',
    value: function renderSize(props) {
      if (props.rowData.type === 'folder') {
        return null;
      }
      var description = (0, _DataFormat.fileSize)(props.data);

      return _react2.default.createElement(
        'span',
        null,
        description
      );
    }
  }, {
    key: 'renderProgressBar',
    value: function renderProgressBar(rowData) {
      if (!rowData.uploading || rowData.message && rowData.message.type === 'error') {
        return null;
      }
      if (rowData.id > 0) {
        return _react2.default.createElement('div', { className: 'gallery__progress-bar--complete' });
      }
      var progressBarProps = {
        className: 'gallery__progress-bar-progress',
        style: {
          width: rowData.progress + '%'
        }
      };

      return _react2.default.createElement(
        'div',
        { className: 'gallery__progress-bar' },
        _react2.default.createElement('div', progressBarProps)
      );
    }
  }, {
    key: 'renderTitle',
    value: function renderTitle(props) {
      var progress = this.renderProgressBar(props.rowData);

      return _react2.default.createElement(
        'div',
        { className: 'fill-width' },
        _react2.default.createElement(
          'div',
          { className: 'flexbox-area-grow' },
          props.data
        ),
        progress
      );
    }
  }, {
    key: 'renderSelect',
    value: function renderSelect(props) {
      return _react2.default.createElement('input', {
        type: 'checkbox',
        title: _i18n2.default._t('AssetAdmin.SELECT'),
        checked: props.data,
        tabIndex: '-1',
        onMouseDown: this.preventFocus
      });
    }
  }, {
    key: 'renderDate',
    value: function renderDate(props) {
      if (props.rowData.type === 'folder') {
        return null;
      }

      return _react2.default.createElement(
        'span',
        null,
        props.data
      );
    }
  }, {
    key: 'renderThumbnail',
    value: function renderThumbnail(props) {
      var url = props.data || props.rowData.url;
      var category = props.rowData.category || 'false';
      var baseClass = 'gallery__table-image';
      var classNames = [baseClass];
      var styles = {};

      classNames.push(baseClass + '--' + category);

      if (category === 'image' && url) {
        styles.backgroundImage = 'url("' + url + '")';
      }

      if (!url && category !== 'folder') {
        classNames.push(baseClass + '--error');
      }

      return _react2.default.createElement('div', { className: classNames.join(' '), style: styles });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_griddleReact2.default, this.getTableProps());
    }
  }]);

  return TableView;
}(_react.Component);

TableView.defaultProps = _Gallery.galleryViewDefaultProps;

TableView.propTypes = _Gallery.galleryViewPropTypes;

exports.TableView = TableView;
exports.default = TableView;

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _GalleryItem = __webpack_require__(80);

var _Gallery = __webpack_require__(57);

var _griddleReact = __webpack_require__(97);

var _griddleReact2 = _interopRequireDefault(_griddleReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ThumbnailView = function (_Component) {
  _inherits(ThumbnailView, _Component);

  function ThumbnailView(props) {
    _classCallCheck(this, ThumbnailView);

    var _this = _possibleConstructorReturn(this, (ThumbnailView.__proto__ || Object.getPrototypeOf(ThumbnailView)).call(this, props));

    _this.renderItem = _this.renderItem.bind(_this);
    _this.handleSetPage = _this.handleSetPage.bind(_this);
    _this.handlePrevPage = _this.handlePrevPage.bind(_this);
    _this.handleNextPage = _this.handleNextPage.bind(_this);
    _this.handleDrag = _this.handleDrag.bind(_this);
    return _this;
  }

  _createClass(ThumbnailView, [{
    key: 'handleDrag',
    value: function handleDrag(dragging) {
      this.props.onEnableDropzone(!dragging);
    }
  }, {
    key: 'handleSetPage',
    value: function handleSetPage(page) {
      this.props.onSetPage(page);
    }
  }, {
    key: 'handleNextPage',
    value: function handleNextPage() {
      this.handleSetPage(this.props.page + 1);
    }
  }, {
    key: 'handlePrevPage',
    value: function handlePrevPage() {
      this.handleSetPage(this.props.page - 1);
    }
  }, {
    key: 'folderFilter',
    value: function folderFilter(file) {
      return file.type === 'folder';
    }
  }, {
    key: 'fileFilter',
    value: function fileFilter(file) {
      return file.type !== 'folder';
    }
  }, {
    key: 'renderPagination',
    value: function renderPagination() {
      if (this.props.totalCount <= this.props.limit) {
        return null;
      }
      var props = {
        setPage: this.handleSetPage,
        maxPage: Math.ceil(this.props.totalCount / this.props.limit),
        next: this.handleNextPage,
        nextText: _i18n2.default._t('AssetAdmin.NEXT', 'Next'),
        previous: this.handlePrevPage,
        previousText: _i18n2.default._t('AssetAdmin.PREVIOUS', 'Previous'),
        currentPage: this.props.page - 1,
        useGriddleStyles: false
      };
      return _react2.default.createElement(
        'div',
        { className: 'griddle-footer' },
        _react2.default.createElement(_griddleReact2.default.GridPagination, props)
      );
    }
  }, {
    key: 'renderItem',
    value: function renderItem(item, index) {
      var badge = this.props.badges.find(function (badgeItem) {
        return badgeItem.id === item.id;
      });
      var props = {
        sectionConfig: this.props.sectionConfig,
        key: index,
        item: item,
        selectedFiles: this.props.selectedFiles,
        onDrag: this.handleDrag,
        badge: badge
      };

      if (item.uploading) {
        Object.assign(props, {
          onCancelUpload: this.props.onCancelUpload,
          onRemoveErroredUpload: this.props.onRemoveErroredUpload
        });
      } else {
        Object.assign(props, {
          onActivate: item.type === 'folder' ? this.props.onOpenFolder : this.props.onOpenFile
        });
      }

      if (this.props.selectableItems) {
        Object.assign(props, {
          selectable: true,
          onSelect: this.props.onSelect
        });
      }

      if (item.type === 'folder') {
        Object.assign(props, {
          onDropFiles: this.props.onDropFiles
        });
        return _react2.default.createElement(_GalleryItem.Folder, props);
      }
      return _react2.default.createElement(_GalleryItem.File, props);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'gallery__main-view--tile' },
        _react2.default.createElement(
          'div',
          { className: 'gallery__folders' },
          this.props.files.filter(this.folderFilter).map(this.renderItem)
        ),
        _react2.default.createElement(
          'div',
          { className: 'gallery__files' },
          this.props.files.filter(this.fileFilter).map(this.renderItem)
        ),
        this.props.files.length === 0 && !this.props.loading && _react2.default.createElement(
          'p',
          { className: 'gallery__no-item-notice' },
          _i18n2.default._t('AssetAdmin.NOITEMSFOUND')
        ),
        _react2.default.createElement(
          'div',
          { className: 'gallery__load' },
          this.renderPagination()
        )
      );
    }
  }]);

  return ThumbnailView;
}(_react.Component);

ThumbnailView.defaultProps = _Gallery.galleryViewDefaultProps;

ThumbnailView.propTypes = _Gallery.galleryViewPropTypes;

exports.default = ThumbnailView;

/***/ }),
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.mutation = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ', '\n  ', '\n'], ['\n  mutation CreateFolder($folder:FolderInput!) {\n    createFolder(folder: $folder) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ', '\n  ', '\n']);

var _reactApollo = __webpack_require__(3);

var _graphqlTag = __webpack_require__(26);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _fileFragments = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var mutation = (0, _graphqlTag2.default)(_templateObject, _fileFragments.fileInterface, _fileFragments.file);

var config = {
  props: function props(_ref) {
    var mutate = _ref.mutate,
        _ref$ownProps = _ref.ownProps,
        errors = _ref$ownProps.errors,
        actions = _ref$ownProps.actions;

    var createFolder = function createFolder(parentId, name) {
      return mutate({
        variables: {
          folder: {
            parentId: parentId,
            name: name
          }
        }
      });
    };

    return {
      errorMessage: errors && errors[0].message,
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          createFolder: createFolder
        })
      })
    };
  }
};

exports.mutation = mutation;
exports.config = config;
exports.default = (0, _reactApollo.graphql)(mutation, config);

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.mutation = undefined;

var _templateObject = _taggedTemplateLiteral(['mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}'], ['mutation DeleteFile($id:ID!) {\n  deleteFile(id: $id)\n}']);

var _reactApollo = __webpack_require__(3);

var _graphqlTag = __webpack_require__(26);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var mutation = (0, _graphqlTag2.default)(_templateObject);

var config = {
  props: function props(_ref) {
    var mutate = _ref.mutate,
        actions = _ref.ownProps.actions;

    var deleteFile = function deleteFile(id, dataId) {
      return mutate({
        variables: {
          id: id
        },
        resultBehaviors: [{
          type: 'DELETE',
          dataId: dataId
        }]
      });
    };

    return {
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          deleteFile: deleteFile
        })
      })
    };
  }
};

exports.mutation = mutation;
exports.config = config;
exports.default = (0, _reactApollo.graphql)(mutation, config);

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.mutation = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  mutation MoveFiles($folderId:ID!, $fileIds:[ID]!) {\n    moveFiles(folderId: $folderId, fileIds: $fileIds) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ', '\n  ', '\n'], ['\n  mutation MoveFiles($folderId:ID!, $fileIds:[ID]!) {\n    moveFiles(folderId: $folderId, fileIds: $fileIds) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ', '\n  ', '\n']);

var _reactApollo = __webpack_require__(3);

var _graphqlTag = __webpack_require__(26);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _fileFragments = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var mutation = (0, _graphqlTag2.default)(_templateObject, _fileFragments.fileInterface, _fileFragments.file);

var config = {
  props: function props(_ref) {
    var mutate = _ref.mutate,
        actions = _ref.ownProps.actions;
    return {
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          moveFiles: function moveFiles(folderId, fileIds) {
            return mutate({
              variables: {
                folderId: folderId,
                fileIds: fileIds
              }
            });
          }
        })
      })
    };
  }
};

exports.mutation = mutation;
exports.config = config;
exports.default = (0, _reactApollo.graphql)(mutation, config);

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.query = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _templateObject = _taggedTemplateLiteral(['\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ', '\n  ', '\n  ', '\n'], ['\n  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, \n    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]\n  ) {\n    readFiles(filter: $rootFilter) {\n      pageInfo {\n        totalCount\n      }\n      edges {\n        node {\n          ...FileInterfaceFields\n          ...FileFields\n          ...on Folder {\n            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {\n              pageInfo {\n                totalCount\n              }\n              edges {\n                node {\n                  ...FileInterfaceFields\n                  ...FileFields\n                  ...FolderFields\n                }\n              }\n            }\n            parents {\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  ', '\n  ', '\n  ', '\n']);

var _reactApollo = __webpack_require__(3);

var _graphqlTag = __webpack_require__(26);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _fileFragments = __webpack_require__(39);

var _Search = __webpack_require__(82);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var query = (0, _graphqlTag2.default)(_templateObject, _fileFragments.fileInterface, _fileFragments.file, _fileFragments.folder);

var config = {
  options: function options(_ref) {
    var sectionConfig = _ref.sectionConfig,
        folderId = _ref.folderId,
        fileId = _ref.fileId,
        params = _ref.query;

    var filter = Object.assign({}, params.filter);
    var childrenFilter = Object.assign({}, filter, {
      parentId: undefined,

      recursive: (0, _Search.hasFilters)(filter),

      currentFolderOnly: undefined
    });

    var anyChildId = (0, _Search.hasFilters)(filter) ? null : fileId || null;
    var id = anyChildId ? null : folderId || 0;

    var rootFilter = {
      id: id,

      anyChildId: anyChildId
    };

    var _ref2 = params.sort ? params.sort.split(',') : ['', ''],
        _ref3 = _slicedToArray(_ref2, 2),
        sortField = _ref3[0],
        sortDir = _ref3[1];

    var limit = params.limit || sectionConfig.limit;
    return {
      variables: {
        rootFilter: rootFilter,
        childrenFilter: childrenFilter,
        limit: limit,
        offset: ((params.page || 1) - 1) * limit,
        sortBy: sortField && sortDir ? [{ field: sortField, direction: sortDir.toUpperCase() }] : undefined
      }
    };
  },
  props: function props(_ref4) {
    var _ref4$data = _ref4.data,
        refetch = _ref4$data.refetch,
        readFiles = _ref4$data.readFiles,
        networkLoading = _ref4$data.loading,
        actions = _ref4.ownProps.actions;

    var folder = readFiles && readFiles.edges[0] ? readFiles.edges[0].node : null;
    var files = folder && folder.children ? folder.children.edges.map(function (edge) {
      return edge.node;
    }).filter(function (file) {
      return file;
    }) : [];
    var filesTotalCount = folder && folder.children ? folder.children.pageInfo.totalCount : 0;

    var filesLoading = folder && !folder.children;

    return {
      loading: networkLoading || filesLoading,
      folder: folder,
      files: files,
      filesTotalCount: filesTotalCount,
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          readFiles: refetch
        })
      })
    };
  }
};

exports.query = query;
exports.config = config;
exports.default = (0, _reactApollo.graphql)(query, config);

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.mutation = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  mutation UnpublishFile($id:ID!) {\n    unpublishFile(id: $id) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ', '\n  ', '\n'], ['\n  mutation UnpublishFile($id:ID!) {\n    unpublishFile(id: $id) {\n      ...FileInterfaceFields\n      ...FileFields\n    }\n  }\n  ', '\n  ', '\n']);

var _reactApollo = __webpack_require__(3);

var _graphqlTag = __webpack_require__(26);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _fileFragments = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var mutation = (0, _graphqlTag2.default)(_templateObject, _fileFragments.fileInterface, _fileFragments.file);

var config = {
  props: function props(_ref) {
    var mutate = _ref.mutate,
        actions = _ref.ownProps.actions;

    var unpublishFile = function unpublishFile(id, dataId) {
      return mutate({
        variables: {
          id: id
        },
        resultBehaviors: [{
          type: 'UNPUBLISH',
          dataId: dataId
        }]
      });
    };

    return {
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          unpublishFile: unpublishFile
        })
      })
    };
  }
};

exports.mutation = mutation;
exports.config = config;
exports.default = (0, _reactApollo.graphql)(mutation, config);

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = galleryReducer;

var _deepFreezeStrict = __webpack_require__(53);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _GalleryActionTypes = __webpack_require__(87);

var _GalleryActionTypes2 = _interopRequireDefault(_GalleryActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  selectedFiles: [],
  errorMessage: null,
  enableDropzone: true,
  badges: []
};

function galleryReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      type = _ref.type,
      payload = _ref.payload;

  switch (type) {

    case _GalleryActionTypes2.default.SET_FILE_BADGE:
      {
        return _extends({}, state, {
          badges: state.badges.filter(function (badge) {
            return badge.id !== payload.id;
          }).concat([payload])
        });
      }

    case _GalleryActionTypes2.default.CLEAR_FILE_BADGE:
      {
        return _extends({}, state, {
          badges: state.badges.filter(function (badge) {
            return badge.id !== payload.id;
          })
        });
      }

    case _GalleryActionTypes2.default.SET_ENABLE_DROPZONE:
      {
        return _extends({}, state, {
          enableDropzone: payload.enableDropzone
        });
      }

    case _GalleryActionTypes2.default.SET_NOTICE_MESSAGE:
      {
        return _extends({}, state, {
          noticeMessage: payload.message
        });
      }

    case _GalleryActionTypes2.default.SET_ERROR_MESSAGE:
      {
        return _extends({}, state, {
          errorMessage: payload.message
        });
      }

    case _GalleryActionTypes2.default.LOAD_FILE_SUCCESS:
      {
        var oldFile = state.files.find(function (file) {
          return file.id === payload.id;
        });
        if (oldFile) {
          var updatedFile = _extends({}, oldFile, payload.file);

          return (0, _deepFreezeStrict2.default)(_extends({}, state, {
            files: state.files.map(function (file) {
              return file.id === updatedFile.id ? updatedFile : file;
            })
          }));
        } else if (state.folder.id === payload.id) {
          return (0, _deepFreezeStrict2.default)(_extends({}, state, {
            folder: _extends({}, state.folder, payload.file)
          }));
        }
        return state;
      }

    case _GalleryActionTypes2.default.SELECT_FILES:
      {
        var selectedFiles = null;

        if (payload.ids === null) {
          selectedFiles = state.files.map(function (file) {
            return file.id;
          });
        } else {
          selectedFiles = state.selectedFiles.concat(payload.ids.filter(function (id) {
            return state.selectedFiles.indexOf(id) === -1;
          }));
        }

        return (0, _deepFreezeStrict2.default)(_extends({}, state, {
          selectedFiles: selectedFiles
        }));
      }

    case _GalleryActionTypes2.default.DESELECT_FILES:
      {
        var _selectedFiles = null;
        if (payload.ids === null) {
          _selectedFiles = [];
        } else {
          _selectedFiles = state.selectedFiles.filter(function (id) {
            return payload.ids.indexOf(id) === -1;
          });
        }

        return (0, _deepFreezeStrict2.default)(_extends({}, state, {
          selectedFiles: _selectedFiles
        }));
      }

    default:
      return state;
  }
}

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultImageFactory = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImageLoadStatus = __webpack_require__(90);

var _ImageLoadStatus2 = _interopRequireDefault(_ImageLoadStatus);

var _ImageLoadLocker = __webpack_require__(188);

var _ImageLoadLocker2 = _interopRequireDefault(_ImageLoadLocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  minRetry: 0,
  maxRetry: 0,
  expiry: 0,

  onStatusChange: function onStatusChange() {
    return null;
  },
  onRetry: function onRetry() {
    return null;
  },
  onReset: function onReset() {
    return null;
  },
  onTimeout: function onTimeout() {
    return null;
  }
};

var defaultImageFactory = function defaultImageFactory(url, resolve, reject) {
  var img = new Image();
  img.onload = resolve;
  img.onerror = reject;
  img.src = url;
};

var ImageLoadActionHandler = function () {
  function ImageLoadActionHandler(options) {
    var factory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultImageFactory;

    _classCallCheck(this, ImageLoadActionHandler);

    this.options = _extends({}, defaultOptions, options);
    this.factory = factory;
  }

  _createClass(ImageLoadActionHandler, [{
    key: 'loadImage',
    value: function loadImage(url) {
      if (!this.options.minRetry) {
        return null;
      }

      if (!_ImageLoadLocker2.default.lock(url)) {
        return null;
      }

      return this.loadImageLoop(url, this.options.minRetry);
    }
  }, {
    key: 'loadImageLoop',
    value: function loadImageLoop(url, retryAfter) {
      var _this = this;

      this.options.onStatusChange(url, _ImageLoadStatus2.default.LOADING);

      return new Promise(function (resolve, reject) {
        return _this.factory(url, resolve, reject);
      }).then(function () {
        return _this.handleSuccess(url);
      }).catch(function () {
        return _this.handleError(url, retryAfter);
      });
    }
  }, {
    key: 'handleReset',
    value: function handleReset(url, resolve) {
      this.options.onReset(url);
      resolve();
    }
  }, {
    key: 'handleTimeout',
    value: function handleTimeout(callback, delay) {
      var id = setTimeout(callback, delay);
      this.options.onTimeout(id, delay);
      return id;
    }
  }, {
    key: 'handleSuccess',
    value: function handleSuccess(url) {
      _ImageLoadLocker2.default.unlock(url);
      this.options.onStatusChange(url, _ImageLoadStatus2.default.SUCCESS);
    }
  }, {
    key: 'handleFailure',
    value: function handleFailure(url) {
      var _this2 = this;

      _ImageLoadLocker2.default.unlock(url);
      this.options.onStatusChange(url, _ImageLoadStatus2.default.FAILED);

      if (this.options.expiry) {
        return new Promise(function (resolve) {
          _this2.handleTimeout(function () {
            return _this2.handleReset(url, resolve);
          }, _this2.options.expiry * 1000);
        });
      }

      return null;
    }
  }, {
    key: 'handleError',
    value: function handleError(url, retryAfter) {
      if (retryAfter > this.options.maxRetry) {
        return this.handleFailure(url);
      }

      this.options.onStatusChange(url, _ImageLoadStatus2.default.WAITING);

      return this.handleRetry(url, retryAfter);
    }
  }, {
    key: 'handleRetry',
    value: function handleRetry(url, retryAfter) {
      var _this3 = this;

      var promise = new Promise(function (resolve) {
        _this3.handleTimeout(function () {
          return resolve(_this3.loadImageLoop(url, retryAfter * 2));
        }, retryAfter * 1000);
      });
      this.options.onRetry(url, retryAfter, promise);
      return promise;
    }
  }, {
    key: 'setOnRetry',
    value: function setOnRetry(callback) {
      this.options.onRetry = callback;
    }
  }, {
    key: 'setOnReset',
    value: function setOnReset(callback) {
      this.options.onReset = callback;
    }
  }, {
    key: 'setOnStatusChange',
    value: function setOnStatusChange(callback) {
      this.options.onStatusChange = callback;
    }
  }, {
    key: 'setOnTimeout',
    value: function setOnTimeout(callback) {
      this.options.onTimeout = callback;
    }
  }]);

  return ImageLoadActionHandler;
}();

exports.defaultImageFactory = defaultImageFactory;
exports.default = ImageLoadActionHandler;

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.loadImage = loadImage;

var _ImageLoadActionTypes = __webpack_require__(89);

var _ImageLoadActionTypes2 = _interopRequireDefault(_ImageLoadActionTypes);

var _ImageLoadActionHandler = __webpack_require__(186);

var _ImageLoadActionHandler2 = _interopRequireDefault(_ImageLoadActionHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadImage(url, options) {
  return function (dispatch, getState) {
    if (!url) {
      return null;
    }

    var state = getState();
    var currentFile = state.assetAdmin.imageLoad.files.find(function (file) {
      return file.url === url;
    });
    if (currentFile) {
      return null;
    }

    var loadOptions = _extends({}, options, {
      onStatusChange: function onStatusChange(statusURL, status) {
        return dispatch({
          type: _ImageLoadActionTypes2.default.SET_STATUS,
          payload: { status: status, url: statusURL }
        });
      },
      onReset: function onReset(statusURL) {
        return dispatch({
          type: _ImageLoadActionTypes2.default.RESET,
          payload: { url: statusURL }
        });
      }
    });

    var handler = new _ImageLoadActionHandler2.default(loadOptions);
    return handler.loadImage(url);
  };
}

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageLoadLocker = function () {
  function ImageLoadLocker() {
    _classCallCheck(this, ImageLoadLocker);

    this.urls = [];
  }

  _createClass(ImageLoadLocker, [{
    key: "lock",
    value: function lock(url) {
      var index = this.urls.indexOf(url);
      if (index >= 0) {
        return false;
      }
      this.urls = [].concat(_toConsumableArray(this.urls), [url]);
      return true;
    }
  }, {
    key: "unlock",
    value: function unlock(url) {
      this.urls = this.urls.filter(function (next) {
        return next !== url;
      });
    }
  }]);

  return ImageLoadLocker;
}();

window.ss = window.ss || {};
window.ss.imagelocker = window.ss.imagelocker || new ImageLoadLocker();

exports.ImageLoadLocker = ImageLoadLocker;
exports.default = window.ss.imagelocker;

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = imageLoadReducer;

var _ImageLoadActionTypes = __webpack_require__(89);

var _ImageLoadActionTypes2 = _interopRequireDefault(_ImageLoadActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  files: [] };

function imageLoadReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      type = _ref.type,
      payload = _ref.payload;

  switch (type) {

    case _ImageLoadActionTypes2.default.SET_STATUS:
      {
        return _extends({}, state, {
          files: [].concat(_toConsumableArray(state.files.filter(function (file) {
            return file.url !== payload.url;
          })), [payload])
        });
      }

    case _ImageLoadActionTypes2.default.RESET:
      {
        return _extends({}, state, {
          files: [].concat(_toConsumableArray(state.files.filter(function (file) {
            return file.url !== payload.url;
          })))
        });
      }

    default:
      return state;
  }
}

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeFile = removeFile;
exports.addFile = addFile;
exports.failUpload = failUpload;
exports.updateFile = updateFile;

var _PreviewFieldActionTypes = __webpack_require__(91);

var _PreviewFieldActionTypes2 = _interopRequireDefault(_PreviewFieldActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeFile(id) {
  return {
    type: _PreviewFieldActionTypes2.default.PREVIEWFIELD_REMOVE_FILE,
    payload: { id: id }
  };
}

function addFile(id, file) {
  return {
    type: _PreviewFieldActionTypes2.default.PREVIEWFIELD_ADD_FILE,
    payload: { id: id, file: file }
  };
}

function failUpload(id, message) {
  return {
    type: _PreviewFieldActionTypes2.default.PREVIEWFIELD_FAIL_UPLOAD,
    payload: { id: id, message: message }
  };
}

function updateFile(id, data) {
  return {
    type: _PreviewFieldActionTypes2.default.PREVIEWFIELD_UPDATE_FILE,
    payload: { id: id, data: data }
  };
}

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(53);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _PreviewFieldActionTypes = __webpack_require__(91);

var _PreviewFieldActionTypes2 = _interopRequireDefault(_PreviewFieldActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {};

function previewFieldReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _PreviewFieldActionTypes2.default.PREVIEWFIELD_ADD_FILE:
      {
        return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, action.payload.id, action.payload.file)));
      }

    case _PreviewFieldActionTypes2.default.PREVIEWFIELD_FAIL_UPLOAD:
      {
        return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, action.payload.id, Object.assign({}, state[action.payload.id], action.payload.message))));
      }

    case _PreviewFieldActionTypes2.default.PREVIEWFIELD_REMOVE_FILE:
      {
        return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, action.payload.id, undefined)));
      }

    case _PreviewFieldActionTypes2.default.PREVIEWFIELD_UPDATE_FILE:
      {
        return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, action.payload.id, Object.assign({}, state[action.payload.id], action.payload.data))));
      }

    default:
      return state;
  }
}

exports.default = previewFieldReducer;

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _deepFreezeStrict = __webpack_require__(53);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _QueuedFilesActionTypes = __webpack_require__(92);

var _QueuedFilesActionTypes2 = _interopRequireDefault(_QueuedFilesActionTypes);

var _fileStructure = __webpack_require__(86);

var _fileStructure2 = _interopRequireDefault(_fileStructure);

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  items: []
};

function queuedFilesReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {

    case _QueuedFilesActionTypes2.default.ADD_QUEUED_FILE:
      return (0, _deepFreezeStrict2.default)(_extends({}, state, {
        items: [].concat(_toConsumableArray(state.items), [_extends({}, _fileStructure2.default, action.payload.file)])
      }));

    case _QueuedFilesActionTypes2.default.FAIL_UPLOAD:
      return (0, _deepFreezeStrict2.default)(_extends({}, state, {
        items: state.items.map(function (file) {
          if (file.queuedId === action.payload.queuedId) {
            return _extends({}, file, {
              message: action.payload.message
            });
          }

          return file;
        })
      }));

    case _QueuedFilesActionTypes2.default.PURGE_UPLOAD_QUEUE:
      return (0, _deepFreezeStrict2.default)(_extends({}, state, {
        items: state.items.filter(function (file) {
          return !file.id;
        })
      }));

    case _QueuedFilesActionTypes2.default.REMOVE_QUEUED_FILE:
      return (0, _deepFreezeStrict2.default)(_extends({}, state, {
        items: state.items.filter(function (file) {
          return file.queuedId !== action.payload.queuedId;
        })
      }));

    case _QueuedFilesActionTypes2.default.SUCCEED_UPLOAD:
      return (0, _deepFreezeStrict2.default)(_extends({}, state, {
        items: state.items.map(function (file) {
          if (file.queuedId === action.payload.queuedId) {
            return _extends({}, file, action.payload.json, {
              messages: [{
                value: _i18n2.default._t('AssetAdmin.DROPZONE_SUCCESS_UPLOAD'),
                type: 'success',
                extraClass: 'success'
              }]
            });
          }
          return file;
        })
      }));

    case _QueuedFilesActionTypes2.default.UPDATE_QUEUED_FILE:
      return (0, _deepFreezeStrict2.default)(_extends({}, state, {
        items: state.items.map(function (file) {
          if (file.queuedId === action.payload.queuedId) {
            return _extends({}, file, action.payload.updates);
          }

          return file;
        })
      }));

    default:
      return state;
  }
}

exports.default = queuedFilesReducer;

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFile = addFile;
exports.setFiles = setFiles;
exports.failUpload = failUpload;
exports.removeFile = removeFile;
exports.succeedUpload = succeedUpload;
exports.updateQueuedFile = updateQueuedFile;

var _UploadFieldActionTypes = __webpack_require__(94);

var _UploadFieldActionTypes2 = _interopRequireDefault(_UploadFieldActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addFile(fieldId, file) {
  return function (dispatch) {
    return dispatch({
      type: _UploadFieldActionTypes2.default.UPLOADFIELD_ADD_FILE,
      payload: { fieldId: fieldId, file: file }
    });
  };
}

function setFiles(fieldId, files) {
  return function (dispatch) {
    return dispatch({
      type: _UploadFieldActionTypes2.default.UPLOADFIELD_SET_FILES,
      payload: { fieldId: fieldId, files: files }
    });
  };
}

function failUpload(fieldId, queuedId, response) {
  return function (dispatch) {
    var message = response.message;

    if (typeof response === 'string') {
      message = {
        value: response,
        type: 'error'
      };
    }
    return dispatch({
      type: _UploadFieldActionTypes2.default.UPLOADFIELD_UPLOAD_FAILURE,
      payload: { fieldId: fieldId, queuedId: queuedId, message: message }
    });
  };
}

function removeFile(fieldId, file) {
  return function (dispatch) {
    return dispatch({
      type: _UploadFieldActionTypes2.default.UPLOADFIELD_REMOVE_FILE,
      payload: { fieldId: fieldId, file: file }
    });
  };
}

function succeedUpload(fieldId, queuedId, json) {
  return function (dispatch) {
    return dispatch({
      type: _UploadFieldActionTypes2.default.UPLOADFIELD_UPLOAD_SUCCESS,
      payload: { fieldId: fieldId, queuedId: queuedId, json: json }
    });
  };
}

function updateQueuedFile(fieldId, queuedId, updates) {
  return function (dispatch) {
    return dispatch({
      type: _UploadFieldActionTypes2.default.UPLOADFIELD_UPDATE_QUEUED_FILE,
      payload: { fieldId: fieldId, queuedId: queuedId, updates: updates }
    });
  };
}

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UploadFieldActionTypes = __webpack_require__(94);

var _UploadFieldActionTypes2 = _interopRequireDefault(_UploadFieldActionTypes);

var _fileStructure = __webpack_require__(86);

var _fileStructure2 = _interopRequireDefault(_fileStructure);

var _reduxFieldReducer = __webpack_require__(353);

var _reduxFieldReducer2 = _interopRequireDefault(_reduxFieldReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  fields: {}
};

var initialFieldState = { files: [] };

function uploadFieldReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  var reduceField = (0, _reduxFieldReducer2.default)(state, action, initialFieldState);

  switch (action.type) {
    case _UploadFieldActionTypes2.default.UPLOADFIELD_ADD_FILE:
      return reduceField(function (field) {
        return {
          files: [].concat(_toConsumableArray(field.files), [Object.assign({}, _fileStructure2.default, action.payload.file)])
        };
      });

    case _UploadFieldActionTypes2.default.UPLOADFIELD_SET_FILES:
      return reduceField(function () {
        return { files: action.payload.files };
      });

    case _UploadFieldActionTypes2.default.UPLOADFIELD_UPLOAD_FAILURE:
      return reduceField(function (field) {
        return {
          files: field.files.map(function (file) {
            if (file.queuedId === action.payload.queuedId) {
              return Object.assign({}, file, {
                message: action.payload.message
              });
            }
            return file;
          })
        };
      });

    case _UploadFieldActionTypes2.default.UPLOADFIELD_REMOVE_FILE:
      return reduceField(function (field) {
        return {
          files: field.files.filter(function (file) {
            return !(action.payload.file.queuedId && file.queuedId === action.payload.file.queuedId || action.payload.file.id && file.id === action.payload.file.id);
          })
        };
      });

    case _UploadFieldActionTypes2.default.UPLOADFIELD_UPLOAD_SUCCESS:
      return reduceField(function (field) {
        return {
          files: field.files.map(function (file) {
            if (file.queuedId === action.payload.queuedId) {
              return Object.assign({}, file, action.payload.json);
            }
            return file;
          })
        };
      });

    case _UploadFieldActionTypes2.default.UPLOADFIELD_UPDATE_QUEUED_FILE:
      return reduceField(function (field) {
        return {
          files: field.files.map(function (file) {
            if (file.queuedId === action.payload.queuedId) {
              return Object.assign({}, file, action.payload.updates);
            }
            return file;
          })
        };
      });

    default:
      return state;
  }
}

exports.default = uploadFieldReducer;

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InsertEmbedModal = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _redux = __webpack_require__(8);

var _reactRedux = __webpack_require__(4);

var _FormBuilderModal = __webpack_require__(36);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

var _SchemaActions = __webpack_require__(55);

var schemaActions = _interopRequireWildcard(_SchemaActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

var InsertEmbedModal = function (_Component) {
  _inherits(InsertEmbedModal, _Component);

  function InsertEmbedModal(props) {
    _classCallCheck(this, InsertEmbedModal);

    var _this = _possibleConstructorReturn(this, (InsertEmbedModal.__proto__ || Object.getPrototypeOf(InsertEmbedModal)).call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(InsertEmbedModal, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setOverrides(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.show && !this.props.show) {
        this.setOverrides(props);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearOverrides();
    }
  }, {
    key: 'setOverrides',
    value: function setOverrides(props) {
      if (this.props.schemaUrl !== props.schemaUrl) {
        this.clearOverrides();
      }
      if (props.schemaUrl) {
        var attrs = Object.assign({}, props.fileAttributes);
        delete attrs.ID;

        var overrides = {
          fields: Object.entries(attrs).map(function (field) {
            var _field = _slicedToArray(field, 2),
                name = _field[0],
                value = _field[1];

            return { name: name, value: value };
          })
        };

        this.props.actions.schema.setSchemaStateOverrides(props.schemaUrl, overrides);
      }
    }
  }, {
    key: 'getModalProps',
    value: function getModalProps() {
      var props = Object.assign({
        handleSubmit: this.handleSubmit,
        onLoadingError: this.handleLoadingError,
        showErrorMessage: true,
        responseClassBad: 'alert alert-danger',
        identifier: 'AssetAdmin.InsertEmbedModal'
      }, this.props, {
        className: 'insert-embed-modal ' + this.props.className,
        bsSize: 'lg',
        handleHide: this.props.onHide,
        title: this.props.targetUrl ? _i18n2.default._t('AssetAdmin.EditTitle', 'Media from the web') : _i18n2.default._t('AssetAdmin.CreateTitle', 'Insert new media from the web')
      });
      delete props.onHide;
      delete props.sectionConfig;
      delete props.onInsert;
      delete props.fileAttributes;

      return props;
    }
  }, {
    key: 'clearOverrides',
    value: function clearOverrides() {
      this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl, null);
    }
  }, {
    key: 'handleLoadingError',
    value: function handleLoadingError(error) {
      if (typeof this.props.onLoadingError === 'function') {
        this.props.onLoadingError(error);
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action) {
      switch (action) {
        case 'action_addmedia':
          {
            this.props.onCreate(data);
            break;
          }
        case 'action_insertmedia':
          {
            this.props.onInsert(data);
            break;
          }
        case 'action_cancel':
          {
            this.props.onHide();
            break;
          }
        default:
          {}
      }

      return Promise.resolve();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_FormBuilderModal2.default, this.getModalProps());
    }
  }]);

  return InsertEmbedModal;
}(_react.Component);

InsertEmbedModal.propTypes = {
  sectionConfig: _react.PropTypes.shape({
    url: _react.PropTypes.string,
    form: _react.PropTypes.object
  }),
  show: _react.PropTypes.bool,
  onInsert: _react.PropTypes.func.isRequired,
  onCreate: _react.PropTypes.func.isRequired,
  fileAttributes: _react.PropTypes.shape({
    Url: _react.PropTypes.string,
    CaptionText: _react.PropTypes.string,
    PreviewUrl: _react.PropTypes.string,
    Placement: _react.PropTypes.string,
    Width: _react.PropTypes.number,
    Height: _react.PropTypes.number
  }),
  onHide: _react.PropTypes.func.isRequired,
  className: _react.PropTypes.string,
  actions: _react.PropTypes.object,
  schemaUrl: _react.PropTypes.string.isRequired,
  targetUrl: _react.PropTypes.string,
  onLoadingError: _react.PropTypes.func
};

InsertEmbedModal.defaultProps = {
  className: '',
  fileAttributes: {}
};

function mapStateToProps(state, ownProps) {
  var sectionConfig = state.config.sections.find(function (section) {
    return section.name === sectionConfigKey;
  });

  var targetUrl = ownProps.fileAttributes ? ownProps.fileAttributes.Url : '';
  var baseEditUrl = sectionConfig.form.remoteEditForm.schemaUrl;

  var editUrl = targetUrl && baseEditUrl + '/?embedurl=' + encodeURIComponent(targetUrl);
  var createUrl = sectionConfig.form.remoteCreateForm.schemaUrl;

  var schemaUrl = editUrl || createUrl;

  return {
    sectionConfig: sectionConfig,
    schemaUrl: schemaUrl,
    targetUrl: targetUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    }
  };
}

exports.InsertEmbedModal = InsertEmbedModal;
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(InsertEmbedModal);

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InsertMediaModal = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(1);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _redux = __webpack_require__(8);

var _reactRedux = __webpack_require__(4);

var _AssetAdmin = __webpack_require__(84);

var _AssetAdmin2 = _interopRequireDefault(_AssetAdmin);

var _stateRouter = __webpack_require__(170);

var _stateRouter2 = _interopRequireDefault(_stateRouter);

var _fileSchemaModalHandler = __webpack_require__(344);

var _fileSchemaModalHandler2 = _interopRequireDefault(_fileSchemaModalHandler);

var _FormBuilderModal = __webpack_require__(36);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InsertMediaModal = function (_Component) {
  _inherits(InsertMediaModal, _Component);

  function InsertMediaModal(props) {
    _classCallCheck(this, InsertMediaModal);

    var _this = _possibleConstructorReturn(this, (InsertMediaModal.__proto__ || Object.getPrototypeOf(InsertMediaModal)).call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(InsertMediaModal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.show) {
        this.props.onBrowse(0);
      }
      if (typeof this.props.setOverrides === 'function' && this.props.show && this.props.fileAttributes.ID) {
        this.props.setOverrides(this.props);
        this.props.onBrowse(null, this.props.fileAttributes.ID);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (!props.show && this.props.show) {
        props.onBrowse(0);
      }
      if (typeof this.props.setOverrides === 'function' && props.show && !this.props.show && props.fileAttributes.ID) {
        this.props.setOverrides(props);

        props.onBrowse(null, props.fileAttributes.ID);
      }
    }
  }, {
    key: 'getSectionProps',
    value: function getSectionProps() {
      return _extends({}, this.props, {
        dialog: true,
        toolbarChildren: this.renderToolbarChildren(),
        onSubmitEditor: this.handleSubmit,
        onReplaceUrl: this.props.onBrowse
      });
    }
  }, {
    key: 'getModalProps',
    value: function getModalProps() {
      var props = Object.assign({}, this.props, {
        className: 'insert-media-modal ' + this.props.className,
        bsSize: 'lg'
      });
      delete props.onHide;
      delete props.onInsert;
      delete props.sectionConfig;
      delete props.schemaUrl;

      return props;
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action, submitFn, file) {
      if (action === 'action_createfolder') {
        return submitFn();
      }
      return this.props.onInsert(data, file);
    }
  }, {
    key: 'renderToolbarChildren',
    value: function renderToolbarChildren() {
      return _react2.default.createElement(
        'button',
        {
          type: 'button',
          className: 'close insert-media-modal__close-button',
          onClick: this.props.onHide,
          'aria-label': _i18n2.default._t('FormBuilderModal.CLOSE', 'Close')
        },
        _react2.default.createElement(
          'span',
          { 'aria-hidden': 'true' },
          '\xD7'
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var modalProps = this.getModalProps();
      var sectionProps = this.getSectionProps();
      var assetAdmin = this.props.show ? _react2.default.createElement(_AssetAdmin2.default, sectionProps) : null;

      return _react2.default.createElement(
        _FormBuilderModal2.default,
        modalProps,
        assetAdmin
      );
    }
  }]);

  return InsertMediaModal;
}(_react.Component);

InsertMediaModal.propTypes = {
  sectionConfig: _react.PropTypes.shape({
    url: _react.PropTypes.string,
    form: _react.PropTypes.object
  }),
  type: _react.PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
  schemaUrl: _react.PropTypes.string,
  show: _react.PropTypes.bool,
  setOverrides: _react.PropTypes.func,
  onInsert: _react.PropTypes.func.isRequired,
  fileAttributes: _react.PropTypes.shape({
    ID: _react.PropTypes.number,
    AltText: _react.PropTypes.string,
    Width: _react.PropTypes.number,
    Height: _react.PropTypes.number,
    TitleTooltip: _react.PropTypes.string,
    Alignment: _react.PropTypes.string,
    Description: _react.PropTypes.string,
    TargetBlank: _react.PropTypes.bool
  }),
  folderId: _react.PropTypes.number,
  fileId: _react.PropTypes.number,
  viewAction: _react.PropTypes.string,
  query: _react.PropTypes.object,
  getUrl: _react.PropTypes.func,
  onBrowse: _react.PropTypes.func.isRequired,
  onHide: _react.PropTypes.func,
  className: _react.PropTypes.string,
  actions: _react.PropTypes.object
};

InsertMediaModal.defaultProps = {
  className: '',
  fileAttributes: {},
  type: 'insert-media'
};

function mapStateToProps(state, ownProps) {
  var config = ownProps.sectionConfig;

  if (!config) {
    return {};
  }

  var folderId = 0;
  if (ownProps.folderId !== null) {
    folderId = ownProps.folderId;
  } else if (ownProps.folder) {
    folderId = ownProps.folder.id;
  }
  var fileId = ownProps.fileAttributes ? ownProps.fileAttributes.ID : ownProps.fileId;

  var props = {
    config: config,
    viewAction: ownProps.viewAction,
    folderId: folderId,
    type: ownProps.type,
    fileId: fileId
  };

  var _getFormSchema = (0, _AssetAdmin.getFormSchema)(props),
      schemaUrl = _getFormSchema.schemaUrl,
      targetId = _getFormSchema.targetId;

  if (!schemaUrl) {
    return {};
  }

  return {
    schemaUrl: schemaUrl + '/' + targetId
  };
}

exports.InsertMediaModal = InsertMediaModal;
exports.default = (0, _redux.compose)(_stateRouter2.default, (0, _reactRedux.connect)(mapStateToProps), _fileSchemaModalHandler2.default)(InsertMediaModal);

/***/ }),
/* 197 */
/***/ (function(module, exports) {

module.exports = {
	"O_RDONLY": 0,
	"O_WRONLY": 1,
	"O_RDWR": 2,
	"S_IFMT": 61440,
	"S_IFREG": 32768,
	"S_IFDIR": 16384,
	"S_IFCHR": 8192,
	"S_IFBLK": 24576,
	"S_IFIFO": 4096,
	"S_IFLNK": 40960,
	"S_IFSOCK": 49152,
	"O_CREAT": 512,
	"O_EXCL": 2048,
	"O_NOCTTY": 131072,
	"O_TRUNC": 1024,
	"O_APPEND": 8,
	"O_DIRECTORY": 1048576,
	"O_NOFOLLOW": 256,
	"O_SYNC": 128,
	"O_SYMLINK": 2097152,
	"O_NONBLOCK": 4,
	"S_IRWXU": 448,
	"S_IRUSR": 256,
	"S_IWUSR": 128,
	"S_IXUSR": 64,
	"S_IRWXG": 56,
	"S_IRGRP": 32,
	"S_IWGRP": 16,
	"S_IXGRP": 8,
	"S_IRWXO": 7,
	"S_IROTH": 4,
	"S_IWOTH": 2,
	"S_IXOTH": 1,
	"E2BIG": 7,
	"EACCES": 13,
	"EADDRINUSE": 48,
	"EADDRNOTAVAIL": 49,
	"EAFNOSUPPORT": 47,
	"EAGAIN": 35,
	"EALREADY": 37,
	"EBADF": 9,
	"EBADMSG": 94,
	"EBUSY": 16,
	"ECANCELED": 89,
	"ECHILD": 10,
	"ECONNABORTED": 53,
	"ECONNREFUSED": 61,
	"ECONNRESET": 54,
	"EDEADLK": 11,
	"EDESTADDRREQ": 39,
	"EDOM": 33,
	"EDQUOT": 69,
	"EEXIST": 17,
	"EFAULT": 14,
	"EFBIG": 27,
	"EHOSTUNREACH": 65,
	"EIDRM": 90,
	"EILSEQ": 92,
	"EINPROGRESS": 36,
	"EINTR": 4,
	"EINVAL": 22,
	"EIO": 5,
	"EISCONN": 56,
	"EISDIR": 21,
	"ELOOP": 62,
	"EMFILE": 24,
	"EMLINK": 31,
	"EMSGSIZE": 40,
	"EMULTIHOP": 95,
	"ENAMETOOLONG": 63,
	"ENETDOWN": 50,
	"ENETRESET": 52,
	"ENETUNREACH": 51,
	"ENFILE": 23,
	"ENOBUFS": 55,
	"ENODATA": 96,
	"ENODEV": 19,
	"ENOENT": 2,
	"ENOEXEC": 8,
	"ENOLCK": 77,
	"ENOLINK": 97,
	"ENOMEM": 12,
	"ENOMSG": 91,
	"ENOPROTOOPT": 42,
	"ENOSPC": 28,
	"ENOSR": 98,
	"ENOSTR": 99,
	"ENOSYS": 78,
	"ENOTCONN": 57,
	"ENOTDIR": 20,
	"ENOTEMPTY": 66,
	"ENOTSOCK": 38,
	"ENOTSUP": 45,
	"ENOTTY": 25,
	"ENXIO": 6,
	"EOPNOTSUPP": 102,
	"EOVERFLOW": 84,
	"EPERM": 1,
	"EPIPE": 32,
	"EPROTO": 100,
	"EPROTONOSUPPORT": 43,
	"EPROTOTYPE": 41,
	"ERANGE": 34,
	"EROFS": 30,
	"ESPIPE": 29,
	"ESRCH": 3,
	"ESTALE": 70,
	"ETIME": 101,
	"ETIMEDOUT": 60,
	"ETXTBSY": 26,
	"EWOULDBLOCK": 35,
	"EXDEV": 18,
	"SIGHUP": 1,
	"SIGINT": 2,
	"SIGQUIT": 3,
	"SIGILL": 4,
	"SIGTRAP": 5,
	"SIGABRT": 6,
	"SIGIOT": 6,
	"SIGBUS": 10,
	"SIGFPE": 8,
	"SIGKILL": 9,
	"SIGUSR1": 30,
	"SIGSEGV": 11,
	"SIGUSR2": 31,
	"SIGPIPE": 13,
	"SIGALRM": 14,
	"SIGTERM": 15,
	"SIGCHLD": 20,
	"SIGCONT": 19,
	"SIGSTOP": 17,
	"SIGTSTP": 18,
	"SIGTTIN": 21,
	"SIGTTOU": 22,
	"SIGURG": 16,
	"SIGXCPU": 24,
	"SIGXFSZ": 25,
	"SIGVTALRM": 26,
	"SIGPROF": 27,
	"SIGWINCH": 28,
	"SIGIO": 23,
	"SIGSYS": 12,
	"SSL_OP_ALL": 2147486719,
	"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION": 262144,
	"SSL_OP_CIPHER_SERVER_PREFERENCE": 4194304,
	"SSL_OP_CISCO_ANYCONNECT": 32768,
	"SSL_OP_COOKIE_EXCHANGE": 8192,
	"SSL_OP_CRYPTOPRO_TLSEXT_BUG": 2147483648,
	"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS": 2048,
	"SSL_OP_EPHEMERAL_RSA": 0,
	"SSL_OP_LEGACY_SERVER_CONNECT": 4,
	"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER": 32,
	"SSL_OP_MICROSOFT_SESS_ID_BUG": 1,
	"SSL_OP_MSIE_SSLV2_RSA_PADDING": 0,
	"SSL_OP_NETSCAPE_CA_DN_BUG": 536870912,
	"SSL_OP_NETSCAPE_CHALLENGE_BUG": 2,
	"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG": 1073741824,
	"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG": 8,
	"SSL_OP_NO_COMPRESSION": 131072,
	"SSL_OP_NO_QUERY_MTU": 4096,
	"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION": 65536,
	"SSL_OP_NO_SSLv2": 16777216,
	"SSL_OP_NO_SSLv3": 33554432,
	"SSL_OP_NO_TICKET": 16384,
	"SSL_OP_NO_TLSv1": 67108864,
	"SSL_OP_NO_TLSv1_1": 268435456,
	"SSL_OP_NO_TLSv1_2": 134217728,
	"SSL_OP_PKCS1_CHECK_1": 0,
	"SSL_OP_PKCS1_CHECK_2": 0,
	"SSL_OP_SINGLE_DH_USE": 1048576,
	"SSL_OP_SINGLE_ECDH_USE": 524288,
	"SSL_OP_SSLEAY_080_CLIENT_DH_BUG": 128,
	"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG": 0,
	"SSL_OP_TLS_BLOCK_PADDING_BUG": 512,
	"SSL_OP_TLS_D5_BUG": 256,
	"SSL_OP_TLS_ROLLBACK_BUG": 8388608,
	"ENGINE_METHOD_DSA": 2,
	"ENGINE_METHOD_DH": 4,
	"ENGINE_METHOD_RAND": 8,
	"ENGINE_METHOD_ECDH": 16,
	"ENGINE_METHOD_ECDSA": 32,
	"ENGINE_METHOD_CIPHERS": 64,
	"ENGINE_METHOD_DIGESTS": 128,
	"ENGINE_METHOD_STORE": 256,
	"ENGINE_METHOD_PKEY_METHS": 512,
	"ENGINE_METHOD_PKEY_ASN1_METHS": 1024,
	"ENGINE_METHOD_ALL": 65535,
	"ENGINE_METHOD_NONE": 0,
	"DH_CHECK_P_NOT_SAFE_PRIME": 2,
	"DH_CHECK_P_NOT_PRIME": 1,
	"DH_UNABLE_TO_CHECK_GENERATOR": 4,
	"DH_NOT_SUITABLE_GENERATOR": 8,
	"NPN_ENABLED": 1,
	"RSA_PKCS1_PADDING": 1,
	"RSA_SSLV23_PADDING": 2,
	"RSA_NO_PADDING": 3,
	"RSA_PKCS1_OAEP_PADDING": 4,
	"RSA_X931_PADDING": 5,
	"RSA_PKCS1_PSS_PADDING": 6,
	"POINT_CONVERSION_COMPRESSED": 2,
	"POINT_CONVERSION_UNCOMPRESSED": 4,
	"POINT_CONVERSION_HYBRID": 6,
	"F_OK": 0,
	"R_OK": 4,
	"W_OK": 2,
	"X_OK": 1,
	"UV_UDP_REUSEADDR": 4
};

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, module) {
/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function() {
  var Dropzone, Emitter, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  noop = function() {};

  Emitter = (function() {
    function Emitter() {}

    Emitter.prototype.addEventListener = Emitter.prototype.on;

    Emitter.prototype.on = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    };

    Emitter.prototype.emit = function() {
      var args, callback, callbacks, event, _i, _len;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._callbacks = this._callbacks || {};
      callbacks = this._callbacks[event];
      if (callbacks) {
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback.apply(this, args);
        }
      }
      return this;
    };

    Emitter.prototype.removeListener = Emitter.prototype.off;

    Emitter.prototype.removeAllListeners = Emitter.prototype.off;

    Emitter.prototype.removeEventListener = Emitter.prototype.off;

    Emitter.prototype.off = function(event, fn) {
      var callback, callbacks, i, _i, _len;
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }
      callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }
      for (i = _i = 0, _len = callbacks.length; _i < _len; i = ++_i) {
        callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    return Emitter;

  })();

  Dropzone = (function(_super) {
    var extend, resolveOption;

    __extends(Dropzone, _super);

    Dropzone.prototype.Emitter = Emitter;


    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
     */

    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      method: "post",
      withCredentials: false,
      parallelUploads: 2,
      uploadMultiple: false,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 10,
      thumbnailWidth: 120,
      thumbnailHeight: 120,
      filesizeBase: 1000,
      maxFiles: null,
      params: {},
      clickable: true,
      ignoreHiddenFiles: true,
      acceptedFiles: null,
      acceptedMimeTypes: null,
      autoProcessQueue: true,
      autoQueue: true,
      addRemoveLinks: false,
      previewsContainer: null,
      hiddenInputContainer: "body",
      capture: null,
      renameFilename: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      dictCancelUpload: "Cancel upload",
      dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
      dictRemoveFile: "Remove file",
      dictRemoveFileConfirmation: null,
      dictMaxFilesExceeded: "You can not upload any more files.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      forceFallback: false,
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;
        this.element.className = "" + this.element.className + " dz-browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )dz-message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          if (span.textContent != null) {
            span.textContent = this.options.dictFallbackMessage;
          } else if (span.innerText != null) {
            span.innerText = this.options.dictFallbackMessage;
          }
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file) {
        var info, srcRatio, trgRatio;
        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = this.options.thumbnailWidth;
        info.optHeight = this.options.thumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
          info.optWidth = info.srcWidth;
          info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
          info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
          info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
      },

      /*
      Those functions register themselves to the events on init and handle all
      the user interface specific stuff. Overwriting them won't break the upload
      but can break the way it's displayed.
      You can overwrite them if you don't like the default behavior. If you just
      want to add an additional event handler, register it on the dropzone object
      and don't overwrite those options.
       */
      drop: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      paste: noop,
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        if (this.element === this.previewsContainer) {
          this.element.classList.add("dz-started");
        }
        if (this.previewsContainer) {
          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
          file.previewTemplate = file.previewElement;
          this.previewsContainer.appendChild(file.previewElement);
          _ref = file.previewElement.querySelectorAll("[data-dz-name]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.textContent = this._renameFilename(file.name);
          }
          _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            node = _ref1[_j];
            node.innerHTML = this.filesize(file.size);
          }
          if (this.options.addRemoveLinks) {
            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
            file.previewElement.appendChild(file._removeLink);
          }
          removeFileEvent = (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                  return _this.removeFile(file);
                });
              } else {
                if (_this.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                    return _this.removeFile(file);
                  });
                } else {
                  return _this.removeFile(file);
                }
              }
            };
          })(this);
          _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            removeLink = _ref2[_k];
            _results.push(removeLink.addEventListener("click", removeFileEvent));
          }
          return _results;
        }
      },
      removedfile: function(file) {
        var _ref;
        if (file.previewElement) {
          if ((_ref = file.previewElement) != null) {
            _ref.parentNode.removeChild(file.previewElement);
          }
        }
        return this._updateMaxFilesReachedClass();
      },
      thumbnail: function(file, dataUrl) {
        var thumbnailElement, _i, _len, _ref;
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumbnailElement = _ref[_i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
          }
          return setTimeout(((function(_this) {
            return function() {
              return file.previewElement.classList.add("dz-image-preview");
            };
          })(this)), 1);
        }
      },
      error: function(file, message) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          file.previewElement.classList.add("dz-error");
          if (typeof message !== "String" && message.error) {
            message = message.error;
          }
          _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
          }
          return _results;
        }
      },
      errormultiple: noop,
      processing: function(file) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-processing");
          if (file._removeLink) {
            return file._removeLink.textContent = this.options.dictCancelUpload;
          }
        }
      },
      processingmultiple: noop,
      uploadprogress: function(file, progress, bytesSent) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (node.nodeName === 'PROGRESS') {
              _results.push(node.value = progress);
            } else {
              _results.push(node.style.width = "" + progress + "%");
            }
          }
          return _results;
        }
      },
      totaluploadprogress: noop,
      sending: noop,
      sendingmultiple: noop,
      success: function(file) {
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-success");
        }
      },
      successmultiple: noop,
      canceled: function(file) {
        return this.emit("error", file, "Upload canceled.");
      },
      canceledmultiple: noop,
      complete: function(file) {
        if (file._removeLink) {
          file._removeLink.textContent = this.options.dictRemoveFile;
        }
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-complete");
        }
      },
      completemultiple: noop,
      maxfilesexceeded: noop,
      maxfilesreached: noop,
      queuecomplete: noop,
      addedfiles: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>"
    };

    extend = function() {
      var key, object, objects, target, val, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    };

    function Dropzone(element, options) {
      var elementOptions, fallback, _ref;
      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      this.clickableElements = [];
      this.listeners = [];
      this.files = [];
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (this.element.dropzone) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      this.element.dropzone = this;
      elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if (this.options.url == null) {
        this.options.url = this.element.getAttribute("action");
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
      }
      if (this.options.acceptedMimeTypes) {
        this.options.acceptedFiles = this.options.acceptedMimeTypes;
        delete this.options.acceptedMimeTypes;
      }
      this.options.method = this.options.method.toUpperCase();
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      if (this.options.previewsContainer !== false) {
        if (this.options.previewsContainer) {
          this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
        } else {
          this.previewsContainer = this.element;
        }
      }
      if (this.options.clickable) {
        if (this.options.clickable === true) {
          this.clickableElements = [this.element];
        } else {
          this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
        }
      }
      this.init();
    }

    Dropzone.prototype.getAcceptedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getRejectedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (!file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getFilesWithStatus = function(status) {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === status) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getQueuedFiles = function() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    };

    Dropzone.prototype.getUploadingFiles = function() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    };

    Dropzone.prototype.getAddedFiles = function() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    };

    Dropzone.prototype.getActiveFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = (function(_this) {
          return function() {
            if (_this.hiddenFileInput) {
              _this.hiddenFileInput.parentNode.removeChild(_this.hiddenFileInput);
            }
            _this.hiddenFileInput = document.createElement("input");
            _this.hiddenFileInput.setAttribute("type", "file");
            if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
              _this.hiddenFileInput.setAttribute("multiple", "multiple");
            }
            _this.hiddenFileInput.className = "dz-hidden-input";
            if (_this.options.acceptedFiles != null) {
              _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
            }
            if (_this.options.capture != null) {
              _this.hiddenFileInput.setAttribute("capture", _this.options.capture);
            }
            _this.hiddenFileInput.style.visibility = "hidden";
            _this.hiddenFileInput.style.position = "absolute";
            _this.hiddenFileInput.style.top = "0";
            _this.hiddenFileInput.style.left = "0";
            _this.hiddenFileInput.style.height = "0";
            _this.hiddenFileInput.style.width = "0";
            document.querySelector(_this.options.hiddenInputContainer).appendChild(_this.hiddenFileInput);
            return _this.hiddenFileInput.addEventListener("change", function() {
              var file, files, _i, _len;
              files = _this.hiddenFileInput.files;
              if (files.length) {
                for (_i = 0, _len = files.length; _i < _len; _i++) {
                  file = files[_i];
                  _this.addFile(file);
                }
              }
              _this.emit("addedfiles", files);
              return setupHiddenFileInput();
            });
          };
        })(this);
        setupHiddenFileInput();
      }
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("removedfile", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("canceled", (function(_this) {
        return function(file) {
          return _this.emit("complete", file);
        };
      })(this));
      this.on("complete", (function(_this) {
        return function(file) {
          if (_this.getAddedFiles().length === 0 && _this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
            return setTimeout((function() {
              return _this.emit("queuecomplete");
            }), 0);
          }
        };
      })(this));
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
            "dragstart": (function(_this) {
              return function(e) {
                return _this.emit("dragstart", e);
              };
            })(this),
            "dragenter": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.emit("dragenter", e);
              };
            })(this),
            "dragover": (function(_this) {
              return function(e) {
                var efct;
                try {
                  efct = e.dataTransfer.effectAllowed;
                } catch (_error) {}
                e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                noPropagation(e);
                return _this.emit("dragover", e);
              };
            })(this),
            "dragleave": (function(_this) {
              return function(e) {
                return _this.emit("dragleave", e);
              };
            })(this),
            "drop": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.drop(e);
              };
            })(this),
            "dragend": (function(_this) {
              return function(e) {
                return _this.emit("dragend", e);
              };
            })(this)
          }
        }
      ];
      this.clickableElements.forEach((function(_this) {
        return function(clickableElement) {
          return _this.listeners.push({
            element: clickableElement,
            events: {
              "click": function(evt) {
                if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                  _this.hiddenFileInput.click();
                }
                return true;
              }
            }
          });
        };
      })(this));
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.destroy = function() {
      var _ref;
      this.disable();
      this.removeAllFiles(true);
      if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    };

    Dropzone.prototype.updateTotalUploadProgress = function() {
      var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
      totalBytesSent = 0;
      totalBytes = 0;
      activeFiles = this.getActiveFiles();
      if (activeFiles.length) {
        _ref = this.getActiveFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }
      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    };

    Dropzone.prototype._getParamName = function(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    };

    Dropzone.prototype._renameFilename = function(name) {
      if (typeof this.options.renameFilename !== "function") {
        return name;
      }
      return this.options.renameFilename(name);
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + (this._getParamName(0)) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
      fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    };

    Dropzone.prototype.getExistingFallback = function() {
      var fallback, getFallback, tagName, _i, _len, _ref;
      getFallback = function(elements) {
        var el, _i, _len;
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      var file, _i, _len, _ref, _results;
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(this.cancelUpload(file));
      }
      return _results;
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len;
      selectedSize = 0;
      selectedUnit = "b";
      if (size > 0) {
        units = ['TB', 'GB', 'MB', 'KB', 'b'];
        for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
          unit = units[i];
          cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;
          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }
        selectedSize = Math.round(10 * selectedSize) / 10;
      }
      return "<strong>" + selectedSize + "</strong> " + selectedUnit;
    };

    Dropzone.prototype._updateMaxFilesReachedClass = function() {
      if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    };

    Dropzone.prototype.drop = function(e) {
      var files, items;
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);
      files = e.dataTransfer.files;
      this.emit("addedfiles", files);
      if (files.length) {
        items = e.dataTransfer.items;
        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    };

    Dropzone.prototype.paste = function(e) {
      var items, _ref;
      if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
        return;
      }
      this.emit("paste", e);
      items = e.clipboardData.items;
      if (items.length) {
        return this._addFilesFromItems(items);
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromItems = function(items) {
      var entry, item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            _results.push(this.addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            _results.push(this._addFilesFromDirectory(entry, entry.name));
          } else {
            _results.push(void 0);
          }
        } else if (item.getAsFile != null) {
          if ((item.kind == null) || item.kind === "file") {
            _results.push(this.addFile(item.getAsFile()));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
      var dirReader, errorHandler, readEntries;
      dirReader = directory.createReader();
      errorHandler = function(error) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
      };
      readEntries = (function(_this) {
        return function() {
          return dirReader.readEntries(function(entries) {
            var entry, _i, _len;
            if (entries.length > 0) {
              for (_i = 0, _len = entries.length; _i < _len; _i++) {
                entry = entries[_i];
                if (entry.isFile) {
                  entry.file(function(file) {
                    if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                      return;
                    }
                    file.fullPath = "" + path + "/" + file.name;
                    return _this.addFile(file);
                  });
                } else if (entry.isDirectory) {
                  _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
                }
              }
              readEntries();
            }
            return null;
          }, errorHandler);
        };
      })(this);
      return readEntries();
    };

    Dropzone.prototype.accept = function(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      file.upload = {
        progress: 0,
        total: file.size,
        bytesSent: 0
      };
      this.files.push(file);
      file.status = Dropzone.ADDED;
      this.emit("addedfile", file);
      this._enqueueThumbnail(file);
      return this.accept(file, (function(_this) {
        return function(error) {
          if (error) {
            file.accepted = false;
            _this._errorProcessing([file], error);
          } else {
            file.accepted = true;
            if (_this.options.autoQueue) {
              _this.enqueueFile(file);
            }
          }
          return _this._updateMaxFilesReachedClass();
        };
      })(this));
    };

    Dropzone.prototype.enqueueFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.enqueueFile(file);
      }
      return null;
    };

    Dropzone.prototype.enqueueFile = function(file) {
      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.processQueue();
            };
          })(this)), 0);
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    };

    Dropzone.prototype._thumbnailQueue = [];

    Dropzone.prototype._processingThumbnail = false;

    Dropzone.prototype._enqueueThumbnail = function(file) {
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(((function(_this) {
          return function() {
            return _this._processThumbnailQueue();
          };
        })(this)), 0);
      }
    };

    Dropzone.prototype._processThumbnailQueue = function() {
      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }
      this._processingThumbnail = true;
      return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
        return function() {
          _this._processingThumbnail = false;
          return _this._processThumbnailQueue();
        };
      })(this));
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
      var file, _i, _len, _ref;
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file, callback) {
      var fileReader;
      fileReader = new FileReader;
      fileReader.onload = (function(_this) {
        return function() {
          if (file.type === "image/svg+xml") {
            _this.emit("thumbnail", file, fileReader.result);
            if (callback != null) {
              callback();
            }
            return;
          }
          return _this.createThumbnailFromUrl(file, fileReader.result, callback);
        };
      })(this);
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.createThumbnailFromUrl = function(file, imageUrl, callback, crossOrigin) {
      var img;
      img = document.createElement("img");
      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }
      img.onload = (function(_this) {
        return function() {
          var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.options.resize.call(_this, file);
          if (resizeInfo.trgWidth == null) {
            resizeInfo.trgWidth = resizeInfo.optWidth;
          }
          if (resizeInfo.trgHeight == null) {
            resizeInfo.trgHeight = resizeInfo.optHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          _this.emit("thumbnail", file, thumbnail);
          if (callback != null) {
            return callback();
          }
        };
      })(this);
      if (callback != null) {
        img.onerror = callback;
      }
      return img.src = imageUrl;
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength, queuedFiles;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.getUploadingFiles().length;
      i = processingLength;
      if (processingLength >= parallelUploads) {
        return;
      }
      queuedFiles = this.getQueuedFiles();
      if (!(queuedFiles.length > 0)) {
        return;
      }
      if (this.options.uploadMultiple) {
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          }
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    };

    Dropzone.prototype.processFile = function(file) {
      return this.processFiles([file]);
    };

    Dropzone.prototype.processFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.processing = true;
        file.status = Dropzone.UPLOADING;
        this.emit("processing", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }
      return this.uploadFiles(files);
    };

    Dropzone.prototype._getFilesWithXhr = function(xhr) {
      var file, files;
      return files = (function() {
        var _i, _len, _ref, _results;
        _ref = this.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.xhr === xhr) {
            _results.push(file);
          }
        }
        return _results;
      }).call(this);
    };

    Dropzone.prototype.cancelUpload = function(file) {
      var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
      if (file.status === Dropzone.UPLOADING) {
        groupedFiles = this._getFilesWithXhr(file.xhr);
        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
          groupedFile = groupedFiles[_i];
          groupedFile.status = Dropzone.CANCELED;
        }
        file.xhr.abort();
        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
          groupedFile = groupedFiles[_j];
          this.emit("canceled", groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    resolveOption = function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof option === 'function') {
        return option.apply(this, args);
      }
      return option;
    };

    Dropzone.prototype.uploadFile = function(file) {
      return this.uploadFiles([file]);
    };

    Dropzone.prototype.uploadFiles = function(files) {
      var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, method, option, progressObj, response, updateProgress, url, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      xhr = new XMLHttpRequest();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      method = resolveOption(this.options.method, files);
      url = resolveOption(this.options.url, files);
      xhr.open(method, url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = (function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
          }
          return _results;
        };
      })(this);
      updateProgress = (function(_this) {
        return function(e) {
          var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
          if (e != null) {
            progress = 100 * e.loaded / e.total;
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              file.upload = {
                progress: progress,
                total: e.total,
                bytesSent: e.loaded
              };
            }
          } else {
            allFilesFinished = true;
            progress = 100;
            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
              file = files[_k];
              if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                allFilesFinished = false;
              }
              file.upload.progress = progress;
              file.upload.bytesSent = file.upload.total;
            }
            if (allFilesFinished) {
              return;
            }
          }
          _results = [];
          for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
            file = files[_l];
            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
          }
          return _results;
        };
      })(this);
      xhr.onload = (function(_this) {
        return function(e) {
          var _ref;
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          if (xhr.readyState !== 4) {
            return;
          }
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            try {
              response = JSON.parse(response);
            } catch (_error) {
              e = _error;
              response = "Invalid JSON response from server.";
            }
          }
          updateProgress();
          if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
            return handleError();
          } else {
            return _this._finished(files, response, e);
          }
        };
      })(this);
      xhr.onerror = (function(_this) {
        return function() {
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          return handleError();
        };
      })(this);
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        formData.append(this._getParamName(i), files[i], this._renameFilename(files[i].name));
      }
      return this.submitRequest(xhr, formData, files);
    };

    Dropzone.prototype.submitRequest = function(xhr, formData, files) {
      return xhr.send(formData);
    };

    Dropzone.prototype._finished = function(files, responseText, e) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype._errorProcessing = function(files, message, xhr) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    return Dropzone;

  })(Emitter);

  Dropzone.version = "4.3.0";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Dropzone.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if ((element != null ? element.dropzone : void 0) == null) {
      throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
    }
    return element.dropzone;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (document.querySelectorAll) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.confirm = function(question, accepted, rejected) {
    if (window.confirm(question)) {
      return accepted();
    } else if (rejected != null) {
      return rejected();
    }
  };

  Dropzone.isValidFile = function(file, acceptedFiles) {
    var baseMimeType, mimeType, validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    mimeType = file.type;
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
    return false;
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  Dropzone.ADDED = "added";

  Dropzone.QUEUED = "queued";

  Dropzone.ACCEPTED = Dropzone.QUEUED;

  Dropzone.UPLOADING = "uploading";

  Dropzone.PROCESSING = Dropzone.UPLOADING;

  Dropzone.CANCELED = "canceled";

  Dropzone.ERROR = "error";

  Dropzone.SUCCESS = "success";


  /*
  
  Bugfix for iOS 6 and 7
  Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
  based on the work of https://github.com/stomita/ios-imagefile-megapixel
   */

  detectVerticalSquash = function(img) {
    var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
    iw = img.naturalWidth;
    ih = img.naturalHeight;
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = ih;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, 1, ih).data;
    sy = 0;
    ey = ih;
    py = ih;
    while (py > sy) {
      alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    ratio = py / ih;
    if (ratio === 0) {
      return 1;
    } else {
      return ratio;
    }
  };

  drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio;
    vertSquashRatio = detectVerticalSquash(img);
    return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
  };


  /*
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   */

  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      var e;
      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(52)(module)))

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);

var CustomFilterContainer = React.createClass({
  displayName: "CustomFilterContainer",

  getDefaultProps: function getDefaultProps() {
    return {
      "placeholderText": ""
    };
  },
  render: function render() {
    var that = this;

    if (typeof that.props.customFilterComponent !== 'function') {
      console.log("Couldn't find valid template.");
      return React.createElement("div", null);
    }

    return React.createElement(that.props.customFilterComponent, {
      changeFilter: this.props.changeFilter,
      results: this.props.results,
      currentResults: this.props.currentResults,
      placeholderText: this.props.placeholderText });
  }
});

module.exports = CustomFilterContainer;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = __webpack_require__(0);

var CustomPaginationContainer = React.createClass({
  displayName: "CustomPaginationContainer",

  getDefaultProps: function getDefaultProps() {
    return {
      "maxPage": 0,
      "nextText": "",
      "previousText": "",
      "currentPage": 0,
      "customPagerComponent": {},
      "customPagerComponentOptions": {}
    };
  },
  render: function render() {
    var that = this;

    if (typeof that.props.customPagerComponent !== 'function') {
      console.log("Couldn't find valid template.");
      return React.createElement("div", null);
    }

    return React.createElement(that.props.customPagerComponent, _extends({}, this.props.customPagerComponentOptions, { maxPage: this.props.maxPage, nextText: this.props.nextText, previousText: this.props.previousText, currentPage: this.props.currentPage, setPage: this.props.setPage, previous: this.props.previous, next: this.props.next }));
  }
});

module.exports = CustomPaginationContainer;


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);

var CustomRowComponentContainer = React.createClass({
  displayName: "CustomRowComponentContainer",

  getDefaultProps: function getDefaultProps() {
    return {
      "data": [],
      "metadataColumns": [],
      "className": "",
      "customComponent": {},
      "globalData": {}
    };
  },
  render: function render() {
    var that = this;

    if (typeof that.props.customComponent !== 'function') {
      console.log("Couldn't find valid template.");
      return React.createElement("div", { className: this.props.className });
    }

    var nodes = this.props.data.map(function (row, index) {
      return React.createElement(that.props.customComponent, { data: row, metadataColumns: that.props.metadataColumns, key: index, globalData: that.props.globalData });
    });

    var footer = this.props.showPager && this.props.pagingContent;
    return React.createElement("div", { className: this.props.className, style: this.props.style }, nodes);
  }
});

module.exports = CustomRowComponentContainer;


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);

var GridFilter = React.createClass({
    displayName: "GridFilter",

    getDefaultProps: function getDefaultProps() {
        return {
            "placeholderText": ""
        };
    },
    handleChange: function handleChange(event) {
        this.props.changeFilter(event.target.value);
    },
    render: function render() {
        return React.createElement("div", { className: "filter-container" }, React.createElement("input", { type: "text", name: "filter", placeholder: this.props.placeholderText, className: "form-control", onChange: this.handleChange }));
    }
});

module.exports = GridFilter;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);

var GridNoData = React.createClass({
    displayName: "GridNoData",

    getDefaultProps: function getDefaultProps() {
        return {
            "noDataMessage": "No Data"
        };
    },
    render: function render() {
        var that = this;

        return React.createElement("div", null, this.props.noDataMessage);
    }
});

module.exports = GridNoData;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);
var assign = __webpack_require__(48);

//needs props maxPage, currentPage, nextFunction, prevFunction
var GridPagination = React.createClass({
    displayName: 'GridPagination',

    getDefaultProps: function getDefaultProps() {
        return {
            "maxPage": 0,
            "nextText": "",
            "previousText": "",
            "currentPage": 0,
            "useGriddleStyles": true,
            "nextClassName": "griddle-next",
            "previousClassName": "griddle-previous",
            "nextIconComponent": null,
            "previousIconComponent": null
        };
    },
    pageChange: function pageChange(event) {
        this.props.setPage(parseInt(event.target.value, 10) - 1);
    },
    render: function render() {
        var previous = "";
        var next = "";

        if (this.props.currentPage > 0) {
            previous = React.createElement('button', { type: 'button', onClick: this.props.previous, style: this.props.useGriddleStyles ? { "color": "#222", border: "none", background: "none", margin: "0 0 0 10px" } : null }, this.props.previousIconComponent, this.props.previousText);
        }

        if (this.props.currentPage !== this.props.maxPage - 1) {
            next = React.createElement('button', { type: 'button', onClick: this.props.next, style: this.props.useGriddleStyles ? { "color": "#222", border: "none", background: "none", margin: "0 10px 0 0" } : null }, this.props.nextText, this.props.nextIconComponent);
        }

        var leftStyle = null;
        var middleStyle = null;
        var rightStyle = null;

        if (this.props.useGriddleStyles === true) {
            var baseStyle = {
                "float": "left",
                minHeight: "1px",
                marginTop: "5px"
            };

            rightStyle = assign({ textAlign: "right", width: "34%" }, baseStyle);
            middleStyle = assign({ textAlign: "center", width: "33%" }, baseStyle);
            leftStyle = assign({ width: "33%" }, baseStyle);
        }

        var options = [];

        for (var i = 1; i <= this.props.maxPage; i++) {
            options.push(React.createElement('option', { value: i, key: i }, i));
        }

        return React.createElement('div', { style: this.props.useGriddleStyles ? { minHeight: "35px" } : null }, React.createElement('div', { className: this.props.previousClassName, style: leftStyle }, previous), React.createElement('div', { className: 'griddle-page', style: middleStyle }, React.createElement('select', { value: this.props.currentPage + 1, onChange: this.pageChange }, options), ' / ', this.props.maxPage), React.createElement('div', { className: this.props.nextClassName, style: rightStyle }, next));
    }
});

module.exports = GridPagination;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);
var ColumnProperties = __webpack_require__(27);
var deep = __webpack_require__(95);
var isFunction = __webpack_require__(51);
var zipObject = __webpack_require__(339);
var assign = __webpack_require__(48);
var defaults = __webpack_require__(311);
var toPairs = __webpack_require__(335);
var without = __webpack_require__(144);

var GridRow = React.createClass({
    displayName: 'GridRow',

    getDefaultProps: function getDefaultProps() {
        return {
            "isChildRow": false,
            "showChildren": false,
            "data": {},
            "columnSettings": null,
            "rowSettings": null,
            "hasChildren": false,
            "useGriddleStyles": true,
            "useGriddleIcons": true,
            "isSubGriddle": false,
            "paddingHeight": null,
            "rowHeight": null,
            "parentRowCollapsedClassName": "parent-row",
            "parentRowExpandedClassName": "parent-row expanded",
            "parentRowCollapsedComponent": "▶",
            "parentRowExpandedComponent": "▼",
            "onRowClick": null,
            "multipleSelectionSettings": null
        };
    },
    handleClick: function handleClick(e) {
        if (this.props.onRowClick !== null && isFunction(this.props.onRowClick)) {
            this.props.onRowClick(this, e);
        } else if (this.props.hasChildren) {
            this.props.toggleChildren();
        }
    },
    handleSelectionChange: function handleSelectionChange(e) {
        //hack to get around warning that's not super useful in this case
        return;
    },
    handleSelectClick: function handleSelectClick(e) {
        if (this.props.multipleSelectionSettings.isMultipleSelection) {
            if (e.target.type === "checkbox") {
                this.props.multipleSelectionSettings.toggleSelectRow(this.props.data, this.refs.selected.checked);
            } else {
                this.props.multipleSelectionSettings.toggleSelectRow(this.props.data, !this.refs.selected.checked);
            }
        }
    },
    verifyProps: function verifyProps() {
        if (this.props.columnSettings === null) {
            console.error("gridRow: The columnSettings prop is null and it shouldn't be");
        }
    },
    formatData: function formatData(data) {
        if (typeof data === 'boolean') {
            return String(data);
        }
        return data;
    },
    render: function render() {
        var _this = this;

        this.verifyProps();
        var that = this;
        var columnStyles = null;

        if (this.props.useGriddleStyles) {
            columnStyles = {
                margin: "0px",
                padding: that.props.paddingHeight + "px 5px " + that.props.paddingHeight + "px 5px",
                height: that.props.rowHeight ? this.props.rowHeight - that.props.paddingHeight * 2 + "px" : null,
                backgroundColor: "#FFF",
                borderTopColor: "#DDD",
                color: "#222"
            };
        }

        var columns = this.props.columnSettings.getColumns();

        // make sure that all the columns we need have default empty values
        // otherwise they will get clipped
        var defaultValues = zipObject(columns, []);

        // creates a 'view' on top the data so we will not alter the original data but will allow us to add default values to missing columns
        var dataView = assign({}, this.props.data);

        defaults(dataView, defaultValues);
        var data = toPairs(deep.pick(dataView, without(columns, 'children')));
        var nodes = data.map(function (col, index) {
            var returnValue = null;
            var meta = _this.props.columnSettings.getColumnMetadataByName(col[0]);

            //todo: Make this not as ridiculous looking
            var firstColAppend = index === 0 && _this.props.hasChildren && _this.props.showChildren === false && _this.props.useGriddleIcons ? React.createElement('span', { style: _this.props.useGriddleStyles ? { fontSize: "10px", marginRight: "5px" } : null }, _this.props.parentRowCollapsedComponent) : index === 0 && _this.props.hasChildren && _this.props.showChildren && _this.props.useGriddleIcons ? React.createElement('span', { style: _this.props.useGriddleStyles ? { fontSize: "10px" } : null }, _this.props.parentRowExpandedComponent) : "";

            if (index === 0 && _this.props.isChildRow && _this.props.useGriddleStyles) {
                columnStyles = assign(columnStyles, { paddingLeft: 10 });
            }

            if (_this.props.columnSettings.hasColumnMetadata() && typeof meta !== 'undefined' && meta !== null) {
                if (typeof meta.customComponent !== 'undefined' && meta.customComponent !== null) {
                    var customComponent = React.createElement(meta.customComponent, { data: col[1], rowData: dataView, metadata: meta });
                    returnValue = React.createElement('td', { onClick: _this.handleClick, className: meta.cssClassName, key: index, style: columnStyles }, customComponent);
                } else {
                    returnValue = React.createElement('td', { onClick: _this.handleClick, className: meta.cssClassName, key: index, style: columnStyles }, firstColAppend, _this.formatData(col[1]));
                }
            }

            return returnValue || React.createElement('td', { onClick: _this.handleClick, key: index, style: columnStyles }, firstColAppend, col[1]);
        });

        // Don't compete with onRowClick, but if no onRowClick function then
        // clicking on the row should trigger select
        var trOnClick, tdOnClick;
        if (this.props.onRowClick !== null && isFunction(this.props.onRowClick)) {
            trOnClick = null;
            tdOnClick = this.handleSelectClick;
        } else {
            if (this.props.multipleSelectionSettings && this.props.multipleSelectionSettings.isMultipleSelection) {
                trOnClick = this.handleSelectClick;
                tdOnClick = null;
            } else {
                trOnClick = null;
                tdOnClick = null;
            }
        }

        if (nodes && this.props.multipleSelectionSettings && this.props.multipleSelectionSettings.isMultipleSelection) {
            var selectedRowIds = this.props.multipleSelectionSettings.getSelectedRowIds();

            nodes.unshift(React.createElement('td', {
                key: 'selection',
                style: columnStyles,
                className: 'griddle-select griddle-select-cell',
                onClick: tdOnClick
            }, React.createElement('input', {
                type: 'checkbox',
                checked: this.props.multipleSelectionSettings.getIsRowChecked(dataView),
                onChange: this.handleSelectionChange,
                ref: 'selected'
            })));
        }

        //Get the row from the row settings.
        var className = that.props.rowSettings && that.props.rowSettings.getBodyRowMetadataClass(that.props.data) || "standard-row";

        if (that.props.isChildRow) {
            className = "child-row";
        } else if (that.props.hasChildren) {
            className = that.props.showChildren ? this.props.parentRowExpandedClassName : this.props.parentRowCollapsedClassName;
        }

        return React.createElement('tr', { onClick: trOnClick, className: className }, nodes);
    }
});

module.exports = GridRow;


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);
var includes = __webpack_require__(318);
var without = __webpack_require__(144);
var find = __webpack_require__(72);

var GridSettings = React.createClass({
    displayName: 'GridSettings',

    getDefaultProps: function getDefaultProps() {
        return {
            "columns": [],
            "columnMetadata": [],
            "selectedColumns": [],
            "settingsText": "",
            "maxRowsText": "",
            "resultsPerPage": 0,
            "enableToggleCustom": false,
            "useCustomComponent": false,
            "useGriddleStyles": true,
            "toggleCustomComponent": function toggleCustomComponent() {}
        };
    },
    setPageSize: function setPageSize(event) {
        var value = parseInt(event.target.value, 10);
        this.props.setPageSize(value);
    },
    handleChange: function handleChange(event) {
        var columnName = event.target.dataset ? event.target.dataset.name : event.target.getAttribute('data-name');
        if (event.target.checked === true && includes(this.props.selectedColumns, columnName) === false) {
            this.props.selectedColumns.push(columnName);
            this.props.setColumns(this.props.selectedColumns);
        } else {
            /* redraw with the selected columns minus the one just unchecked */
            this.props.setColumns(without(this.props.selectedColumns, columnName));
        }
    },
    render: function render() {
        var that = this;

        var nodes = [];
        //don't show column selector if we're on a custom component
        if (that.props.useCustomComponent === false) {
            nodes = this.props.columns.map(function (col, index) {
                var checked = includes(that.props.selectedColumns, col);
                //check column metadata -- if this one is locked make it disabled and don't put an onChange event
                var meta = find(that.props.columnMetadata, { columnName: col });
                var displayName = col;

                if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
                    displayName = meta.displayName;
                }

                if (typeof meta !== "undefined" && meta != null && meta.locked) {
                    return React.createElement('div', { className: 'column checkbox' }, React.createElement('label', null, React.createElement('input', { type: 'checkbox', disabled: true, name: 'check', checked: checked, 'data-name': col }), displayName));
                } else if (typeof meta !== "undefined" && meta != null && typeof meta.visible !== "undefined" && meta.visible === false) {
                    return null;
                }
                return React.createElement('div', { className: 'griddle-column-selection checkbox', key: col, style: that.props.useGriddleStyles ? { "float": "left", width: "20%" } : null }, React.createElement('label', null, React.createElement('input', { type: 'checkbox', name: 'check', onChange: that.handleChange, checked: checked, 'data-name': col }), displayName));
            });
        }

        var toggleCustom = that.props.enableToggleCustom ? React.createElement('div', { className: 'form-group' }, React.createElement('label', { htmlFor: 'maxRows' }, React.createElement('input', { type: 'checkbox', checked: this.props.useCustomComponent, onChange: this.props.toggleCustomComponent }), ' ', this.props.enableCustomFormatText)) : "";

        var setPageSize = this.props.showSetPageSize ? React.createElement('div', null, React.createElement('label', { htmlFor: 'maxRows' }, this.props.maxRowsText, ':', React.createElement('select', { onChange: this.setPageSize, value: this.props.resultsPerPage }, React.createElement('option', { value: '5' }, '5'), React.createElement('option', { value: '10' }, '10'), React.createElement('option', { value: '25' }, '25'), React.createElement('option', { value: '50' }, '50'), React.createElement('option', { value: '100' }, '100')))) : "";

        return React.createElement('div', { className: 'griddle-settings', style: this.props.useGriddleStyles ? { backgroundColor: "#FFF", border: "1px solid #DDD", color: "#222", padding: "10px", marginBottom: "10px" } : null }, React.createElement('h6', null, this.props.settingsText), React.createElement('div', { className: 'griddle-columns', style: this.props.useGriddleStyles ? { clear: "both", display: "table", width: "100%", borderBottom: "1px solid #EDEDED", marginBottom: "10px" } : null }, nodes), setPageSize, toggleCustom);
    }
});

module.exports = GridSettings;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/


var React = __webpack_require__(0);
var GridTitle = __webpack_require__(208);
var GridRowContainer = __webpack_require__(96);
var ColumnProperties = __webpack_require__(27);
var RowProperties = __webpack_require__(98);

var GridTable = React.createClass({
  displayName: 'GridTable',

  getDefaultProps: function getDefaultProps() {
    return {
      "data": [],
      "columnSettings": null,
      "rowSettings": null,
      "sortSettings": null,
      "multipleSelectionSettings": null,
      "className": "",
      "enableInfiniteScroll": false,
      "nextPage": null,
      "hasMorePages": false,
      "useFixedHeader": false,
      "useFixedLayout": true,
      "paddingHeight": null,
      "rowHeight": null,
      "filterByColumn": null,
      "infiniteScrollLoadTreshold": null,
      "bodyHeight": null,
      "useGriddleStyles": true,
      "useGriddleIcons": true,
      "isSubGriddle": false,
      "parentRowCollapsedClassName": "parent-row",
      "parentRowExpandedClassName": "parent-row expanded",
      "parentRowCollapsedComponent": "▶",
      "parentRowExpandedComponent": "▼",
      "externalLoadingComponent": null,
      "externalIsLoading": false,
      "onRowClick": null
    };
  },
  getInitialState: function getInitialState() {
    return {
      scrollTop: 0,
      scrollHeight: this.props.bodyHeight,
      clientHeight: this.props.bodyHeight
    };
  },
  componentDidMount: function componentDidMount() {
    // After the initial render, see if we need to load additional pages.
    this.gridScroll();
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    // After the subsequent renders, see if we need to load additional pages.
    this.gridScroll();
  },
  gridScroll: function gridScroll() {
    if (this.props.enableInfiniteScroll && !this.props.externalIsLoading) {
      // If the scroll height is greater than the current amount of rows displayed, update the page.
      var scrollable = this.refs.scrollable;
      var scrollTop = scrollable.scrollTop;
      var scrollHeight = scrollable.scrollHeight;
      var clientHeight = scrollable.clientHeight;

      // If the scroll position changed and the difference is greater than a row height
      if (this.props.rowHeight !== null && this.state.scrollTop !== scrollTop && Math.abs(this.state.scrollTop - scrollTop) >= this.getAdjustedRowHeight()) {
        var newState = {
          scrollTop: scrollTop,
          scrollHeight: scrollHeight,
          clientHeight: clientHeight
        };

        // Set the state to the new state
        this.setState(newState);
      }

      // Determine the diff by subtracting the amount scrolled by the total height, taking into consideratoin
      // the spacer's height.
      var scrollHeightDiff = scrollHeight - (scrollTop + clientHeight) - this.props.infiniteScrollLoadTreshold;

      // Make sure that we load results a little before reaching the bottom.
      var compareHeight = scrollHeightDiff * 0.6;

      if (compareHeight <= this.props.infiniteScrollLoadTreshold) {
        this.props.nextPage();
      }
    }
  },
  verifyProps: function verifyProps() {
    if (this.props.columnSettings === null) {
      console.error("gridTable: The columnSettings prop is null and it shouldn't be");
    }
    if (this.props.rowSettings === null) {
      console.error("gridTable: The rowSettings prop is null and it shouldn't be");
    }
  },
  getAdjustedRowHeight: function getAdjustedRowHeight() {
    return this.props.rowHeight + this.props.paddingHeight * 2; // account for padding.
  },
  getNodeContent: function getNodeContent() {
    this.verifyProps();
    var that = this;

    //figure out if we need to wrap the group in one tbody or many
    var anyHasChildren = false;

    // If the data is still being loaded, don't build the nodes unless this is an infinite scroll table.
    if (!this.props.externalIsLoading || this.props.enableInfiniteScroll) {
      var nodeData = that.props.data;
      var aboveSpacerRow = null;
      var belowSpacerRow = null;
      var usingDefault = false;

      // If we have a row height specified, only render what's going to be visible.
      if (this.props.enableInfiniteScroll && this.props.rowHeight !== null && this.refs.scrollable !== undefined) {
        var adjustedHeight = that.getAdjustedRowHeight();
        var visibleRecordCount = Math.ceil(that.state.clientHeight / adjustedHeight);

        // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
        var displayStart = Math.max(0, Math.floor(that.state.scrollTop / adjustedHeight) - visibleRecordCount * 0.25);
        var displayEnd = Math.min(displayStart + visibleRecordCount * 1.25, this.props.data.length - 1);

        // Split the amount of nodes.
        nodeData = nodeData.slice(displayStart, displayEnd + 1);

        // Set the above and below nodes.
        var aboveSpacerRowStyle = { height: displayStart * adjustedHeight + "px" };
        aboveSpacerRow = React.createElement('tr', { key: 'above-' + aboveSpacerRowStyle.height, style: aboveSpacerRowStyle });
        var belowSpacerRowStyle = { height: (this.props.data.length - displayEnd) * adjustedHeight + "px" };
        belowSpacerRow = React.createElement('tr', { key: 'below-' + belowSpacerRowStyle.height, style: belowSpacerRowStyle });
      }

      var nodes = nodeData.map(function (row, index) {
        var hasChildren = typeof row["children"] !== "undefined" && row["children"].length > 0;
        var uniqueId = that.props.rowSettings.getRowKey(row, index);

        //at least one item in the group has children.
        if (hasChildren) {
          anyHasChildren = hasChildren;
        }

        return React.createElement(GridRowContainer, {
          useGriddleStyles: that.props.useGriddleStyles,
          isSubGriddle: that.props.isSubGriddle,
          parentRowExpandedClassName: that.props.parentRowExpandedClassName,
          parentRowCollapsedClassName: that.props.parentRowCollapsedClassName,
          parentRowExpandedComponent: that.props.parentRowExpandedComponent,
          parentRowCollapsedComponent: that.props.parentRowCollapsedComponent,
          data: row,
          key: uniqueId + '-container',
          uniqueId: uniqueId,
          columnSettings: that.props.columnSettings,
          rowSettings: that.props.rowSettings,
          paddingHeight: that.props.paddingHeight,
          multipleSelectionSettings: that.props.multipleSelectionSettings,
          rowHeight: that.props.rowHeight,
          hasChildren: hasChildren,
          tableClassName: that.props.className,
          onRowClick: that.props.onRowClick
        });
      });

      // no data section
      if (this.props.showNoData) {
        var colSpan = this.props.columnSettings.getVisibleColumnCount();
        nodes.push(React.createElement('tr', { key: 'no-data-section' }, React.createElement('td', { colSpan: colSpan }, this.props.noDataSection)));
      }

      // Add the spacer rows for nodes we're not rendering.
      if (aboveSpacerRow) {
        nodes.unshift(aboveSpacerRow);
      }
      if (belowSpacerRow) {
        nodes.push(belowSpacerRow);
      }

      // Send back the nodes.
      return {
        nodes: nodes,
        anyHasChildren: anyHasChildren
      };
    } else {
      return null;
    }
  },
  render: function render() {
    var that = this;
    var nodes = [];

    // for if we need to wrap the group in one tbody or many
    var anyHasChildren = false;

    // Grab the nodes to render
    var nodeContent = this.getNodeContent();
    if (nodeContent) {
      nodes = nodeContent.nodes;
      anyHasChildren = nodeContent.anyHasChildren;
    }

    var gridStyle = null;
    var loadingContent = null;
    var tableStyle = {
      width: "100%"
    };

    if (this.props.useFixedLayout) {
      tableStyle.tableLayout = "fixed";
    }

    if (this.props.enableInfiniteScroll) {
      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
      gridStyle = {
        "position": "relative",
        "overflowY": "scroll",
        "height": this.props.bodyHeight + "px",
        "width": "100%"
      };
    }

    // If we're currently loading, populate the loading content
    if (this.props.externalIsLoading) {
      var defaultLoadingStyle = null;
      var defaultColSpan = null;

      if (this.props.useGriddleStyles) {
        defaultLoadingStyle = {
          textAlign: "center",
          paddingBottom: "40px"
        };
      }

      defaultColSpan = this.props.columnSettings.getVisibleColumnCount();

      var loadingComponent = this.props.externalLoadingComponent ? React.createElement(this.props.externalLoadingComponent, null) : React.createElement('div', null, 'Loading...');

      loadingContent = React.createElement('tbody', null, React.createElement('tr', null, React.createElement('td', { style: defaultLoadingStyle, colSpan: defaultColSpan }, loadingComponent)));
    }

    //construct the table heading component
    var tableHeading = this.props.showTableHeading ? React.createElement(GridTitle, { useGriddleStyles: this.props.useGriddleStyles, useGriddleIcons: this.props.useGriddleIcons,
      sortSettings: this.props.sortSettings,
      multipleSelectionSettings: this.props.multipleSelectionSettings,
      columnSettings: this.props.columnSettings,
      filterByColumn: this.props.filterByColumn,
      rowSettings: this.props.rowSettings }) : undefined;

    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
    if (!anyHasChildren) {
      nodes = React.createElement('tbody', null, nodes);
    }

    var pagingContent = React.createElement('tbody', null);
    if (this.props.showPager) {
      var pagingStyles = this.props.useGriddleStyles ? {
        padding: "0px",
        backgroundColor: "#EDEDED",
        border: "0px",
        color: "#222",
        height: this.props.showNoData ? "20px" : null
      } : null;
      pagingContent = React.createElement('tbody', null, React.createElement('tr', null, React.createElement('td', { colSpan: this.props.multipleSelectionSettings.isMultipleSelection ? this.props.columnSettings.getVisibleColumnCount() + 1 : this.props.columnSettings.getVisibleColumnCount(), style: pagingStyles, className: 'footer-container' }, !this.props.showNoData ? this.props.pagingContent : null)));
    }

    // If we have a fixed header, split into two tables.
    if (this.props.useFixedHeader) {
      if (this.props.useGriddleStyles) {
        tableStyle.tableLayout = "fixed";
      }

      return React.createElement('div', null, React.createElement('table', { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null }, tableHeading), React.createElement('div', { ref: 'scrollable', onScroll: this.gridScroll, style: gridStyle }, React.createElement('table', { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null }, nodes, loadingContent, pagingContent)));
    }

    return React.createElement('div', { ref: 'scrollable', onScroll: this.gridScroll, style: gridStyle }, React.createElement('table', { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null }, tableHeading, nodes, loadingContent, pagingContent));
  }
});

module.exports = GridTable;


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
 */


var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

var React = __webpack_require__(0);
var ColumnProperties = __webpack_require__(27);
var assign = __webpack_require__(48);

var DefaultHeaderComponent = React.createClass({
    displayName: 'DefaultHeaderComponent',

    render: function render() {
        return React.createElement('span', null, this.props.displayName);
    }
});

var GridTitle = React.createClass({
    displayName: 'GridTitle',

    getDefaultProps: function getDefaultProps() {
        return {
            "columnSettings": null,
            "filterByColumn": function filterByColumn() {},
            "rowSettings": null,
            "sortSettings": null,
            "multipleSelectionSettings": null,
            "headerStyle": null,
            "useGriddleStyles": true,
            "useGriddleIcons": true,
            "headerStyles": {}
        };
    },
    componentWillMount: function componentWillMount() {
        this.verifyProps();
    },
    sort: function sort(column) {
        var that = this;
        return function (event) {
            that.props.sortSettings.changeSort(column);
        };
    },
    toggleSelectAll: function toggleSelectAll(event) {
        this.props.multipleSelectionSettings.toggleSelectAll();
    },
    handleSelectionChange: function handleSelectionChange(event) {
        //hack to get around warning message that's not helpful in this case
        return;
    },
    verifyProps: function verifyProps() {
        if (this.props.columnSettings === null) {
            console.error("gridTitle: The columnSettings prop is null and it shouldn't be");
        }

        if (this.props.sortSettings === null) {
            console.error("gridTitle: The sortSettings prop is null and it shouldn't be");
        }
    },
    render: function render() {
        this.verifyProps();
        var that = this;
        var titleStyles = {};

        var nodes = this.props.columnSettings.getColumns().map(function (col, index) {
            var defaultTitleStyles = {};
            var columnSort = "";
            var columnIsSortable = that.props.columnSettings.getMetadataColumnProperty(col, "sortable", true);
            var sortComponent = columnIsSortable ? that.props.sortSettings.sortDefaultComponent : null;

            if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortDirection === 'asc') {
                columnSort = that.props.sortSettings.sortAscendingClassName;
                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortAscendingComponent;
            } else if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortDirection === 'desc') {
                columnSort += that.props.sortSettings.sortDescendingClassName;
                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortDescendingComponent;
            }

            var meta = that.props.columnSettings.getColumnMetadataByName(col);
            var displayName = that.props.columnSettings.getMetadataColumnProperty(col, "displayName", col);
            var HeaderComponent = that.props.columnSettings.getMetadataColumnProperty(col, "customHeaderComponent", DefaultHeaderComponent);
            var headerProps = that.props.columnSettings.getMetadataColumnProperty(col, "customHeaderComponentProps", {});

            columnSort = meta == null ? columnSort : (columnSort && columnSort + " " || columnSort) + that.props.columnSettings.getMetadataColumnProperty(col, "cssClassName", "");

            if (that.props.useGriddleStyles) {
                defaultTitleStyles = {
                    backgroundColor: "#EDEDEF",
                    border: "0px",
                    borderBottom: "1px solid #DDD",
                    color: "#222",
                    padding: "5px",
                    cursor: columnIsSortable ? "pointer" : "default"
                };
            }
            titleStyles = meta && meta.titleStyles ? assign({}, defaultTitleStyles, meta.titleStyles) : assign({}, defaultTitleStyles);

            var ComponentClass = displayName ? 'th' : 'td';
            return React.createElement(ComponentClass, { onClick: columnIsSortable ? that.sort(col) : null, 'data-title': col, className: columnSort, key: col,
                style: titleStyles }, React.createElement(HeaderComponent, _extends({ columnName: col, displayName: displayName,
                filterByColumn: that.props.filterByColumn }, headerProps)), sortComponent);
        });

        if (nodes && this.props.multipleSelectionSettings.isMultipleSelection) {
            nodes.unshift(React.createElement('th', { key: 'selection', onClick: this.toggleSelectAll, style: titleStyles, className: 'griddle-select griddle-select-title' }, React.createElement('input', {
                type: 'checkbox',
                checked: this.props.multipleSelectionSettings.getIsSelectAllChecked(),
                onChange: this.handleSelectionChange
            })));
        }

        //Get the row from the row settings.
        var className = that.props.rowSettings && that.props.rowSettings.getHeaderRowMetadataClass() || null;

        return React.createElement('thead', null, React.createElement('tr', {
            className: className,
            style: this.props.headerStyles }, nodes));
    }
});

module.exports = GridTitle;


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(19),
    root = __webpack_require__(10);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(272),
    hashDelete = __webpack_require__(273),
    hashGet = __webpack_require__(274),
    hashHas = __webpack_require__(275),
    hashSet = __webpack_require__(276);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(19),
    root = __webpack_require__(10);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(19),
    root = __webpack_require__(10);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(19),
    root = __webpack_require__(10);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 214 */
/***/ (function(module, exports) {

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;


/***/ }),
/* 215 */
/***/ (function(module, exports) {

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;


/***/ }),
/* 216 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(18),
    keys = __webpack_require__(13);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(18),
    keysIn = __webpack_require__(76);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(62),
    arrayEach = __webpack_require__(101),
    assignValue = __webpack_require__(28),
    baseAssign = __webpack_require__(217),
    baseAssignIn = __webpack_require__(218),
    cloneBuffer = __webpack_require__(248),
    copyArray = __webpack_require__(118),
    copySymbols = __webpack_require__(257),
    copySymbolsIn = __webpack_require__(258),
    getAllKeys = __webpack_require__(124),
    getAllKeysIn = __webpack_require__(125),
    getTag = __webpack_require__(45),
    initCloneArray = __webpack_require__(277),
    initCloneByTag = __webpack_require__(278),
    initCloneObject = __webpack_require__(279),
    isArray = __webpack_require__(2),
    isBuffer = __webpack_require__(50),
    isObject = __webpack_require__(12),
    keys = __webpack_require__(13);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(64);

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(261);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 223 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(61),
    arrayIncludes = __webpack_require__(103),
    arrayIncludesWith = __webpack_require__(104),
    arrayMap = __webpack_require__(9),
    baseUnary = __webpack_require__(43),
    cacheHas = __webpack_require__(66);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isObjectLike = __webpack_require__(15);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(62),
    equalArrays = __webpack_require__(121),
    equalByTag = __webpack_require__(266),
    equalObjects = __webpack_require__(267),
    getTag = __webpack_require__(45),
    isArray = __webpack_require__(2),
    isBuffer = __webpack_require__(50),
    isTypedArray = __webpack_require__(75);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(62),
    baseIsEqual = __webpack_require__(113);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),
/* 228 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(51),
    isMasked = __webpack_require__(282),
    isObject = __webpack_require__(12),
    toSource = __webpack_require__(135);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isLength = __webpack_require__(74),
    isObjectLike = __webpack_require__(15);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12),
    isPrototype = __webpack_require__(31),
    nativeKeysIn = __webpack_require__(295);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(227),
    getMatchData = __webpack_require__(268),
    matchesStrictComparable = __webpack_require__(129);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(113),
    get = __webpack_require__(138),
    hasIn = __webpack_require__(139),
    isKey = __webpack_require__(70),
    isStrictComparable = __webpack_require__(128),
    matchesStrictComparable = __webpack_require__(129),
    toKey = __webpack_require__(20);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

var basePickBy = __webpack_require__(235),
    hasIn = __webpack_require__(139);

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

module.exports = basePick;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(42),
    baseSet = __webpack_require__(238),
    castPath = __webpack_require__(24);

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

module.exports = basePickBy;


/***/ }),
/* 236 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(42);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(28),
    castPath = __webpack_require__(24),
    isIndex = __webpack_require__(46),
    isObject = __webpack_require__(12),
    toKey = __webpack_require__(20);

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(310),
    defineProperty = __webpack_require__(120),
    identity = __webpack_require__(33);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 240 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;


/***/ }),
/* 241 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(9);

/**
 * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
 * of key-value pairs for `object` corresponding to the property names of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the key-value pairs.
 */
function baseToPairs(object, props) {
  return arrayMap(props, function(key) {
    return [key, object[key]];
  });
}

module.exports = baseToPairs;


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(22),
    arrayMap = __webpack_require__(9),
    isArray = __webpack_require__(2),
    isSymbol = __webpack_require__(25);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(24),
    last = __webpack_require__(325),
    parent = __webpack_require__(298),
    toKey = __webpack_require__(20);

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(9);

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ }),
/* 246 */
/***/ (function(module, exports) {

/**
 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */
function baseZipObject(props, values, assignFunc) {
  var index = -1,
      length = props.length,
      valsLength = values.length,
      result = {};

  while (++index < length) {
    var value = index < valsLength ? values[index] : undefined;
    assignFunc(result, props[index], value);
  }
  return result;
}

module.exports = baseZipObject;


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLikeObject = __webpack_require__(73);

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

module.exports = castArrayLikeObject;


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(10);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(52)(module)))

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(67);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var addMapEntry = __webpack_require__(214),
    arrayReduce = __webpack_require__(106),
    mapToArray = __webpack_require__(71);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;


/***/ }),
/* 251 */
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

var addSetEntry = __webpack_require__(215),
    arrayReduce = __webpack_require__(106),
    setToArray = __webpack_require__(132);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(22);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(67);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(25);

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

var compareAscending = __webpack_require__(255);

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(18),
    getSymbols = __webpack_require__(69);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(18),
    getSymbolsIn = __webpack_require__(126);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(10);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(11);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),
/* 261 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(29),
    isArrayLike = __webpack_require__(11),
    keys = __webpack_require__(13);

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

var baseToPairs = __webpack_require__(242),
    getTag = __webpack_require__(45),
    mapToArray = __webpack_require__(71),
    setToPairs = __webpack_require__(301);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Creates a `_.toPairs` or `_.toPairsIn` function.
 *
 * @private
 * @param {Function} keysFunc The function to get the keys of a given object.
 * @returns {Function} Returns the new pairs function.
 */
function createToPairs(keysFunc) {
  return function(object) {
    var tag = getTag(object);
    if (tag == mapTag) {
      return mapToArray(object);
    }
    if (tag == setTag) {
      return setToPairs(object);
    }
    return baseToPairs(object, keysFunc(object));
  };
}

module.exports = createToPairs;


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(32);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = customDefaultsAssignIn;


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(140);

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(22),
    Uint8Array = __webpack_require__(99),
    eq = __webpack_require__(32),
    equalArrays = __webpack_require__(121),
    mapToArray = __webpack_require__(71),
    setToArray = __webpack_require__(132);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(124);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(128),
    keys = __webpack_require__(13);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(22);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 270 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(24),
    isArguments = __webpack_require__(49),
    isArray = __webpack_require__(2),
    isIndex = __webpack_require__(46),
    isLength = __webpack_require__(74),
    toKey = __webpack_require__(20);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(47);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 273 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(47);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(47);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(47);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 277 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(67),
    cloneDataView = __webpack_require__(249),
    cloneMap = __webpack_require__(250),
    cloneRegExp = __webpack_require__(251),
    cloneSet = __webpack_require__(252),
    cloneSymbol = __webpack_require__(253),
    cloneTypedArray = __webpack_require__(254);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(220),
    getPrototype = __webpack_require__(68),
    isPrototype = __webpack_require__(31);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(22),
    isArguments = __webpack_require__(49),
    isArray = __webpack_require__(2);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),
/* 281 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(259);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 283 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(41);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(41);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(41);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(41);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(210),
    ListCache = __webpack_require__(40),
    Map = __webpack_require__(59);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(44);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(44);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(44);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(44);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(326);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(130);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 295 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(123);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(52)(module)))

/***/ }),
/* 297 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(42),
    baseSlice = __webpack_require__(30);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),
/* 299 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 300 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 301 */
/***/ (function(module, exports) {

/**
 * Converts `set` to its value-value pairs.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the value-value pairs.
 */
function setToPairs(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = [value, value];
  });
  return result;
}

module.exports = setToPairs;


/***/ }),
/* 302 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(40);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 304 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 305 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 306 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(40),
    Map = __webpack_require__(59),
    MapCache = __webpack_require__(60);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 308 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(18),
    createAssigner = __webpack_require__(119),
    keysIn = __webpack_require__(76);

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;


/***/ }),
/* 310 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(100),
    assignInWith = __webpack_require__(309),
    baseRest = __webpack_require__(23),
    customDefaultsAssignIn = __webpack_require__(264);

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, customDefaultsAssignIn);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(108),
    baseFlatten = __webpack_require__(65),
    baseRest = __webpack_require__(23),
    isArrayLikeObject = __webpack_require__(73);

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(30),
    toInteger = __webpack_require__(34);

/**
 * Creates a slice of `array` with `n` elements dropped from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.drop([1, 2, 3]);
 * // => [2, 3]
 *
 * _.drop([1, 2, 3], 2);
 * // => [3]
 *
 * _.drop([1, 2, 3], 5);
 * // => []
 *
 * _.drop([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, n < 0 ? 0 : n, length);
}

module.exports = drop;


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(30),
    toInteger = __webpack_require__(34);

/**
 * Creates a slice of `array` with `n` elements dropped from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.dropRight([1, 2, 3]);
 * // => [1, 2]
 *
 * _.dropRight([1, 2, 3], 2);
 * // => [1]
 *
 * _.dropRight([1, 2, 3], 5);
 * // => []
 *
 * _.dropRight([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = dropRight;


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(109),
    baseIteratee = __webpack_require__(29),
    toInteger = __webpack_require__(34);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(65);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(110),
    castFunction = __webpack_require__(117);

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

module.exports = forOwn;


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(112),
    isArrayLike = __webpack_require__(11),
    isString = __webpack_require__(323),
    toInteger = __webpack_require__(34),
    values = __webpack_require__(338);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(30);

/**
 * Gets all but the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 */
function initial(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 0, -1) : [];
}

module.exports = initial;


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(9),
    baseIntersection = __webpack_require__(224),
    baseRest = __webpack_require__(23),
    castArrayLikeObject = __webpack_require__(247);

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

module.exports = intersection;


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(114),
    getTag = __webpack_require__(45),
    isArguments = __webpack_require__(49),
    isArray = __webpack_require__(2),
    isArrayLike = __webpack_require__(11),
    isBuffer = __webpack_require__(50),
    isPrototype = __webpack_require__(31),
    isTypedArray = __webpack_require__(75);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;


/***/ }),
/* 322 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isArray = __webpack_require__(2),
    isObjectLike = __webpack_require__(15);

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;


/***/ }),
/* 324 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;


/***/ }),
/* 325 */
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(60);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(9),
    baseClone = __webpack_require__(219),
    baseUnset = __webpack_require__(244),
    castPath = __webpack_require__(24),
    copyObject = __webpack_require__(18),
    customOmitClone = __webpack_require__(265),
    flatRest = __webpack_require__(122),
    getAllKeysIn = __webpack_require__(125);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

var baseOrderBy = __webpack_require__(116),
    isArray = __webpack_require__(2);

/**
 * This method is like `_.sortBy` except that it allows specifying the sort
 * orders of the iteratees to sort by. If `orders` is unspecified, all values
 * are sorted in ascending order. Otherwise, specify an order of "desc" for
 * descending or "asc" for ascending sort order of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @param {string[]} [orders] The sort orders of `iteratees`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 34 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 36 }
 * ];
 *
 * // Sort by `user` in ascending order and by `age` in descending order.
 * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }
  if (!isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }
  orders = guard ? undefined : orders;
  if (!isArray(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return baseOrderBy(collection, iteratees, orders);
}

module.exports = orderBy;


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

var basePick = __webpack_require__(234),
    flatRest = __webpack_require__(122);

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

module.exports = pick;


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(65),
    baseOrderBy = __webpack_require__(116),
    baseRest = __webpack_require__(23),
    isIterateeCall = __webpack_require__(127);

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

module.exports = sortBy;


/***/ }),
/* 331 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(30),
    toInteger = __webpack_require__(34);

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(334);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12),
    isSymbol = __webpack_require__(25);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

var createToPairs = __webpack_require__(263),
    keys = __webpack_require__(13);

/**
 * Creates an array of own enumerable string keyed-value pairs for `object`
 * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
 * entries are returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias entries
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the key-value pairs.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.toPairs(new Foo);
 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
 */
var toPairs = createToPairs(keys);

module.exports = toPairs;


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(9),
    copyArray = __webpack_require__(118),
    isArray = __webpack_require__(2),
    isSymbol = __webpack_require__(25),
    stringToPath = __webpack_require__(134),
    toKey = __webpack_require__(20),
    toString = __webpack_require__(77);

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}

module.exports = toPath;


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var toString = __webpack_require__(77);

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

var baseValues = __webpack_require__(245),
    keys = __webpack_require__(13);

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(28),
    baseZipObject = __webpack_require__(246);

/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */
function zipObject(props, values) {
  return baseZipObject(props || [], values || [], assignValue);
}

module.exports = zipObject;


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toPath2 = __webpack_require__(336);

var _toPath3 = _interopRequireDefault(_toPath2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getIn = function getIn(state, field) {
  if (!state) {
    return state;
  }

  var path = (0, _toPath3.default)(field);
  var length = path.length;
  if (!length) {
    return undefined;
  }

  var result = state;
  for (var i = 0; i < length && !!result; ++i) {
    result = result[path[i]];
  }

  return result;
};

exports.default = getIn;

/***/ }),
/* 341 */
/***/ (function(module, exports) {

module.exports = Breadcrumb;

/***/ }),
/* 342 */
/***/ (function(module, exports) {

module.exports = BreadcrumbsActions;

/***/ }),
/* 343 */
/***/ (function(module, exports) {

module.exports = FieldHolder;

/***/ }),
/* 344 */
/***/ (function(module, exports) {

module.exports = FileSchemaModalHandler;

/***/ }),
/* 345 */
/***/ (function(module, exports) {

module.exports = FormAlert;

/***/ }),
/* 346 */
/***/ (function(module, exports) {

module.exports = ReactAddonsCssTransitionGroup;

/***/ }),
/* 347 */
/***/ (function(module, exports) {

module.exports = ReactBootstrap;

/***/ }),
/* 348 */
/***/ (function(module, exports) {

module.exports = ReactRouteRegister;

/***/ }),
/* 349 */
/***/ (function(module, exports) {

module.exports = ReactRouter;

/***/ }),
/* 350 */
/***/ (function(module, exports) {

module.exports = Toolbar;

/***/ }),
/* 351 */
/***/ (function(module, exports) {

module.exports = UnsavedFormsActions;

/***/ }),
/* 352 */
/***/ (function(module, exports) {

module.exports = qs;

/***/ }),
/* 353 */
/***/ (function(module, exports) {

module.exports = reduxFieldReducer;

/***/ }),
/* 354 */
/***/ (function(module, exports) {

module.exports = schemaFieldValues;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map