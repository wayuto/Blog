---
title: 06-流程控制
date: 2026-02-28 18:36:16
tags: Alum
---

相信熟悉计算机语言的读者都很熟悉这个概念，它是指通过控制程序执行的次序实现制定的功能，诸如：顺序，分支，循环，……在编程语言中则体现为`if-else`，`while`，`for`，……等等， 遗憾的是，`Alum`并没有实现`switch-case`或`match-case`这样的结构以改进大量的`if-else if-else`，但对于一个以学习为目的的语言来说，问题不大。下面是关于`Alum`中流程控制的介绍：  
1. ## 顺序
这是最简单的流程控制，就像一个算术时逐步计算每一步的结果，下面给出一个例子：
```alum
$import "io.al"
$import "convert.al" // 这其中包含了itoa，用于将数字转为字符串。

fun main(): int {
    let a: int = 1
    let b: int = a + 2
    let c: int = b * 3
    let d: string = itoa(c)
    println(d) // 输出结果
    return 0
}
```
这实际上计算了$(1+2)*3$的结果，最终输出了`d`，即： $9$

2. ## 分支
我们的程序肯定不能一条路走到死，特别是当程序变得复杂的时候，例如，从终端读入用户输入的年龄并判断是否成年，我们便可以使用`if-else`来判断：
```alum
$import "io.al" // 这里包含了input函数，用于从终端接收输入
$import "convert.al" 这其中也包含了atoi，用于将字符串转为数字

fun main(): int {
    let age: int = atoi(input("Enter your age"))
    if age >= 18 { // 判断年龄是否大于等于18
        println("You are an adult.")
    } else {
        println("You are a minor.")
    }
}
```
在`Alum`中，`if-else`的结构如下：
```alum
if condtion
    then_expr
else
    else_expr
```
当条件`condition`成立，即值为`true`、非`0`值或非`nil`值时，则执行then_expr，否则就执行else_expr。  
> 另外，`if-else`也能产生值，相当于`C语言`中的三元运算符`?:`。

3. ## 循环
为了介绍`循环`，我们来思考一个问题，如果要求你计算`1`到`100`的和，你应该怎么写程序？你当然可以这么写
```alum
let sum: int = 1 + 2 + 3 + ... + 100
```
但这未免太费力了，但如果你知道求和公式：$\frac{n(n+1)}{2}$的话，就可以直接这么写
```alum
let sum: int = 100 * (100 + 1) / 2
```
但这只是个简单的例子，面对复杂的案例，我们并不总是能找到一个简单合适的数学公式，这时，我们便可以通过`循环`来解决。
```alum
let i: int = 100
let sum: int = 0
while i != 0 {
    sum += i
    i -= 1
}
```
最终也能得到结果，这里我们用到了`while`循环，他的语法是
```alum
while condition
    while_expr
```
它的逻辑是，只要条件`condition`为真，就循环执行`while_expr`，但在这种单纯计算的例子上用while似乎有点麻烦，还要声明计数器`i`，每次还要让它减1,这似乎太麻烦了，于是我们便可以用`for`循环，它的语法如下：
```alum
for i in n..m
    for_expr
```
这就相当于
```alum
let i: int = n
while i != m {
    for_expr
    i += 1
}
```
所以，我们便能改写为：
```alum
let sum: int = 0
for i in 1..100 {
    sum += i
} // 另外需要注意的是，这里的i仅存在于for语句的作用域内，在for语句之外无法访问。
```
这里的`for`语句，就可以看作是$\sum_{i=n}^{m}...$只不过不再仅仅局限于求和了