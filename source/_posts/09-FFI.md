---
title: 09-外部函数接口
date: 2026-02-28 19:49:16
tags: Alum
---

作为一个`Toy Language`，`Alum`的生态极为弱小，这限制了我们编写一些比较复杂的程序，我们可以通过`FFI`(Foreign Function Interface，即：外部函数接口)用其他语言为`Alum`编写拓展，这里最推荐的是`C语言`，因为`Alum`的数据在内存布局上与`C语言`几乎一致，不需要转换的开销。可以通过`extern`直接引入外部函数。  

## `extern`关键字
`extern`关键字是`Alum`与外部函数（不论是`Alum`还是其他语言）打交道的桥梁，它的语法如下：
```alum
extern F(PTn, ...): RT
```
例如，我们每次调用`println`函数都要`$import "io.al"`，但其实，也可以通过
```alum
extern println(string): void
```
的方式直接定义，但还是推荐引入`io.al`，这样更方便也更直观。

## 与`C语言`的兼容性
我们直接用示例介绍，还记得在[02-Installation](/2026/02/27/02-Installation/)中安装的`almk`工具吧？它可以很好的帮我们处理`Alum`与`C语言`的混合编译与连接问题。关于`almk`我们会在未来的章节讲解，下面是`Alum`与`C语言`混合编程的例子：  
1. 首先在终端输入：
```bash
$ almk new c_compat
```
2. 然后，编辑`c_compat/Alumake.toml`文件，像下文所示（只要`build`部分类似即可）：
```toml
[package]
name = "c_compat"
version = "0.1.0"
author = ""
license = ""
language = "mixed"

[build]
linker = "alc"
cc = "cc"
alc = "alc"
cflags = "-Wall -O2 -nostdlib"
includes = ["./include"]
```
2. 接着创建目录`c_compat/include`，并将以下代码写入`helper.al`文件中：
```alum
$ifndef HELPER_AL
$define HELPER_AL nil

extern c_add(int, int): int
extern c_multiply(int, int): int
extern c_calculate_factorial(int): int

$endif // HELPER_AL
```
3. 并将以下代码写入`src/helper.c`文件中：
```c
#include "helper.h"

int c_add(int a, int b) {
    return a + b;
}

int c_multiply(int a, int b) {
    return a * b;
}

int c_calculate_factorial(int n) {
    if (n < 0) {
        return 0;
    }
    
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    
    return result;
}
```
4. 最后，修改`src/main.al`文件： 
```alum
$import "io.al"
$import "convert.al"
$import "helper.al"

fun main(): int {
    let sum: int = c_add(10, 20)
    print("c_add(10, 20) = ")
    println(itoa(sum))
    
    let product: int = c_multiply(5, 6)
    print("c_multiply(5, 6) = ")
    println(itoa(product))
    
    let factorial: int = c_calculate_factorial(5)
    print("c_calculate_factorial(5) = ")
    println(itoa(factorial))
    
    return 0
}   
```
5. 在终端进入`c_compat/`目录后执行`almk run`或者`almk build && ./target/c_compat`便能得到输出：
```bash
c_add(10, 20) = 30
c_multiply(5, 6) = 30
c_calculate_factorial(5) = 120
```

> 注：示例代码来自Alum/examples/15_mixed_c_alum