module.exports = {
  // 基本配置
  semi: true, // 语句末尾添加分号
  singleQuote: true, // 使用单引号而不是双引号
  quoteProps: 'as-needed', // 仅在需要时给对象属性加引号
  trailingComma: 'es5', // 在ES5中有效的尾随逗号（对象、数组等）
  tabWidth: 2, // 缩进空格数
  useTabs: false, // 使用空格而不是制表符
  printWidth: 80, // 行长度限制
  endOfLine: 'lf', // 行尾序列

  // JSX配置
  jsxSingleQuote: true, // JSX中使用单引号
  bracketSameLine: false, // JSX标签的'>'放在下一行

  // 其他配置
  bracketSpacing: true, // 对象字面量的大括号间是否有空格
  arrowParens: 'avoid', // 箭头函数参数只有一个时是否要有小括号
  rangeStart: 0, // 格式化范围开始
  rangeEnd: Infinity, // 格式化范围结束
  requirePragma: false, // 是否只格式化在文件顶部包含特殊注释的文件
  insertPragma: false, // 是否在文件顶部插入格式化注释
  proseWrap: 'preserve', // 是否换行
  htmlWhitespaceSensitivity: 'css', // HTML空白敏感性
  vueIndentScriptAndStyle: false, // Vue文件中的script和style标签缩进
  embeddedLanguageFormatting: 'auto', // 嵌入式语言格式化
  singleAttributePerLine: false, // 每个属性占一行
};
