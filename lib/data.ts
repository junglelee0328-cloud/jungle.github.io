export const profile = {
  name: "李俊",
  title: "Java 服务端研发工程师",
  birthday: "1998.03.28",
  location: "福建厦门",
  phone: "13205030308",
  email: "271669603@qq.com",
  avatar: "/photo.jpg",
};

export const education = {
  school: "福州大学",
  major: "软件工程",
  degree: "本科",
  period: "2016.09 — 2020.06",
  courses: [
    "C",
    "C++",
    "Java",
    "数据库系统原理",
    "算法与数据结构",
    "编译原理",
    "软件工程",
    "Java EE 应用开发",
  ],
};

export const skills = {
  core: [
    "Java 基础语法、编程思想、多线程、IO、JVM",
    "数据库系统原理，MySQL，Redis 等 NoSQL",
    "Rocket MQ 消息队列机制",
    "Spring / SpringBoot 开发及部分实现原理",
    "微服务架构与分布式系统基础",
    "算法与数据结构、数据分析基础",
  ],
  modern: [
    "Vibe Coding",
    "Claude Code / Cursor 等 AI 编程工具",
    "MCP、Skills、Harness Engineering 实战",
  ],
  tools: [
    "IDEA",
    "Git",
    "AI 开发工具",
  ],
  certificates: ["英语 CET-6", "英语 CET-4"],
};

export const experiences = [
  {
    company: "美图之家有限公司",
    role: "Java 开发工程师",
    period: "2023.09 — 2026.06",
    highlights: [
      "负责订阅系统需求对接、评审、开发等常规迭代",
      "负责订阅系统海外环境搭建与代码统一改造",
      "负责营销活动、黑灰产防控等能力建设",
      "负责代币体系完善，包括多主体通用与混合支付能力",
      "负责稳定性建设、代码优化与技术改造",
    ],
  },
  {
    company: "上海寻梦有限公司（拼多多）",
    role: "Java 开发工程师",
    period: "2021.08 — 2023.06",
    highlights: [
      "负责 ASC 流程引擎系统需求开发、维护与技术改造",
      "负责消息系统需求开发与技术改造",
      "负责落户、固定资产等若干系统的需求开发",
    ],
  },
  {
    company: "福建新大陆支付技术有限公司",
    role: "Java 开发工程师",
    period: "2019.11 — 2021.07",
    highlights: [
      "负责银商系统国际化设计与部分实现",
      "负责商户系统功能模块开发",
      "研究文件预览功能的开源实现与改造",
      "负责河南农信广告投放系统设计实现（广告/商户/分组模块）",
      "负责支付系统商户申请、商户资料等模块前后端开发",
    ],
  },
];

export const projects = [
  {
    name: "订阅系统",
    company: "美图之家有限公司",
    period: "2023.09 — 2026.06",
    description:
      "面向海外用户的会员订阅与虚拟商品售卖平台，支撑美图系多款 App 的营收增长。",
    contributions: [
      "日常需求迭代、值班与线上问题处理",
      "海外 starii 集群搭建，完成复杂代码逻辑统一与资源迁移",
      "营销能力建设：组合商品、用户分层、挽留弹窗、多段优惠",
      "黑灰产防控：异地 IP、免费试用滥用、低价使用、多三方账号支付防控",
      "代币体系完善：美叶多主体通用、美叶美豆混合支付",
      "技术优化：多语言统一、辅助商品多语言、业务定制逻辑后台配置化",
    ],
    tags: ["Java", "SpringBoot", "Redis", "MySQL", "微服务", "风控"],
  },
  {
    name: "消息系统",
    company: "上海寻梦有限公司（拼多多）",
    period: "2021.08 — 2023.06",
    description:
      "拼多多内部统一消息发送平台，支持多种消息类型与多渠道发送。",
    contributions: [
      "负责消息系统需求评审与研发，覆盖各类消息迭代与视频卡片消息优化",
      "实现消息管理统一与发送引擎，将多渠道发送封装在发送管理引擎中",
      "自动生成图片调研、发送逻辑优化、发送对象计算优化",
      "ORM 框架迁移、代码模块优化、多租户功能上线部署",
    ],
    tags: ["Java", "SpringBoot", "Rocket MQ", "MySQL", "多租户"],
  },
  {
    name: "审批中心系统",
    company: "上海寻梦有限公司（拼多多）",
    period: "2021.08 — 2023.06",
    description:
      "面向内部业务方的流程引擎与审批平台，支撑高并发审批场景。",
    contributions: [
      "流程引擎业务需求开发：业务方接入、外部服务接口、通过率/驳回率改造",
      "数据库分表技术改造支持",
      "多级缓存优化、业务配置聚合重构",
      "接口调用优化与 SQL 调优",
    ],
    tags: ["Java", "流程引擎", "分库分表", "缓存优化", "SQL 调优"],
  },
  {
    name: "重庆银行支付系统",
    company: "福建新大陆支付技术有限公司",
    period: "2020.11 — 2021.03",
    description:
      "为重庆银行打造的支付收单系统，涵盖商户入驻、资料管理与交易处理。",
    contributions: [
      "完成商户资料、商户申请模块前后端开发",
      "完成技术文档编写、测试与支付业务接口压测",
      "开发中严格遵循代码规范",
    ],
    tags: ["Java", "SpringBoot", "支付", "MySQL"],
  },
];

export const selfEvaluation =
  "性格开朗，乐于助人，有一定的组织策划能力。在专业能力上，有一定的自主学习能力，阅读过《高性能 MySQL》《深入理解 Java 虚拟机》等优秀书籍，善于总结实践所学知识，平常有写博客的习惯。同时，持续关注前沿技术，积极使用 AI 工具与 Vibe Coding 提升开发效率。";
