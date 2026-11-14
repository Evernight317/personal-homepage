import { Fragment, useEffect, useState } from "react";

type Project = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accent: string;
  art: string;
  href?: string;
  detail?: {
    intro: string;
    label: string;
    steps: { name: string; desc: string }[];
    stack?: string;
  };
};

type EssaySection = {
  heading: string;
  paragraphs: string[];
};

type Essay = {
  title: string;
  date: string;
  topic: string;
  sections: EssaySection[];
};

const projects: Project[] = [
  {
    number: "01",
    title: "NEUQ-ACM 官网",
    subtitle: "社团官方网站",
    description: "东北大学秦皇岛分校 ACM 社团官方网站",
    tags: ["Web", "Community", "NEUQ"],
    accent: "bg-[#1546ff]",
    art: "acm",
    href: "https://neuqacm.neuqer.com",
  },
  {
    number: "02",
    title: "ContractNet",
    subtitle: "多智能体协作框架",
    description: "基于 Contract Net 协议，让多个 Agent 像招标—投标一样分工合作",
    tags: ["Multi-Agent", "Contract Net", "Python"],
    accent: "bg-[#d8ff57]",
    art: "network",
    href: "https://github.com/Evernight317/ContractNet",
    detail: {
      intro:
        "基于 FIPA Contract Net Protocol 的多智能体协作调度框架。用户提交高层目标后，系统自动完成任务分解、Agent 竞标仲裁、ReAct 执行、三层质量校验和冲突消解——无需手动编排 Agent 交互",
      label: "核心流程",
      steps: [
        { name: "HTN 任务分解", desc: "Planner 通过 LLM 将高层目标递归分解为子任务 DAG，自动解析依赖关系" },
        { name: "契约竞标仲裁", desc: "Agent 通过 CapabilityProfile 声明能力竞标子任务，Auctioneer 按能力/成本/置信度综合评分仲裁" },
        { name: "ReAct 执行引擎", desc: "Agent 通过 Think→Act→Observe 多轮推理 + 工具调用（文件读写、代码执行、测试运行）完成任务" },
        { name: "三层质量门控", desc: "Layer 1: JSON Schema 校验 → Layer 2: LLM-as-Judge 语义校验 → Layer 3: 冲突影响检测" },
        { name: "冲突检测消解", desc: "5 种检测（文件写冲突/接口不一致/语义矛盾/依赖违规/死锁）+ 5 种消解策略，失败时自动重规划" },
      ],
    },
  },
  {
    number: "03",
    title: "量化交易 Agent",
    subtitle: "自主行情分析与策略决策",
    description: "自主完成行情分析、策略决策与模拟交易的智能助手",
    tags: ["LangGraph", "FastAPI", "Redis"],
    accent: "bg-[#ff6f4a]",
    art: "trading",
    detail: {
      intro:
        "一个能自主完成「看盘—决策—执行」全流程的量化交易智能体。它不是策略指标的可视化面板，而是一个会读市场、会写策略、会复盘自己的交易员",
      label: "系统架构",
      steps: [
        { name: "行情感知", desc: "接入实时行情与历史 K 线，构建多维度市场上下文，识别趋势与关键支撑阻力位" },
        { name: "策略生成", desc: "LLM 基于技术面与基本面分析，生成交易假设与入场出场条件，输出结构化策略" },
        { name: "风险控制", desc: "仓位管理、止损纪律、情绪过滤——机器没有贪心，严格按风控规则执行每笔交易" },
        { name: "回测引擎", desc: "每条策略先在历史数据上走一遍，计算胜率、最大回撤、夏普比率，用数据说话" },
        { name: "复盘学习", desc: "交易结束后自动生成复盘报告，分析盈亏归因，将经验反哺下一次决策" },
      ],
      stack: "Python · LangGraph · FastAPI · MySQL · Redis",
    },
  },
  {
    number: "04",
    title: "数据分析 Agent",
    subtitle: "从数据到洞见",
    description: "专注于数据模拟、分析与预测的 Agent——给它数据，还你洞见",
    tags: ["LangChain", "pandas", "scikit-learn"],
    accent: "bg-[#b9a7ff]",
    art: "data",
    detail: {
      intro:
        "给它一份数据和一个问题，它还你一份数据模拟、分析结论与趋势预测。把数据分析师的日常工作流——清洗、探索、建模、预测——交给一个 Agent 来编排",
      label: "Agent 工作流",
      steps: [
        { name: "数据理解", desc: "自动识别字段含义与数据质量，生成探索报告，发现缺失率、分布特征与异常模式" },
        { name: "清洗规整", desc: "缺失值填补、异常值检测、格式混乱——Agent 自己判断处理策略并执行" },
        { name: "模拟分析", desc: "统计检验、相关性分析、Monte Carlo 模拟，多角度交叉验证数据中的信号" },
        { name: "建模预测", desc: "时序预测与回归建模，置信区间一并给出，不回避不确定性" },
        { name: "结论输出", desc: "生成带图表的分析报告，用人话写结论，不写黑话，每个判断都有数据支撑" },
      ],
      stack: "Python · LangChain · FastAPI · pandas · scikit-learn",
    },
  },
];

