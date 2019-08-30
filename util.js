//工具相关
var lang = {
    /**
     * 获取类型
     * @param source {String}
     * @returns {String}
     * 比如：getType([])返回'Array'，getType({})返回'Object'
     */
    getType: function (source) {
        var _type = Object.prototype.toString.call(source);
        return _type.substring(8, _type.length - 1);
    },

    /**
     * 判断是否是数组
     * @param source {String}
     * @returns {Boolean}
     * 比如：isArray([])返回true
     */
    isArray: function (source) {
        return this.getType(source).toLowerCase() == 'array' ? true : false;
    },

    /**
     * 判断是否是日期
     * @param source {String}
     * @returns {Boolean}
     * 比如：isDate(new Date)返回true
     */
    isDate: function (source) {
        return this.getType(source).toLowerCase() == 'date' ? true : false;
    },

    /**
     * toArray 类数组转数组
     * @param elements
     * @returns Array
     * 比如：toArray(document.getElementsByTagName('meta'))，返回一个数组
     */
    toArray: function (elements) {
        var _result = [];
        try {
            _result = Array.from(elements) || Array.prototype.slice.call(elements);
        } catch (e) {
            for (var i = 0; i < elements.length; i++) {
                _result.push(elements[i]);
            }
        }
        return _result;
    },

    /**
     * 合并对象
     * @param source {Object} 被合并的对象
     * @param obj {Object}
     * @returns {Object}
     */
    extend: function (source, obj) {
        if (Object.assign) {
            source = Object.assign(source, obj);
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    source[key] = obj[key];
                }
            }
        }
        return source;
    },

    /**
     * 深度克隆对象
     * @param source {Object}
     * @returns {Object}
     */
    deepClone: function deepclonefn(source) {
        var _result = source.constructor === Array ? [] : source.constructor === Object ? {} : source,
            _key;

        for (_key in source) {
            if (source.hasOwnProperty(_key)) {
                if (source[_key].constructor === Array || source[_key].constructor === Object) {
                    _result[_key] = deepclonefn(source[_key]);
                } else {
                    _result[_key] = source[_key];
                }
            }
        }
        return _result;
    },

    /**
     * bind 更改函数this指向
     * @param ele
     * @param fn
     * @returns function
     */
    bind: function (ele, fn) {
        var _this = this,
            result;
        if (fn.bind) {
            result = fn.bind(ele);
        } else {
            result = function (event) {
                fn.apply(ele, _this.toArray(arguments).slice(1));
            };
        }
        return result;
    },

    /**
     * throttle 函数节流
     * @param fn
     * @param delay
     */
    throttle: function (fn, delay) {
        var last = 0;
        return function () {
            var cur = new Date().getTime();
            if (cur - last > delay) {
                fn.apply(this, arguments);
            }
            last = cur;
        };
    },

    /**
     * debounce 函数去抖
     * @param fn
     * @param delay
     */
    debounce: function (fn, delay) {
        var timer;
        return function () {
            var _this = this,
                _arg = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(_this, _arg);
            }, delay);
        };
    }
};

