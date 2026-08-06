---
title: 17-函数注解
date: 2026-08-06 16:00:34
tags:
---

在编程时，我们常常需要对函数增加一些`元信息`，例如`C语言`的`static`与`inline`等关键字表示`静态函数`与`内联`，在`Alum 0.9.6`中，加入了函数注解语法：
```alum
fun(meta) foo(P: PT): RT
```
我们在[09-外部函数接口](09-FFI.md)学到的`extern`就是其中之一，目前，`Alum 0.9.6`仅支持`extern`，`pub`与`pure`三种，我们将介绍`pub`与`pure`的用途。  

## `pub`
在[09-外部函数接口](09-FFI.md)中我们知道了通过`extern`调用外部函数，同样的使用`pub`注解可以将`Alum`函数暴露给外部函数，例如：
```alum
fun(pub) succ(n: int): int {
    return n + 1
}
```
这样，就可以在其他兼容`SystemV ABI`的语言中调用`succ`函数。  
你可能会有一个`疑问`：为什么`main`函数不需要添加`pub`注解就能调用？这个问题我们可以在编译器的源码中观察到：
```rust
let is_pub = attrs.is_pub || name == "main";
```
是的，如果函数名是`main`，编译器会自动将`is_pub`设`true`

## `pure`
相信了解过`函数式编程`的读者一定知道一个概念：`纯函数`，即`无副作用函数`，也就是说，调用一个`纯函数`，相同的输入永远得到相同的输出，并且不会`产生I/O操作`，`修改全局状态`，`读取外部状态`。
例如，`斐波那契`函数就是经典的纯函数，它会产生大量的递归，经常用来测试`编程语言`的`性能`，我们用`Alum`编写以下代码：
```alum
$import "io.ah"

fun fib(n: int): int {
    if n < 2 return n
    return fib(n - 1) + fib(n - 2)
}

fun main(): int {
    var n = fib(35)
    println(f"{n}")
    return 0
}
```
编译运行，经过测试，在`笔者`的笔记本电脑中的运行时间大约在`90ms`。对于这种固定输入得到固定输出的程序，我们只需要稍作修改（编译上面的版本时，编译器也会提示该函数体是纯的，建议加上`pure`注解）：
```alum
$import "io.ah"

fun(pure) fib(n: int): int {
    if n < 2 return n
    return fib(n - 1) + fib(n - 2)
}

fun main(): int {
    var n = fib(35)
    println(f"{n}")
    return 0
}
```
再次编译并运行，速度大约在`200µs`，性能大约提升了`450`倍！  
但读者肯定也能明显感知到`编译时`时间显著增加。  
没错，我们曾在[01-介绍](01-Introduction.md)提到，`Gos 0.5.x`之前一直存在`字节码虚拟机(GosVM)`，
在`Alum 0.9.6`中，`GosVM`已经回归，但并非是一个`完整的后端`，而是作为`受限的子集`，在`编译时`将无副作用的`函数`直接计算出结果，提升`运行时`性能。