const essays: Essay[] = [
  {
    title: "AI 时代，我们如何武装自己",
    date: "2026.11",
    topic: "AI / 思考",
    sections: [
      {
        heading: "一",
        paragraphs: [
          "每一代人都相信自己面对的变革是前所未有的，而每一代人中总有人靠贩卖这种「前所未有」谋生。所以先做一次祛魅：AI 带来的变化很重大，但焦虑的结构是古老的。纺织机时代的卢德分子、照相机发明后宣称绘画已死的批评家、计算机出现时担心算盘先生失业的评论员——每一次，问题都被表述为「机器抢走了人的能力」。",
          "这个表述有一个隐蔽的错误：**它假设能力是人的属性。** 但能力从来不是属性，是关系。一个人「会英语」，指的是他和一个英语使用共同体之间存在可交换的关系；一个人「会写代码」，指的是他和机器之间存在一条可信赖的命令通道。机器从来不抢「你的」能力——它抢走的是那条通道的稀缺性。通道还在，只是不再只有你能走。",
          "想清楚这一点，焦虑会换一个形状：问题不是「我还剩什么能力」，而是「当所有通道都开放时，走通道的人凭什么被选择」。",
        ],
      },
      {
        heading: "二",
        paragraphs: [
          "流行的答案是「学更难的东西」。这个答案经不起推敲，因为它默认了一条不存在的防线：能力有高墙，墙内安全。但 AI 的进攻方式恰恰不是仰攻高墙——它是把墙外的一切填平。你以为护城河在「难」的那一侧，结果它直接把「易」的整片大陆抬升到与你同一条水平线上。今天你逃到「更难的技能」上，明天那片技能也会被填平。这场逃亡没有终点，因为**它的规则是：凡是可形式化的，终将可自动化。**",
          "这句话值得展开。什么是可形式化的？一切有明确对错、可大量重复、可用数据描述反馈的东西。注意这个定义的可怕之处：它不按「难度」划分，而按「结构」划分。拉赫玛尼诺夫第三钢琴协奏曲极难，但它完全可形式化——音符、指法、速度都有明确标准——所以在演奏层面，它比「即兴给一场婚礼暖场」更容易被替代。难度不构成防线，**结构才构成。** 一个看似简单的能力，只要它的评价标准最终落在「某个具体的人是否被具体地打动了」，它就在防线之内；一个看似艰深的能力，只要它有标准答案，它就在防线之外。",
        ],
      },
      {
        heading: "三",
        paragraphs: [
          "那么什么在防线之内？把候选列出来，逐一检验。",
          "**创造力？** 半个。AI 的生成能力已经覆盖了绝大多数被叫做「创造」的活动——但那大多是排列组合意义上的创造。真正的创造有一个机器目前无法复刻的特征：它要为一个还不存在的价值提前付账。印象派画家画得「不像」，在当时是被嘲笑的——他们为一个尚未被承认的审美价值垫付了声誉成本。AI 可以生成一万个变体，但它不知道哪个变体值得为之付出「不被理解的代价」，因为「值得」的判断需要承担后果的主体。**创造的核心不是生成，是署名与担保。**",
          "**共情？** 也只有半个。AI 可以说出完美的安慰话术，但这恰恰拆穿了话术与共情的区别：共情的价值不在于说了什么，在于「有人愿意为我花费不可再生的注意力」这一事实本身。你对一个濒死的人说什么并不重要，重要的是你来了——你的到场是稀缺资源，你的措辞不是。",
          "**判断力。** 这个是完整的。判断力的定义是：在不完备信息下，为不可逆的选择负责的能力。三个成分缺一不可——信息不完备（所以不能靠算力解决）、不可逆（所以不能靠试错解决）、负责（所以不能外包）。医生下手术决定、工程师做架构取舍、编辑判断一部稿子——这些活动的最后一步，永远是一个人从所有分析中抬起头来说：「就这么办，出了问题算我的。」这句话机器说不出来，不是音色问题，是**机器没有可以「算我的」的东西。**",
        ],
      },
      {
        heading: "四",
        paragraphs: [
          "所以武装方案可以落下来了，就三条，朴素得近乎扫兴。",
          "**第一，把自己放在判断的位置上，而不是执行的位置上。** 职业选择时问一个问题：这份工作的最后一步，是「得出结论」还是「得出答案」？答案可以查，结论要担。往结论的方向走。",
          "**第二，积累不可形式化的部分。** 每个行业都有它的「形式化残余」——机器拿走之后剩下的东西。会计的残余不是记账，是对老板那句含糊需求的解码；编程的残余不是写代码，是决定「什么根本不该被写出来」。刻意把职业里即将被自动化的部分让出去，死死抱住残余——这是反直觉的，因为残余往往恰是当年你觉得「不专业」的软技能部分。",
          "**第三，也是最重要的：成为某个目标的最终担责者。** 这不取决于职位，取决于姿态。同样一个项目，有人把它当任务，有人把它当署名物。区别会在系统凌晨三点崩溃的时刻显形：前者想的是「这不是我的错」，后者已经在看日志了。AI 越强大，这种人的溢价越高——因为工具的洪流，需要有人站在下游对结果说「是」。",
        ],
      },
      {
        heading: "五",
        paragraphs: [
          "最后回到那个古老的结构。卢德分子错在哪？不是错在反抗，是错在把自己认同为「操作纺织机的人」。纺织机会过时，但「人需要衣服」这个需求不会；Copilot 会进化，但「世界需要有人对软件负责」这个需求不会。**不要把自己认同为工具的使用者，要把自己认同为结果的担保人。** 前者随工具迭代而贬值，后者随工具的强大而升值——工具越强，滥用工具造成的后果越重，敢担保的人越稀缺。",
          "工具是自来水。这句话仍然成立，但补上后半句：",
          "水流过之后，要么什么也不留，要么留下河床。河床不是水的对立面——河床是千万次水流冲刷之后，那个决定水往哪里去的形状。",
          "去做河床。",
        ],
      },
    ],
  },
  {
    title: "从荷马到奥德赛：西方叙事的源头",
    date: "2026.10",
    topic: "文学 / 叙事",
    sections: [
      {
        heading: "一",
        paragraphs: [
          "每个文明的文学都有一个需要反复回头的源头，而西方文学的源头有一个奇特之处：它一出场就是双峰并峙，且两座峰彼此相反。《伊利亚特》与《奥德赛》共享同一位作者的名号、同一套神谱，精神方向却完全相反——前者讲人如何走向死亡中的荣耀，后者讲人如何穿越屈辱回到家。西方文学后来的几乎所有大争论——行动与沉思、崇高与日常、英雄与凡人、向外征服与向内追问——都能在这两部史诗里找到各自的根据地。这不是巧合。更合理的解释是：荷马（无论他是谁）在文学的第一天，就把「人」这个命题的两半各自写完了。此后三千年的工作不是超越，而是重新分配比重。",
          "关于荷马本人，我们几乎一无所知：他是否真实存在，是一位诗人还是游吟传统共用的名字，学界争了几百年没有定论。两部各一万多行的史诗，在文字定型之前靠吟诵口传数百年，本身就是人类记忆的一桩奇迹。但比「作者是谁」更重要的是：**它们在那里。** 公元前八世纪前后，西方文学的第一个清晨，两座丰碑同时立起。",
        ],
      },
      {
        heading: "二",
        paragraphs: [
          "《伊利亚特》的伟大，首先在于选题的剪裁。请注意荷马**不写什么**：不写战争的起因（帕里斯与海伦被压缩成一句回忆），不写战争的结局（木马屠城根本不在诗里），不写十年的漫长（只截取最后五十天）。一个以战争叙事立身的诗人，把战争本身几乎全部删掉了——这在任何时代都是惊世骇俗的手笔。他留下的是：愤怒，以及愤怒的代价。",
          "阿喀琉斯的愤怒，表层是一笔财物纠纷——统帅夺走了他的战礼。但荷马立刻借主人公之口把问题翻到深层：阿喀琉斯面临一个选择——留下来战死，换取不朽的荣耀；或者回家养老，长寿而无名。**他选择了荣耀，然后在选择兑现之前，亲眼看到了这个选择的全部价格：挚友帕特罗克洛斯的尸体。** 整部《伊利亚特》，就是这个价格清算的过程。当他终于重返战场，杀戮已经不再是勇敢，而是一种自我执行的死刑——他知道自己时日无多，杀戮是他向死亡讨还利息的方式。",
          "而全诗的顶点，是普里阿摩斯的夜访。特洛伊老王深夜潜入敌营，跪在杀子仇人面前，亲吻「那双杀了我这么多儿子的手」——一个父亲，用人身上最不为战争服务的部分（嘴唇），去接触对方身上最服务于战争的部分（手）。随后荷马写下整个古代文学最惊人的一次翻转：两个人都在对方身上认出了自己的灾难——老人看见自己将死时的凄凉，年轻人看见白发的父亲将收不到自己的尸骨。**敌对双方的和解不是出于道德，而是出于镜像。** 悲悯不是「我应该善良」，而是「我在你身上认出了我」。三千年后，托尔斯泰与陀思妥耶夫斯基处理的依然是这个机制。全诗的最后一行属于敌人：「这样，他们安葬了赫克托耳，驯马的赫克托耳。」歌唱愤怒的史诗，以一场葬礼收束。",
        ],
      },
      {
        heading: "三",
        paragraphs: [
          "如果说《伊利亚特》回答「人如何面对死亡」，那《奥德赛》回答的就是一个更现代的问题：**人如何在漫长的磨损中，保持自己是谁。**",
          "奥德修斯的十年归途，本质是一连串的「去身份化」试验。独眼巨人的洞窟里，他自称「无人」——为了活命，他先把自己抹去。塞壬的海域，他把自己绑上桅杆——为了听清诱惑而活着，他自愿成为囚徒。而在女神卡吕普索的岛上，考验换了一副面孔：不是威胁，是驯化。永生、青春、一位爱他的神——条件只有一个：忘记伊萨卡。**天堂的诱惑比怪物更凶险，因为怪物要你的命，天堂要你的名字。** 他拒绝了。理由荷马写得极低、极诚实：不是因为忠于某种抽象理想，而是因为佩涅罗珀会老，而他不想在一个不会老的神身边，看一个凡人妻子变老。他要的是时间之内的东西，不是时间之外的东西。这是西方文学里第一次，有人为了必朽的生活拒绝不朽——后来所有文艺复兴式的人间颂歌，都从这个拒绝里出发。",
          "归途的终点也并非凯旋，而是一次测验：佩涅罗珀不肯相认，直到归来说出只有夫妻二人知道的婚床秘密。十年的漂泊与二十年的等待，在这一刻对上了账。",
        ],
      },
      {
        heading: "四",
        paragraphs: [
          "此后三千年，西方文学一直在重写这两座源头。维吉尔让埃涅阿斯背着父亲渡海去建立罗马——还乡被改写成建国；但丁让维吉尔的亡魂引他游历三界——史诗被改写成灵魂的旅程；乔伊斯让奥德修斯变成都柏林的一个广告推销员，用一天十八个小时走完十年航程——神话被改写成日常，而日常经此一照，显出神话的重量。奥德修斯回家这条路，文学走了三千年，还没有走完。",
          "我们今天读史诗，不是为了掉书袋，而是为了看清一件事：人类讲故事，从第一天起，讲的就不是事件，而是命运里的人。战争会过时，神谱会失效，但普里阿摩斯吻上那双手的深夜，今天读来依然让人喉头发紧。这就是「经典」的本义——它不是过去的遗产，而是每次翻开都重新发生的事。",
        ],
      },
    ],
  },
  {
    title: "陀思妥耶夫斯基：在深渊边上写作的人",
    date: "2026.09",
    topic: "文学 / 人物",
    sections: [
      {
        heading: "一",
        paragraphs: [
          "俄国文学的黄金时代群星璀璨——普希金、果戈里、屠格涅夫、托尔斯泰，每一个都足以撑起一个民族的文学史。但如果只能选一个人来代表「文学能够抵达的深度」，很多人会选陀思妥耶夫斯基。托尔斯泰写出了俄国生活的广度，而陀思妥耶夫斯基往下挖，一直挖到人不肯承认的那一层。",
          "他的生平本身就是一部小说。二十七岁那年，他因参加一个地下读书小组被判处死刑。一八四九年十二月，谢苗诺夫校场，零下的严寒，囚衣，分组，前三名已被绑上刑柱，他排在第二组。他后来在给哥哥的信里写：那几分钟里，他把自己的生活分成了几段——前一段挥霍掉的，他不再在乎；后一段，他打算每一个小时都算数。赦令在此刻到达：沙皇早已签发，整场处决是排演好的戏，只有死囚们不知道。死刑改为苦役。他带着这个「被退还的人生」走进西伯利亚，戴了四年脚镣。",
          "此后的岁月没有任何舒缓：癫痫、丧偶、赌瘾、债台高筑、没完没了的催稿。《罪与罚》写于妻子与哥哥相继去世、他独自负担两个家庭开销的年月；而《赌徒》——一部恰好以赌徒心理为题材的小说——是他在二十六天里口述赶完的，因为与出版商签下了魔鬼般的合同：逾期交稿，未来九年所有作品的版权归对方。为他做速记的安娜，后来成为他的妻子，也成为他一生里少有的、把他从深渊边上往回拉的人。",
        ],
      },
      {
        heading: "二",
        paragraphs: [
          "但生平的惨烈只是注脚。真正让他在文学史上不可替代的，是他处理「人」的方式。",
          "别的作家写「人做了什么」，他写**人为什么明明知道不对，还是去做**。《罪与罚》开场，拉斯柯尔尼科夫的杀人逻辑严密得可怕：世上的人分为两类——「虱子」与「拿破仑」，绝大多数人只是繁衍的材料，极少数人有资格踏过血去实现更高的目标。那么他属于哪一类？杀一个放高利贷的老太婆，用她的钱做一百件善事——这道算术在功利的天平上毫无悬念。他杀了人，拿了钱，把钱原封不动埋起来，一次也没花过。**逻辑没有塌——是人在逻辑里活不下去了。** 高烧、梦魇、自首的冲动、与索尼娅之间那场不可能的爱，全是理性管辖之外的部分在反扑。他用一整部小说证明：一套在纸面上无懈可击的理论，落进一个具体的人的身体里，会把这个人生生碾碎。这是对一切「抽象地爱人类、具体地牺牲个人」的主义，最早也最准的审判。",
        ],
      },
      {
        heading: "三",
        paragraphs: [
          "这也是他作为预言家的一面。《卡拉马佐夫兄弟》里，无神论者伊万说出那个著名的推论：如果没有上帝与灵魂不死，那么一切都被允许。这句话常被当作怀疑主义的宣言，其实恰恰相反——陀思妥耶夫斯基让伊万把怀疑推到尽头，是为了看清尽头处站着什么。半个世纪后，他的同胞用一场革命实践了这个句子；再半个世纪后，欧洲用两场战争实践了它。写尽怀疑，是为了抵达信仰；写尽深渊，是因为知道人能堕落到哪里，所以更知道光可能在哪里。伊万那章「宗教大法官」的后面，紧跟着的正是俄国文学最明亮的信仰篇章——《俄罗斯修士》。他不回避任何一个反方的论点，恰恰因为他不怕反方的论点。",
        ],
      },
      {
        heading: "四",
        paragraphs: [
          "他笔下没有一个小人物被敷衍对待：赌徒、乞丐、酗酒的九等文官、被侮辱的孩子——每个人在崩溃时刻的独白，都配得上一篇哲学论文的密度。别的作家俯视他们，他蹲下去平视；还不够，就往自己的伤口里找共鸣。",
          "所以，说他写小说不对，说他是心理学家也不对。他是在深渊边上弯下腰，把底下的人一个一个往上拽——用的是当年把自己拽上来的那股力气。刑场上被退还的那几分钟里，他承诺把之后的每一个小时都算数。此后三十年的写作，就是这份承诺的利息。",
          "我们是收息的人。",
        ],
      },
    ],
  },
  {
    title: "建筑是凝固的音乐：谈谈建筑美学",
    date: "2026.08",
    topic: "建筑 / 美学",
    sections: [
      {
        heading: "一",
        paragraphs: [
          "歌德说「建筑是凝固的音乐」。这句话被引用得太多次，多到几乎失去了重量——人们把它写进导览词与教材，却很少停下来问：它到底对在哪里？",
          "音乐是时间的艺术，建筑是空间的艺术：一段旋律必须流过你，一座建筑站在原地等你。二者看似相反，歌德抓住的却是一个更深的共通点——**节奏。** 柱廊的间距是节拍：多立克式密集、粗壮，像进行曲；爱奥尼亚式舒展、纤秀，像行板。拱券的起伏是旋律，穹顶的聚合是终止式。走进哥特教堂，束柱领着视线一路向上收束，肋拱在顶端交汇——那与一首赋格曲向高处的攀升，是同一种运动，只是载体从声音换成了石头。而最关键的是：人不是「看」建筑的，人是「穿过」建筑的。空间一段一段在身后展开，像乐句一段一段进行；苏州园林尤其如此，移步换景，每一个转折都是一次换气。用身体读完一栋建筑，你才听见了它的音乐。",
        ],
      },
      {
        heading: "二",
        paragraphs: [
          "但建筑美学真正动人的地方还不是比例，而是另一件事：**几乎所有的杰作，都是限制的产物。**",
          "帕特农神庙没有一块自由形状的石料，全部困在梁柱体系的严苛逻辑里。于是建筑师把「视觉校正」做到了极致：基座不是平的，是微微上凸的弧线；柱子不是直的，是中段略粗的卷杀；四角的柱子略粗、略向内倾。每一处修正都小到肉眼无法辨认，合起来却让整座神庙呈现出一种「比直线更直」的生命感——大理石在呼吸。限制没有束缚他们，限制成了他们的语言。",
          "哥特教堂的一切繁花，起点是一个工程绝境：如何让厚重的石造屋顶，开出一整面彩色玻璃窗？答案是把承重交给墙外的飞扶壁——墙体被解放的那一刻，石头让位给了光。苏州园林更极端：在方寸宅地之间造出山、水、亭、廊的四季。没有大空间，就经营纵深；不能高，就做深。借景、框景、曲径，每一个手法都是对着「地太小」这个前提说话的。**美常常不是自由的结果，而是限制被优雅地克服的那个瞬间。** 无限的预算与不受限的地块，反而极少造出值得被记住的东西。",
        ],
      },
      {
        heading: "三",
        paragraphs: [
          "这也是看建筑和写系统时，体验到同一种快乐的原因。好的建筑与好的系统是一回事：每一个决定都有理由，每一处克制都是表达。帕特农的卷杀与一段精心设计的重试逻辑，本质上是同一种东西——都是对不完美条件的优雅回应，都在说：我知道这里的限制是什么，我尊重它，并且越过了它。你站在神庙下面，或者读一段好代码，能感到同一件事：有人在某个地方，认真地想过你此刻的感受。",
          "凝固的音乐，流动的逻辑。造物的人，说的是同一门语言。",
        ],
      },
    ],
  },
];

