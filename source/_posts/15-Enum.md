---
title: 15-枚举
date: 2026-08-02 15:49:52
tags: Alum
---

枚举是`Alum`中的一种基本数据类型，它依然保持了`C语言`的兼容性，用于定义一组具有离散值的常量，它可以让数据更简洁，更易读。
枚举类型通常用于为程序中的一组相关的常量取名字，以便于程序的可读性和维护性。
当然，我们可以使用`宏定义`达到同样的目的，但是这不仅增加了`代码量`，也牺牲了`类型安全`。
例如，编写一门编程语言时，我们通常需要定义很多`Token`，使用`宏定义`，我们可以写出以下代码：
```alum
$define NUMBER 0
$define PLUS   1
$define MINUS  2
$define MUL    3
$define DIV    4
```
但如果使用枚举，我们可以写出以下代码：
```alum
enum Token {
    NUMBER, 
    PLUS, 
    MINUS, 
    MUL, 
    DIV
}
```

下面是一个枚举的示例： 
```alum
$import "io.ah"
$import "convert.ah"

// C-style enum with auto-incrementing and explicit values

enum Color {
    RED,
    GREEN = 5,
    BLUE,
    BLACK = 10,
    WHITE
}

enum Direction {
    NORTH = -1,
    EAST = 0,
    SOUTH = 1
}

fun color_name(c: Color): string {
    if c == Color.RED {
        return "red"
    } else if c == Color.GREEN {
        return "green"
    } else if c == Color.BLUE {
        return "blue"
    } else {
        return "other"
    }
}

fun main(): int {
    // Values auto-increment unless explicitly set
    print("RED = ")
    println(itoa(Color.RED))      // 0
    print("GREEN = ")
    println(itoa(Color.GREEN))    // 5
    print("BLUE = ")
    println(itoa(Color.BLUE))     // 6
    print("WHITE = ")
    println(itoa(Color.WHITE))    // 11

    // Bare (C-style) member reference
    print("NORTH = ")
    println(itoa(NORTH))          // -1

    // Enums are ints and work in expressions
    var next: int = Color.BLACK + 1
    print("BLACK + 1 = ")
    println(itoa(next))

    // Enums as function arguments and comparisons
    print("color_name(BLUE) = ")
    println(color_name(Color.BLUE))

    return 0
}
```
> 注：示例代码来自Alum/examples/28_enum.al