---
title: 20-移动与深拷贝
date: 2026-08-25 09:33:15
tags:
---

熟悉`C语言`的读者一定经常被一件事折磨：`内存管理`，在`C语言`中，没有其他语言所谓的`GC机制`或者`RAII`，一切内存都需要自己管理。这就经常造成`空指针`或`悬垂指针`的问题。
例如：
```c
#include <stdio.h>
#include <stdlib.h>

void func(char *p1) {
  // ...
  free(p1);
  // ...
}

int main() {
  char *p = malloc(8);
  func(p);
  printf("%p\n", p);
  return 0;
}
```
在这段代码中，`char *s`指向了使用`malloc`申请的8个字节的堆内存，并传递给了函数`func`，之后有使用`printf`打印了`p`指向的地址，
问题在于`C语言`中默认使用`浅拷贝`语义，所以`p`与`p1`实际上指向了同一个地址，`free(p1)`之后`p`就变成了`悬垂指针`，此时再使用`p`就属于`use-after-free`。
如果再次`free(p)`就会造成`double-free`导致段错误而使程序崩溃。  

如果读者曾学习过`Rust`，那么一定会了解，`Rust`那套复杂的`所有权`和`生命周期`机制，就是为了保证内存安全。  
在Rust中，默认使用`移动`语义，函数传参后所有权就被移动了，原来的资源也就不允许被使用，当资源超出作用域，就会被自动释放。  

在`Alum 0.9.8`中，为了避免`C语言`手动管理内存的痛苦，同时也为了避免`Rust`中所有权的复杂，默认使用了`深拷贝`语义，传递参数时，会将资源重新在堆上拷贝一份，不影响原有的资源，当资源超出`作用域`，同样会被自动释放，这就一定程度上避免了`use-after-free`和`double-free`，但同时，在面对大的资源时，就带来了巨大的拷贝开销，如果想要避免就只能使用指针传递，但这样，资源就又需要手动释放。  
所以，在`Alum 0.9.9`中，也引入了类似`Rust所有权`的机制，使用移动语义，避免了一般的拷贝开销，例如：
```alum
using io::println

fun main() {
    var s = "hello"
    println(f"{s}")
    println(f"{s}")
}@void
```
这段代码直接运行就会报错： 
```
Code generation error: Use of moved value: 's' (moved at 1:1) no longer owns its data; assign it a new value or use '$' to copy before moving
```
这是因为在第一次`println`时， `s`的所有权已经被移走，再次使用就会造成`use-after-move`错误，为了避免这种情况，可以使用`$`操作符，他会重新使用`深拷贝`语义，所以只需要将代码修改为：
```
using io::println

fun main() {
    var s = "hello"
    println(f"{$s}")
    println(f"{s}")
}@void
```
就可以正常运行。