//处理url
var url = {
    /**
     * 获取查询字符串
     * @param url {String}
     * @param key {String}
     * @returns {String}
     * 加入location.href为：https://www.domain.com/?aaaa=11111&bbb=22222&ccc=33333
     * getQuery('aaaa')返回'11111'
     * 或者getQuery('https://www.domain.com/?aaaa=11111&bbb=22222&ccc=33333', 'aaaa')返回'11111'
     */
    getQuery: function (url, key) {
        var _url = arguments.length > 1 ? url : location.search,
            _val = _url.match(new RegExp('[\?&]' + key + '=([^&]*)(&|$)', 'i'));
        return _val ? decodeURIComponent(_val[1]) : '';
    },

    /**
     * 将对象转换为query字符串，使用URI编码值
     * @param obj {Object}
     * @returns {String}
     * 比如：format({"b":"bbb","a":["1 1","&2","=3","?4","5"]})返回'b=bbb&a=5&a=%3F4&a=%3D3&a=%262&a=1%201'
     */
    format: function (obj) {
        var _result = [],
            _item,
            _len;

        for (var key in obj) {
            //item只支持数组，字符串
            _item = obj[key];
            if (lang.isArray(_item)) {
                _len = _item.length;
                while (_len--) {
                    _result.push(key + '=' + encodeURIComponent(_item[_len]));
                }
            } else {
                _result.push(key + '=' + encodeURIComponent(obj[key]));
            }
        }

        return _result.join('&');
    },

    /**
     * 将query字符串转换为对象
     * @param source {String}
     * @returns {Object}
     * 比如：parse('b=bbb&a=5&a=%3F4&a=%3D3&a=%262&a=1%201')返回{"b":"bbb","a":["1 1","&2","=3","?4","5"]}
     */
    parse: function (source) {
        var _arr = source.split('&'),
            _len = _arr.length,
            _result = {},
            _key,
            _val,
            _temp;

        while (_len--) {
            _val = _arr[_len].match(new RegExp('([^=]*)=(.*)', 'i'));
            _key = _val[1];
            _val = decodeURIComponent(_val[2]);
            _temp = _result[_key];
            if (_temp == undefined) {
                _result[_key] = _val;
            } else if (lang.isArray(_temp)) {
                _result[_key].push(_val);
            } else {
                _result[_key] = [_temp, _val];
            }
        }

        return _result;
    }
};

