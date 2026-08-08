---
title: 13-泛型
date: 2026-03-02 16:49:47
tags: Alum
---

编写代码时，我们会遇到一个问题，就是对于一些通用的代码，由于类型的不同，我们通常需要为不同类型编写不同的代码，例如最简单的，一个函数返回给定的参数，我们就需要这么写：
```alum
fun ret_int(v: int): int { return v }
fun ret_float(v: float): float { return v }
fun ret_string(v: string): string { return v }
```

在`Alum`的`<=0.9.5`版本之前，通过`gen`类型实现了简单的泛型，其原理是`编译时`自动推导出`gen`对应的类型，但也引出了一些问题，下文`Vec`容器的实现将会介绍。  
在`0.9.6`版本中，`Alum`改用更强大的`单态化`实现泛型，也就是在`编译时`为不同类型分别生成对应的代码。  

想要使用泛型，`Alum`使用以下语法：
```alum
// 泛型函数
fun ret<T>(v: T): T { return v }

// 泛型结构体
struct S<T> {
    field: T
}
```

这里，我们给出一个关于泛型简单的示例：
```alum
$import "io.ah"

// Generic Type Example
// Demonstrates generic functions with type parameters

// Generic identity function - works for any type T
fun identity<T>(x: T): T {
    return x
}

fun main(): int {
    // Test 1: identity with integer
    var x: int = 42
    var result: int = identity(x)
    println(f"identity(42) = {result}")

    // Test 2: identity with float
    var y: float = 3.14
    var f_result: float = identity(y)
    println(f"identity(3.14) = {f_result}")

    return 0
}
```
> 注：示例代码来自Alum/examples/24_gen_type.al

读到这里，我们就已经能写出很多实用的代码了，例如，通过已经学习的特性，我们可以自己实现一个`Vec`动态数组，这与`T[]`静态数组不同，它会自己扩充数组的容量，并且带边界检查，访问的索引越界时会返回`Nothing`，首先定义如下结构体：
```alum
struct Vec<T> {
    data: T[],
    len: int,
    capacity: int,
    iter: int,
    nth: Maybe<T>(*Vec<T>, int),
    push: void(*Vec<T>, T),
    pop: Maybe<T>(*Vec<T>),
    next: Maybe<T>(*Vec<T>),
    clear: void(*Vec<T>),
}

fun vec_new<T>(): Vec<T> {
    return Vec<T> {
        data: [T; 0],
        len: 0,
        capacity: 0,
        iter: 0,
		nth: \(v: *Vec<T>, i: int): Maybe<T> {
			if i >= v.len || i < 0 return Maybe<T> {
				tag: Nothing,
				value: nil
			}
			return Maybe<T> {
				tag: Just,
				value: v.data[i]
			}
		},
		push: \(v: *Vec<T>, elem: T): void {
			if v.len >= v.capacity {
				var new_capacity: int = if v.capacity == 0 {
					4
				} else {
					v.capacity * 2
				}
				var new_data: T[] = [T; new_capacity]
				for i in 0..v.len {
					new_data[i] = v.data[i]
				}
				v.data = new_data
				v.capacity = new_capacity
			}
			v.data[v.len] = elem
			v.len = v.len + 1
		},
		pop: \(v: *Vec<T>): Maybe<T> {
			if v.len == 0 return Maybe<T> {
				tag: Nothing,
				value: nil
			}
			v.len = v.len - 1
			var elem: T = v.data[v.len]
			return Maybe<T> {
				tag: Just,
				value: elem
			}
		},
		next: \(v: *Vec<T>): Maybe<T> {
			if v.iter >= v.len {
				v.iter = 0
				return Maybe<T> {
					tag: Nothing,
					value: nil
				}
			}
			var elem: T = v.data[v.iter]
			v.iter = v.iter + 1
			return Maybe<T> {
				tag: Just,
				value: elem
			}
		},
		clear: \(v: *Vec<T>): void {
			v.len = 0
			v.capacity = 0
			v.data = [T; 0]
		},
	}
}
```
在`Vec`中，我们使用`data`存储数据，类型为`T[]`，`len`为当前`Vec`的长度，`capacity`是`data`数组的容量（分配的总长度），`iter`则是与`next`配合使用的迭代游标，`nth`、`push`、`pop`、`next`、`clear`则分别是函数指针，也是实现`Vec`的核心。然后，我们定义一个`vec_new()`函数来返回一个新的`Vec`：
> 这里不做过多代码讲解，相信已经阅读前面内容的读者能很容易看懂。

想要使用`Vec`容器，如下所示：
```alum
$import "io.ah"
$import "maybe.ah"
$import "vec.ah"

// Vector Example

fun main(): int {
	var v: Vec<int> = vec_new()
	for i in 0..10 {
		v.push(&v, i * i)
	}
	
	for i in 0..10 {
		var m: Maybe<int> = v[i]
		if m.tag == Just {
			println(f"{m.value}")
		} else {
			println("out of bounds")
		}
	}
	return 0
}
```
> 注：示例代码来自Alum/examples/25_vector.al

看到这个`$import "vec.ah"`相信读者已经能猜到，我们已经自己实现了`Alum`标准库中的`Vec`容器。