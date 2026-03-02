---
title: 12-结构体
date: 2026-03-02 16:17:36
tags:
---

现在我们想象一个实际问题，假如我们要记录下1个学生的`姓名`、`性别`、`年龄`、`身高`、`体重`，我们可以怎么写？很自然的可以写出以下代码：
```alum
fun main(): int {
    let stu1_name = "Xiao Ming"
    let stu1_sex = "Male"
    let stu1_age = 15
    let stu1_height = 175.0
    let stu1_weight = 60.0
    return 0
}
```
可如果是10个，甚至100个呢？已知每个学生有`5`个信息，那么如果记录`N`个学生就要定义`5N`个变量，不仅容易搞混，而且太麻烦了，这是`简单`的数据结构就不够用了，我们便可以想到一些`复合`数据结构，用`T[]`吗？可是年龄和性别类型不一样，`Alum`也不存在`元组`这样的数据结构，并且用`[N]`也不利于可读性，于是我们便思考，在`Alum`中，是否存在一种复合结构类型，能够存储不同类型的数据，并且还带标签呢？当然有，就是结构体：`struct T`，它的语法如下：
```alum
struct S {
    fieldN: TN, 
    ...
}
```
我们可以通过`S.field`访问结构体中的`字段`，构造一个结构体，可以用这样的语法：
```alum
let s = S {
    fieldN: V, 
    ...
}
```
这与`C语言`是一致的，但需要注意的是，在`Alum`中，定义的结构体作为一种类型，不需要像`C语言`一样使用`Struct T`，可以直接使用`T`。  
那么对于上文存储的学生信息，我们便可以用结构体重写：
```alum
struct Student {
    name: string, 
    sex: string, 
    age: int, 
    height: float, 
    weight: float
}

fun main(): int {
    let stu1 = Student {
        name: "Xiao Ming", 
        sex: "Male", 
        age: 15, 
        height: 175.0, 
        weight: 60.0
    }
    return 0
}
```
这样就清晰多了，并且如果管理多个学生，可以存储到`Student[]`中，便能更轻松的管理，这不仅提高了`可读性`，也提高了`效率`。  
下面给出一个示例：
```alum
$import "io.al"
$import "convert.al"

// Struct declaration and using Example

struct Point {
    x: int, 
    y: int
}

fun main(): int {
    let p: Point = Point {
        x: 1,
        y: 1
    }
    println("Point(" + itoa(p.x) + ", " + itoa(p.y) +")")
    return 0
}
```
> 注：示例代码来自Alum/examples/21_struct.al