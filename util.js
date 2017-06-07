/**
 * util javascript常用功能函数
 * Author : 水煮菠菜 949395345@qq.com
 * Url : https://github.com/shuizhubocai
 * Date : 2017-4-12
 */

(function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function () {
            return factory(root)
        })
    } else if (typeof exports == 'object') {
        module.exports = factory(root)
    } else {
        root.util = factory(root)
    }
})(this, function (root) {
    return {
        /**
         * hasDoctype 判断是否有doctype
         * @returns {boolean}
         */
        hasDoctype: function () {
            var hasDoc = true
            if (document.compatMode == 'CSS1Compat') {
                hasDoc = true
            } else if (document.compatMode == 'BackCompat') {
                hasDoc = false
            }
            return hasDoc
        },
        /**
         * getEleById 通过id获取dom
         * @param id
         * @returns {Element}
         */
        getEleById: function (id) {
            return typeof id == 'object' && id.nodeType == 1 ? id : document.getElementById(id)
        },
        /**
         * getContentInfo 获取内容高度，默认是window，html中没有doctype标签会导致结果不正确
         * @param container
         * @returns {{}}
         */
        getContentInfo: function (container) {
            var info = {}
            if (!container || container == window) {
                info.width = document.documentElement.scrollWidth || document.body.scrollWidth
                info.height = document.documentElement.scrollHeight || document.body.scrollHeight
            } else {
                container = this.getEleById(container)
                info.width = container.scrollWidth
                info.height = container.scrollHeight
            }
            return info
        },
        /**
         * getViewInfo 获取可视宽高，默认是window，html中没有doctype标签会导致结果不正确
         * @param contianer
         * @returns Object width是宽，height是高
         */
        getViewInfo: function (container) {
            var info = {}
            if (!container || container == window) {
                info.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                info.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            } else {
                container = this.getEleById(container)
                info.width = container.clientWidth
                info.height = container.clientHeight
            }
            return info
        },
        /**
         * setScrollPosition 设置滚动条位置
         * @param container 容器
         * @param options x水平位置，y垂直位置，不需要单位
         */
        setScrollPosition: function (container, options) {
            if (arguments.length > 1) {
                container = this.getEleById(container)
                container.scrollLeft = options.x
                container.scrollTop = options.y
            } else {
                window.scrollTo(arguments[0].x, arguments[0].y)
            }
        },
        /**
         * getScrollPosition 获取滚动条位置
         * @param container 容器
         * @returns Object top垂直方向，left水平方向
         */
        getScrollPosition: function (container) {
            var position = {}
            if (!container || container == window) {
                position.top = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
                position.left = window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft
            } else {
                if (typeof container == 'string') {
                    position.top = document.getElementById(container).scrollTop
                    position.left = document.getElementById(container).scrollLeft
                }
                if (typeof container == 'object') {
                    position.top = container.scrollTop
                    position.left = container.scrollLeft
                }
            }
            return position
        },
        /**
         * offset 获取元素距离顶部值
         * @param ele
         * @returns {{top: number, left: number}}
         */
        offset: function (ele) {
            var result = {
                top: 0,
                left: 0
            }
            while (ele) {
                result.top += ele.offsetTop
                result.left += ele.offsetLeft
                ele = ele.offsetParent
            }
            return result
        },
        /**
         * getElesByClassName 通过类名获取dom
         * @param className
         * @param parent 限定查找范围的id
         * @returns Array
         */
        getElesByClassName: function (className, parent) {
            var reg = new RegExp('\\b' + className + '\\b'),
                parent = this.getEleById(parent),
                len,
                eles
            if (document.getElementsByClassName) {
                eles = parent ? parent.getElementsByClassName(className) : document.getElementsByClassName(className)
                eles = this.toArray(eles)
            } else {
                eles = parent ? parent.getElementsByTagName('*') : document.getElementsByTagName('*'),
                    eles = this.toArray(eles),
                    len = eles.length
                for (var i = len - 1; i >= 0; i--) {
                    if (!reg.test(eles[i].className)) {
                        eles.splice(i, 1)
                    }
                }
            }
            return eles
        },
        /**
         * getCSS 获取元素css样式值
         * @param ele
         * @param attr
         * @returns string
         */
        getCSS: function (ele, attr) {
            var ele = this.getEleById(ele),
                attr = attr.toLowerCase(),
                result
            if (window.getComputedStyle) {
                result = window.getComputedStyle(ele, null)[attr]
            } else {
                result = ele.currentStyle[attr]
            }
            return result
        },
        /**
         * getQueryString 查询指定url键值
         * @param name
         * @returns string or null
         */
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
            var result = this.getNode.win.location.search.substr(1).match(reg)
            if (result != null) {
                return decodeURIComponent(result[2])
            } else {
                return null
            }
        },
        /**
         * bind 更改函数this指向
         * @param ele
         * @param fn
         * @returns function
         */
        bind: function (ele, fn) {
            var _this = this,
                result
            if (fn.bind) {
                result = fn.bind(ele)
            } else {
                result = function (event) {
                    fn.apply(ele, _this.toArray(arguments).slice(1))
                }
            }
            return result
        },
        /**
         * addEvent 添加事件，修正this指向
         * @param ele
         * @param type
         * @param fn
         */
        addEvent: function (ele, type, fn) {
            if (ele.addEventListener) {
                ele.addEventListener(type, fn, false)
            } else if (ele.attachEvent) {
                ele[type + fn] = function () {
                    fn.call(ele, window.event)
                }
                ele.attachEvent('on' + type, ele[type + fn])
            }
        },
        /**
         * removeEvent 删除事件
         * @param ele
         * @param type
         * @param fn
         */
        removeEvent: function (ele, type, fn) {
            if (ele.removeEventListener) {
                ele.removeEventListener(type, fn, false)
            } else if (ele.detachEvent) {
                ele.detachEvent('on' + type, ele[type + fn])
                ele[type + fn] = null
            }
        },
        /**
         * throttle 函数节流
         * @param fn
         * @param delay
         */
        throttle: function (fn, delay) {
            var last = 0
            return function () {
                var cur = new Date().getTime()
                if (cur - last > delay) {
                    fn.apply(this, arguments)
                }
                last = cur
            }
        },
        /**
         * debounce 函数去抖
         * @param fn
         * @param delay
         */
        debounce: function (fn, delay) {
            var timer
            return function () {
                var _this = this,
                    _arg = arguments
                clearTimeout(timer)
                timer = setTimeout(function () {
                    fn.apply(_this, _arg)
                }, delay)
            }
        },
        /**
         * toArray 类数组转数组
         * @param elements
         * @returns Array
         */
        toArray: function (elements) {
            var arr
            try {
                arr = Array.from(elements) || Array.prototype.slice.call(elements)
            } catch (e) {
                arr = []
                for (var i = 0; i < elements.length; i++) {
                    arr.push(elements[i])
                }
            }
            return arr
        },
        /**
         * deepClone 深度克隆对象
         * @param obj
         * @returns Object
         */
        deepClone: function deepclonefn (obj) {
            var result = obj.constructor === Array ? [] : obj.constructor === Object ? {} : obj,
                key
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key].constructor === Array || obj[key].constructor === Object) {
                        result[key] = deepclonefn(obj[key])
                    } else {
                        result[key] = obj[key]
                    }
                }
            }
            return result
        },

        /**
         * extend 合并对象
         * @param target 被合并的对象
         * @param obj
         * @returns Object
         */
        extend: function (target, obj) {
            if (Object.assign) {
                target = Object.assign(target, obj)
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        target[key] = obj[key]
                    }
                }
            }
            return target
        },
        /**
         * getPicInfo 快速获取图片宽高，图片加载完回调
         * @param options 对象类型，包含{src:string, fastCallback:fn, loadedCallback:fn, errorCallback:fn}
         * @options  src是图片地址，fastCallback是快速获取到图片宽高后的回调函数，loadedCallback是图片加载完的回调函数，errorCallback是图片加载失败的回调函数
         * @params {isError: boolean, width:number: height:number}，回调函数参数
         */
        getPicInfo: function (options) {
            var src = options.src || '',
                fastCallback = options.fastCallback,
                loadedCallback = options.loadedCallback,
                errorCallback = options.errorCallback,
                pic = new Image(),
                params = {
                    isError: false,
                    width: 0,
                    height: 0
                },
                rollpolling = function () {
                    if (params.isError || pic.width > 0 || pic.height > 0) {
                        clearInterval(timer)
                        params.width = pic.width
                        params.height = pic.height
                        fastCallback && fastCallback(params)
                    }
                },
                timer
            pic.src = src
            this.addEvent(pic, 'error', function () {
                params.isError = true
                errorCallback && errorCallback(params)
            })
            if (pic.complete) {
                params.width = pic.width
                params.height = pic.height
                fastCallback && fastCallback(params)
                loadedCallback && loadedCallback(params)
            } else {
                this.addEvent(pic, 'load', function () {
                    params.width = pic.width
                    params.height = pic.height
                    loadedCallback && loadedCallback(params)
                })
                timer = setInterval(rollpolling, 50)
            }
        },
        /**
         * curryfix 柯里化函数含固定参数
         * @param fn
         * @returns {Function}
         */
        curryfix: function (fn) {
            var _args = Array.prototype.slice.call(arguments).slice(1)
            return function () {
                return fn.apply(this, _args.concat(Array.prototype.slice.call(arguments)))
            }
        },
        /**
         * curry 柯里化函数不含固定参数
         * @param fn
         * @returns {callback}
         */
        curry: function (fn) {
            var _args = []
            return function callback () {
                if (!arguments.length) {
                    return fn.apply(this, _args)
                }
                _args = _args.concat(Array.prototype.slice.call(arguments))
                return callback
            }
        },
        /**
         * mouseWheelAddEvent 为鼠标滚轮事件设置方法
         * @param ele
         * @param fn
         */
        mouseWheelAddEvent: function (ele, fn) {
            //firefox和标准浏览器
            if (ele.addEventListener) {
                ele.addEventListener('onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel', fn, false)
            } else {
                //ie和标准浏览器
                ele.onmousewheel = fn
            }
        },
        /**
         * getMouseWheelDirection 获取鼠标滚轮方向
         * @param e 事件对象
         * @return number 正表示上或者左滚动，负表示下或者右滚动
         */
        getMouseWheelDirection: function (e) {
            e = e || window.event
            var delta = 0
            if (e.wheelDelta) {
                console.log('wheelDelta')
                delta = e.wheelDelta / 120
            } else if (e.deltaY) {
                console.log('deltaY')
                delta = -(e.deltaY / 3)
            }
            return delta
        }
    }
})