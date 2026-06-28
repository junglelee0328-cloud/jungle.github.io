---
title: 深入理解Java虚拟机(一) 引言
date: 2026-06-28
category: java
source: https://zhuanlan.zhihu.com/p/148675596
---
## 何为虚拟机

虚拟机是一类能够通过软件模拟其他系统行为，做到虚拟化、[跨平台](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E8%B7%A8%E5%B9%B3%E5%8F%B0&zhida_source=entity)等目的的一类的软件。市面上的许多虚拟机产品如VmWare，都有比较好的虚拟化能力，能够在该软件上运行其他的[操作系统](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F&zhida_source=entity)。

通常，上述这些虚拟机有自己的[文件系统](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F&zhida_source=entity)、网络、内存，然后借助虚拟机软件的虚拟化，将[虚拟操作系统](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E8%99%9A%E6%8B%9F%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F&zhida_source=entity)的指令转化为本机(运行虚拟机的操作系统的机器)的系统指令，达到跨平台虚拟化的目的。

当然，上述类型的虚拟机是一种”全功能“的虚拟机，能够拥有自己的文件系统等操作系统的所有或者说绝大部分功能。而实际上，虚拟机最本质的工作实际上是将**虚拟系统的指令转化为本机的系统指令**，在这里，这个虚拟系统可以是一个完整的操作系统，也可以是其他的软件功能或者一些[编程语言](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80&zhida_source=entity)等。

## Java[虚拟机](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=10&q=%E8%99%9A%E6%8B%9F%E6%9C%BA&zhida_source=entity)

Java虚拟机也是一种虚拟机，这个虚拟机的任务就是在本机上开辟一块特大号的内存空间作为自己虚拟机的内存空间，然后将Java字节码指令转化成系统指令，然后在内存上完成对象的创建销毁等Java语言所定义的一些功能。

Java虚拟机它没有自己的文件系统、网络系统，内存是向操作系统申请的。这种虚拟机较之Vmware而言，它只完成Java[字节码](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=2&q=%E5%AD%97%E8%8A%82%E7%A0%81&zhida_source=entity)的转化以及执行，功能点比较专一，没有复杂的网络、文件系统，比较精简。

Java语言本身并没有跨平台性，它的跨平台性是依赖于Java虚拟机(JVM)。同时，Java语言的定义如Java语法、类[文件结构](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%84&zhida_source=entity)扽分，这些是唯一的；但是JVM产品可以（肯定）有很多中不同的实现，如HotSpot、Graal，JRocket等。也就是说，如果把Java语言本身类比为手机充电线接口，那么JVM就是多种多样的手机充电线，只要满足这个充电接口，无论该充电器充电多快，线有多长，寿命如何，都是可以使用的。

## 如何深入

Java虚拟机是一门比较深入而又专业的内容，接下来的内容将从以下几个方面去深入了解JVM虚拟机：

-   虚拟机内存结构以及[内存分配](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D&zhida_source=entity)、垃圾收集相关的内容
-   类文件结构、[类加载机制](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E7%B1%BB%E5%8A%A0%E8%BD%BD%E6%9C%BA%E5%88%B6&zhida_source=entity)以及虚拟机字节码执行相关内容
-   虚拟机调优以及一些[衍生工具](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E8%A1%8D%E7%94%9F%E5%B7%A5%E5%85%B7&zhida_source=entity)的使用

如果条件允许，我会制作一些调优案例以及更加深入地分析虚拟机[源代码](https://zhida.zhihu.com/search?content_id=121171630&content_type=Article&match_order=1&q=%E6%BA%90%E4%BB%A3%E7%A0%81&zhida_source=entity)相关的内容，尽量做到深入理解。

## 说明

本系列文章大部分知识获取来源为《深入理解Java虚拟机》一书，可以认为是对本书的一部分总结以及拓展，当然也会参考一些其他书籍。同时，由于刚开始写作，如有错误，还请指正。本系列文章还在持续更新中。

本系列文章皆为原创，部分引用会加以注明。可以认为是一个读书笔记，如有转载，请联系我。