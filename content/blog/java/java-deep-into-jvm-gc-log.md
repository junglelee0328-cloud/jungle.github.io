---
title: 深入理解Java虚拟机（GC日志分析）
date: 2026-06-28
category: java
source: https://zhuanlan.zhihu.com/p/391919786
---
## 简介

本文主要讲述如何查看GC日志，以及尽可能多地编写几种Demo，尽可能多地展现出所有可能的GC情况。

## 工具及环境

### [实验平台](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=1&q=%E5%AE%9E%E9%AA%8C%E5%B9%B3%E5%8F%B0&zhida_source=entity)基本参数

-   8核16G Window10系统
-   CPU型号Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz 2.30 GHz
-   [jdk1.8](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=1&q=jdk1.8&zhida_source=entity)

### 工具

-   IDEA
-   Jvisual VM
-   记事本

## 开始测试

### 主要GC类型一览

![](https://pic4.zhimg.com/v2-71b4e263f740b590bca6e3b1df5a4193_1440w.jpg)

这些参数，如果使用+号则是代表使用某种/某几种收集器，如果使用-号则是不使用某种收集器，关于这些[垃圾收集器](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=1&q=%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86%E5%99%A8&zhida_source=entity)的具体行为以及功能以及性能，将会在下一篇中继续说明。

### 范例一

首先，随手写一个Demo程序：

```java
public class TestGCApplication {

    public static void main(String[] args) {
        for(int i = 0;i< 10000;i++){
            Object o = new Object();
        }
    }
}
```

然后，配置GC相关参数：

```text
-XX:+PrintGC -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:D://logs/gc.log
```

然后查看相关GC日志：

```text
Java HotSpot(TM) 64-Bit Server VM (25.0-b70) for windows-amd64 JRE (1.8.0-b132), built on Mar  4 2014 03:46:18 by "java_re" with MS VC++ 10.0 (VS2010)
Memory: 4k page, physical 16622180k(8684220k free), swap 17670756k(8014184k free)
CommandLine flags: -XX:InitialHeapSize=265954880 -XX:MaxHeapSize=4255278080 -XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC 
2021-07-17T22:14:15.846+0800: 0.077: [GC (Allocation Failure) [PSYoungGen: 512K->498K(1024K)] 512K->546K(259584K), 0.0013436 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-17T22:14:15.950+0800: 0.181: [GC (Allocation Failure) [PSYoungGen: 1010K->498K(1536K)] 1058K->730K(260096K), 0.0042966 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-17T22:14:16.023+0800: 0.254: [GC (Allocation Failure) [PSYoungGen: 1522K->498K(1536K)] 1754K->1086K(260096K), 0.0164167 secs] [Times: user=0.00 sys=0.00, real=0.02 secs] 
2021-07-17T22:14:16.082+0800: 0.314: [GC (Allocation Failure) [PSYoungGen: 1522K->490K(2560K)] 2110K->1404K(261120K), 0.0008459 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 2560K, used 2433K [0x000000076b700000, 0x000000076ba00000, 0x00000007c0000000)
  eden space 2048K, 94% used [0x000000076b700000,0x000000076b8e5bf0,0x000000076b900000)
  from space 512K, 95% used [0x000000076b980000,0x000000076b9fa910,0x000000076ba00000)
  to   space 512K, 0% used [0x000000076b900000,0x000000076b900000,0x000000076b980000)
 ParOldGen       total 258560K, used 914K [0x00000006c2400000, 0x00000006d2080000, 0x000000076b700000)
  object space 258560K, 0% used [0x00000006c2400000,0x00000006c24e4818,0x00000006d2080000)
 Metaspace       used 3192K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 344K, capacity 388K, committed 512K, reserved 1048576K
```

可以看到在在这10000次的循环生成对象中，发生了4次GC，以行的形式记录GC日志，其中记录了时间，GC原因(Allocation Failure),执行GC的区域为YoungGen, 512K->498K(1024K)代表执行GC时前后内存的变化以及堆区的总大小，512K->546K(259584K)暂时看不懂是什么意思，但是后面的那个肯定就是GC的用时了。

同时，在CommandLine flags的参数中可以看到，目前用到的是ParallelGC。

### 范例二

我们尝试修改一下一些[虚拟机](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=1&q=%E8%99%9A%E6%8B%9F%E6%9C%BA&zhida_source=entity)参数和代码，看能否来一次Full GC。

```java
/**
	GC参数：
    -Xms10m 初始堆10m
	-Xmx20m 最大10m
	-Xmn15m 新生代15m
	-XX:+PrintGC
	-XX:+PrintGCDetails
	-XX:+PrintGCDateStamps
	-Xloggc:D://logs/gc.log
*/

public static void main(String[] args) {

        String[] s = new String[1028];
        while(true){
            Object o = new Object();
            s[o.hashCode()&(1027)] = o.toString();
        }

}
```

部分GC结果显示：

```text
2021-07-19T22:25:33.778+0800: 0.425: [Full GC (Ergonomics) [PSYoungGen: 994K->949K(8704K)] [ParOldGen: 646K->609K(2560K)] 1640K->1558K(11264K), [Metaspace: 3383K->3383K(1056768K)], 0.0102817 secs] [Times: user=0.00 sys=0.00, real=0.01 secs] 
2021-07-19T22:25:33.800+0800: 0.447: [GC (Allocation Failure) [PSYoungGen: 8629K->1000K(8704K)] 9238K->1617K(11264K), 0.0014617 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-19T22:25:33.812+0800: 0.460: [GC (Allocation Failure) [PSYoungGen: 8680K->994K(8704K)] 9297K->1619K(11264K), 0.0008413 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-19T22:25:33.821+0800: 0.468: [GC (Allocation Failure) [PSYoungGen: 8674K->1018K(13824K)] 9299K->1702K(16384K), 0.0010072 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-19T22:25:33.830+0800: 0.477: [GC (Allocation Failure) [PSYoungGen: 13818K->1018K(13824K)] 14502K->1710K(16384K), 0.0008383 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-19T22:25:33.838+0800: 0.485: [GC (Allocation Failure) [PSYoungGen: 13818K->1042K(12800K)] 14510K->1734K(15360K), 0.0006688 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-19T22:25:33.844+0800: 0.491: [GC (Allocation Failure) [PSYoungGen: 12306K->32K(13312K)] 12998K->1702K(15872K), 0.0009113 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-19T22:25:33.845+0800: 0.492: [Full GC (Ergonomics) [PSYoungGen: 32K->0K(13312K)] [ParOldGen: 1670K->1250K(4096K)] 1702K->1250K(17408K), [Metaspace: 3388K->3388K(1056768K)], 0.0101543 secs] [Times: user=0.00 sys=0.00, real=0.01 secs] 
2021-07-19T22:25:33.861+0800: 0.508: [GC (Allocation Failure) [PSYoungGen: 11264K->32K(13312K)] 12514K->1282K(17408K), 0.0007071 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-19T22:25:33.869+0800: 0.516: [GC (Allocation Failure) [PSYoungGen: 11296K->96K(13312K)] 12546K->1346K(17408K), 0.0003486 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
```

可以看到在应用启动后发生了两次GC，两次GC都是Full GC，且发生变化的区域都是ParOldGen，也就是老年代区域。在这里特地地设置一个数组对象，使得在程序运行很多次后她能够被存放在老年代中，所以刚开始的时候，很快地这个数据的数据就被填满了而且年龄也会不断地增加，进入老年代后空间，空间急剧激增，不得已进行一次Full GC，而后又因为空间不足发生了GC，又扩容了老年代的空间。而至此之后，就再也没有GC过了。

通常这种情况在项目中也很常见，当项目体积特别庞大时，在应用启动时经常有初始化系统变量的行为，如果初始化流程较长，初始化的数据特别多，且这些数据是常驻数据，那么通常需要配置较大的老年代空间，降低在初始化过程中频繁Full GC。也可以审查代码，去除一些无用的初始化或者延迟初始化来达到快速启动应用的目的。

### 范例三

现在我们来写另一个能发生Full GC的例子，我们尝试写一个Demo，能够让方法区内存暴涨或泄漏，看看会打印出什么样的GC日志。首先，[方法区](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=2&q=%E6%96%B9%E6%B3%95%E5%8C%BA&zhida_source=entity)中存放的东西有一些常量，一些[静态变量](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=1&q=%E9%9D%99%E6%80%81%E5%8F%98%E9%87%8F&zhida_source=entity)，一些类和方法信息。可以尝试加载初始化一个大静态变量，或者使用动态生成类信息(CGlib)达到让方法区变大，而同时控制方法区内存大小，让它在达到这个内存大小的时候进行扩容，顺便发生Full GC。

代码如下：

```java
/**
	用到的GC参数
    -Xms10m
    -Xmx20m
    -Xmn15m
    -XX:MetaspaceSize=2M
    -XX:MaxMetaspaceSize=20M
    -XX:+PrintGC
    -XX:+PrintGCDetails
    -XX:+PrintGCDateStamps
    -Xloggc:D://logs/gc.log
*/
public static void main(String[] args) {
    for(int i = 0; i< 10000;i++) {
        String s = UUID.randomUUID().toString();
        s.intern();
    }      
}
```

日志如下：

```text
Java HotSpot(TM) 64-Bit Server VM (25.0-b70) for windows-amd64 JRE (1.8.0-b132), built on Mar  4 2014 03:46:18 by "java_re" with MS VC++ 10.0 (VS2010)
Memory: 4k page, physical 16622180k(9222960k free), swap 17670756k(8603408k free)
CommandLine flags: -XX:InitialHeapSize=10485760 -XX:MaxHeapSize=20971520 -XX:MaxMetaspaceSize=20971520 -XX:MaxNewSize=15728640 -XX:MetaspaceSize=2097152 -XX:NewSize=15728640 -XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC 
2021-07-21T20:11:13.067+0800: 0.424: [GC (Metadata GC Threshold) [PSYoungGen: 4579K->1010K(8704K)] 4579K->1614K(9728K), 0.0015531 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
2021-07-21T20:11:13.069+0800: 0.425: [Full GC (Metadata GC Threshold) [PSYoungGen: 1010K->476K(8704K)] [ParOldGen: 604K->997K(3072K)] 1614K->1474K(11776K), [Metaspace: 2869K->2869K(1056768K)], 0.0107209 secs] [Times: user=0.08 sys=0.00, real=0.01 secs] 
2021-07-21T20:11:13.166+0800: 0.521: [GC (Allocation Failure) [PSYoungGen: 8156K->762K(8704K)] 9154K->1768K(11776K), 0.0016175 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 8704K, used 5618K [0x00000000ff100000, 0x00000000ffd00000, 0x0000000100000000)
  eden space 7680K, 63% used [0x00000000ff100000,0x00000000ff5be118,0x00000000ff880000)
  from space 1024K, 74% used [0x00000000ff980000,0x00000000ffa3e910,0x00000000ffa80000)
  to   space 1024K, 0% used [0x00000000ff880000,0x00000000ff880000,0x00000000ff980000)
 ParOldGen       total 3072K, used 1005K [0x00000000fec00000, 0x00000000fef00000, 0x00000000ff100000)
  object space 3072K, 32% used [0x00000000fec00000,0x00000000fecfb7f8,0x00000000fef00000)
 Metaspace       used 3922K, capacity 4568K, committed 4864K, reserved 1056768K
  class space    used 428K, capacity 460K, committed 512K, reserved 1048576K
```

上述的例子中，我们循环了万次，每次都产生一个UUID，然后用intern()方法将这个大字符保存在位于元空间的常量表中。我们可以看到，在程序运行中发生了一次Full GC，其中年轻代，老年代，元空间的内存区域都有发生GC。同时，标明了这次的GC是Metadata GC threshold(到达元空间门槛，需要扩容)，看起来就是因为元空间扩容引起的GC，然而[元空间](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=5&q=%E5%85%83%E7%A9%BA%E9%97%B4&zhida_source=entity)并没有发生GC，他的内存变化为\[Metaspace: 2869K->2869K(1056768K)\]。所以，这里元空间它只是扩容，并没有针对元空间有GC。如果说元空间内存太多的话，是会发生OOM的。

### 范例四

Java虚拟机中还有一块区域也是经常会发生内存泄漏的地方就是堆外内存了，通常也叫[直接内存](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=1&q=%E7%9B%B4%E6%8E%A5%E5%86%85%E5%AD%98&zhida_source=entity)。通常在使用一些NIO框架例如Netty，直接内存相关API如Unsafe的时候会发生。下面我使用Unsafe的相关API，同时调小直接内存大小，看能否因为这个发生GC，代码如下：

```java
public class TestGCApplication {

    private static final int QUARTER_OF_KB = 256;

    public static void main(String[] args) throws InterruptedException {
        Unsafe unsafe = Unsafe.getUnsafe();
        while(true){
            Thread.sleep(50);
            unsafe.allocateMemory(QUARTER_OF_KB);
        }
    }
}
```

这里我参考了引用中的第三篇，了解了在美团使用Netty的过程中发生了内存泄漏，据他们统计结果可知，每次稳定浪费256B，然后20分钟大概浪费6400K，所以根据这个数据我们可以得知，每秒钟内存泄漏差不多5.3K，也就是说每秒中发生了差不多21.2次的256B的[内存泄漏](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=4&q=%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F&zhida_source=entity)，也就是说差不多每隔50ms就会发生一次256B的内存泄漏。所以便有了以上的设计。

运行一段时间后，发现GC的次数太少，的确，其实这个内存的浪费速度太慢了。我试着加大每次浪费内存的数量和浪费内存的频率。然而并没有我期待的GC发生，内存到的确是蹭蹭蹭地涨，看来在这次实验中直接内存泄漏并不能触发Full GC(直接内存泄漏笔者不知是否会触发，可能是需要加入特殊的GC，亦或是要通过一些代码才能触发，所以这句话是说明了这个实验的结果)。

## 总结

这四个小例子只是为了初步地认识一下各种GC发生了他的日志是怎么样地以及通过日志简单分析一下发生GC的可能原因。在企业开发中也可能遇到频繁GC的情况，希望通过这篇文章能够让各位读者更加清晰大致GC发生的几种可能的情况以及一些简单的参数调整来避免GC发生，而真实情况往往十分复杂，可能需要优化代码，优化[体系结构](https://zhida.zhihu.com/search?content_id=175223443&content_type=Article&match_order=1&q=%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84&zhida_source=entity)甚至是优化某个中间件，挑出中间件的毛病来，这无疑需要很深的内功，而在写这篇文章的时候，笔者是远远没有这种能力的，在此简单发表一下学习心得，如有错误，还请指正。

## 引用

-   周志明 《深入理解Java虚拟机 第三版》

[](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/redcreen/archive/2011/05/04/2037057.html)

[](https://zhuanlan.zhihu.com/p/47146957)