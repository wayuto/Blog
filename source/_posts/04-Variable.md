---
title: 04-变量
date: 2026-02-27 14:22:21
tags: Alum
---

`变量`是一个语言中重要的部分，大多数`Toy Language`都会选择在实现四则计算后，实现变量的存储，`Alum`也不例外，在`Alum`中，变量的声明与初始化方式如下：
```alum
let var: T = value
```
例如，声明一个变量`i`，其类型为`int`，值为`1`，代码如下：
```alum
let i: int = 1
```
需要注意的是，`Alum`的变量必须在声明的同时初始化，这意味着，即使暂时没有用到它，你也要给他一个值，哪怕是`0`, `0.0`, `''`(空字符串)，`false`，`nil`，并且`Alum`中并没有变量与常量的区分，默认也没有不可变性，这让语法以及后端实现更简单，但也需要开发者自己保证一个标识符是变量还是常量。另外，`Alum`也不支持通过`extern`关键字引入全局变量。  
下面给出一个关于变量的例子，出自`Alum/examples/02_variables.al`：
```alum
$import "io.al"
$import "convert.al"

// Variables Example
// Demonstrates variable declarations with different types

fun main(): int {
    // Integer variable
    let age: int = 25
    
    // Float variable
    let pi: float = 3.14159
    
    // Boolean variable
    let is_student: bool = true
    
    // String variable
    let name: string = "Alum"
    
    // Nil value for integer
    let empty: int = nil
    
    // Print values
    println("Name: ")
    println(name)
    println("Age: ")
    println(itoa(age))
    println("Pi: ")
    println(ftoa(pi))
    println("Is Student: ")
    if is_student {
        println("true")
    } else {
        println("false")
    }
    
    return 0
}
```

这里可以看到，每次声明并初始化一个变量时，都要显式的标出类型，这虽然清晰，但有时也令代码变得冗长且不必要，比如上面的定义`i`的值为`1`，这里很明显`i`的类型为`int`，于是我们便可以省略类型，使用`Alum`自动推导的特性，直接写为：
```alum
let i = 1
```
这样在保证代码清晰的同时，也提升了简洁性。