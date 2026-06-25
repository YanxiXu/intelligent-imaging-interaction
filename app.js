const video = document.querySelector("#screen");
const app = document.querySelector("#app");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const hotspotsEl = document.querySelector("#choices");
const scanner = document.querySelector("#scanner");
const scannerLabel = document.querySelector("#scannerLabel");
const fragmentLayer = document.querySelector("#fragmentLayer");
const hintEl = document.querySelector("#interactionHint");
const chapterEl = document.querySelector("#chapter");
const titleEl = document.querySelector("#sceneTitle");
const lineEl = document.querySelector("#systemLine");
const painEl = document.querySelector("#painValue");
const speedEl = document.querySelector("#speedValue");
const gazeEl = document.querySelector("#gazeValue");
const reportTextEl = document.querySelector("#reportText");
const reportStatsEl = document.querySelector("#reportStats");

const media = {
  phone: "./media/01_phone_portal.mp4",
  tvRoom: "./media/02_tv_room.mp4",
  face: "./media/03_face_scan.mp4",
  stationPulse: "./media/04_station_pulse.mp4",
  studioWitness: "./media/05_studio_witness.mp4",
  studioVoid: "./media/06_studio_void.mp4",
  childhoodCorridor: "./media/07_childhood_corridor.mp4",
  escalator: "./media/08_escalator_memory.mp4",
  stationOrb: "./media/09_station_orb.mp4",
  silverVortex: "./media/10_silver_vortex.mp4",
  handContact: "./media/11_hand_contact.mp4",
  trainPlatform: "./media/12_train_platform.mp4",
  phoneVoid: "./media/13_phone_void.mp4",
  faceGrid: "./media/14_face_grid.mp4",
  taichiTrain: "./media/15_taichi_train.mp4",
  taichiMall: "./media/16_taichi_mall.mp4",
};

const memoryFragments = [
  "2001 / 屏幕成为家庭里的第二个窗口",
  "2003 / 身体第一次学会把疼痛延后",
  "2008 / 集体情绪同步，个人感受静音",
  "2012 / 消费空间开始替代童年街道",
  "2016 / 速度成为正确答案",
  "2020 / 屏幕成为新的公共空间",
  "2026 / 疼痛重新上线",
  "系统提示：无法确认这是否属于怀旧",
  "系统提示：该样本正在抵抗分类",
];

