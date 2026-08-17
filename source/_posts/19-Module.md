---
title: 19-模块
date: 2026-08-17 10:14:30
tags: Alum
---

在`0.9.8`版本之前，`Alum`一直使用宏处理`$import`配合`.ah`头文件组织多个文件的代码，这与`C语言`一致并且易于实现。
但历史也证明，这样的组织方式给开发者带来了很大的负担，每次都要改动两个文件。  
在`Alum`的`0.9.8`版本中，保留了`C`风格的预处理，同时引入了`import`与`using`关键字，用于模块化的组织代码。  

## import
`import`关键字用于注册命名空间，例如
```alum
import io
```
就是将标准库中`io.al`的符号注册到`io`命名空间中，可以使用`::`调用其中的方法，结构体，枚举，以及变量（都需要标记pub）。
例如最简单的`Hello world`：
```alum
import io

fun main(): int {
    io::println("Hello world!")
    return 0
}
```

## using
使用`import`会将所有符号都注册，而`using`关键字则仅将部分符号注册到当前命名空间，以下是一个简单的示例程序:
```
using io::{input, println}

fun main(): int {
    var name = input("Enter your name: ")
    println(f"Hello {name}!")
    return 0
}
```

## 注意
需要注意的是，当前的模块仅仅是一层`语法糖`，生成的汇编依然没有`mangling`，  
所以标准库中的`vec_new`和`arr_new`都没有改为`new`，后导入的符号静默覆盖先前导入的符号。