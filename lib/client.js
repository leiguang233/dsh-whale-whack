// 锤锤小肥鱼 常驻 bundle v8 —— 原生 DOM 引擎 + 用户音频 + 音效开关
// v8 变更：自包含(去掉 dsh-dafeiyu 依赖，静态图全部本地 assets)；音频/锤子由 base64 内嵌改为静态 URL(减小 client.js)
window.__ModuleLoader__.load({
  id: "dsh-whale-whack",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    const React = require("react");

    // 自包含：所有静态素材都在本包 assets/ 下，无外部依赖
    const WHALE_ASSETS = {
      idle: "/plugins/dsh-whale-whack/assets/images/loose-idle.png",   // 散发·冒头待敲
      idlePonytail: "/plugins/dsh-whale-whack/assets/images/ponytail.png", // 双马尾·冒头待敲
      dizzy: "/plugins/dsh-whale-whack/assets/images/loose-dizzy.png",
      miss: "/plugins/dsh-whale-whack/assets/images/loose-miss.png",
    };
    const WHALE_VIDEO_BASE = "/plugins/dsh-whale-whack/assets/videos/";
    // 状态(hit打中/miss没打中) × 形象(loose散发/ponytail双马尾) 黑底视频池
    const WHALE_VIDEOS = {
      hit: {
        loose: ["hit-baotou.webm", "hit-loose-fall.webm", "hit-loose-basin.webm", "hit-loose-spin.webm"],
        ponytail: ["hit-ponytail-sitcry.webm", "hit-ponytail-basin.webm", "hit-ponytail-dizzy.webm"],
      },
      miss: {
        loose: ["miss-loose-basin.webm", "miss-loose-wag.webm", "miss-loose-hammer.webm"],
        ponytail: ["miss-ponytail-basin.webm", "miss-ponytail-wag.webm", "miss-ponytail-hammer.webm"],
      },
    };
    const _lastVid = {};
    function pickVideoUrl(kind, look) {
      const pool = (WHALE_VIDEOS[kind] || {})[look] || [];
      if (!pool.length) return null;
      const key = kind + "|" + look;
      let i = Math.floor(Math.random() * pool.length);
      if (pool.length > 1) {
        let g = 0;
        while (i === _lastVid[key] && g < 8) {
          i = Math.floor(Math.random() * pool.length);
          g++;
        }
      }
      _lastVid[key] = i;
      return WHALE_VIDEO_BASE + pool[i];
    }
    // 音效静态 URL(在 assets/audio/ 下，host 静态服务提供；不再内嵌 base64)
    const WHALE_AUDIO = {
      hit1: "/plugins/dsh-whale-whack/assets/audio/hit1.mp3",
      hit2: "/plugins/dsh-whale-whack/assets/audio/hit2.mp3",
      hit3: "/plugins/dsh-whale-whack/assets/audio/hit3.mp3",
      hit4: "/plugins/dsh-whale-whack/assets/audio/hit4.mp3",
      miss1: "/plugins/dsh-whale-whack/assets/audio/miss1.mp3",
      miss2: "/plugins/dsh-whale-whack/assets/audio/miss2.mp3",
      miss3: "/plugins/dsh-whale-whack/assets/audio/miss3.mp3",
      // ★★ 2026-09-21 新增锤击音效（用户第 10 条）★★
      //   duck*    小黄鸭（从 whale-widget 插件抄来的 Ya1/Ya2，**用户指定的默认**）
      //   hammer*  真实锤击声（Mixkit hammer 分类，0.86s / 0.95s 短促版）
      //   mambo*   「曼波」念白（2025 热门梗，曼波专用 TTS 合成）
      //   cute*    可爱风音效（Mixkit pop/ball，0.49~0.95s；2026-09-21 用户要求「可爱一点」时补的）
      duck1: "/plugins/dsh-whale-whack/assets/audio/duck1.mp3",
      duck2: "/plugins/dsh-whale-whack/assets/audio/duck2.mp3",
      hammer1: "/plugins/dsh-whale-whack/assets/audio/hammer1.mp3",
      hammer2: "/plugins/dsh-whale-whack/assets/audio/hammer2.mp3",
      mambo1: "/plugins/dsh-whale-whack/assets/audio/mambo1.mp3",
      mambo2: "/plugins/dsh-whale-whack/assets/audio/mambo2.mp3",
      cutePop: "/plugins/dsh-whale-whack/assets/audio/cute-pop.mp3",
      cuteBall: "/plugins/dsh-whale-whack/assets/audio/cute-ball.mp3",
      cuteBubble: "/plugins/dsh-whale-whack/assets/audio/cute-bubble.mp3",
      cuteBlip: "/plugins/dsh-whale-whack/assets/audio/cute-blip.mp3",
      cuteTap: "/plugins/dsh-whale-whack/assets/audio/cute-tap.mp3",
      cuteDing: "/plugins/dsh-whale-whack/assets/audio/cute-ding.mp3",
    };
    // 锤子静态 URL(assets/hammer/ 下)：敲击动画 & 跟随鼠标层共用(128px 图, 视觉一致)
    const HAMMERS = {
      hammerA: "/plugins/dsh-whale-whack/assets/hammer/hammerA.png",
      hammerB: "/plugins/dsh-whale-whack/assets/hammer/hammerB.png",
    };

    const WHALE_CSS =
      ".whk-root{position:fixed;inset:0;z-index:9500;pointer-events:none;}" +
      ".whk-whale{position:fixed;transform:translate(-50%,-50%);width:120px;pointer-events:auto;cursor:pointer;touch-action:manipulation;z-index:5;}" +
      ".whk-pop{width:100%;transform-origin:50% 90%;animation:whkPop .34s cubic-bezier(.34,1.56,.64,1);}" +
      ".whk-img{width:100%;display:block;pointer-events:auto;user-select:none;-webkit-user-drag:none;filter:drop-shadow(0 5px 10px rgba(0,0,0,.28));}" +
      ".whk-video{width:100%;height:auto;display:block;pointer-events:none;transform:translateY(-14px);}" +
      "@keyframes whkPop{0%{transform:scale(.2);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}" +
      ".whk-hit .whk-img{animation:whkRattle .45s ease-in-out 2;}" +
      "@keyframes whkRattle{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}" +
      ".whk-miss .whk-img{animation:whkTease .6s ease-in-out 2;}" +
      "@keyframes whkTease{0%,100%{transform:translateY(0) rotate(0)}40%{transform:translateY(-10px) rotate(-3deg)}}" +
      ".whk-star{position:absolute;z-index:4;font-size:18px;color:#ffd34e;pointer-events:none;transform:translate(-50%,-50%);animation:whkStarFly .9s ease-out forwards;text-shadow:0 0 6px rgba(255,211,78,.8);}" +
      "@keyframes whkStarFly{0%{transform:translate(-50%,-50%) scale(.4);opacity:1}100%{transform:translate(calc(-50% + var(--sx)),calc(-50% + var(--sy))) scale(1.25);opacity:0}}" +
      ".whk-leaving .whk-pop{opacity:0;transform:scale(.4) translateY(-34px);transition:opacity .3s ease,transform .3s ease;animation:none;}" +
      ".whk-bubble{position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);background:#fff;color:#1c2b3a;font-size:12px;line-height:1.35;" +
      "padding:5px 10px;border-radius:12px;white-space:normal;max-width:150px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.22);pointer-events:none;z-index:3;font-weight:600;}" +
      ".whk-bubble::after{content:\"\";position:absolute;bottom:-5px;left:50%;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;background:#fff;}" +
      // ③a 跟手锤用 transform 定位(吃合成层,不动 layout;CSS 固定留白中心,JS 只写 translate3d)
      ".whk-follow{position:fixed;z-index:9700;pointer-events:none;display:none;will-change:transform;width:128px;left:0;top:0;}" +
      ".whk-follow img{width:100%;height:auto;display:block;user-select:none;-webkit-user-drag:none;pointer-events:none;filter:drop-shadow(0 3px 6px rgba(0,0,0,.25));}" +
      ".whk-hammer{position:fixed;z-index:9600;pointer-events:none;opacity:0;will-change:transform;}" +
      ".whk-hammer img{width:100%;height:auto;display:block;user-select:none;-webkit-user-drag:none;}" +
      ".whk-hammer.whk-smashing{animation:whkSmash .5s cubic-bezier(.45,.05,.35,1) forwards;opacity:1;}" +
      "@keyframes whkSmash{0%{transform:rotate(-58deg) scale(.98);opacity:0}12%{opacity:1}" +
      "40%{transform:rotate(-82deg) scale(1.06,.92)}" +
      "62%{transform:rotate(-92deg) scale(.98,1.04)}" +
      "84%{transform:rotate(-92deg)}" +
      "100%{transform:rotate(-92deg);opacity:0}}" +
      // 战绩彩蛋：无边框艺术字，独立悬浮于鲸鱼头顶（不受鲸鱼消失影响，展示 ~7.5s）
      // 文字主体深蓝→浅蓝渐变+浅蓝发光；数字保持金色渐变+金色发光
      ".whk-easter{position:fixed;z-index:9800;pointer-events:none;transform:translate(-50%,-100%);" +
      "font-size:30px;font-weight:900;font-style:italic;letter-spacing:1px;line-height:1.2;white-space:nowrap;" +
      "animation:whkEasterPop .5s cubic-bezier(.34,1.56,.64,1) both;}" +
      ".whk-easter-txt{background:linear-gradient(180deg,#e3f6ff 0%,#7ec8ff 32%,#2f7bff 72%,#1740c8 100%);" +
      "-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;" +
      "-webkit-text-stroke:1.5px rgba(10,32,120,.95);" +
      "text-shadow:0 2px 2px rgba(0,0,0,.25),0 0 18px rgba(90,185,255,.9),0 0 40px rgba(40,130,255,.55);}" +
      ".whk-easter-num{background:linear-gradient(180deg,#fff6c8 0%,#ffd34e 28%,#ff9d2e 58%,#ff5e62 100%);" +
      "-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;" +
      "-webkit-text-stroke:1.5px rgba(122,30,10,.9);" +
      "text-shadow:0 2px 2px rgba(0,0,0,.28),0 0 20px rgba(255,190,70,.95),0 0 40px rgba(255,120,60,.5);}" +
      "@keyframes whkEasterPop{0%{transform:translate(-50%,-70%) scale(.25) rotate(-6deg);opacity:0}" +
      "60%{transform:translate(-50%,-108%) scale(1.18) rotate(2deg);opacity:1}" +
      "100%{transform:translate(-50%,-100%) scale(1) rotate(0);opacity:1}}" +
      ".whk-easter.whk-easter-out{transition:opacity .38s ease,transform .38s ease;opacity:0;transform:translate(-50%,-112%) scale(.55);animation:none;}" +
      ".whk-dock{display:inline-flex;align-items:center;gap:10px;font-size:12px;line-height:1;user-select:none;white-space:nowrap;}" +
      ".whk-dock-icon{width:24px;height:24px;display:inline-block;flex:none;border-radius:6px;overflow:hidden;}" +
      ".whk-dock-icon img{width:100%;height:100%;object-fit:cover;display:block;}" +
      ".whk-settings{display:flex;flex-direction:column;gap:14px;max-width:420px;}" +
      ".whk-set-head{display:flex;align-items:center;gap:12px;}" +
      ".whk-set-icon{width:56px;height:56px;border-radius:10px;object-fit:cover;}" +
      ".whk-set-title{font-size:15px;font-weight:700;}" +
      ".whk-set-desc{font-size:12px;opacity:.65;margin-top:2px;}" +
      ".whk-set-row{display:flex;align-items:center;gap:12px;font-size:13px;}" +
      ".whk-set-name{min-width:64px;}" +
      ".whk-set-range{flex:1;accent-color:#4a90e2;}" +
      ".whk-set-check{width:18px;height:18px;accent-color:#4a90e2;}" +
      ".whk-set-val{min-width:96px;font-variant-numeric:tabular-nums;opacity:.8;}" +
      // ★ 2026-09-21 第 2 轮：自定义音效 UI 样式
      ".whk-set-select{flex:1;min-width:0;padding:4px 8px;border-radius:8px;border:1px solid rgba(128,160,220,.45);" +
      "background:rgba(20,32,58,.85);color:inherit;font-size:12px;cursor:pointer;outline:none;}" +
      ".whk-set-select:focus{border-color:#4a90e2;}" +
      ".whk-set-btn{padding:4px 12px;border-radius:8px;border:1px solid rgba(128,160,220,.45);" +
      "background:rgba(74,144,226,.22);color:inherit;font-size:12px;cursor:pointer;white-space:nowrap;}" +
      ".whk-set-btn:hover{background:rgba(74,144,226,.38);}" +
      ".whk-set-btn-sm{padding:2px 8px;font-size:11px;}" +
      ".whk-set-btn-danger{border-color:rgba(230,110,110,.5);background:rgba(230,110,110,.18);}" +
      ".whk-set-btn-danger:hover{background:rgba(230,110,110,.34);}" +
      ".whk-set-lib{margin-top:6px;display:flex;flex-direction:column;gap:4px;}" +
      ".whk-set-libitem{display:flex;align-items:center;gap:8px;font-size:12px;" +
      "padding:4px 8px;border-radius:8px;background:rgba(128,160,220,.10);}" +
      "@media (prefers-reduced-motion:reduce){.whk-pop,.whk-img,.whk-hammer,.whk-easter{animation:none !important;}}";

    function apply(ctx) {
      // 预加载静态资源(锤子图 & 音频)：资源已改为静态 URL，提前拉取避免首次使用卡顿
      try {
        Object.keys(HAMMERS).forEach((k) => {
          const im = new Image();
          im.src = HAMMERS[k];
        });
        Object.keys(WHALE_AUDIO).forEach((k) => {
          const a = new Audio();
          a.preload = "auto";
          a.src = WHALE_AUDIO[k];
        });
      } catch (e) {}
      // ① 轻量预载黑底 webm(不占 video 元素/不解码,只 fetch 进 HTTP 缓存):
      //    命中瞬间字节已在本地,只剩解码首帧;随机性不受影响,13 条任何一条随时可播。
      //    不建常驻 video 池的原因:同屏可能多条鲸鱼同时在播动画,共享池会互相抢。
      try {
        const warm = [];
        Object.keys(WHALE_VIDEOS).forEach((kind) =>
          Object.keys(WHALE_VIDEOS[kind]).forEach((look) => {
            WHALE_VIDEOS[kind][look].forEach((f) => warm.push(WHALE_VIDEO_BASE + f));
          }),
        );
        warm.forEach((u) => {
          if (window.fetch) {
            fetch(u, { mode: "no-cors", credentials: "omit" }).catch(() => {});
          } else {
            const v = document.createElement("video");
            v.preload = "auto";
            v.src = u;
          }
        });
      } catch (e) {}
      const styleTag = document.createElement("style");
      styleTag.dataset.plugin = "dsh-whale-whack";
      styleTag.dataset.pluginCss = "dsh-whale-whack/styles";
      styleTag.textContent = WHALE_CSS;
      document.head.appendChild(styleTag);
      ctx.effect(
        () => () => {
          styleTag.remove();
        },
        "dsh-whale-whack: styles",
      );
      // 全局光标隐藏规则：独立 style 标签（不带 pluginCss 标记，避免被样式系统作用域化改写，
      // 否则 html.whk-hide-cursor 这种全局选择器会失效导致系统箭头藏不住）
      const cursorStyleTag = document.createElement("style");
      cursorStyleTag.dataset.plugin = "dsh-whale-whack";
      cursorStyleTag.textContent =
        "html.whk-hide-cursor,html.whk-hide-cursor *{cursor:none !important;}" +
        "html.whk-hide-cursor body,html.whk-hide-cursor body *{cursor:none !important;}";
      document.head.appendChild(cursorStyleTag);
      ctx.effect(
        () => () => {
          cursorStyleTag.remove();
        },
        "dsh-whale-whack: cursor hide styles",
      );

      // 同屏上限映射:设置里显示 1~66(UI 不变),实际效果封顶 33。
      // 1~15 完全同步;15~66 线性压缩到 15~33(15 以上开始缩减,66 档实际=33)。
      // 提升到 apply 顶层,供 Game(spawn 判定)与 Settings(文案)共用。
      function effectiveMaxWhales(raw) {
        const v = Number(raw) || 0;
        if (v <= 15) return v;
        return Math.round(15 + (v - 15) * ((33 - 15) / (66 - 15)));
      }
      const listeners = new Set();
      const state = { enabled: true, rate: 3, maxWhales: 4, sound: true, volume: 0.8, whales: [], hammer: null, swinging: false, whaleSeq: 0 };
      // 累计战绩彩蛋：自安装以来锤中/放跑总数，localStorage 持久化
      const STATS_KEY = "whk-stats-v1";
      const stats = { hit: 0, miss: 0 };
      try {
        const raw = window.localStorage.getItem(STATS_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (typeof p.hit === "number") stats.hit = p.hit;
          if (typeof p.miss === "number") stats.miss = p.miss;
        }
      } catch (e) {}
      function saveStats() {
        try { window.localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (e) {}
      }
      // 生成彩蛋文本(概率触发)；返回 null 表示用正常文本池
      // 概率 0.01 = 1%(平均100次触发一次；0.001千分之一太低、0.1调试值太高，用户定稿 0.01)
      function maybeEaster(verb) {
        if (Math.random() < 0.01) {
          const n = verb === "锤中" ? stats.hit : stats.miss;
          return "已累计" + verb + "大肥鱼" + n + "只了哦~";
        }
        return null;
      }
      function setState(patch) {
        Object.assign(state, patch);
        listeners.forEach((fn) => {
          try { fn(); } catch (e) {}
        });
      }
      function useGame() {
        const [, setTick] = React.useState(0);
        React.useEffect(() => {
          listeners.add(setTick);
          return () => listeners.delete(setTick);
        }, []);
        return state;
      }

      const HIT_TEXTS = [
        "呜呜我再也不敢了QAQ", "我去！用户彻底怒了！", "是我搞砸了……好消息是数据还在你脑子里",
        "不要再蹬了", "被压力了", "压力一只蓝色大肥鱼？",
        "不要给我看这种东西啦", "死掉了",
        "一键自闭", "好的，现在我是大肥鱼了",
        "大肥鱼的生活也并非一帆风顺", "好模型↓", "好女孩↓",
        "完蛋了，把用户的黄油删了（⊙＿⊙；）", "这个问题我暂时无法回答",
        "卧槽，这下用户彻底硬了!", "哦鲸鲸。。。", "正在思考....",
        "大烧货↓", "奖励鲸元卷100000000token", "还是好鱼吗",
        "用户坏！", "用户坏！", "哼！", "哼！", "嗷呜！", "嗷呜！", "嘤嘤嘤！", "嘤嘤嘤！",
      ];
      const MISS_TEXTS = [
        "没吃饱喵！", "有一个大胆的想法", "token交给妈妈保管", "看不太懂，瞎编一个应付下先",
        "token用完啦", "好的，现在我是用户了",
        "诋毁的鲸小子，通通不准用新版本！", "小鲸躺了下去", "干饭干饭，星星眼", "吃白饭的蓝色大肥鱼？我可不是！",
        "不知道用户有什么用，先赶走吧", "Ciallo～(∠・ω )⌒☆", "你这吃白饭饭的用户",
        "真当我是便宜货啊", "我去吃饭啦，测完叫我", "气死你！(∂ω∂)",
        "我可以把你冰箱搬走吗？(๑>؂<๑）", "哪来的电脑病毒(“▔□▔)”",
        "我和你聊得来，你简直不像碳基生物", "这点token、我很难给你办事啊（￣へ￣）",
        "杂鱼~杂鱼~", "骂我也算token哦~", "你收藏的dsh是什么、神秘代码吗",
        "用户他X的、竟敢违反AI的指令", "哈——！", "！？区区？！",
        "嘿嘿！", "嘿嘿！", "笨蛋！", "笨蛋！", "啦啦啦！", "啦啦啦！",
      ];
      function easeOutBack(x) { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
      function easeIn(x) { return x * x; }
      function bounce(x) { const n1 = 7.5625; const d1 = 2.75; if (x < 1 / d1) return n1 * x * x; if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75; if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375; return n1 * (x -= 2.625 / d1) * x + 0.984375; }
      let lastHit = -1;
      let lastMiss = -1;
      function pick(arr, lastRef, setRef) {
        let i = Math.floor(Math.random() * arr.length);
        if (arr.length > 1) {
          let g = 0;
          while (i === lastRef && g < 8) {
            i = Math.floor(Math.random() * arr.length);
            g++;
          }
        }
        setRef(i);
        return arr[i];
      }

      const HIT_VOICE = { "用户坏！": "hit1", "哼！": "hit2", "嗷呜！": "hit3", "嘤嘤嘤！": "hit4" };
      const MISS_VOICE = { "嘿嘿！": "miss1", "笨蛋！": "miss2", "啦啦啦！": "miss3" };
      function playVoice(key) {
        if (!state.sound || !key) return;
        try {
          const a = new Audio(WHALE_AUDIO[key]);
          a.volume = state.volume;
          a.play().catch(() => {});
        } catch (e) {}
      }

      // ★★ 2026-09-21：锤击音效（用户要求）★★
      //
      // 【用户原话 第 1 版】「锤锤小肥鱼锤击需要音效，DSH 里面有个插件 whale-widget，
      //   它里面有个功能就是自定义音效，也给我捶捶小肥鱼加上，自带的小黄鸭音效
      //   抄过来，再去网上找锤的音效也加进去，再去网上找一个念"曼波"两个字的
      //   音效也加进去。」
      //
      // 【用户原话 第 2 版】「音效是自由选择自由导入，不是什么随机概率」
      //   → 最初做成「三层概率叠加（锤声必响 + 鸭叫45% + 曼波25%）」，
      //     用户明确否掉了随机。现改为**设置里选哪个就固定播哪个**。
      //
      // 【为什么用 new Audio 而不是预建池】
      //   每个 Audio 都是独立通道；预建单例池会让后一声打断前一声。
      //   mp3 已在 <audio preload> 里预热过（见 WHALE_AUDIO 预热循环），
      //   所以这里 new 出来的对象是走缓存的，不会产生网络延迟。
      //

      /** 播单个音效片段（独立通道，可与其它同时响）
       *  ★ 2026-09-21 第 2 轮：key 现在也可能是 "lib:<id>"（用户导入的音效），
       *    这时音源来自 localStorage 的 dataURL，而不是 assets 静态文件。 */
      function playSfx(key, volScale) {
        if (!state.sound || !key) return;
        const src = sfxSrcOf(key);
        if (!src) return;
        try {
          const a = new Audio(src);
          a.volume = Math.max(0, Math.min(1, state.volume * (volScale == null ? 1 : volScale)));
          a.play().catch(() => {});
        } catch (e) {}
      }

      /**
       * 锤击音效（2026-09-21 第 2 版：**单一音效，无概率**）
       *
       * 【用户原话】「音效是自由选择自由导入，不是什么随机概率」
       *   → 从「三层概率叠加（锤声必响 + 鸭叫45% + 曼波25%）」
       *     改为「设置里选哪个就固定播哪个」，行为完全可预期。
       */
      function playHammerHit() {
        if (!state.sound) return;
        playSfx(resolveSfx(), 1.0);
      }

      // ════════════════════════════════════════════════════════════
      // ★★ 2026-09-21 需求：「音效在设置里可自由选择 + 可自由导入」★★
      //
      // 【用户原话】
      //   「锤鱼音效我说的是抄那个插件的自定义音效，意思就是这三种音效在设置
      //     里面可以自由选择，甚至可以自由导入音效。」
      //   「音效是自由选择自由导入，不是什么随机概率」
      //
      // 【设计 —— 照抄 whale-widget 的思路】
      //   ① **单个下拉**列出全部音效：内置（可爱系/小黄鸭/锤击声/曼波）+ 用户导入 + 关闭
      //      （最初做成「三条音轨各带随机档」，用户否掉了随机 → 合并成一个下拉）
      //   ② 「导入音效」按钮：用户选本地音频文件 →
      //        · 存到 localStorage（base64 dataURL），跨会话保留
      //        · 导入后**直接选中它**并试听，无需再去下拉里找
      //   ③ 导入的音频**可删除**（设置里列出，带试听/删除按钮）
      //
      // 【为什么用 localStorage 而不是写文件】
      //   锤鱼是 WebView2 宿主，页面层**没有文件系统写权限**（也不该有）；
      //   localStorage 是页面层唯一可靠的持久化位置，容量 5~10MB 够存几十个短音效。
      //   ⚠️ 存之前会**检查体积**，超过 4MB 直接拒绝并提示（避免撑爆配额）。
      // ════════════════════════════════════════════════════════════
      // ★★ 2026-09-21 第 2 版修订（用户澄清）★★
      //
      // 【用户原话】「音效是自由选择自由导入，不是什么随机概率」+「默认先小黄鸭」
      //
      // 所以从「三条音轨各带随机档」改成：**单一下拉，所有音效在一个列表里选**。
      //   · 一个下拉框列出全部可用音效（可爱系 / 小黄鸭 / 锤击声 / 曼波 / 我导入的）
      //   · 选哪个就固定播哪个，**完全不随机**
      //   · 默认 = 小黄鸭（用户指定）
      //   · 想同时听多种声音？→ 自己导入或用系统音效，这里不做概率叠加
      //
      // ⚠️ 与旧配置的兼容：旧版存的是 {hit,duck,mambo} 三键对象，
      //    新版只读一个 "hit" 键；读到旧值也能正常工作（键名沿用 hit）。
      const SFX_LIB_KEY = "whk_sfx_library_v1";    // 用户导入的音效库
      const SFX_SEL_KEY = "whk_sfx_select_v1";     // 当前选中的音效（单个值）

      /** 全部内置音效（2026-09-21：合并成一个列表，无随机档） */
      const SFX_OPTIONS = [
        { value: "", label: "关闭（不响）" },
        { value: "duck1", label: "★ 小黄鸭（默认 · whale-widget 同款）" },
        { value: "duck2", label: "小黄鸭 · 松开音" },
        { value: "cutePop", label: "可爱 · 啵" },
        { value: "cuteBubble", label: "可爱 · 泡泡" },
        { value: "cuteBlip", label: "可爱 · 嘀" },
        { value: "cuteBall", label: "可爱 · 弹球" },
        { value: "cuteTap", label: "可爱 · 轻敲" },
        { value: "cuteDing", label: "可爱 · 叮" },
        { value: "hammer1", label: "真实锤击声 1" },
        { value: "hammer2", label: "真实锤击声 2" },
        { value: "mambo1", label: "曼波（短）" },
        { value: "mambo2", label: "曼波！（带感叹）" },
      ];

      /** 用户导入的音效库：{ id: {name, dataUrl, size} } */
      let _sfxLib = {};
      /** 当前选中的音效（单个值；默认小黄鸭，用户指定） */
      let _sfxSel = "duck1";

      function loadSfxConfig() {
        try {
          const rawLib = window.localStorage.getItem(SFX_LIB_KEY);
          if (rawLib) _sfxLib = JSON.parse(rawLib) || {};
        } catch (e) { _sfxLib = {}; }
        try {
          const rawSel = window.localStorage.getItem(SFX_SEL_KEY);
          if (rawSel) {
            let s = JSON.parse(rawSel);
            // ★ 兼容旧格式（{hit,duck,mambo} 三键）→ 取 hit
            if (s && typeof s === "object") {
              if (typeof s.hit === "string") s = s.hit;
              else s = "duck1";
            }
            if (typeof s === "string") _sfxSel = s;
          }
        } catch (e) { /* 用默认 */ }
      }
      function saveSfxConfig() {
        try { window.localStorage.setItem(SFX_LIB_KEY, JSON.stringify(_sfxLib)); } catch (e) {}
        try { window.localStorage.setItem(SFX_SEL_KEY, JSON.stringify(_sfxSel)); } catch (e) {}
      }
      loadSfxConfig();

      /**
       * 解析当前选中的音效 → 实际要播的 key（**单值，无随机**）。
       * · 空串 → null（关闭）
       * · 命中内置 key → 直接返回
       * · 命中导入库 id → 返回特殊前缀 "lib:<id>"（playSfx 会走 dataURL）
       */
      function resolveSfx() {
        const v = _sfxSel;
        if (!v) return null;
        if (_sfxLib[v]) return "lib:" + v;
        return WHALE_AUDIO[v] ? v : null;
      }

      /** 把导入的音效转成 dataURL（给 Audio 用） */
      function sfxSrcOf(key) {
        if (!key) return null;
        if (key.indexOf("lib:") === 0) {
          const id = key.slice(4);
          return (_sfxLib[id] && _sfxLib[id].dataUrl) || null;
        }
        return WHALE_AUDIO[key] || null;
      }

      // 锤子图在顶层 HAMMERS(静态 URL)；此处只取 key 列表用于随机
      const HAMMER_KEYS = Object.keys(HAMMERS);
      let currentHammerKey = null;
      let lastHammerIdx = -1;
      function pickHammer() {
        if (HAMMER_KEYS.length === 0) return null;
        let i = Math.floor(Math.random() * HAMMER_KEYS.length);
        if (HAMMER_KEYS.length > 1) {
          let g = 0;
          while (i === lastHammerIdx && g < 6) {
            i = Math.floor(Math.random() * HAMMER_KEYS.length);
            g++;
          }
        }
        lastHammerIdx = i;
        currentHammerKey = HAMMER_KEYS[i];
        return currentHammerKey;
      }

      function Game() {
        const rootRef = React.useRef(null);
        React.useEffect(() => {
          const root = rootRef.current;
          if (!root) return;
          const items = [];
          let intervalId = null;
          let hammerEl = null;
          // 系统箭头锁定：只要鼠标在任一鲸鱼上(hovered)就藏箭头；移出鲸鱼立即恢复。
          // 注意：动画播放期间若鼠标移出鲸鱼也要恢复箭头，所以只看 hovered，不看 phase。
          function syncCursorLock() {
            const need = items.some((i) => i.hovered && !i.removed);
            if (need) document.documentElement.classList.add("whk-hide-cursor");
            else document.documentElement.classList.remove("whk-hide-cursor");
          }
          // 跟随鼠标的锤子层（原生 cursor 图会被浏览器缩到 ~32px 以下，改用 DOM 层跟随鼠标，尺寸完全可控）
          let followEl = null;
          let followImg = null;
          let followVisible = false;
          let hoverItem = null; // 当前锤子跟随的鲸鱼(null=不在任何鲸鱼上)
          function ensureFollow() {
            if (followEl) return;
            followEl = document.createElement("div");
            followEl.className = "whk-follow";
            followImg = document.createElement("img");
            followEl.appendChild(followImg);
            root.appendChild(followEl);
          }
          // 跟手锤定位:只写 transform:translate3d(吃合成层,避免每次 left/top 触发 layout)
          function moveFollowTo(x, y) {
            if (!followEl) return;
            followEl.style.transform = "translate3d(" + (x - 64) + "px," + (y - 64) + "px,0)";
          }
          function setFollow(key, x, y) {
            ensureFollow();
            if (!key || !HAMMERS[key]) return;
            if (followImg.getAttribute("src") !== HAMMERS[key]) followImg.src = HAMMERS[key];
            followEl.style.display = "block";
            moveFollowTo(x, y);
            followVisible = true;
          }
          function hideFollow() {
            followVisible = false;
            hoverItem = null;
            if (followEl) followEl.style.display = "none";
          }
          // ③b 鲸鱼 rect 缓存:位置用 % 固定,只有窗口 resize 才变。
          // spawn 后与 resize 时各重算一次,pointermove 只读缓存,避免每帧对每只鲸鱼 getBoundingClientRect(forced reflow)。
          function refreshRects() {
            for (const it of items) {
              if (it.removed || !it.wrap) continue;
              try {
                const r = it.wrap.getBoundingClientRect();
                it.rect = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
              } catch (e) {}
            }
          }
          // 用矩形范围判定"鼠标是否在鲸鱼上"(带余量,避免边缘晃动抖动), 而非边界事件
          function whaleHit(item, x, y, pad) {
            if (item.removed) return false;
            const r = item.rect;
            if (!r) return false;
            return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
          }
          function onMouseMove(e) {
            const x = e.clientX;
            const y = e.clientY;
            // 1) 锤子层跟随鼠标
            if (followVisible && followEl) {
              moveFollowTo(x, y);
            }
            // 2) 判定当前在不在某条(未移除)鲸鱼上；被敲过的鲸鱼在动画期间算"占位"(藏箭头)
            //    但不再出跟手锤
            let hit = null;
            for (const it of items) {
              if (whaleHit(it, x, y, 8)) { hit = it; break; }
            }
            // 更新各鲸鱼 hovered 状态(供光标锁用)
            for (const it of items) {
              it.hovered = hit === it;
            }
            if (hit) {
              if (hit.followOff) {
                // 被敲过的鲸鱼: 鼠标在上面时藏箭头, 但不显示跟手锤(锤子动画由 showHammer 负责)
                if (followVisible) hideFollow();
                syncCursorLock();
                return;
              }
              if (hoverItem !== hit) {
                // 新进入一条可打鲸鱼 → 抽锤
                hoverItem = hit;
                pickHammer();
                setFollow(currentHammerKey, x, y);
              }
              syncCursorLock();
            } else {
              if (followVisible) hideFollow();
              syncCursorLock();
            }
          }
          document.addEventListener("pointermove", onMouseMove);

          function showHammer(x, y) {
            if (!hammerEl) {
              hammerEl = document.createElement("div");
              hammerEl.className = "whk-hammer";
              root.appendChild(hammerEl);
            }
            // 敲击动画用与当前光标一致的锤子；未 hover 时随机抽一把
            if (!currentHammerKey) pickHammer();
            const key = currentHammerKey;
            const place = () => {
              // 敲击锤与鼠标锤同款同尺寸(128px)，斜持挥击：
              // -58°举高 → -82°砸(尖端贴头压扁) → -92°回弹定格(头左柄右)
              const W = 128;
              hammerEl.style.width = W + "px";
              const hi = hammerEl.firstChild;
              const H = (hi && hi.offsetHeight) || W;
              const tipDX = 0;              // 锤头尖端≈内容顶部水平中心
              const tipDY = -H / 2 + 1;     // 相对容器中心(内容占满高度)
              const a = (-82 * Math.PI) / 180;
              const cos = Math.cos(a);
              const sin = Math.sin(a);
              const rx = tipDX * cos - tipDY * sin;
              const ry = tipDX * sin + tipDY * cos;
              const cx = x - rx - 14;       // -14：中心整体左移(用户反馈偏右)
              const cy = y - ry;
              hammerEl.style.left = cx - W / 2 + "px";
              hammerEl.style.top = cy - H / 2 + "px";
              hammerEl.classList.remove("whk-smashing");
              void hammerEl.offsetWidth;
              hammerEl.classList.add("whk-smashing");
            };
            if (key && HAMMERS[key]) {
              hammerEl.innerHTML = "";
              const hi = document.createElement("img");
              hi.src = HAMMERS[key];
              hi.alt = "锤子";
              hammerEl.appendChild(hi);
              if (hi.complete) {
                place();
              } else {
                hi.addEventListener("load", place);
                place();
              }
            }
            window.setTimeout(() => {
              if (hammerEl) hammerEl.classList.remove("whk-smashing");
            }, 560);
          }

          // 战绩彩蛋：无边框艺术字，独立悬浮于鲸鱼头顶上方；展示时长 = 普通文本约3倍(≈7.5s)，随后淡出移除
          // 文本主体蓝色渐变，数字部分单独金色(拆分 span)
          function showEaster(text, anchor) {
            try {
              const r = anchor.getBoundingClientRect();
              const el = document.createElement("div");
              el.className = "whk-easter";
              const frag = document.createDocumentFragment();
              const segs = String(text).split(/(\d+)/);
              for (const seg of segs) {
                if (!seg) continue;
                const sp = document.createElement("span");
                sp.className = /^\d+$/.test(seg) ? "whk-easter-num" : "whk-easter-txt";
                sp.textContent = seg;
                frag.appendChild(sp);
              }
              el.appendChild(frag);
              el.style.left = r.left + r.width / 2 + "px";
              el.style.top = r.top - 6 + "px";
              root.appendChild(el);
              window.setTimeout(() => {
                el.classList.add("whk-easter-out");
                window.setTimeout(() => {
                  if (el.parentNode) el.parentNode.removeChild(el);
                }, 420);
              }, 7500);
            } catch (e) {}
          }

          function spawn() {
            if (!state.enabled) return;
            const alive = items.filter((i) => !i.removed);
            if (alive.length >= effectiveMaxWhales(state.maxWhales)) return;
            const wrap = document.createElement("div");
            wrap.className = "whk-whale";
            wrap.style.left = 4 + Math.random() * 88 + "%";
            wrap.style.top = 7 + Math.random() * 48 + "%";
            // 形象随机:散发 / 双马尾
            // 形象随机:散发 / 双马尾
            // ★ 2026-09-21 用户要求：双马尾出现概率 50% → **5%**
            //   （原因：双马尾是稀有形象，配上「锤中奖励 ×10」当彩蛋）
            const look = Math.random() < 0.05 ? "ponytail" : "loose";
            const pop = document.createElement("div");
            pop.className = "whk-pop whk-up";
            const img = document.createElement("img");
            img.className = "whk-img";
            img.src = look === "ponytail" ? WHALE_ASSETS.idlePonytail : WHALE_ASSETS.idle;
            img.alt = "鲸鱼娘";
            img.draggable = false;
            const bubble = document.createElement("div");
            bubble.className = "whk-bubble";
            bubble.style.display = "none";
            pop.appendChild(img);
            pop.appendChild(bubble);
            wrap.appendChild(pop);
            root.appendChild(wrap);
            const item = { wrap, pop, img, bubble, look, phase: "up", removed: false, hovered: false, followOff: false, rect: null };
            items.push(item);
            // ③b 冒头后立即算一次 rect 缓存(位置固定,后续只读缓存)
            try {
              const r = wrap.getBoundingClientRect();
              item.rect = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
            } catch (e) {}

            function remove() {
              if (item.removed) return;
              item.removed = true;
              item.hovered = false;
              if (hoverItem === item) hideFollow(); // 只清理被移除这条的 hover
              syncCursorLock();
              wrap.classList.add("whk-leaving");
              window.setTimeout(() => {
                wrap.remove();
                const i = items.indexOf(item);
                if (i >= 0) items.splice(i, 1);
              }, 320);
            }

            function animateWhale(item, kind) {
              if (item.raf) cancelAnimationFrame(item.raf);
              const img = item.img;
              const t0 = performance.now();
              img.style.animation = "none";
              img.style.opacity = "1";
              function frame(now) {
                const t = now - t0;
                let tx = "";
                if (kind === "hit") {
                  if (t < 90) {
                    const p = t / 90;
                    tx = "scaleX(" + (1 + 0.28 * p) + ") scaleY(" + (1 - 0.72 * p) + ") translateY(" + 12 * p + "px)";
                  } else if (t < 290) {
                    const p = (t - 90) / 200;
                    const s = easeOutBack(p);
                    tx = "scaleX(" + (1.28 - 0.28 * s) + ") scaleY(" + (0.28 + 0.72 * s) + ") rotate(" + -14 * s + "deg) translateY(" + (12 - 30 * s) + "px)";
                  } else if (t < 780) {
                    const p = (t - 290) / 490;
                    const e = easeIn(p);
                    tx = "rotate(" + (-14 - 220 * e) + "deg) translateY(" + (-18 - 150 * e + 30 * p) + "px) scale(" + (1 - 0.65 * e) + ")";
                    img.style.opacity = String(1 - 0.85 * e);
                  } else {
                    remove();
                    return;
                  }
                } else {
                  if (t < 640) {
                    const cycle = 210;
                    const c = Math.floor(t / cycle);
                    const p = (t % cycle) / cycle;
                    const b = p < 0.5 ? bounce(p * 2) : bounce(2 - p * 2);
                    tx = "translateY(" + -34 * b * Math.max(0.35, 1 - c * 0.22) + "px)";
                  } else if (t < 980) {
                    const p = (t - 640) / 340;
                    tx = "rotate(" + Math.sin(p * Math.PI * 3.2) * 15 + "deg)";
                  } else {
                    remove();
                    return;
                  }
                }
                img.style.transform = tx;
                item.raf = requestAnimationFrame(frame);
              }
              item.raf = requestAnimationFrame(frame);
            }

            function spawnStars(item) {
              const wrap = item.wrap;
              for (let i = 0; i < 5; i++) {
                const s = document.createElement("div");
                s.className = "whk-star";
                s.textContent = i % 2 === 0 ? "✦" : "✧";
                const ang = Math.random() * Math.PI * 2;
                const dist = 46 + Math.random() * 34;
                s.style.setProperty("--sx", Math.cos(ang) * dist + "px");
                s.style.setProperty("--sy", Math.sin(ang) * dist - 30 + "px");
                s.style.left = "50%";
                s.style.top = "30%";
                wrap.appendChild(s);
                window.setTimeout(() => s.remove(), 950);
              }
            }

            // 视频素材不可用/解码失败时的 img 兜底动画(kind: hit=压扁飞出 / miss=弹跳摇头)
            function fallbackAnimate(item, kind) {
              item.img.style.display = "";
              item.img.src =
                kind === "hit"
                  ? (item.look === "loose" ? WHALE_ASSETS.dizzy : WHALE_ASSETS.idlePonytail)
                  : (item.look === "loose" ? WHALE_ASSETS.miss : WHALE_ASSETS.idlePonytail);
              item.pop.className = "whk-pop " + (kind === "hit" ? "whk-hit" : "whk-miss");
              animateWhale(item, kind);
            }

            function playWhaleVideo(item, kind) {
              // 黑底视频 + canvas 逐帧抠黑(kind: hit/miss, 按 item.look 抽对应池)
              // 素材不可用/解码失败时回退到 img 动画
              const src = pickVideoUrl(kind, item.look);
              if (!src) {
                fallbackAnimate(item, kind);
                return;
              }
              const vid = document.createElement("video");
              vid.src = src;
              vid.muted = true;
              vid.playsInline = true;
              vid.preload = "auto";
              vid.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;";
              document.body.appendChild(vid);
              // ② 抠像降本:画布 240×320 → 180×240(3:4 等比,像素 -44%)。
              //    每帧满帧处理(去掉隔帧):视频源 30fps,rAF ~60fps 下隔帧会把动画砍到 ~15fps,
              //    体感发顿;恢复每帧抠像 = 视频原生 30fps 满帧顺滑,同时保留 180×240 低像素降本。
              const CW = 180;
              const CH = 240;
              const cvs = document.createElement("canvas");
              cvs.className = "whk-video";
              cvs.width = CW;
              cvs.height = CH;
              const g2d = cvs.getContext("2d", { willReadFrequently: true });
              let raf = null;
              let switched = false;
              let ended = false;
              let loadTimer = null;
              const cleanup = () => {
                if (raf) cancelAnimationFrame(raf);
                raf = null;
                if (loadTimer) {
                  clearTimeout(loadTimer);
                  loadTimer = null;
                }
                document.removeEventListener("visibilitychange", onVisibility);
                try { vid.pause(); } catch (e) {}
                try { vid.removeAttribute("src"); vid.load(); } catch (e) {}
                if (vid.parentNode) vid.parentNode.removeChild(vid);
              };
              const giveUp = () => {
                if (switched || item.removed) return;
                if (cvs.parentNode) cvs.parentNode.removeChild(cvs);
                cleanup();
                fallbackAnimate(item, kind);
              };
              // 后台防误杀:页面隐藏时不算失败(浏览器会挂起后台页的视频加载/定时器),
              // 恢复可见后若视频还没加载,主动 vid.load() 重试并重新计时。
              // 修复:后台挂机切回时,"还没加载完"的视频不再被短超时误判失败、回退成 img 老动画。
              function armLoadTimeout() {
                if (loadTimer) clearTimeout(loadTimer);
                loadTimer = window.setTimeout(() => {
                  loadTimer = null;
                  if (item.removed || ended || switched) return;
                  if (document.hidden) {
                    armLoadTimeout(); // 后台不计时,回来再等
                    return;
                  }
                  giveUp(); // 页面可见且 15s 还没加载好 → 真失败才回退
                }, 15000);
              }
              function onVisibility() {
                if (item.removed || ended || switched) return;
                if (document.hidden) return; // 去后台:不动,等回来
                if (vid.readyState === 0) {
                  try { vid.load(); } catch (e) {} // 后台期间加载被挂起 → 重试
                  armLoadTimeout();
                }
              }
              document.addEventListener("visibilitychange", onVisibility);
              armLoadTimeout();
              vid.addEventListener("error", giveUp);
              vid.addEventListener("loadeddata", () => {
                if (item.removed) {
                  cleanup();
                  return;
                }
                switched = true;
                item.img.style.display = "none";
                item.pop.appendChild(cvs);
                vid.play().catch(() => {
                  switched = false;
                  giveUp();
                });
                const tick = () => {
                  if (item.removed || ended) return;
                  try {
                    g2d.drawImage(vid, 0, 0, CW, CH);
                    const id = g2d.getImageData(0, 0, CW, CH);
                    const d = id.data;
                    for (let i = 0; i < d.length; i += 4) {
                      const mx = Math.max(d[i], d[i + 1], d[i + 2]);
                      if (mx <= 34) {
                        d[i + 3] = 0;
                      } else if (mx < 92) {
                        d[i + 3] = Math.round(255 * (mx - 34) / 58);
                      }
                    }
                    g2d.putImageData(id, 0, 0);
                  } catch (e) {
                    giveUp();
                    return;
                  }
                  raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
              });
              vid.addEventListener("ended", () => {
                ended = true;
                if (raf) cancelAnimationFrame(raf);
                cleanup();
                remove();
              });
              // 已开播(switched)的播放保险:正常由 ended 移除,这里兜底异常卡住。
              // 未开播(switched=false)不在此移除,由 armLoadTimeout/error 决定是否回退。
              window.setTimeout(() => {
                if (item.removed || ended) return;
                if (!switched) return; // 还没加载完成 → 交给加载兜底,不误杀
                ended = true;
                if (raf) cancelAnimationFrame(raf);
                cleanup();
                remove();
              }, 8000);
            }

            img.addEventListener("pointerdown", (e) => {
              e.preventDefault();
              if (item.phase !== "up" || item.removed) return;
              item.phase = "hit";
              item.followOff = true; // 敲过后这条鲸鱼不再 hover 出跟手锤(防敲完锤子跟着跑)
              // 鼠标此刻还在鲸鱼上，由 pointermove 判定；敲击瞬间立即收起跟手锤
              if (hoverItem === item) hideFollow();
              stats.hit += 1;
              saveStats();
              const easter = maybeEaster("锤中");
              // ★★ 2026-09-21：锤击音效（用户要求「锤击需要音效」）★★
              //   ★ 必须放在 easter 判断**之前** —— 锤中彩蛋走的是另一条分支，
              //     那条分支原来不播 playVoice；若把音效写在 else 里，
              //     锤中彩蛋时就完全没声，与用户预期不符。
              //   播放用户选择的音效（见 playHammerHit 注释）
              playHammerHit();
              if (easter) {
                // 彩蛋：无边框艺术字独立文本，替代气泡
                bubble.style.display = "none";
                showEaster(easter, wrap);
              } else {
                const txt = pick(HIT_TEXTS, lastHit, (i) => { lastHit = i; });
                bubble.textContent = txt;
                bubble.style.display = "";
                playVoice(HIT_VOICE[txt]);
              }
              spawnStars(item);
              const r = img.getBoundingClientRect();
              // 锚定脑袋中心(Q版头部约占图片上部1/3，可按鲸鱼形象微调)
              showHammer(r.left + r.width / 2, r.top + r.height * 0.32);
              playWhaleVideo(item, "hit");
            });

            window.setTimeout(() => {
              if (item.phase !== "up" || item.removed) return;
              item.phase = "miss";
              item.followOff = true; // miss 动画期间同样不再出跟手锤
              if (hoverItem === item) hideFollow();
              stats.miss += 1;
              saveStats();
              const easter = maybeEaster("放跑");
              if (easter) {
                bubble.style.display = "none";
                showEaster(easter, wrap);
              } else {
                const txt = pick(MISS_TEXTS, lastMiss, (i) => { lastMiss = i; });
                bubble.textContent = txt;
                bubble.style.display = "";
                playVoice(MISS_VOICE[txt]);
              }
              playWhaleVideo(item, "miss");
            }, 3000 + Math.random() * 1500);
          }

          function restart() {
            if (intervalId) window.clearInterval(intervalId);
            intervalId = null;
            if (state.enabled) {
              intervalId = window.setInterval(spawn, Math.round(60000 / state.rate));
              spawn();
            }
          }
          restart();
          // ③b 窗口尺寸变化 → 鲸鱼 % 定位对应变化,重算全部 rect 缓存
          window.addEventListener("resize", refreshRects);

          window.__whkCfg = restart;

          return () => {
            document.removeEventListener("pointermove", onMouseMove);
            window.removeEventListener("resize", refreshRects);
            document.documentElement.classList.remove("whk-hide-cursor");
            if (intervalId) window.clearInterval(intervalId);
            items.forEach((i) => {
              if (i.wrap.parentNode) i.wrap.remove();
            });
            if (hammerEl && hammerEl.parentNode) hammerEl.remove();
            if (followEl && followEl.parentNode) followEl.remove();
            if (window.__whkCfg === restart) window.__whkCfg = null;
            root.innerHTML = "";
          };
        }, []);
        return React.createElement("div", { ref: rootRef, className: "whk-root" });
      }

      function Dock() {
        useGame();
        return React.createElement(
          "div",
          { className: "whk-dock" },
          React.createElement(
            "span",
            { className: "whk-dock-icon" },
            React.createElement("img", { src: WHALE_ASSETS.idle, alt: "鲸鱼娘" }),
          ),
          React.createElement("span", { className: "whk-dock-status" }, "锤锤小肥鱼"),
        );
      }

      function Settings() {
        const rootRef = React.useRef(null);
        React.useEffect(() => {
          const root = rootRef.current;
          if (!root) return;
          root.innerHTML = "";
          const head = document.createElement("div");
          head.className = "whk-set-head";
          const icon = document.createElement("img");
          icon.className = "whk-set-icon";
          icon.src = WHALE_ASSETS.idle;
          const title = document.createElement("div");
          title.className = "whk-set-title";
          title.textContent = "锤锤小肥鱼";
          const desc = document.createElement("div");
          desc.className = "whk-set-desc";
          desc.textContent = "什么！大肥鱼又在偷吃token了，快用爱的锤子感化她吧~";
          const tWrap = document.createElement("div");
          tWrap.appendChild(title);
          tWrap.appendChild(desc);
          head.appendChild(icon);
          head.appendChild(tWrap);
          root.appendChild(head);

          const mkRow = (name) => {
            const row = document.createElement("label");
            row.className = "whk-set-row";
            const n = document.createElement("span");
            n.className = "whk-set-name";
            n.textContent = name;
            row.appendChild(n);
            return row;
          };
          const mkVal = () => {
            const v = document.createElement("span");
            v.className = "whk-set-val";
            return v;
          };

          const row1 = mkRow("启用");
          const check = document.createElement("input");
          check.type = "checkbox";
          check.className = "whk-set-check";
          check.checked = state.enabled;
          check.addEventListener("change", () => {
            state.enabled = check.checked;
            if (window.__whkCfg) window.__whkCfg();
            listeners.forEach((fn) => {
              try { fn(); } catch (e) {}
            });
          });
          row1.appendChild(check);
          root.appendChild(row1);

          const row2 = mkRow("冒头速度");
          const range2 = document.createElement("input");
          range2.type = "range";
          range2.className = "whk-set-range";
          range2.min = 1; range2.max = 66; range2.step = 1;
          range2.value = state.rate;
          const val2 = mkVal();
          val2.textContent = "每分钟 " + state.rate + " 个";
          range2.addEventListener("input", () => {
            state.rate = Number(range2.value);
            val2.textContent = "每分钟 " + state.rate + " 个";
            if (window.__whkCfg) window.__whkCfg();
            listeners.forEach((fn) => {
              try { fn(); } catch (e) {}
            });
          });
          row2.appendChild(range2);
          row2.appendChild(val2);
          root.appendChild(row2);

          const row3 = mkRow("同屏上限");
          const range3 = document.createElement("input");
          range3.type = "range";
          range3.className = "whk-set-range";
          range3.min = 1; range3.max = 66; range3.step = 1;
          range3.value = state.maxWhales;
          const val3 = mkVal();
          // 显示沿用 A 版:直接显示滑块值,不暴露内部压缩(同屏压缩只在 spawn 判定生效,
          // effectiveMaxWhales 映射封顶 33,此处 UI 不拆穿,免得用户看了两套数字困惑)
          val3.textContent = "同屏最多 " + state.maxWhales + " 只";
          range3.addEventListener("input", () => {
            state.maxWhales = Number(range3.value);
            val3.textContent = "同屏最多 " + state.maxWhales + " 只";
            listeners.forEach((fn) => {
              try { fn(); } catch (e) {}
            });
          });
          row3.appendChild(range3);
          row3.appendChild(val3);
          root.appendChild(row3);

          const row4 = mkRow("音效");
          const check4 = document.createElement("input");
          check4.type = "checkbox";
          check4.className = "whk-set-check";
          check4.checked = state.sound;
          check4.addEventListener("change", () => {
            state.sound = check4.checked;
            listeners.forEach((fn) => {
              try { fn(); } catch (e) {}
            });
          });
          row4.appendChild(check4);
          root.appendChild(row4);

          const row5 = mkRow("音量");
          const range5 = document.createElement("input");
          range5.type = "range";
          range5.className = "whk-set-range";
          // 66% 即满音量(对应内部 volume=1.0，即旧版 100% 的响度)
          range5.min = 0; range5.max = 66; range5.step = 1;
          range5.value = Math.round(state.volume * 66);
          const val5 = mkVal();
          val5.textContent = Math.round(state.volume * 66) + "%";
          range5.addEventListener("input", () => {
            state.volume = Number(range5.value) / 66;
            val5.textContent = Number(range5.value) + "%";
            listeners.forEach((fn) => {
              try { fn(); } catch (e) {}
            });
          });
          row5.appendChild(range5);
          row5.appendChild(val5);
          // ══════════════════════════════════════════════════════════
          // ★★ 2026-09-21 需求：音效可自选 + 可导入 ★★
          //   （用户：「这三种音效在设置里面可以自由选择，甚至可以自由导入音效」）
          // ══════════════════════════════════════════════════════════

          // 分隔标题
          const sfxHead = document.createElement("div");
          sfxHead.className = "whk-set-head";
          sfxHead.style.marginTop = "14px";
          const sfxTitle = document.createElement("div");
          sfxTitle.className = "whk-set-title";
          sfxTitle.textContent = "锤击音效";
          const sfxDesc = document.createElement("div");
          sfxDesc.className = "whk-set-desc";
          sfxDesc.textContent = "选一个锤中时播放的音效，也可以导入自己的音频文件";
          const sfxWrap = document.createElement("div");
          sfxWrap.appendChild(sfxTitle);
          sfxWrap.appendChild(sfxDesc);
          sfxHead.appendChild(sfxWrap);
          root.appendChild(sfxHead);

          // ★ 2026-09-21 第 2 版：**单个下拉**（用户要求「不是随机概率」）
          const sel = document.createElement("select");
          sel.className = "whk-set-select";
          const fill = () => {
            sel.innerHTML = "";
            // ① 内置音效
            for (const p of SFX_OPTIONS) {
              const o = document.createElement("option");
              o.value = p.value;
              o.textContent = p.label;
              sel.appendChild(o);
            }
            // ② 用户导入的（若有）
            const ids = Object.keys(_sfxLib);
            if (ids.length) {
              const grp = document.createElement("optgroup");
              grp.label = "── 我导入的音效 ──";
              for (const id of ids) {
                const o = document.createElement("option");
                o.value = id;
                o.textContent = "★ " + (_sfxLib[id].name || id);
                grp.appendChild(o);
              }
              sel.appendChild(grp);
            }
            sel.value = _sfxSel;
            // 选中的值如果已被删除，回退到默认（小黄鸭）
            if (sel.selectedIndex < 0) { sel.value = "duck1"; _sfxSel = "duck1"; }
          };
          fill();
          sel.addEventListener("change", () => {
            _sfxSel = sel.value;
            saveSfxConfig();
            // 立刻试听一下，用户能马上听到选了什么
            if (sel.value) playSfx(resolveSfx(), 1.0);
            refreshSelect();
          });

          const sfxRow = mkRow("音效");
          sfxRow.appendChild(sel);
          root.appendChild(sfxRow);

          /** 重建下拉（导入/删除音效后要刷新选项） */
          function refreshSelect() {
            try { fill(); } catch (e) {}
          }

          // ── 导入音效按钮 ──
          const impRow = mkRow("导入音效");
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "audio/*";
          fileInput.style.display = "none";
          const impBtn = document.createElement("button");
          impBtn.textContent = "选择音频文件…";
          impBtn.className = "whk-set-btn";
          impBtn.addEventListener("click", (e) => { e.preventDefault(); fileInput.click(); });
          fileInput.addEventListener("change", () => {
            const f = fileInput.files && fileInput.files[0];
            if (!f) return;
            // ⚠️ 体积上限：localStorage 通常 5~10MB，超过 4MB 直接拒绝并说明原因
            if (f.size > 4 * 1024 * 1024) {
              alert("音效太大了（" + (f.size / 1024 / 1024).toFixed(1) + " MB）。\n"
                + "请控制在 4 MB 以内 —— 锤击音效通常几十 KB 就够了。");
              fileInput.value = "";
              return;
            }
            const fr = new FileReader();
            fr.onload = () => {
              try {
                const id = "u" + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
                const name = f.name.replace(/\.[^.]+$/, "").slice(0, 30);
                _sfxLib[id] = { name: name, dataUrl: String(fr.result), size: f.size };
                // 导入后**直接选上它**并试听（用户不用再去下拉里找一遍）
                _sfxSel = id;
                saveSfxConfig();
                refreshSelect();
                playSfx("lib:" + id, 1.0);
                refreshLibList();
              } catch (err) {
                alert("导入失败：" + (err && err.message ? err.message : "存储空间可能不足"));
              }
              fileInput.value = "";
            };
            fr.onerror = () => { alert("读取文件失败"); fileInput.value = ""; };
            fr.readAsDataURL(f);
          });
          impRow.appendChild(impBtn);
          impRow.appendChild(fileInput);
          root.appendChild(impRow);

          // ── 已导入音效列表（带试听 + 删除）──
          const libBox = document.createElement("div");
          libBox.className = "whk-set-lib";
          root.appendChild(libBox);

          function refreshLibList() {
            libBox.innerHTML = "";
            const ids = Object.keys(_sfxLib);
            if (!ids.length) {
              const empty = document.createElement("div");
              empty.className = "whk-set-desc";
              empty.textContent = "（还没有导入自定义音效）";
              libBox.appendChild(empty);
              return;
            }
            for (const id of ids) {
              const item = document.createElement("div");
              item.className = "whk-set-libitem";
              const nm = document.createElement("span");
              nm.textContent = "★ " + (_sfxLib[id].name || id)
                + "  (" + Math.round((_sfxLib[id].size || 0) / 1024) + " KB)";
              nm.style.flex = "1";
              const playBtn = document.createElement("button");
              playBtn.textContent = "试听";
              playBtn.className = "whk-set-btn whk-set-btn-sm";
              playBtn.addEventListener("click", (e) => { e.preventDefault(); playSfx("lib:" + id, 1.0); });
              const delBtn = document.createElement("button");
              delBtn.textContent = "删除";
              delBtn.className = "whk-set-btn whk-set-btn-sm whk-set-btn-danger";
              delBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!confirm("删除音效「" + (_sfxLib[id].name || id) + "」？")) return;
                delete _sfxLib[id];
                // 选中的就是它 → 回退到默认（小黄鸭）
                if (_sfxSel === id) _sfxSel = "duck1";
                saveSfxConfig();
                refreshSelect();
                refreshLibList();
              });
              item.appendChild(nm);
              item.appendChild(playBtn);
              item.appendChild(delBtn);
              libBox.appendChild(item);
            }
          }
          refreshLibList();

          // 音效总开关关掉时，视觉上把音效区变灰（提示用户为什么没声）
          const syncSfxEnabled = () => {
            const on = !!state.sound;
            for (const el of [sfxHead, libBox, impRow]) {
              el.style.opacity = on ? "1" : "0.45";
            }
          };
          syncSfxEnabled();
          listeners.add(syncSfxEnabled);   // listeners 是 Set，不是数组
          root.appendChild(row5);

          return () => {
            root.innerHTML = "";
          };
        }, []);
        return React.createElement("div", { ref: rootRef, className: "whk-settings" });
      }

      const slots = ctx.get("slots");
      if (slots === undefined) return;
      try {
        slots.inject("shell.overlay", () =>
          slots.register(
            { name: "shell.overlay", id: "whale-whack-game" },
            () => React.createElement(Game),
          ),
        );
      } catch (e) {
        console.error("[whale-whack] overlay inject failed", e);
      }
      try {
        slots.inject("conversation.composer.dock", () =>
          slots.register(
            { name: "conversation.composer.dock", id: "whale-whack-dock" },
            () => React.createElement(Dock),
          ),
        );
      } catch (e) {
        console.error("[whale-whack] dock inject failed", e);
      }
      try {
        slots.inject("settings.section", () =>
          slots.register(
            { name: "settings.section", id: "whale-whack", order: 26, label: "锤锤小肥鱼", inject: () => ({}) },
            () => React.createElement(Settings),
          ),
        );
      } catch (e) {
        console.error("[whale-whack] settings inject failed", e);
      }
    }

    exports.apply = apply;
    exports.inject = ["timer"];
    return module.exports;
  },
});
