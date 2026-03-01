---
title: 01-介绍
date: 2026-02-26 23:25:16
tags: Alum
---

> 阅读本系列文章时建议先学习`C语言`基础或从网上查阅相关资料

`Alum`语言是一门静态类型，语法接近`C`与`Rust`，运行在x86_64 Linux平台的语言，对`C语言`有良好的兼容性，性能接近C(Benchmark: fib(30)), 由[笔者](/about)使用`Rust`独立开发。

## Hello world
这是每个语言经典的第一个程序，对于`Alum`, 最简单的Hello world如下
```Alum
$import "io.al" // 引入标准I/O函数(print, input, open, close, ...)

fun main() { // Alum语言的函数入口，与大多数语言一致
    println("Hello world!") // print不换行，println自动换行
    return 0 // 返回程序退出状态码
}
```
将其保存为.al文件，并用alc编译运行，即可得到输出
```bash
$ alc hello.al
$ ./hello.al
```
程序输出结果为：
```
Hello world!
```

## Alum语言的来源
`Alum`的前身是由`TypeScript`编写的`Gos`语言，是一种解释型语言，灵感来自放学路上的灵光一现，后在`0.2.7`版本使用`Rust`重构，并后续添加`AOT`，`0.5.x`版本后因维护难度抛弃`GosVM`，保留`AOT`，现在的`Alum`是使用`Cranelift`重写后的版本，使用`rust.lld`做连接器，初始版本使用`NASM`与`GNU Linker`编译后端输出的汇编字符串。