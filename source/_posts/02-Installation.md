---
title: 02-环境搭建
date: 2026-02-27 12:13:25
tags: Alum
---

> `Alum`目前不具备跨平台性，仅支持x86_64 Linux平台

## 安装Rust
`Alum`不提供预编译的二进制文件，仅支持从源码编译安装，但`Alum`语言并不复杂，所以这不会花费很长时间。  
为了安装`Alum`，需要先安装Rust，首先，执行以下命令安装`rustup`程序：
```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
为了提高下载速度，使用以下命令使用国内镜像源
```bash
$ echo 'export RUSTUP_UPDATE_ROOT=https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup' >> ~/.bashrc
$ echo 'export RUSTUP_DIST_SERVER=https://mirrors.tuna.tsinghua.edu.cn/rustup' >> ~/.bashrc
```
并切换到`Bash`以进行安装
```bash
$ bash
$ rustup default nightly # Alum依赖Rust Nightly
```

## 安装Alum
首先从`GitHub`克隆`Alum`的源码：
```bash
$ git clone https://github.com/wayuto/Alum.git --depth 1 ~/Alum
```
克隆完毕后，进入目录内运行安装脚本，这会安装`alc`编译器，`almk`构建工具，以及`Alum`的标准库：
```bash
$ cd ~/Alum
$ sh ./install.sh
```
然后，重新启动Shell, 就能使用`alc`, `almk`等程序了。  

为了更好的开发体验，使用`VSCode`时，可以从本地安装`~/Alum/alum-vscode/alum-vscode/alum-vscode-0.9.2.vsix `，注意：这并不包含`LSP`，仅提供`Alum`语法高亮。