const contacts = [
  { label: "EMAIL 01", value: "guohongyi840@gmail.com", copy: true },
  { label: "EMAIL 02", value: "2750182212@qq.com", copy: true },
  { label: "PHONE", value: "131-3011-1666", copy: true },
  { label: "WECHAT", value: "ThisIsYoukai", copy: true },
  { label: "QQ", value: "2750182212", copy: true },
  { label: "GITHUB", value: "github.com/Evernight317", href: "https://github.com/Evernight317" },
];

const backendStack = [
  "Java",
  "Spring Boot",
  "Spring Cloud",
  "MyBatis",
  "MySQL",
  "Redis",
  "RabbitMQ / Kafka",
  "Docker",
  "Linux",
];

const agentStack = [
  "Python",
  "LangChain / LangGraph",
  "RAG",
  "Embedding",
  "Milvus / FAISS",
  "Function Calling",
  "MCP",
  "Prompt Engineering",
  "FastAPI",
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {diagonal ? (
        <>
          <path d="M5 19 19 5" />
          <path d="M9 5h10v10" />
        </>
      ) : (
        <>
          <path d="M4 12h16" />
          <path d="m14 6 6 6-6 6" />
        </>
      )}
    </svg>
  );
}

function ProjectArtwork({ type }: { type: string }) {
  if (type === "acm") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-6 border border-white/25 md:inset-9" />
        <span className="absolute left-9 top-8 text-[10px] tracking-[0.22em] text-white/60">
          NORTHEASTERN UNIVERSITY
        </span>
        <p className="text-[clamp(4rem,9vw,8rem)] font-black leading-none tracking-[-0.1em]">ACM</p>
        <span className="absolute bottom-8 right-9 rounded-full border border-white/40 px-3 py-1 text-[10px]">
          NEUQ
        </span>
      </div>
    );
  }

  if (type === "network") {
    return (
      <div className="relative h-full overflow-hidden">
        <svg className="h-full w-full" viewBox="0 0 700 440" fill="none">
          <path d="M120 100 350 220 570 88M350 220l-180 130m180-130 210 145" stroke="#111" />
          <circle cx="120" cy="100" r="42" fill="#1546ff" />
          <circle cx="570" cy="88" r="42" fill="#ff6f4a" />
          <circle cx="170" cy="350" r="42" fill="#f4f0e8" stroke="#111" />
          <circle cx="560" cy="365" r="42" fill="#f4f0e8" stroke="#111" />
          <circle cx="350" cy="220" r="61" fill="#111" />
          <text x="350" y="228" textAnchor="middle" fill="white" fontSize="20">
            AGENT
          </text>
        </svg>
        <span className="absolute bottom-6 left-7 text-xs tracking-[0.18em]">
          BID / AWARD / EXECUTE
        </span>
      </div>
    );
  }

  if (type === "trading") {
    return (
      <div className="relative h-full overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 border-t border-black/20" />
        <div className="absolute inset-y-0 left-1/2 border-l border-black/20" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 440" fill="none">
          <path
            d="M0 349c71-17 94-92 159-70s86 73 145 21 78-158 146-122 73 90 126 22 74-121 124-146"
            stroke="#111"
            strokeWidth="5"
          />
          <path d="m678 55 22-1-5 22" stroke="#111" strokeWidth="5" />
        </svg>
        <p className="absolute left-7 top-7 text-xs tracking-[0.18em]">MARKET / AUTONOMOUS</p>
        <p className="absolute bottom-7 right-8 text-5xl font-black tracking-tighter">+24.8%</p>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden p-7 md:p-10">
      <div className="flex h-full items-end gap-3">
        {[42, 68, 51, 86, 63, 100, 78].map((height, index) => (
          <div
            key={height}
            className={`flex-1 border border-black ${index === 5 ? "bg-[#1546ff]" : "bg-[#f4f0e8]"}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <p className="absolute left-7 top-7 text-xs tracking-[0.18em]">DATA → INSIGHT</p>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-5" aria-hidden="true">
      <span
        className={`absolute left-0 top-[6px] h-px w-5 bg-current transition-transform ${open ? "translate-y-[4px] rotate-45" : ""}`}
      />
      <span
        className={`absolute left-0 top-[14px] h-px w-5 bg-current transition-transform ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
      />
    </span>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeEssay, setActiveEssay] = useState<Essay | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    document.body.style.overflow = menuOpen || activeProject || activeEssay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, activeProject]);

  useEffect(() => {
    const root = document.documentElement;
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add("is-visible");
      } else {
        observer.observe(item);
      }
    });

    let frame = 0;
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty(
        "--scroll-progress",
        (height > 0 ? window.scrollY / height : 0).toString(),
      );
      if (!reduced)
        root.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.12, 64)}px`);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProject(null);
        setActiveEssay(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const copyContact = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#101010]">
      <div className="scroll-progress" aria-hidden="true" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/15 bg-[#f4f0e8]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a
            href="#top"
            className="flex items-center gap-3 font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid size-8 place-items-center rounded-full bg-[#1546ff] text-sm font-bold text-white">
              水
            </span>
            <span className="tracking-tight">氵璃水</span>
          </a>
          <nav className="hidden items-center gap-9 text-sm md:flex" aria-label="主要导航">
            {[
              ["关于", "#about"],
              ["项目", "#work"],
              ["随笔", "#writing"],
              ["联络", "#contact"],
            ].map(([label, href]) => (
              <a key={href} className="nav-link" href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a
            className="hidden items-center gap-2 text-sm md:flex"
            href="https://github.com/Evernight317"
            target="_blank"
            rel="noreferrer"
          >
            <span className="size-2 rounded-full bg-[#34a853] pulse-dot" />
            GitHub
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center md:hidden"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
        <div
          className={`absolute inset-x-0 top-18 h-[calc(100vh-4.5rem)] bg-[#1546ff] px-5 text-white transition-all duration-300 md:hidden ${
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex h-full flex-col justify-between py-12" aria-label="移动端导航">
            <div className="flex flex-col text-4xl font-semibold tracking-[-0.05em]">
              {[
                ["关于", "#about"],
                ["项目", "#work"],
                ["随笔", "#writing"],
                ["联络", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  className="border-b border-white/25 py-3"
                  href={href}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
            <p className="text-sm text-white/65">Backend Engineer / Agent Developer</p>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative mx-auto flex min-h-[94vh] snap-start max-w-[1440px] flex-col justify-end overflow-hidden px-5 pb-12 pt-36 md:px-10 md:pb-16">
          <div className="hero-sticker absolute right-[8%] top-32 hidden border border-black/20 bg-white/40 p-2 lg:block">
            <div className="grid h-28 w-20 place-items-center bg-[#d8ff57]">
              <span className="-rotate-6 text-4xl font-black">水.</span>
            </div>
            <p className="pt-2 text-center text-[9px] tracking-[0.18em]">CREATE SOMETHING</p>
          </div>
          <p
            className="mb-5 text-xs font-semibold tracking-[0.24em] text-[#1546ff] md:mb-7"
            data-reveal="fade"
          >
            LARGE MODEL BACKEND · AGENT DEVELOPER
          </p>
          <h1
            className="max-w-6xl text-[clamp(3.35rem,9.5vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.075em]"
            data-reveal="title"
          >
            你好，我是
            <br />
            <span className="text-[#1546ff]">氵璃水</span>
          </h1>
          <div
            className="mt-12 grid gap-8 border-t border-black/25 pt-6 md:grid-cols-2 md:items-end"
            data-reveal="fade"
          >
            <p className="max-w-xl text-base leading-relaxed tracking-tight md:text-lg">
              璃是凝固的水，水是流动的璃。在系统的刚性里注入流动，在智能的流动里铸造形状。
            </p>
            <a
              className="group flex items-center justify-between md:justify-end md:gap-5"
              href="#about"
            >
              <span className="text-sm font-semibold">认识我</span>
              <span className="grid size-12 place-items-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white">
                <span className="rotate-90">
                  <ArrowIcon />
                </span>
              </span>
            </a>
          </div>
        </section>

        <section id="about" className="snap-start border-t border-black/15 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-[1360px] gap-14 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="sticky top-24">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#1546ff]">
                  01 / 关于
                </p>
              </div>
            </div>
            <div className="md:col-span-9">
              <h2
                className="max-w-5xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-medium leading-[1.14] tracking-[-0.045em]"
                data-reveal="title"
              >
                在系统与智能体之间，
                <span className="text-black/35">构建可靠、清晰且真正有用的产品</span>
              </h2>
              <div
                className="mt-14 grid gap-8 border-t border-black/20 pt-8 md:grid-cols-2"
                data-reveal="fade"
              >
                <div>
                  <p className="mb-3 text-xs tracking-[0.18em] text-black/45">
                    EDUCATION / IDENTITY
                  </p>
                  <p className="max-w-md text-lg leading-relaxed">
                    现就读于东北大学—奥克兰大学 3+2 项目，专注大模型后端与 Agent 开发
                  </p>
                </div>
                <div>
                  <p className="mb-3 text-xs tracking-[0.18em] text-black/45">INTERESTS</p>
                  <p className="text-lg leading-relaxed">建筑 · 字画 · 音乐 · 文学 · 创造事物</p>
                </div>
              </div>
              <div className="mt-14 grid gap-10 md:grid-cols-2" data-reveal="fade">
                <div>
                  <h3 className="mb-5 flex items-center gap-3 text-sm font-semibold">
                    <span className="grid size-7 place-items-center rounded-full bg-[#1546ff] text-xs text-white">
                      B
                    </span>
                    后端技术栈
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {backendStack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-black/25 px-4 py-2 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-5 flex items-center gap-3 text-sm font-semibold">
                    <span className="grid size-7 place-items-center rounded-full bg-[#d8ff57] text-xs">
                      A
                    </span>
                    Agent 技术栈
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agentStack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-black/25 px-4 py-2 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="snap-start bg-[#101010] px-5 py-20 text-[#f4f0e8] md:px-10 md:py-28">
          <div className="mx-auto max-w-[1360px]">
            <div
              className="sticky top-[4.5rem] z-30 mb-14 flex items-end justify-between border-b border-white/20 pb-6 backdrop-blur-md md:mb-20" style={{ backgroundColor: "rgba(16,16,16,0.85)" }}
              data-reveal="title"
            >
              <div>
                <p className="mb-3 text-xs tracking-[0.2em] text-white/50">
                  SELECTED WORK / 4 PROJECTS
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-5xl">02 / 项目</h2>
              </div>
              <span className="hidden text-2xl text-white/40 md:block">04</span>
            </div>
            <div className="grid gap-x-8 gap-y-20 md:grid-cols-2">
              {projects.map((project) => (
                <article key={project.number} className="group" data-reveal="project">
                  <div className={`project-art aspect-[4/3] overflow-hidden ${project.accent}`}>
                    <ProjectArtwork type={project.art} />
                  </div>
                  <div className="mt-6">
                    <div className="mb-5 flex items-center justify-between text-xs tracking-[0.16em] text-white/45">
                      <span>{project.number}</span>
                      <span>{project.subtitle}</span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-white/60">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/55"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.detail && (
                      <button
                        className="mt-7 flex w-full items-center justify-between border-t border-white/25 pt-5 text-left text-sm transition-colors hover:text-[#d8ff57]"
                        onClick={() => setActiveProject(project)}
                      >
                        查看项目详情
                        <ArrowIcon diagonal />
                      </button>
                    )}
                    {project.href && (
                      <a
                        className="mt-2 flex w-full items-center justify-between border-t border-white/25 pt-5 text-sm transition-colors hover:text-[#d8ff57]"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        访问项目
                        <ArrowIcon diagonal />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="writing" className="snap-start px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1360px]">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-3">
                <div className="sticky top-24"><p className="text-xs font-semibold tracking-[0.2em] text-[#1546ff]">
                  03 / 随笔
                </p></div>
              </div>
              <div className="md:col-span-9">
                <h2
                  className="mb-12 text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.06em]"
                  data-reveal="title"
                >
                  思考与书写
                </h2>
                <div className="border-t border-black" data-reveal="fade">
                  {essays.map((essay, index) => (
                    <button
                      key={essay.title}
                      className="essay-row group grid w-full gap-3 border-b border-black/20 py-6 text-left md:grid-cols-[3rem_1fr_auto] md:items-center md:py-8"
                      onClick={() => setActiveEssay(essay)}
                    >
                      <span className="text-xs text-black/35">0{index + 1}</span>
                      <div>
                        <p className="text-xs text-[#1546ff] md:hidden">{essay.topic}</p>
                        <h3 className="mt-1 text-lg font-medium tracking-tight transition-transform md:mt-0 md:text-2xl">
                          《{essay.title}》
                        </h3>
                      </div>
                      <div className="flex items-center justify-between gap-8 text-xs text-black/45">
                        <span className="hidden md:block">{essay.topic}</span>
                        <time>{essay.date}</time>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mt-8 text-sm text-black/45">尚在书写 更多文章在路上</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="snap-start bg-[#1546ff] px-5 py-20 text-white md:px-10 md:py-24">
          <div className="mx-auto max-w-[1360px]">
            <div className="sticky top-[4.5rem] z-30 backdrop-blur-md" style={{ backgroundColor: "rgba(21,70,255,0.85)" }}>
              <p className="text-xs tracking-[0.2em] text-white/60" data-reveal="fade">
                04 / CONTACT
              </p>
            </div>
            <h2
              className="my-10 max-w-5xl text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.06em]"
              data-reveal="title"
            >
              保持联络，
              <br />
              一起创造
            </h2>
            <div className="grid border-t border-white/30 md:grid-cols-2" data-reveal="fade">
              {contacts.map((contact) =>
                contact.href ? (
                  <a
                    key={contact.label}
                    className="contact-row group flex items-center justify-between border-b border-white/25 py-5 md:odd:mr-6 md:even:ml-6"
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-[10px] tracking-[0.18em] text-white/45">
                      {contact.label}
                    </span>
                    <span className="flex items-center gap-3 text-sm md:text-base">
                      {contact.value}
                      <ArrowIcon diagonal />
                    </span>
                  </a>
                ) : (
                  <button
                    key={contact.label}
                    className="contact-row group flex items-center justify-between border-b border-white/25 py-5 text-left md:odd:mr-6 md:even:ml-6"
                    onClick={() => copyContact(contact.value)}
                  >
                    <span className="text-[10px] tracking-[0.18em] text-white/45">
                      {contact.label}
                    </span>
                    <span className="text-right text-sm md:text-base">
                      {copied === contact.value ? "已复制" : contact.value}
                    </span>
                  </button>
                ),
              )}
            </div>
            <div className="mt-12 flex items-center justify-between text-xs text-white/45">
              <span>© 2026 氵璃水</span>
              <a href="#top">BACK TO TOP ↑</a>
            </div>
          </div>
        </section>
      </main>

      {activeProject?.detail && (
        <div
          className="project-modal fixed inset-0 z-[70] grid place-items-end bg-black/60 p-0 backdrop-blur-sm md:place-items-center md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveProject(null);
          }}
        >
          <div className="modal-panel max-h-[92vh] w-full overflow-y-auto bg-[#f4f0e8] p-6 text-black md:max-w-3xl md:p-10">
            <div className="flex items-start justify-between border-b border-black/20 pb-6">
              <div>
                <p className="text-xs tracking-[0.18em] text-[#1546ff]">
                  PROJECT {activeProject.number}
                </p>
                <h2
                  id="project-dialog-title"
                  className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl"
                >
                  {activeProject.title}
                </h2>
              </div>
              <button
                className="grid size-11 shrink-0 place-items-center rounded-full border border-black/25 text-2xl"
                onClick={() => setActiveProject(null)}
                aria-label="关闭详情"
              >
                ×
              </button>
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/65 md:text-xl">
              {activeProject.detail.intro}
            </p>
            <div className="mt-10">
              <p className="mb-5 text-xs tracking-[0.18em] text-black/45">
                {activeProject.detail.label}
              </p>
              <div className="space-y-px bg-black/15">
                {activeProject.detail.steps.map((step, index) => (
                  <div key={step.name} className="flex gap-5 bg-[#f4f0e8] p-5">
                    <span className="shrink-0 text-sm font-bold text-[#1546ff]">0{index + 1}</span>
                    <div>
                      <p className="text-sm font-semibold">{step.name}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-black/55">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {activeProject.detail.stack && (
              <div className="mt-8 border-t border-black/20 pt-6">
                <p className="mb-3 text-xs tracking-[0.18em] text-black/45">技术栈</p>
                <p className="text-sm font-medium text-black/75">{activeProject.detail.stack}</p>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-2">
              {activeProject.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-black/25 px-4 py-2 text-sm">
                  {tag}
                </span>
              ))}
            </div>
            {activeProject.href && (
              <a
                className="mt-8 flex items-center gap-2 border-t border-black/20 pt-6 text-sm font-semibold text-[#1546ff]"
                href={activeProject.href}
                target="_blank"
                rel="noreferrer"
              >
                访问项目
                <ArrowIcon diagonal />
              </a>
            )}
          </div>
        </div>
      )}

      {activeEssay && (
        <div
          className="project-modal fixed inset-0 z-[70] grid place-items-end bg-black/60 p-0 backdrop-blur-sm md:place-items-center md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="essay-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveEssay(null);
          }}
        >
          <div className="modal-panel max-h-[92vh] w-full overflow-y-auto bg-[#f4f0e8] p-6 text-black md:max-w-3xl md:p-12">
            <div className="flex items-start justify-between border-b border-black/20 pb-6">
              <div>
                <p className="text-xs tracking-[0.18em] text-[#1546ff]">
                  {activeEssay.topic} · {activeEssay.date}
                </p>
                <h2
                  id="essay-dialog-title"
                  className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-4xl"
                >
                  {activeEssay.title}
                </h2>
              </div>
              <button
                className="grid size-11 shrink-0 place-items-center rounded-full border border-black/25 text-2xl"
                onClick={() => setActiveEssay(null)}
                aria-label="关闭文章"
              >
                ×
              </button>
            </div>
            <div className="mt-8 space-y-10">
              {activeEssay.sections.map((section) => (
                <section key={section.heading}>
                  <h3 className="mb-4 text-sm font-semibold tracking-[0.18em] text-black/45">
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-base leading-[1.85] tracking-tight text-black/75 md:text-lg md:leading-[1.9]"
                    >
                      {paragraph.split(/\*\*(.+?)\*\*/).map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="font-semibold text-black">
                            {part}
                          </strong>
                        ) : (
                          <Fragment key={i}>{part}</Fragment>
                        ),
                      )}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className={`pointer-events-none fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-black px-5 py-3 text-sm text-white transition-all ${
          copied ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        已复制到剪贴板
      </div>
    </div>
  );
}