const scenes = {
  boot: {
    chapter: "01 / 启动",
    title: "屏幕开始记忆",
    video: media.phone,
    line: "系统检测到一部旧手机。它没有保存号码，只保存了第一次被世界加速刺痛的感觉。",
    scan: ["检测到：翻盖手机", "检测到：旧设备入口", "识别：时间孔洞"],
    choices: [
      {
        label: "触摸屏幕",
        note: "进入十岁以后的时间",
        next: "livingRoom",
        delta: { pain: 8, speed: 4, gaze: 2 },
        x: 56,
        y: 53,
        kind: "portal",
      },
    ],
    idleChoice: {
      next: "livingRoom",
      delta: { pain: 3, speed: 2, gaze: 10 },
      fragment: "未触摸屏幕：系统以观看者身份进入。",
    },
  },
  livingRoom: {
    chapter: "02 / 客厅",
    title: "电视正在等待",
    video: media.tvRoom,
    line: "客厅没有移动，电视里的世界却一直在刷新。你坐在那里，学习如何成为观众。",
    scan: ["检测到：家庭电视", "检测到：静止身体", "识别：早期观看训练"],
    autoNext: "faceScan",
    delta: { pain: 4, speed: 2, gaze: 8 },
  },
  faceScan: {
    chapter: "03 / 身体",
    title: "面部识别失败",
    video: media.face,
    line: "系统反复比对这张脸：女儿、学生、消费者、样本。没有一个词能解释她为什么开始会疼。",
    scan: ["检测到：面部样本", "检测到：疲惫凝视", "识别失败：无法归类此人"],
    choices: [
      {
        label: "确认疼痛",
        note: "让身体优先于时代叙事",
        next: "stationPulse",
        delta: { pain: 14, speed: 1, gaze: 5 },
        x: 48,
        y: 45,
        kind: "body",
      },
      {
        label: "继续观看",
        note: "把疼痛暂时交给屏幕",
        next: "studioWitness",
        delta: { pain: 5, speed: 3, gaze: 14 },
        x: 65,
        y: 50,
        kind: "gaze",
      },
    ],
    idleChoice: {
      next: "studioWitness",
      delta: { pain: 2, speed: 2, gaze: 14 },
      fragment: "未确认疼痛：系统将其归为可观看对象。",
    },
  },
  stationPulse: {
    chapter: "04 / 车站",
    title: "城市脉冲",
    video: media.stationPulse,
    line: "高铁站像一台巨大的心脏。每一次发车，都会把人的年龄向前推一点。",
    scan: ["检测到：交通枢纽", "检测到：人群压力", "识别：城市加速"],
    choices: [
      {
        label: "跟上人流",
        note: "接受速度作为新的秩序",
        next: "escalator",
        delta: { pain: 4, speed: 18, gaze: 5 },
        x: 26,
        y: 64,
        kind: "speed",
      },
      {
        label: "触摸异常",
        note: "靠近银色的错误入口",
        next: "stationOrb",
        delta: { pain: 10, speed: 8, gaze: 4 },
        x: 53,
        y: 52,
        kind: "portal",
      },
    ],
    idleChoice: {
      next: "escalator",
      delta: { pain: 2, speed: 16, gaze: 4 },
      fragment: "未选择方向：人流替你完成移动。",
    },
  },
  studioWitness: {
    chapter: "04 / 节目",
    title: "集体观看",
    video: media.studioWitness,
    line: "人群排成整齐的两侧，像在等待一个被时代认证的答案。",
    scan: ["检测到：集体观看", "检测到：舞台中心", "识别：被观看样本"],
    autoNext: "studioVoid",
    delta: { pain: 2, speed: 5, gaze: 15 },
  },
  studioVoid: {
    chapter: "05 / 舞台",
    title: "节目中央的洞",
    video: media.studioVoid,
    line: "舞台把一个黑洞包装成奖品。你越靠近，它越像一份不会结束的问卷。",
    scan: ["检测到：节目黑洞", "检测到：归档入口", "识别：问卷化人生"],
    choices: [
      {
        label: "进入黑洞",
        note: "让系统继续归档你",
        next: "childhoodCorridor",
        delta: { pain: 8, speed: 4, gaze: 16 },
        x: 52,
        y: 50,
        kind: "portal",
      },
      {
        label: "离开舞台",
        note: "回到公共交通的速度里",
        next: "trainPlatform",
        delta: { pain: 6, speed: 14, gaze: 4 },
        x: 79,
        y: 61,
        kind: "speed",
      },
    ],
    idleChoice: {
      next: "childhoodCorridor",
      delta: { pain: 5, speed: 2, gaze: 18 },
      fragment: "未离开舞台：系统继续采集观看姿态。",
    },
  },
  childhoodCorridor: {
    chapter: "06 / 童年",
    title: "走廊尽头",
    video: media.childhoodCorridor,
    line: "系统找到一个小孩。她背对镜头，被所有长大的版本同时注视。",
    scan: ["检测到：童年背影", "检测到：走廊尽头", "识别：延迟疼痛"],
    autoNext: "phoneVoid",
    delta: { pain: 13, speed: 2, gaze: 9 },
  },
  escalator: {
    chapter: "06 / 扶梯",
    title: "向上移动",
    video: media.escalator,
    line: "扶梯让身体保持静止，却把你送往另一个被命名的未来。",
    scan: ["检测到：扶梯", "检测到：被动上升", "识别：自动化速度"],
    autoNext: "trainPlatform",
    delta: { pain: 3, speed: 16, gaze: 4 },
  },
  stationOrb: {
    chapter: "06 / 异常",
    title: "银色入口",
    video: media.stationOrb,
    line: "城市中心出现一个无法解释的球体。它反射人群，也吞掉人群。",
    scan: ["检测到：银色球体", "检测到：异常反射", "识别：城市错误"],
    autoNext: "silverVortex",
    delta: { pain: 8, speed: 5, gaze: 8 },
  },
  silverVortex: {
    chapter: "07 / 坠入",
    title: "速度的内部",
    video: media.silverVortex,
    line: "你并不是被吸进去的。你只是终于看清，自己已经在里面生活了很多年。",
    scan: ["检测到：速度内部", "检测到：银色漩涡", "识别：无出口循环"],
    autoNext: "handContact",
    delta: { pain: 12, speed: 10, gaze: 6 },
  },
  handContact: {
    chapter: "08 / 接触",
    title: "隔着透明材料",
    video: media.handContact,
    line: "两只手互相寻找。中间隔着一层看不见的年代差。",
    scan: ["检测到：手部接触", "检测到：透明隔膜", "识别：触觉延迟"],
    choices: [
      {
        label: "按住这层膜",
        note: "让疼痛留下形状",
        next: "faceGrid",
        delta: { pain: 15, speed: 3, gaze: 7 },
        x: 48,
        y: 58,
        kind: "body",
      },
      {
        label: "松开",
        note: "让车站继续运行",
        next: "trainPlatform",
        delta: { pain: 4, speed: 12, gaze: 3 },
        x: 70,
        y: 61,
        kind: "speed",
      },
    ],
    idleChoice: {
      next: "trainPlatform",
      delta: { pain: 3, speed: 12, gaze: 4 },
      fragment: "未完成触摸：系统恢复默认交通流。",
    },
  },
  trainPlatform: {
    chapter: "09 / 站台",
    title: "列车经过",
    video: media.trainPlatform,
    line: "列车经过时，所有人都像影子。只有站在原地的人暴露了自己的重量。",
    scan: ["检测到：列车经过", "检测到：原地停留", "识别：速度压迫"],
    autoNext: "phoneVoid",
    delta: { pain: 4, speed: 18, gaze: 4 },
  },
  phoneVoid: {
    chapter: "10 / 设备",
    title: "手机里的洞",
    video: media.phoneVoid,
    line: "入口变小了，速度却更深。系统开始把你的记忆转换成可查询的数据。",
    scan: ["检测到：手机黑洞", "检测到：掌中入口", "识别：便携归档"],
    choices: [
      {
        label: "允许归档",
        note: "进入人脸矩阵",
        next: "faceGrid",
        delta: { pain: 3, speed: 5, gaze: 18 },
        x: 52,
        y: 51,
        kind: "gaze",
      },
      {
        label: "关闭设备",
        note: "用身体中断系统",
        next: "taichiTrain",
        delta: { pain: 12, speed: 2, gaze: 4 },
        x: 36,
        y: 69,
        kind: "body",
      },
    ],
    idleChoice: {
      next: "faceGrid",
      delta: { pain: 2, speed: 4, gaze: 18 },
      fragment: "未关闭设备：系统默认允许归档。",
    },
  },
  faceGrid: {
    chapter: "11 / 档案",
    title: "样本集合",
    video: media.faceGrid,
    line: "医生、工人、学生、白领。系统没有找到你，只找到了可以被分类的人。",
    scan: ["检测到：职业脸谱", "检测到：多重身份", "识别失败：本人缺席"],
    autoNext: "taichiTrain",
    delta: { pain: 8, speed: 4, gaze: 18 },
  },
  taichiTrain: {
    chapter: "12 / 回返",
    title: "慢动作抵抗",
    video: media.taichiTrain,
    line: "当人群以最快的方式经过，身体选择一种最慢的算法。",
    scan: ["检测到：太极动作", "检测到：慢速抵抗", "识别：反算法身体"],
    autoNext: "taichiMall",
    delta: { pain: 6, speed: -8, gaze: 5 },
  },
  taichiMall: {
    chapter: "13 / 重新会疼",
    title: "身体重新取得时间",
    video: media.taichiMall,
    line: "疼痛不是故障。疼痛是身体终于拒绝只作为时代发展的背景。",
    scan: ["检测到：集体慢动作", "检测到：身体回返", "识别：疼痛恢复"],
    choices: [
      {
        label: "生成报告",
        note: "保存本次路径",
        next: "report",
        delta: { pain: 10, speed: -6, gaze: 4 },
        x: 50,
        y: 57,
        kind: "body",
      },
    ],
    idleChoice: {
      next: "report",
      delta: { pain: 7, speed: -8, gaze: 2 },
      fragment: "未生成报告：系统以沉默作为最终输入。",
    },
  },
};

