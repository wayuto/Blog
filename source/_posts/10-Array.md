---
title: 10-数组
date: 2026-03-01 12:32:41
tags:
---

在[03-Types](/2026/02/27/03-Types)中我们介绍过，`Alum`中的`T[N]`也就是`C语言`中的`T[]`类型，其本质是一个[`指针`](2026/03/01/11-Pointer)，指向数组第一个元素的地址。我们通过实例来说明`T[]`的用法：
```alum
$import "io.al"
$import "convert.al"

// Arrays Example
// Demonstrates array operations with new T[N] syntax

fun main(): int {
    // Array literal with explicit values
    // Type is inferred from elements
    let numbers: int[5] = [1, 2, 3, 4, 5]

    // Access array elements
    println("First element: ")
    println(itoa(numbers[0]))

    println("Third element: ")
    println(itoa(numbers[2]))

    // Modify array elements
    numbers[0] = 10
    numbers[2] = 30

    println("After modification:")
    println("First element: ")
    println(itoa(numbers[0]))

    println("Third element: ")
    println(itoa(numbers[2]))

    // Iterate through array using for loop
    // for loop now iterates over arrays directly
    println("All elements (using for loop):")
    for num in numbers {
        println(itoa(num))
    }

    // Range expression creates an array
    println("\nRange 0..5:")
    for i in 0..5 {
        println(itoa(i))
    }

    return 0
}
```
> 注：示例代码来自Alum/examples/05_arrays.al

在示例代码中，我们看到了一些关于`Alum`中数组的用法，例如，数组变量的初始化方法如下：
```alum
let V: T[N] = [Vn, ...]
```
但这样初始化变量未免太愚蠢了，费时且费力，如果是一个连续的且递增的数组，我们可以直接使用`..`运算符，如，定义一个`[0, 1, 2, ..., 99]`的数组，可以直接通过`0..100`生成。  

然而在实际应用中，我们并不总是会立即填满一个数组，而是预先申请内存，后续逐步填充，这时我们
可以用`[T; N]`语法做到，这会生成一个长度为`N`，类型为`T`的数组，因为还填充数据，所以默认被`nil`填充，可以通过`A[N] = V`修改数据，这为以后我们实现动态数组奠定了基础。  

通过这几章的学习，我们已经可以使用`Alum`写出一个`冒泡排序算法`，这时一个经典的排序算法，特点是简单但低效：
```alum
$import "io.al"
$import "convert.al"

// Array Sort Example
// Demonstrates bubble sort algorithm

fun main(): int {
    let numbers: int[8] = [64, 34, 25, 12, 22, 11, 90, 45]
    let n: int = 8
    let i: int = 0
    let j: int = 0
    let temp: int = 0

    println("Original array:")
    for i in 0..n {
        print(itoa(numbers[i]))
        print(" ")
    }
    println("")

    // Bubble sort algorithm
    i = 0
    while i < n - 1 {
        j = 0
        while j < n - i - 1 {
            if numbers[j] > numbers[j + 1] {
                temp = numbers[j]
                numbers[j] = numbers[j + 1]
                numbers[j + 1] = temp
            }
            j = j + 1
        }
        i = i + 1
    }

    println("Sorted array:")
    for i in 0..n {
        print(itoa(numbers[i]))
        print(" ")
    }
    println("")

    return 0
}
```
> 注：示例代码来自Alum/examples/13_array_sort.al