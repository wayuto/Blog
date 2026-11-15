---
title: 21-工具链
date: 2026-11-15 14:31:46
tags: Alum
---

## 序言
经过数个章节的介绍后，相信读者对于`Alum语言`的语言特性已经有了大致了解，本章节中将会详细介绍`Alum工具链`。  
在[02-Installation](/2026/02/27/02-Installation/)中已经介绍过，克隆下`Alum`的源码后只需要执行`./install.sh`就能自动安装`Alum工具链`。包括：
- `alum-compiler`：包括`Alum语言`的编译器： `alum`
- `alum-make`：`Alum语言`的项目管理工具：`almk`
- `alum-lsp`：用于服务`alum-vscode`在`VSCode`中提供语法高亮以及补全功能
- `alum-std`：包括`libalum.a`，`libalum_runtime.a`，`libalum.so`
- `alum-vscode`：用于`Alum语言`的`VSCode`拓展

## alum-compiler
在`Alum 0.9.9`之后，为了`可读性`，对原有的风格做出了较大修改，不再全部使用`参数`控制行为，而是类似`alum-make`加入了子命令，包含：
- build
- run
- lib
- ast
- pp
- help

使用`alum subcommand --help`即可得到详细参数介绍，例如：
```bash
$ alum build --help
Compile and link an executable (use -c for objects, --vm for bytecode)

Usage: alum build [OPTIONS] [INPUT]...

Arguments:
  [INPUT]...  Input files (.al source files or .o/.a object files)

Options:
  -o, --output <FILE>   Output file name
  -c                    Compile to object files only, do not link
      --vm              Compile to GVM bytecode (.albc); single input only
  -I <DIR>              Add include directory
      --cte-lib <PATH>  Shared library dlopened for compile-time evaluation and VM runtime natives
      --cte-steps <N>   Step budget for the compile-time evaluator (default 100000000)
      --cte-force       Treat a failed compile-time evaluation as a hard error instead of falling back to runtime code
  -v, --verbose         Verbose output
      --nostdlib        Do not link with standard library
      --emit-ir         Dump optimized IR to stderr, then continue compiling
      --emit-asm        Dump generated assembly to stderr, then continue compiling
  -h, --help            Print help
```

## alum-make
`almk`是从`Alum`较早版本就已加入的项目管理工具，其初衷仅仅是因为标准库尚且不够完整，需要使用`C语言`补充，但手动编译并链接每个`Alum`与`C`源码过于繁琐，`Makefile`也不够清晰，笔者便参考`Cargo`开发了`alum-make`，可以方便的管理`Alum`与`C`的混合编程项目。其大致命令可以通过`almk --help`获取：
```bash
$ almk --help
Usage: almk <COMMAND>

Commands:
  new    Create a new project
  run    Run the project
  build  Build the project
  clean  Clean the project
  add    Add a dependency
  rm     Remove a dependency
  sync   Pull the dependencies
  help   Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help
```
具体配置项可参考仓库内的[alum-make/README.md](https://github.com/wayuto/Alum/blob/main/alum-make/README.md)

## alum-std
`alum-std`是`Alum`语言的标准库，包括`libalum.a`，`libalum_runtime.a`，`libalum.so`

### libalum.a
`libalum.a`包含了`文件I/O`，`内存管理`，`多进程`等`C-style`的接口，由于依赖`Linux Syscall`，也是`Alum`迟迟没有跨平台的原因之一，故而笔者也致力于使用`GVM + libc`的模式让`Alum`运行在其他平台。

### libalum_runtime.a
`libalum_runtime.a`包含了运行`Alum`所必需的骨架代码，包括对齐栈，传递`argc`与`argv`参数，调用`main`函数，以指定的退出码结束进程等操作。

### libalum.so
`libalum.so`并不直接用于一般情况的`Alum`，它只在服务于作为`Runtime`运行时的`GVM`。

## alum-lsp && alum-vscode
`alum-lsp`与`alum-vscode`旨在为对`Alum`感兴趣的读者使用`VSCode`编写`Alum`代码是提供更舒适的体验，`./install.sh`会自动安装`alum-vscode-lsp.vsix`与`alum-lsp`，之后无需关注，故而本文不作更多介绍。