const state = {
  pain: 0,
  speed: 0,
  gaze: 0,
  path: [],
  scene: null,
  autoTimer: null,
  idleTimer: null,
  fragmentTimer: null,
  lastScanAt: 0,
};

function clamp(value) {
  return Math.max(0, Math.min(99, value));
}

function applyDelta(delta = {}) {
  state.pain = clamp(state.pain + (delta.pain || 0));
  state.speed = clamp(state.speed + (delta.speed || 0));
  state.gaze = clamp(state.gaze + (delta.gaze || 0));
  updateMeters();
}

function dominantSignal() {
  if (state.pain >= state.speed && state.pain >= state.gaze) return "pain";
  if (state.speed >= state.pain && state.speed >= state.gaze) return "speed";
  return "gaze";
}

function updateMeters() {
  painEl.textContent = String(state.pain).padStart(2, "0");
  speedEl.textContent = String(state.speed).padStart(2, "0");
  gazeEl.textContent = String(state.gaze).padStart(2, "0");
  app.dataset.dominant = dominantSignal();
}

function clearTimers() {
  [state.autoTimer, state.idleTimer, state.fragmentTimer].forEach((timer) => {
    if (timer) window.clearTimeout(timer);
  });
  state.autoTimer = null;
  state.idleTimer = null;
  state.fragmentTimer = null;
}

