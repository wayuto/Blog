---
title: 18-编译时求值
date: 2026-08-08 10:18:42
tags: Alum
---
在[17-函数注解](17-Function-Annotations.md)中我们了解了为纯函数添加`pure`注解可以在编译时求值，此章节我们详细介绍其`限制`与`原理`。  


## 限制
在`Alum 0.9.7`中，纯函数在编译期求值时暂不支持`数组操作`与`匿名函数`——字节码编译器尚未实现这两者的字节码指令，匿名函数还会被提升为普通函数而无法参与计算，未来的版本有`可能`会解决。并且`GosVM`只能计算编译时已经确定的量，如果涉及`命令行输入`，`文件读取`等操作，则无法生效。

## 原理
`Alum`编译器在将`AST`转换为`IR`时，会先经过`GosVM`编译为字节码，并计算出部分结果，编译为`机器码`后仅剩下一个`常量`，在最新版本中，编译以下代码仅需要`10ms`左右：
```alum
$import "io.ah"

fun(pure) fib(n: int): int {
    if n < 2 return n
    return fib(n - 1) + fib(n - 2)
}

fun main(): int {
    var n = fib(40)
    println(f"{n}")
    return 0
}
```
而运行仅需要`180µs`左右，对比以下`C++`代码：
```c++
#include <stdio.h>

constexpr long long fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    constexpr long long n = fib(40);
    printf("%lld\n", n);
    return 0;
}
```
> 注意：`g++`的`constexpr`求值默认有步数上限（`2^25`，约`3355万`步），朴素递归的`fib(40)`需要约`3.3亿`步，因此必须使用 `-fconstexpr-ops-limit=331999999` 提高上限，否则上述`C++`代码无法通过编译。

编译时间大约`28s`，运行时间约`1.3ms`，文件大小也略小于`C++`。  
这得益于`GosVM`对函数调用结果的`记忆化`：它对每次调用都无条件缓存返回值，对于纯函数而言效果与检测`重叠子问题`等价，每个子问题只计算一次。同时`GosVM`也支持`尾递归`优化（目前仅针对直接自递归的尾调用）。
> 有人可能认为这修改了程序的语义，但是因为`GosVM`被严格限制为仅计算的虚拟机，笔者认为对于同样的输入输出，当然是越快越好。这点就仁者见仁，智者见智了。

以下是笔者在自己电脑跑的脚本：
```bash
clear ; cat run.sh
export codes=$(find . -type f -regextype posix-extended -regex ".*\.(al|c|cpp)$")

for code in $codes
do
        echo
        echo "========= $code =========="
        cat $code
        echo
done

echo "========== alc fib.al -o fib_al =========="
time alc fib.al -o fib_al
echo 
echo "==========  g++ fib.cpp -o fib_cpp -O3 -fconstexpr-ops-limit=331999999  =========="
time  g++ fib.cpp -o fib_cpp -O3 -fconstexpr-ops-limit=331999999 
echo 

echo "========== Result =========="
ls -l fib_*
echo

echo "========== Running =========="
echo "Alum: $(./fib_al)"
echo "C++: $(./fib_cpp)"
echo

echo "========== Benchmark =========="

hyperfine "./fib_cpp" "./fib_al" --warmup 10 -i --shell none
rm fib_*

========= ./fib.cpp ==========
#include <stdio.h>

constexpr long long fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    constexpr long long n = fib(40);
    printf("%lld\n", n);
    return 0;
}


========= ./fib.al ==========
$import "io.ah"

fun(pure) fib(n: int): int {
    if n < 2 return n
    return fib(n - 1) + fib(n - 2)
}

fun main(): int {
    var n = fib(40)
    println(f"{n}")
    return 0
}

========== alc fib.al -o fib_al ==========

real    0m0.011s
user    0m0.005s
sys     0m0.006s

==========  g++ fib.cpp -o fib_cpp -O3 -fconstexpr-ops-limit=331999999  ==========

real    0m27.878s
user    0m27.265s
sys     0m0.034s

========== Result ==========
-rwxr-xr-x. 1 w w  9280 Aug  7 17:01 fib_al
-rwxr-xr-x. 1 w w 12520 Aug  7 17:01 fib_cpp

========== Running ==========
Alum: 102334155
C++: 102334155

========== Benchmark ==========
Benchmark 1: ./fib_cpp
  Time (mean ± σ):       1.3 ms ±   0.2 ms    [User: 0.6 ms, System: 0.6 ms]
  Range (min … max):     1.0 ms …   2.5 ms    2227 runs
 
Benchmark 2: ./fib_al
  Time (mean ± σ):     178.3 µs ±  45.3 µs    [User: 102.5 µs, System: 10.6 µs]
  Range (min … max):   122.7 µs … 934.8 µs    14712 runs
 
  Warning: Statistical outliers were detected. Consider re-running this benchmark on a quiet system without any interferences from other programs. It might help to use the '--warmup' or '--prepare' options.
 
Summary
  ./fib_al ran
    7.43 ± 2.31 times faster than ./fib_cpp
```
> 需要说明的是，`fib(40)`在两种语言中都是编译期完成计算的，因此上表中的`运行时间`主要反映进程启动与输出的开销，而非计算本身；`Alum`真正的优势在`编译时求值`阶段——`10ms`级的编译时间与`C++`的`28s`相比有数量级的差距。

可以看出，在`编译时计算`这一特殊场景，`Alum`超越了`C++`这一高性能语言，拥有不俗的性能。