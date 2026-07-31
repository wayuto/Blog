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
`Alum`的前身是由`TypeScript`编写的`Gos`语言，是一种解释型语言，起初是笔者为了学习`TypeScript`编写的`Toy Language`，后在`0.2.7`版本使用`Rust`重构，并后续添加`AOT`，`0.5.x`版本后因维护难度抛弃`GosVM`，保留`AOT`。

## Alum语言的后端
`<=0.2.7`，`Gos`采用了字节码的后端，性能相较于`Tree-Walker`有提升，但仍显著慢于`AOT`语言，并且不易编写`标准库`。
`>=0.2.7`，`Gos`转向`AOT`后端，引入了`GosIR`，并将其编译为`x86_64 Linux`平台的汇编字符串，使用`nasm`汇编后使用`GNU Linker`链接`对象文件`与`标准库`。
`>=0.5.x`，`Gos`将后端切换到`Cranelift`，并改名为`Alum`
`>=0.9.4`, 由于`Cranelift API`的复杂性，笔者逐渐无力维护，只能交由`Agent`编写代码，同时也难以review，于是切换回自研后端，并且不再生成`汇编字符串`，而是在`IR`之后生成更底层的，可以直接映射为汇编的`ASM IR`，并抛弃`nasm`，使用`自制汇编器`将`ASM IR`翻译为`机器码`

## Alum语言的编译流程
```
Source Code (.al)
        │
        ▼
┌───────────────┐
│ Preprocessor  │  →  Handles $import, $define, $ifdef, $ifndef, $endif
└───────────────┘
        │
        ▼
┌───────────────┐
│    Lexer      │  →  Tokenizes source code into tokens
└───────────────┘
        │
        ▼
┌───────────────┐
│    Parser     │  →  Builds Abstract Syntax Tree (AST)
└───────────────┘
        │
        ▼
┌───────────────┐
│  Type Checker │  →  Validates type safety and semantic rules
└───────────────┘
        │
        ▼
┌───────────────┐
│  Optimizer    │  →  Constant folding, dead code elimination, IR optimizations
└───────────────┘
        │
        ▼
┌───────────────┐
│   IR Gen      │  →  Lowers AST to intermediate representation (IR)
└───────────────┘
        │
        ▼
┌──────────────────┐
│ Code Generator   │  →  Emits x86-64 instructions (Asm IR)
└──────────────────┘
        │
        ▼
┌──────────────────┐
│   Assembler      │  →  Encodes Asm IR → x86-64 machine code → ELF .o
└──────────────────┘
        │
        ▼
  Object File (.o)
        │
        ▼
┌──────────────────┐
│    Linker        │  →  LLD links object file with standard library
└──────────────────┘
        │
        ▼
  Executable File
```