function clearHotspots() {
  hotspotsEl.classList.remove("is-visible");
  hotspotsEl.replaceChildren();
  hintEl.textContent = "";
  app.dataset.hotspots = "hidden";
}

function choose(choice, source = "touch") {
  applyDelta(choice.delta);
  emitFragment(
    source === "idle"
      ? choice.fragment || "无操作输入：系统继续默认归档。"
      : `触摸记录：${choice.label}`,
  );

  if (choice.next === "report") {
    showReport();
  } else {
    playScene(choice.next);
  }
}

function showHotspots(scene) {
  clearHotspots();
  if (!scene.choices?.length) return;

  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = `hotspot hotspot-${choice.kind || "portal"}`;
    button.type = "button";
    button.style.left = `${choice.x}%`;
    button.style.top = `${choice.y}%`;
    button.setAttribute("aria-label", `${choice.label}。${choice.note}`);

    const pulse = document.createElement("span");
    pulse.className = "hotspot-pulse";
    const label = document.createElement("span");
    label.className = "hotspot-label";
    label.textContent = choice.label;
    const note = document.createElement("small");
    note.textContent = choice.note;

    button.append(pulse, label, note);
    button.addEventListener("mouseenter", () => {
      setScannerText(`可触摸：${choice.label}`);
    });
    button.addEventListener("click", () => choose(choice));
    hotspotsEl.append(button);
  });

  hotspotsEl.classList.add("is-visible");
  app.dataset.hotspots = "visible";
  hintEl.textContent = "移动鼠标扫描画面。触摸发光区域，或停留不动让系统自动归档。";

  if (scene.idleChoice) {
    state.idleTimer = window.setTimeout(() => {
      choose(scene.idleChoice, "idle");
    }, 9800);
  }
}

function scheduleInteraction(scene) {
  clearTimers();
  if (scene.choices?.length) {
    const delay = Math.max(1800, Math.min(5600, (video.duration || 5) * 420));
    state.autoTimer = window.setTimeout(() => showHotspots(scene), delay);
  }
  scheduleFragment(scene);
}

function scheduleFragment(scene) {
  const delay = 2200 + Math.random() * 2600;
  state.fragmentTimer = window.setTimeout(() => {
    const pool = scene.scan?.length ? scene.scan : memoryFragments;
    const text = Math.random() > 0.5 ? pick(pool) : pick(memoryFragments);
    emitFragment(text);
    if (app.dataset.state === "playing") scheduleFragment(scene);
  }, delay);
}

async function playScene(id) {
  const scene = scenes[id];
  if (!scene) return;

  clearTimers();
  clearHotspots();
  state.scene = id;
  state.path.push(id);
  app.dataset.state = "playing";

  chapterEl.textContent = scene.chapter;
  titleEl.textContent = scene.title;
  lineEl.textContent = scene.line;
  setScannerText(scene.scan?.[0] || "系统扫描中");

  video.loop = false;
  video.muted = false;
  video.src = scene.video;
  video.load();

  try {
    await video.play();
  } catch {
    video.muted = true;
    await video.play();
  }

  applyDelta(scene.delta);
  scheduleInteraction(scene);
}

