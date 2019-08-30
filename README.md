常用函数

# 【lang】工具相关
lang.getType 获取类型
lang.isArray 判断是否是数组
lang.isDate 判断是否是日期
lang.toArray 类数组转数组
lang.extend 合并对象
lang.deepClone 深度克隆对象
lang.bind 更改函数this指向
lang.throttle 函数节流
lang.debounce 函数去抖

# 【url】处理url
- url.getQuery 获取查询字符串
- url.format 将对象转换为query字符串，使用URI编码值
- url.parse 将query字符串转换为对象

# 【string】处理字符串
- string.escapeHTML 转义html为实体字符
- string.unescapeHTML 实体字符转换为html
- string.escapeRegExp 把字符串中的正则表达式字符转义
- string.escapeJs 对代码进行js转义，将编码值低于255的转换成\x十六进制
- string.escapeString 将代码转换为实体编码
- string.simpleTemplate 简单的模板替换
- string.formatRgbToHex 把rgb转换为十六进制颜色
- string.formatHexToRgb 把十六进制颜色转换为rgb
- string.getByteLength 获取字节大小
- string.subBytes 截取指定个数的字节，并且添加后缀
- string.toCamelCase 将字符串转换为驼峰
- string.toDBC 全角转半角
- string.toSBC 半角转全角
- string.trim 清除左右空格
- string.guid 生成guid

# 【number】处理数字
- number.padStartZero 指定长度，如果不够前面自动补充0
- number.toFixed 获取小数点后指定位数四舍五入取整
- number.formatFileSize 将给定的文件大小转换为带单位的字符串

# 【date】处理日期
- date.parse 返回日期
- date.format 格式化日期
- date.toTime 时间戳转换成天，时，分，秒
- date.toMilliseconds 将天转换为毫秒

# 【cookie】
- cookie.get 根据cookie名获取值
- cookie.set 设置cookie
- cookie.remove 删除cookie
