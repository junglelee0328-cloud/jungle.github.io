---
title: 深入理解Java虚拟机(三)——Java内存对象及内存异常
date: 2026-06-28
category: java
source: https://zhuanlan.zhihu.com/p/150665569
---
## 虚拟机对象

Java虚拟机对象在内存中是有严格的格式的。为了能够较好地表征对象，Java对象的格式如下：

-   对象头
-   对象数据
-   对齐填充

Java对象内存结构可以表示如下：

![](https://picx.zhimg.com/v2-f1c376f55a1afabbe4df03aea824a549_1440w.png)

### 对象头

对象头存储了对象的基本特征，分为两个部分，第一个部分是"Mark Word"，这是一个动态定义的[数据结构](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84&zhida_source=entity)，并根据对象的状态不断复用的存储空间。这里面存储了对象[哈希码](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E5%93%88%E5%B8%8C%E7%A0%81&zhida_source=entity)，对象分代年龄，锁标志为等。另一部分就是指向该对象的类型指针，如果该对象是数组对象，那么还需要记录数组的长度。

### 实例数据

实例[数据存储](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8&zhida_source=entity)对象各个字段的字段内容，包括从父类中继承的内容，并且遵从一定的分配原则分配各个字段的内存，一般而言是从大类型的[数据字段](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E6%95%B0%E6%8D%AE%E5%AD%97%E6%AE%B5&zhida_source=entity)进行分配的。

### 对其填充

对其填充单纯是为了进行对其而设计的。[虚拟机规范](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E8%99%9A%E6%8B%9F%E6%9C%BA%E8%A7%84%E8%8C%83&zhida_source=entity)中要求对象的数据是8字节的整数倍。

## 对象创建

虚拟机在创建一个对象时，首先会定位到类的符号引用，然后检查引用的类是否被加载、解析以及初始化，如果没有，就会执行一遍类加载的过程。当通过了这些步骤后，Java会对这些对象分配内存，通常使用“指针碰撞”以及“空闲列表”等方法对对象进行分配内存。

### 指针碰撞

该方法假设Java内存区域是绝对规整的，将已分配的区域和未分配的区域使用指针间隔开。

### 空闲列表

通过维护一个列表，记录对象在内存中那些部分有分配，分配时从列表中找到一块足够大的内存对象分配给对象，并更新记录。

不过无论使用怎样的方法实现对象创建，对象创建都涉及到了[线程安全](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8&zhida_source=entity)的问题。通常，当需要创建对象时，需要修改一些指针，这在[高并发](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E9%AB%98%E5%B9%B6%E5%8F%91&zhida_source=entity)情况下是十分危险的，很有可能在创建对象时勿修改了指针，导致一系列的问题。所以，针对这种问题，可以对分配内存空间进行同步处理，即可以采用CAS和失败重试的方法来保证更新指针的原子性。同时，也可以对不同的线程进行分区创建对象，每个线程能够有自己的内存空间，避免了多个线程在高并发下创建对象的问题，该方法为TLAB(Thread Local Allocation Buffer)，可以使用-XX:+/-UseTLAB来开启。

Java对象[内存分配](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D&zhida_source=entity)流程大致如下，本图源于 [人类身份验证 - SegmentFault](https://link.zhihu.com/?target=https%3A//segmentfault.com/a/1190000004606059)：

  

![](https://pic3.zhimg.com/v2-14dd5bfa2f77d648fe2698d3bef332ea_1440w.jpg)

内存对象分配图

  

## 常见内存异常

如果发生内存异常，通常是[虚拟机](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=5&q=%E8%99%9A%E6%8B%9F%E6%9C%BA&zhida_source=entity)内存不够用导致的（如果没有[内存泄露](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2&zhida_source=entity)的问题的话），常见的[内存异常](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=3&q=%E5%86%85%E5%AD%98%E5%BC%82%E5%B8%B8&zhida_source=entity)有OutOfMemoryError和StackOverflowError。

随着软件的体系不断增大，[类对象](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E7%B1%BB%E5%AF%B9%E8%B1%A1&zhida_source=entity)数量也不断变多。如果避免了低级的死循环、过多的递归等问题，那么通常小型的项目并不会有太多的内存异常问题。

### OutOfMemoryError

出现这种异常的情况有很多种，简单说明一下可能出现的错误。

1.内存泄露，无法捕捉到垃圾对象。通常是对象无法通过GC Roots的对象定位到垃圾对象照成的。

2.系统过于庞大，产生许多对象。如果在代码层面能够进行优化，减少内存占用，那么尽可能地优化代码。如果不行，那么可以通过-Xmx，-Xms来调整[虚拟机内存](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=2&q=%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%86%85%E5%AD%98&zhida_source=entity)的最大和最小。若果是[虚拟机栈](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%A0%88&zhida_source=entity)和本地方法栈太小，可以通过-Xss来调整栈内存大小。如果能够具体到各个分区，也可以调整分区的大小，例如如果永久代[内存溢出](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA&zhida_source=entity)，可以使用-XX:PermSize和-XX:MaxPermSize来调整。当然，随着当下Spring等框架的出现，这些框架能够通过CGLib直接生成[字节码](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E5%AD%97%E8%8A%82%E7%A0%81&zhida_source=entity)，可能会导致方法区内存溢出，可以使用-XX:MaxMetaspaceSize和-XX:MetaspaceSize来调整。

3.当然还有可能是本机直接内存溢出，可以使用-XX:MaxDirectMemorySize来调整。也可以换一台内存更大的及其或者使用[分布式](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E5%88%86%E5%B8%83%E5%BC%8F&zhida_source=entity)的方案。

### StackOverflowError

这种异常通常是[栈深度](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=1&q=%E6%A0%88%E6%B7%B1%E5%BA%A6&zhida_source=entity)大于虚拟机允许的最大深度，通常是写递归时出现的。可以使用-Xss128k:deep of calling = 栈深度 来进行设置。不过最好能够手写栈来模拟[递归](https://zhida.zhihu.com/search?content_id=121613400&content_type=Article&match_order=3&q=%E9%80%92%E5%BD%92&zhida_source=entity)，在速度和内存使用上都要好于递归。

## 总结

本系列文章二、三两节介绍了Java虚拟机内存管理，布局以及内存创建以及内存异常等相关内容。本系列文章理论偏多，后续会写附录来从实践的方面继续深入。本系列文章尽量做到一周一更，如果觉得写的好的话，请点个赞。如果觉得写的不好的话，还请指出错误，谢谢。

## 参考

周志明 《深入理解JVM虚拟机》[人类身份验证 - SegmentFault](https://link.zhihu.com/?target=https%3A//segmentfault.com/a/1190000004606059)周志明 《深入理解JVM虚拟机》

[](https://link.zhihu.com/?target=https%3A//segmentfault.com/a/1190000004606059)

[](https://link.zhihu.com/?target=https%3A//segmentfault.com/a/1190000019112673)