function onVideoEnd() {
  const scene = scenes[state.scene];
  if (!scene) return;

  if (scene.autoNext) {
    playScene(scene.autoNext);
    return;
  }

  if (scene.choices?.length) {
    showHotspots(scene);
    video.loop = true;
    video.play().catch(() => {});
  }
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function setScannerText(text) {
  scannerLabel.textContent = text;
}

function updateScanner(event) {
  if (app.dataset.state === "idle") return;

  const rect = app.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  scanner.style.setProperty("--scan-x", `${x}px`);
  scanner.style.setProperty("--scan-y", `${y}px`);
  scanner.classList.add("is-active");

  const now = Date.now();
  if (now - state.lastScanAt > 620) {
    const scene = scenes[state.scene];
    if (scene?.scan?.length) setScannerText(pick(scene.scan));
    state.lastScanAt = now;
  }
}

function emitFragment(text) {
  if (!text) return;

  const item = document.createElement("div");
  item.className = "memory-fragment";
  item.textContent = text;
  item.style.left = `${12 + Math.random() * 62}%`;
  item.style.top = `${18 + Math.random() * 54}%`;
  fragmentLayer.append(item);

  window.setTimeout(() => item.remove(), 4200);
}

function reportProfile() {
  const dominant = dominantSignal();
  const clicked = state.path.length;

  if (dominant === "pain") {
    return {
      type: "身体型路径",
      symptom: "延迟疼痛",
      misread: "系统误判为：可被消费空间安置的安静样本",
      final:
        "你不是没有受伤，只是世界发展得太快，疼痛来晚了二十年。",
      summary:
        "这次路径显示：你把注意力交还给身体。腕环、手、脸和慢动作不断打断城市的速度叙事。",
      clicked,
    };
  }

  if (dominant === "speed") {
    return {
      type: "速度型路径",
      symptom: "加速顺从",
      misread: "系统误判为：稳定移动的乘客",
      final: "你一直在向前，但身体把原地站立保存成了一种反抗。",
      summary:
        "这次路径显示：列车、扶梯和人流替你完成了很多选择。太极不是结尾装饰，而是身体夺回时间的方式。",
      clicked,
    };
  }

  return {
    type: "凝视型路径",
    symptom: "被观看疲劳",
    misread: "系统误判为：可分类、可展示、可归档的人脸",
    final: "你被识别了很多次，但没有一次等同于被理解。",
    summary:
      "这次路径显示：电视、演播厅、人脸矩阵和人群让你持续成为样本。真正的出口来自拒绝继续被观看。",
    clicked,
  };
}

function showReport() {
  clearTimers();
  clearHotspots();
  app.dataset.state = "report";
  chapterEl.textContent = "14 / 报告";
  titleEl.textContent = "路径已生成";
  lineEl.textContent = "";

  const report = reportProfile();
  reportTextEl.replaceChildren(
    createReportLine("主要路径", report.type),
    createReportLine("时代症状", report.symptom),
    createReportLine("系统误判", report.misread),
    createReportLine("最终判断", report.final),
    createReportLine("路径说明", report.summary),
  );

  reportStatsEl.replaceChildren(
    createStat("疼痛值", state.pain),
    createStat("速度值", state.speed),
    createStat("被观看值", state.gaze),
  );

  video.loop = true;
  video.src = media.taichiMall;
  video.load();
  video.play().catch(() => {});
}

function createReportLine(label, value) {
  const row = document.createElement("p");
  const key = document.createElement("span");
  key.textContent = label;
  const text = document.createElement("b");
  text.textContent = value;
  row.append(key, text);
  return row;
}

function createStat(label, value) {
  const item = document.createElement("div");
  item.className = "report-stat";
  const text = document.createElement("span");
  text.textContent = label;
  const number = document.createElement("b");
  number.textContent = String(value).padStart(2, "0");
  item.append(text, number);
  return item;
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await app.requestFullscreen?.();
  } else {
    await document.exitFullscreen?.();
  }
}

function updateFullscreenButton() {
  fullscreenButton.textContent = document.fullscreenElement ? "退出全屏" : "全屏";
  fullscreenButton.setAttribute(
    "aria-label",
    document.fullscreenElement ? "退出全屏" : "进入全屏",
  );
}

function resetExperience() {
  clearTimers();
  clearHotspots();
  state.pain = 0;
  state.speed = 0;
  state.gaze = 0;
  state.path = [];
  state.scene = null;
  updateMeters();
  app.dataset.state = "idle";
  app.dataset.hotspots = "hidden";
  chapterEl.textContent = "00 / 待机";
  titleEl.textContent = "记忆未启动";
  lineEl.textContent = "";
  setScannerText("等待输入");
  fragmentLayer.replaceChildren();
  video.loop = true;
  video.muted = true;
  video.src = media.phone;
  video.load();
  video.play().catch(() => {});
}

video.addEventListener("ended", onVideoEnd);
app.addEventListener("mousemove", updateScanner);
startButton.addEventListener("click", () => playScene("boot"));
restartButton.addEventListener("click", resetExperience);
fullscreenButton.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "f") toggleFullscreen();
});

resetExperience();
