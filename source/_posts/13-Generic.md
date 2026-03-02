---
title: 13-泛型
date: 2026-03-02 16:49:47
tags:
---

编写代码时，我们会遇到一个问题，就是对于一些通用的代码，由于类型的不同，我们通常需要为不同类型编写不同的代码，例如最简单的，一个函数返回给定的参数，我们就需要这么写：
```alum
fun ret_int(v: int): int { return v }
fun ret_float(v: float): float { return v }
fun ret_string(v: string): string { return v }
```
这未免太过于麻烦了，这时，我们便可以引出`泛型`的概念。`泛型`的实现通常有两种方式，一种是`单例化`，就像上面的，开发者只需要写一次代码，编译器会为不同的类型自动生成不同类型版本的函数。这提高了性能，但也牺牲了二进制文件的大小，`Alum`则使用了更简单的方式：`类型擦除`，编译器在代码检查期间确定类型，并在运行时擦除类型信息，这可能拖慢了运行速度，但缩小了二进制文件的体积，在实现上也更简单，`Alum`则使用`gen`类型来实现简单的泛型。上面的代码我们便可以简化为：
```alum
fun ret(v: gen): gen { return v }
```
调用时，编译器便根据上下文自动将`gen`转换成正确的类型，无需开发者手动编写重复的代码。这里，我们给出一个关于泛型简单的示例：
```alum
$import "io.al"
$import "convert.al"

// Gen Type Example
// Demonstrates the use of 'gen' type with generic-like type inference

// Generic identity function - accepts and returns gen type
fun identity(x: gen): gen {
    return x
}

// Generic add function - works with gen numeric type
fun add(a: gen, b: gen): gen {
    return a + b
}

fun main(): int {
    // Test 1: gen type with integer
    let x: gen = 42
    let result: gen = identity(x)
    println("identity(42) = ")
    println(itoa(result))

    // Test 2: Generic addition with integers
    let sum: gen = add(10, 20)
    println("add(10, 20) = ")
    println(itoa(sum))

    return 0
}
```
> 注：示例代码来自Alum/examples/24_gen_type.al

读到这里，我们就已经能写出很多实用的代码了，例如，通过已经学习的特性，我们可以自己实现一个`Vec`动态数组，这与`T[]`静态数组不同，它会自己扩充数组的容量，并且带边界检查，访问的索引越界时会返回`nil`，首先定义如下结构体：
```alum
struct Vec {
    data: gen[],
    len: int,
    capacity: int,
    at: gen(*Vec, int),
    push: void(*Vec, gen),
    pop: gen(*Vec),
    clear: void(*Vec),
}
```
在`Vec`中，我们使用`data`存储数据，类型为`gen[]`，`len`为当前`Vec`的长度，`capacity`是`data`的实际长度，`at`、`push`、`pop`、`clear`则分别是函数指针，也是实现`Vec`的核心。然后，我们定义一个`new_vec()`函数来返回一个新的`Vec`：
```alum
fun vec_new(): Vec {
    return Vec {
        data: [gen; 0],
        len: 0,
        capacity: 0,
                at: lamb(v: *Vec, i: int): gen {
                        if i >= v.len || i < 0 return nil
                        return v.data[i]
                },
                push: lamb(v: *Vec, elem: gen): void {
                        if v.len >= v.capacity {
                                let new_capacity: int = if v.capacity == 0 {
                                        4
                                } else {
                                        v.capacity * 2
                                }
                                let new_data: gen[] = [gen; new_capacity]
                                for i in 0..v.len {
                                        new_data[i] = v.data[i]
                                }
                                v.data = new_data
                                v.capacity = new_capacity
                        }
                        v.data[v.len] = elem
                        v.len = v.len + 1
                },
                pop: lamb(v: *Vec): gen {
                        if v.len == 0 return nil
                        v.len = v.len - 1
                        let elem: gen = v.data[v.len]
                        return elem
                },
                clear: lamb(v: *Vec): void {
                        v.len = 0
                        v.capacity = 0
                        v.data = [gen; 0]
                },
        }
}
```
> 这里不做过多代码讲解，相信已经阅读前面内容读者能很容易看懂。

想要使用`Vec`容器，如下所示：
```alum
$import "io.al"
$import "convert.al"
$import "vec.al"

// Vector Example

fun main(): int {
        let v: Vec = vec_new()
        for i in 0..10 {
                v.push(&v, i * i)
        }

        for i in 0..10 {
                println(itoa(v.at(&v, i)))
        }
        return 0
}
```
> 注：示例代码来自Alum/examples/25_vector.al

看到这个`$import "vec.al"`相信读者已经能猜到，我们已经自己实现了`Alum`标准库中的`Vec`容器。