//处理字符串
var string = {

    //html对应的实体字符
    htmlEscapes: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    },

    //实体字符对应的html
    htmlUnescapes: {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    },

    /**
     * 转义html为实体字符，&<>"'
     * @param source {String}
     * @returns {String}
     * 比如：escapeHTML(<a href="http://www.domain.com/?a=3&b=3">test</a>')，返回'&lt;a href=&quot;http://www.domain.com/?a=3&amp;b=3&quot;&gt;test&lt;/a&gt;'
     */
    escapeHTML: function (source) {
        var _htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return source.replace(new RegExp("[&<>\"']", 'g'), function (match, children, index, sourceString) {
            return _htmlEscapes[match];
        });
    },

    /**
     * 将实体字符转换为html
     * @param source {String}
     * @returns {String}
     * 比如：unescapeHTML('&lt;a href=&quot;http://www.domain.com/?a=3&amp;b=3&quot;&gt;test&lt;/a&gt;')，返回'<a href="http://www.domain.com/?a=3&b=3">test</a>'
     */
    unescapeHTML: function (source) {
        var _htmlUnescapes = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'"
        };

        return source.replace(new RegExp('&(?:lt|gt|quot|amp|#39);', 'g'), function (match) {
            return _htmlUnescapes[match];
        });
    },

    /**
     * 把字符串中的正则表达式字符转义，有14个^$?.*+|\(){}[]
     * @param source {String}
     * @returns {string}
     * 比如：escapeRegExp('^      $      ?      .      *      +      |      (      )      {      }      [      ]')
     * 返回：'\^      \$      \?      \.      \*      \+      \|      \(      \)      \{      \}      \[      \]'
     */
    escapeRegExp: function (source) {
        return source.replace(new RegExp('([\\^\\$\\?\\.\\*\\+\\|\\\\\(\\)\\{\\}\\[\\]])', 'g'), '\\$1');
    },

    /**
     * 对代码进行js转义，将编码值低于255的转换成\x十六进制
     * @param source {String}
     * @param type {Number}，进制js转义可以转义成16进制和8进制，默认是16进制
     * @returns {String}
     * 比如：escapeJs('alert(123)')，返回'\x61\x6c\x65\x72\x74\x28\x31\x32\x33\x29'
     * 比如：escapeJs('alert(123)', 8)，返回'\141\154\145\162\164\50\61\62\63\51'
     */
    escapeJs: function (source, type) {
        var _result = [],
            _len = source.length,
            _type = (type == undefined || type == 16) ? 16 : 8,
            _code;

        while (_len--) {
            _code = source.charCodeAt(_len);
            _code > 255 ? _result.push(source.charAt(_len)) : _result.push('\\' + (_type == 16 ? 'x' : '') + _code.toString(_type));
        }

        return _result.reverse().join('');
    },

    /**
     * 将代码转换为实体编码，如：&#十进制;和&#x十六进制;，转义包含<>"'&/\`
     * @param source {String}
     * @param type {Number}，可以转换的进制，默认是10进制，支持10进制和16进制
     * @returns {String}
     * 比如：escapeString('<>"\'&/\\`')，返回'&#60;&#62;&#34;&#39;&#38;&#47;\&#96;'
     * 比如：escapeString('<>"\'&/\\`', 16)，返回'&#x3c;&#x3e;&#x22;&#x27;&#x26;&#x2f;\&#x60;'
     */
    escapeString: function (source, type) {
        var _type = (type == undefined || type == 10) ? 10 : 16;

        return source.replace(new RegExp('[<>"\'&/\\`]', 'g'), function (match) {
            return _type == 10 ? '&#' + match.charCodeAt(0) + ';' : '&#x' + match.charCodeAt(0).toString(16) + ';';
        });
    },

    /**
     * 简单的模板替换，将字符串中{{变量}}替换为data对象的变量属性，
     * @param source {String}
     * @param data {Object}
     * @returns {String}
     * 比如：simpleTemplate('我的名字叫{{  name  }}，我今年{{ age }}岁，我的性别是{{sex}}。', {name: '张三', age: 20, sex: '男'})
     * 返回：'我的名字叫张三，我今年20岁，我的性别是男。'
     */
    simpleTemplate: function (source, data) {
        return source.replace(new RegExp('\{\{\\s*(.*?)\\s*\}\}', 'g'), function (match, children) {
            return data[children] || '';
        });
    },

    /**
     * 把rgb(255,255,255)或rgba(255,255,255,1)格式颜色转换为十六进制#RRGGBB格式
     * @param source {String} 比如rgb(255,255,255)或者rgba(255,255,255,0.1)
     * @returns {Object} {color: '', alpha: ''}
     * 比如：formatRgbToHex('rgb(255,255,255)')返回 {color: '#FFFFFF', alpha: ''}，formatRgbToHex('rgba(0,0,0,0.3)')返回{color: '#000000', alpha: '0.3'}
     */
    formatRgbToHex: function (source) {
        var _match = source.match(/([^\(]*)\(([^,]*),([^,]*),([^,]*)(,(.*))?\)/),
            _result = {
                color: '',
                alpha: ''
            },
            _r, _g, _b;

        //如果格式不对返回原字符串
        if (_match.length !== 7 || (_match[1] == 'rgba' && _match[6] == undefined) || (_match[1] == 'rgb' && _match[6] !== undefined) || (_match[2] > 255 || _match[2] < 0) || (_match[3] > 255 || _match[3] < 0) || (_match[4] > 255 || _match[4] < 0) || (_match[6] > 255 || _match[6] < 0)) {
            _result = source;
        } else {
            _r = (+_match[2]).toString(16);
            _r = _r.length == 1 ? _r + _r : _r;
            _g = (+_match[3]).toString(16);
            _g = _g.length == 1 ? _g + _g : _g;
            _b = (+_match[4]).toString(16);
            _b = _b.length == 1 ? _b + _b : _b;
            _result.color = '#' + _r + _g + _b;
            _result.color = _result.color.toUpperCase();
            _result.alpha = _match[1] == 'rgba' ? _match[6] : '';
        }

        return _result;
    },

    /**
     * 把十六进制#RRGGBB格式颜色转换为rgb(255,255,255)格式
     * @param hex {String}  值为#RGB或者#RRGGBB
     * @param alpha {String} 透明度，值在0-1之间
     * @returns {String} 返回类似rgb(255,255,255)或者rgba(255,255,255,0.1)
     * 比如：formatHexToRgb('#fff')或者formatHexToRgb('#ffffff')返回rgb(255,255,255)，formatHexToRgb('#000', 0.1)返回rgba(255,255,255,0.1)
     */
    formatHexToRgb: function (hex, alpha) {
        var _simpleReg = /^#\w{3}$/g,
            _reg = /^#\w{6}$/g,
            _arguments = arguments,
            _result = '',
            _val;

        //将#FFF转换为#FFF
        hex = _simpleReg.test(hex) ? hex.replace(/(\w{1})/g, '$1$1') : hex;
        alpha = parseFloat(alpha);
        alpha = isNaN(alpha) || alpha >= 1 || alpha <= 0 ? 1 : alpha;

        //如果是#RRGGBB就转换，否则不转换
        if (_reg.test(hex)) {
            _result = hex.replace(/^(#)(\w{2})(\w{2})(\w{2})$/g, function (match, children) {
                _val = parseInt(arguments[2], 16) + ',' + parseInt(arguments[3], 16) + ',' + parseInt(arguments[4], 16);
                //根据第二个参数返回不同的值
                return (_arguments.length > 1 ? 'rgba(' + _val + ',' + alpha : 'rgb(' + _val) + ')';
            });
        } else {
            _result = hex;
        }

        return _result;
    },

    /**
     * 获取字节大小，这里一个多字节字符占两个字节，可能不准
     * @param source {String}
     * @returns {Number}
     * 比如：getByteLength('测试abc')，返回7
     */
    getByteLength: function (source) {
        return source.replace(/[^\x00-\xff]/g, '**').length;
    },

    /**
     * 截取指定个数的字节，并且添加后缀
     * @param source {String} 给的字符串
     * @param length {Number} 要截取的字节长度
     * @param suffix 截取后添加的字符串
     * @returns {string}
     * 比如：subBytes('测123试', 6, '...')，返'测123...'，
     */
    subBytes: function (source, length, suffix) {
        var _result = '',
            _byteLength,
            _len = 0,
            _i = 0;

        source = source.toString();
        _byteLength = this.getByteLength(source);

        //小于0或者大于本来字符长度都返回原字符串
        if (length >= _byteLength || length < 0) {
            _result = source + suffix;
        } else {
            //找到要截取的位置，如果最后一个字符是多字节，即Unicode码大于255，则截取到这个字符的前一个字符
            while (_len < length) {
                _len += source.charCodeAt(_i) > 255 ? 2 : 1;
                _i = _len > length ? _i : _i + 1;
            }
            _result = source.substr(0, _i) + suffix;
        }

        return _result;
    },

    /**
     * 将字符串转换为驼峰，可以处理-和_分隔的
     * @param source
     * @returns {string}
     * 比如：toCamelCase('page-content-box')或toCamelCase('page_content_box')，都返回'pageContentBox'，
     */
    toCamelCase: function (source) {
        var _result = '';

        //如果没有-_直接返回原字符串
        if (!/[-_]/g.test(source)) {
            _result = source;
        } else {
            _result = source.replace(/[-_][^-_]/g, function (match) {
                return match.charAt(1).toUpperCase();
            });
        }

        return _result;
    },

    /**
     * 全角转半角
     * ！!  ＂"  ＃#  ＄$  ％%  ＆&  ＇'  （(  ）)  ＊*  ＋+  ，,  －-  ．.  ／/  ０0  １1  ２2  ３3  ４4  ５5  ６6  ７7  ８8  ９9  ：:  ；;  ＜<  ＝=  ＞>  ？?  ＠@  ＡA  ＢB  ＣC  ＤD  ＥE  ＦF  ＧG  ＨH  ＩI  ＪJ  ＫK  ＬL  ＭM  ＮN  ＯO  ＰP  ＱQ  ＲR  ＳS  ＴT  ＵU  ＶV  ＷW  ＸX  ＹY  ＺZ  ［[  ＼\  ］]  ＾^  ＿_  ｀`  ａa  ｂb  ｃc  ｄd  ｅe  ｆf  ｇg  ｈh  ｉi  ｊj  ｋk  ｌl  ｍm  ｎn  ｏo  ｐp  ｑq  ｒr  ｓs  ｔt  ｕu  ｖv  ｗw  ｘx  ｙy  ｚz  ｛{  ｜|  ｝}  ～~
     * 全角字符Unicode码65281-65374，对应的半角字符Unicode码33-126，两者值差65248；另外全角空格Unicode码12288，半角空格Unicode码32。全角字符 半角字符对应如下
     * @param source
     * @returns {string}
     * 比如：toDBC('＄（ａｂｃ）　－　＃［１２３］')，返'$(abc) - #[123]'
     */
    toDBC: function (source) {
        var _result = '',
            _charCode;

        for (var i = 0; i < source.length; i++) {
            _charCode = source.charCodeAt(i);

            if (_charCode == 12288) {
                _result += String.fromCharCode(32);
            } else if (_charCode >= 65281 && _charCode <= 65374) {
                _result += String.fromCharCode(_charCode - 65248);
            } else {
                _result += source.charAt(i);
            }
        }

        return _result;
    },

    /**
     * 半角转全角
     * @param source
     * @returns {string}
     * 比如：toSBC('$(abc) - #[123]')，返'＄（ａｂｃ）　－　＃［１２３］'
     */
    toSBC: function (source) {
        var _result = '',
            _charCode;

        for (var i = 0; i < source.length; i++) {
            _charCode = source.charCodeAt(i);

            if (_charCode == 32) {
                _result += String.fromCharCode(12288);
            } else if (_charCode >= 33 && _charCode <= 126) {
                _result += String.fromCharCode((_charCode + 65248));
            } else {
                _result += source.charAt(i);
            }
        }

        return _result;
    },

    /**
     * 清除左右空格，兼容低版本浏览器
     * 低版本浏览器中正则\s包含[\f\n\r\t\v]，不包含中文空格\u3000\和不间断空格\u00A0，还需要去除BOM\uFEFF
     * @param source
     * @returns {string}
     * 比如：trim('　 测试123　 ')，返回'测试123'
     */
    trim: function (source) {
        return source.replace(/^[\s\u3000\u00A0\uFEFF]+|[\s\u3000\u00A0\uFEFF]+$/g, '');
    },

    /**
     * 生成guid
     * @returns {string}
     * 比如guid()，返回''
     */
    guid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

//处理数字
var number = {
    /**
     * 指定长度，如果不够前面自动补充0，否则返回原值，一般用在时间格式化中比如22:00:00
     * @param source
     * @param len 长度
     * @returns {string}
     * 比如：padStartZero('123', 10)，返回'0000000123'
     */
    padStartZero: function (source, len) {
        var _sourceLen = source.toString().length;

        return Array(len > _sourceLen ? len - _sourceLen + 1 : 0).join('0') + source;
    },

    /**
     * 获取小数点后指定位数四舍五入取整，主要是修复ie和chrome在Number.prototype.toFixed得到的值不同，这个方法在ie下预期正确，在chrome下某些情况不会进行四舍五入
     * @param num {Number}
     * @param subLength {Number} 指定小数点后的多少位数
     * @returns {number}
     * 比如：用1.335.toFixed(2)在IE中为'1.34'，在chrome中为'1.33'
     * 修正后的方法：toFixed(1.335, 2)，返回'1.34'
     */
    toFixed: function (num, subLength) {
        var _result = parseFloat(num).toString(),
            _reg;

        //IE中toFixed参数最大值为20，这里也做限制
        if (subLength > 20 || subLength < 0) {
            _result = num;
        } else {
            //这里处理四舍五入的兼容性
            _result = _result.replace(/^(\d+)\.(\d+)$/g, function (match, integer, decimal) {
                //为保证正则可以执行需要小数长度最少2位
                if (decimal.length > subLength && decimal.length >= 2) {
                    _reg = new RegExp('^(\\d{' + (subLength - 1) + '})(\\d)(\\d).*$', 'g');
                    decimal = decimal.replace(_reg, function (subMath, first, second, third) {
                        return third >= 5 ? first * 10 + (parseInt(second) + 1) : first + second;
                    });
                }
                return integer + '.' + decimal;
            });
            _result = parseFloat(_result).toFixed(subLength);
        }

        return _result;
    },

    /**
     * 将给定的文件大小转换为带单位的字符串
     * @param size {Number}
     * @param len {Number} 默认值为2，保留小数点位数
     * @returns {string}
     * 比如：formatFileSize(1024652)，返回'1000.64KB'
     */
    formatFileSize: function (size, len) {
        var _unitArray = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            _k = 1024,
            _i = 0;

        len = len == undefined ? 2 : parseInt(len);
        size = parseFloat(size);
        while (size >= _k) {
            _i++;
            size = size / _k;
        }

        return this.toFixed(size, len) + _unitArray[_i];
    }
};

//处理日期
var date = {
    /**
     * 返回日期，兼容浏览器，支持-/分割日期
     * +new Date(0) == +new Date('1970/01/01 08:00:00')，本地时间是东8区，所以会以197/01/01 08:00:00为开始时间
     * @param source {String|Number}
     * 如String日期：'1970/01/01 08:00:00'，或'1970-01-01 08:00:00'，或'1970/01/01'会自动加上时间00:00:00；
     * 如Number时间戳：1557213505794
     * @returns {string}
     * 比如：parse('1970/01/01 00:00:00')或parse('1970-01-01')或new Date(-28800000)，都返回Thu Jan 01 1970 00:00:00 GMT+0800 (中国标准时间)
     */
    parse: function (source) {
        //new Date本来就支持时间戳和日期如1970/01/01格式，这里处理了Firefox不支持-分割日期，将其转换为/
        return new Date(typeof source == 'string' ? source.replace(/-/g, '/') : source);
    },

    /**
     * y代表年，M代表月，d代表天，H代表24小时制，h代表12小时制，m代表分钟，s代表秒，W代表周
     * @param source {Number|Date} 时间戳或日期
     * @param format {String} 格式化字符串
     * @returns {string}
     * 比如：format(+new Date(), 'yyyy-MM-dd hh:mm:ss 周W')，返回'2019-05-07 06:16:21 周二'
     */
    format: function (source, format) {
        source = lang.isDate(source) ? source : this.parse(+source);
        var _weekArr = ['日', '一', '二', '三', '四', '五', '六'],
            _year = source.getFullYear(),
            _month = source.getMonth() + 1,
            _date = source.getDate(),
            _hours = source.getHours(),
            _minutes = source.getMinutes(),
            _seconds = source.getSeconds(),
            _week = source.getDay(),
            _padStartZero = number.padStartZero;

        return format.replace(/(y+)|(M+)|(d+)|(H+)|(h+)|(m+)|(s+)|W/g, function (match) {
            switch (match) {
                case 'yyyy':
                    return _year;
                case 'yy':
                    return _year.toString().slice(-2);
                case 'MM':
                    return _padStartZero(_month, 2);
                case 'M':
                    return _month;
                case 'dd':
                    return _padStartZero(_date, 2);
                case 'd':
                    return _date;
                case 'HH':
                    return _padStartZero(_hours, 2);
                case 'H':
                    return _hours;
                case 'hh':
                    return _padStartZero(_hours % 12, 2);
                case 'h':
                    return _hours % 12;
                case 'mm':
                    return _padStartZero(_minutes, 2);
                case 'm':
                    return _minutes;
                case 'ss':
                    return _padStartZero(_seconds, 2);
                case 's':
                    return _seconds;
                case 'W':
                    return _weekArr[_week];
                default:
                    return match;
            }
        });
    },

    /**
     * 时间戳转换成天，时，分，秒
     * @param source 时间戳
     * @returns {string}
     * 比如：toTime(123123123)，返回'1天10时12分03秒'
     */
    toTime: function (source) {
        var _padStartZero = number.padStartZero,
            _days = Math.floor(source / (24 * 60 * 60 * 1000)),
            _hours = _padStartZero(Math.floor((source % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)), 2),
            _minutes = _padStartZero(Math.floor((source % (60 * 60 * 1000)) / (60 * 1000)), 2),
            _seconds = _padStartZero(Math.floor((source % (60 * 1000)) / (1000)), 2),
            _result;

        if (+_days) {
            _result = _days + '天' + _hours + '时' + _minutes + '分' + _seconds + '秒';
        } else if (+_hours) {
            _result = _hours + '时' + _minutes + '分' + _seconds + '秒';
        } else if (+_minutes) {
            _result = _minutes + '分' + _seconds + '秒';
        } else {
            _result = _seconds + '秒';
        }

        return _result;
    },

    /**
     * 将天转换为毫秒，忽略小数点
     * @param source {Number}
     * @returns {number}
     * 比如：toMilliseconds(3.2)，返回259200000
     */
    toMilliseconds: function (source) {
        return parseInt(source) * 24 * 60 * 60 * 1000;
    }
};

//处理cookie
var cookie = {

    /**
     * 根据cookie名获取值
     * cookie值之间是用; 隔开的。比如document.cookie获取到'a=1; b=2; c=3'
     * @param key cookie名
     * @returns {string}
     * 比如：get('a')，返'1'
     */
    get: function (key) {
        var _reg = new RegExp('\\b' + encodeURIComponent(key.toString()).replace(/\(\)/g, escape) + '=([^;]*)'),
            _result = document.cookie.match(_reg);

        return _result === null ? undefined : decodeURIComponent(_result[1]);
    },

    /**
     * 设置cookie，对cookie的键名和值都进行encodeURIComponent编码(一般只需要对逗号，分号，空格进行URI编码)，默认path为/
     * 设置cookie的expires需要GTM格式时间，因为toGMTString()已经废弃，推荐使用toUTCString()，domain默认是页面所在域名
     * @param key cookie名
     * @param val cookie值
     * @param params {Object} cookie的选项，如{expires:1, path:'/', domain:'localhost', secure: true}
     * 需要在https下设置secure，如果在http下设置secure会失败
     * expires单位是天，值为Number类型或new Date()的值
     * 修改cookie值需要domain和path相同
     * @returns '' {String} 返回val的值
     * 比如：set('a', '1')，返回'1'
     */
    set: function (key, val, params) {
        var _paramsString = '',
            _item;

        params = lang.extend({
            path: '/'
        }, params || {});
        /*encodeURIComponent对()不编码，需要使用escape。http://www.ietf.org/rfc/rfc2068.txt
        tspecials  = "(" | ")" | "<" | ">" | "@" | "," | ";" | ":" | "\" | <"> | "/" | "[" | "]" | "?" | "=" | "{" | "}" | SP | HT*/
        key = encodeURIComponent(key.toString()).replace(/\(\)/g, escape);
        val = encodeURIComponent(val.toString()).replace(/\(\)/g, escape);
        typeof params.expires == 'number' && (params.expires = new Date(+new Date() + params.expires * (24 * 60 * 60 * 1000)));
        lang.isDate(params.expires) && (params.expires = params.expires.toUTCString());
        for (_item in params) {
            //跳过空值
            if (!params[_item]) {
                continue;
            }
            _paramsString += '; ' + _item;
            //secure不需要赋值
            if (params[_item] === true) {
                continue;
            }
            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characterjsonToQuerys of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...
            _paramsString += '=' + params[_item].split(';')[0];
        }

        return (document.cookie = key + '=' + val + _paramsString);
    },

    /**
     * 删除cookie
     * @param key {String} cookie名
     */
    remove: function (key, params) {
        return this.set(key, '', lang.extend(params || {}, {
            expires: -1
        }));
    }
};