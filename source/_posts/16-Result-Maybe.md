---
title: 16-Result与Maybe类型
date: 2026-08-02 15:58:01
tags: Alum
---

随着`Alum`的特性的补充与完善，已经具备了一定的能力以编写使用的工具，以及更完善的标准库，相信学习过`Rust`的读者一定了解`Rust`的错误处理以及空安全，它们通过两个枚举`Result<T, E>`与`Option<T>`实现，但由于`Alum`使用了`C-style`的枚举，所以无法带值，但我们可以通过`struct`+`union`+`enum`实现类似的机制, 实现了结构体`Result<T, E>`与`Maybe<T>`。
下面分别给出实现：
```alum
enum ResultStatus {
    Ok,
    Err
}

union ResultValue<T, E> {
    ok: T, 
    err: E
}

struct Result<T, E> {
    result: ResultStatus, 
    value: ResultValue<T, E>
}
```

```alum
enum MaybeTag {
    Nothing,
    Just
}

struct Maybe<T> {
    tag: MaybeTag,
    value: T
}
```
并给出`Result`相关示例：
```alum
$import "result.ah"
$import "io.ah"
$import "string.ah"
$import "convert.ah"

// Result Example

fun auth(password: string): Result<int, string> {
    if memcmp(password, "123456", 6) == 0 {
        return Result<int, string> {
            result: Ok, 
            value: ResultValue<int, string> {
                ok: 114514
            }
        }
    } else {
        return Result<int, string> {
            result: Err, 
            value: ResultValue<int, string> {
                err: "Wrong password!"
            }
        }
    }
}

fun main(): int {
    var password = input("Enter your password: ")
    var result = auth(password)
    match result.result {
        Ok: {
            println(itoa(result.value.ok))
        }
        Err: {
            println(result.value.err)
        }
    }
    return 0    
}
```
> 注：示例代码来自Alum/examples/29_result.al