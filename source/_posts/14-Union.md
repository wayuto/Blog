---
title: 14-共用体
date: 2026-08-02 13:31:06
tags: Alum
---

`共用体`是一种特殊的数据类型，允许在相同的内存位置存储不同的数据类型。可以定义一个带有`多成员`的共用体，但是任何时候只能有`一个`成员带有值。`共用体`提供了一种使用相同的内存位置的有效方式。
要在`Alum`中定义`共用体`使用以下语法：
```alum
union Union {
    member0: T0, 
    member1: T1,
    ...
}
```

下面给出一个`Alum`中`共用体`的示例：
```alum
$import "io.ah"
$import "convert.ah"

// Union declaration and usage Example

union Value {
    i: int,
    f: float
}

fun main(): int {
    var v: Value = Value {
        i: 42
    }

    // Read the int member
    print("v.i = ")
    println(itoa(v.i))

    // Assign through the int member
    v.i = 100
    print("v.i after assign = ")
    println(itoa(v.i))

    return 0
}
```
> 注：示例代码来自Alum/examples/27_union.al