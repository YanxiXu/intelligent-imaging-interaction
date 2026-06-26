import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { media, memoryFragments, scenes } from "./storyConfig.js";

const initialMeters = { pain: 0, speed: 0, gaze: 0 };

function clamp(value) {
  return Math.max(0, Math.min(99, value));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function dominantSignal(meters) {
  if (meters.pain >= meters.speed && meters.pain >= meters.gaze) return "pain";
  if (meters.speed >= meters.pain && meters.speed >= meters.gaze) return "speed";
  return "gaze";
}

function applyDelta(meters, delta = {}) {
  return {
    pain: clamp(meters.pain + (delta.pain || 0)),
    speed: clamp(meters.speed + (delta.speed || 0)),
    gaze: clamp(meters.gaze + (delta.gaze || 0)),
  };
}

function reportProfile(meters, path) {
  const dominant = dominantSignal(meters);
  const clicked = path.length;

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

function App() {
  const appRef = useRef(null);
  const videoRef = useRef(null);
  const timersRef = useRef({ auto: null, idle: null, fragment: null });
  const lastScanAt = useRef(0);

  const [mode, setMode] = useState("idle");
  const [sceneId, setSceneId] = useState(null);
  const [meters, setMeters] = useState(initialMeters);
  const [path, setPath] = useState([]);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
  const [scanner, setScanner] = useState({
    active: false,
    x: "50%",
    y: "50%",
    label: "等待输入",
  });
  const [fragments, setFragments] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scene = sceneId ? scenes[sceneId] : null;
  const activeVideo = mode === "report" ? media.taichiMall : scene?.video || media.phone;
  const dominant = dominantSignal(meters);
  const report = useMemo(() => reportProfile(meters, path), [meters, path]);

  const clearTimers = useCallback(() => {
    Object.values(timersRef.current).forEach((timer) => {
      if (timer) window.clearTimeout(timer);
    });
    timersRef.current = { auto: null, idle: null, fragment: null };
  }, []);

  const emitFragment = useCallback((text) => {
    if (!text) return;
    const id = crypto.randomUUID();
    setFragments((items) => [
      ...items,
      {
        id,
        text,
        left: `${12 + Math.random() * 62}%`,
        top: `${18 + Math.random() * 54}%`,
      },
    ]);
    window.setTimeout(() => {
      setFragments((items) => items.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const clearHotspots = useCallback(() => {
    setHotspotsVisible(false);
  }, []);

  const playScene = useCallback(
    async (nextSceneId) => {
      const nextScene = scenes[nextSceneId];
      if (!nextScene) return;

      clearTimers();
      clearHotspots();
      setMode("playing");
      setSceneId(nextSceneId);
      setPath((items) => [...items, nextSceneId]);
      setScanner((current) => ({
        ...current,
        label: nextScene.scan?.[0] || "系统扫描中",
      }));

      setMeters((current) => applyDelta(current, nextScene.delta));
    },
    [clearHotspots, clearTimers],
  );

  const showReport = useCallback(() => {
    clearTimers();
    clearHotspots();
    setMode("report");
    setSceneId(null);
  }, [clearHotspots, clearTimers]);

  const choose = useCallback(
    (choice, source = "touch") => {
      clearTimers();
      clearHotspots();
      setMeters((current) => applyDelta(current, choice.delta));
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
    },
    [clearHotspots, clearTimers, emitFragment, playScene, showReport],
  );

  const showHotspots = useCallback(
    (targetScene) => {
      if (!targetScene?.choices?.length) return;
      setHotspotsVisible(true);

      if (targetScene.idleChoice) {
        timersRef.current.idle = window.setTimeout(() => {
          choose(targetScene.idleChoice, "idle");
        }, 9800);
      }
    },
    [choose],
  );

  const scheduleFragment = useCallback(
    (targetScene) => {
      timersRef.current.fragment = window.setTimeout(() => {
        const pool = targetScene.scan?.length ? targetScene.scan : memoryFragments;
        emitFragment(Math.random() > 0.5 ? pick(pool) : pick(memoryFragments));
        if (mode === "playing") scheduleFragment(targetScene);
      }, 2200 + Math.random() * 2600);
    },
    [emitFragment, mode],
  );

  useEffect(() => {
    if (mode !== "playing" || !scene) return;

    clearTimers();
    if (scene.choices?.length) {
      const delay = Math.max(1800, Math.min(5600, (videoRef.current?.duration || 5) * 420));
      timersRef.current.auto = window.setTimeout(() => showHotspots(scene), delay);
    }
    scheduleFragment(scene);

    return clearTimers;
  }, [clearTimers, mode, scene, showHotspots, scheduleFragment]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = mode === "idle" || mode === "report";
    video.muted = mode === "idle";
    video.load();
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [activeVideo, mode]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const handleKeydown = (event) => {
      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const handleVideoEnd = () => {
    if (!scene) return;

    if (scene.autoNext) {
      playScene(scene.autoNext);
      return;
    }

    if (scene.choices?.length) {
      showHotspots(scene);
      const video = videoRef.current;
      if (video) {
        video.loop = true;
        video.play().catch(() => {});
      }
    }
  };

  const handleMouseMove = (event) => {
    if (mode === "idle" || !appRef.current) return;

    const rect = appRef.current.getBoundingClientRect();
    const now = Date.now();
    const nextScanner = {
      active: true,
      x: `${event.clientX - rect.left}px`,
      y: `${event.clientY - rect.top}px`,
      label: scanner.label,
    };

    if (now - lastScanAt.current > 620 && scene?.scan?.length) {
      nextScanner.label = pick(scene.scan);
      lastScanAt.current = now;
    }

    setScanner(nextScanner);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await appRef.current?.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  const resetExperience = () => {
    clearTimers();
    clearHotspots();
    setMode("idle");
    setSceneId(null);
    setMeters(initialMeters);
    setPath([]);
    setFragments([]);
    setScanner({ active: false, x: "50%", y: "50%", label: "等待输入" });
  };

  return (
    <main
      ref={appRef}
      className="experience"
      data-state={mode}
      data-dominant={dominant}
      data-hotspots={hotspotsVisible ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        className="screen"
        playsInline
        preload="auto"
        muted={mode === "idle"}
        onEnded={handleVideoEnd}
      >
        <source src={activeVideo} type="video/mp4" />
      </video>

      <div className="grain" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <FragmentLayer fragments={fragments} />
      <Scanner scanner={scanner} />

      <StartPanel onStart={() => playScene("boot")} />
      <Hud
        mode={mode}
        scene={scene}
        meters={meters}
        isFullscreen={isFullscreen}
        onFullscreen={toggleFullscreen}
      />
      <Caption mode={mode} scene={scene} />
      <Hotspots
        visible={hotspotsVisible}
        scene={scene}
        onChoose={choose}
        onHover={(label) =>
          setScanner((current) => ({ ...current, label: `可触摸：${label}` }))
        }
      />
      <InteractionHint visible={mode === "playing" && hotspotsVisible} />
      <ReportPanel mode={mode} report={report} meters={meters} onRestart={resetExperience} />
    </main>
  );
}

function StartPanel({ onStart }) {
  return (
    <section className="start-panel" aria-label="作品入口">
      <p className="kicker">AI MEMORY SYSTEM / 2000-2026</p>
      <h1>一个重新会疼的世界</h1>
      <p className="start-copy">
        你十岁以后，世界开始加速。系统将尝试从身体、车站、屏幕和人群中恢复一份记忆。
      </p>
      <button className="primary-action" type="button" onClick={onStart}>
        进入
      </button>
    </section>
  );
}

function Hud({ mode, scene, meters, isFullscreen, onFullscreen }) {
  return (
    <section className="hud" aria-label="系统状态">
      <div className="identity">
        <span>{mode === "report" ? "14 / 报告" : scene?.chapter || "00 / 待机"}</span>
        <strong>{mode === "report" ? "路径已生成" : scene?.title || "记忆未启动"}</strong>
      </div>
      <div className="hud-actions">
        <div className="meters" aria-label="记忆变量">
          <Meter label="疼痛" value={meters.pain} />
          <Meter label="速度" value={meters.speed} />
          <Meter label="凝视" value={meters.gaze} />
        </div>
        <button className="icon-action" type="button" onClick={onFullscreen}>
          {isFullscreen ? "退出全屏" : "全屏"}
        </button>
      </div>
    </section>
  );
}

function Meter({ label, value }) {
  return (
    <div className="meter">
      <span>{label}</span>
      <b>{pad(value)}</b>
    </div>
  );
}

function Caption({ mode, scene }) {
  return (
    <section className="caption-panel" aria-live="polite">
      <p>{mode === "playing" ? scene?.line : ""}</p>
    </section>
  );
}

function Hotspots({ visible, scene, onChoose, onHover }) {
  return (
    <section className={`hotspots ${visible ? "is-visible" : ""}`} aria-label="可触摸区域">
      {visible &&
        scene?.choices?.map((choice) => (
          <button
            key={`${choice.label}-${choice.next}`}
            className={`hotspot hotspot-${choice.kind || "portal"}`}
            type="button"
            style={{ left: `${choice.x}%`, top: `${choice.y}%` }}
            aria-label={`${choice.label}。${choice.note}`}
            onMouseEnter={() => onHover(choice.label)}
            onClick={() => onChoose(choice)}
          >
            <span className="hotspot-pulse" />
            <span className="hotspot-label">{choice.label}</span>
            <small>{choice.note}</small>
          </button>
        ))}
    </section>
  );
}

function Scanner({ scanner }) {
  return (
    <div
      className={`scanner ${scanner.active ? "is-active" : ""}`}
      style={{ "--scan-x": scanner.x, "--scan-y": scanner.y }}
      aria-hidden="true"
    >
      <span>{scanner.label}</span>
    </div>
  );
}

function FragmentLayer({ fragments }) {
  return (
    <div className="fragment-layer" aria-hidden="true">
      {fragments.map((fragment) => (
        <div
          key={fragment.id}
          className="memory-fragment"
          style={{ left: fragment.left, top: fragment.top }}
        >
          {fragment.text}
        </div>
      ))}
    </div>
  );
}

function InteractionHint({ visible }) {
  return (
    <p className="interaction-hint" aria-live="polite">
      {visible ? "移动鼠标扫描画面。触摸发光区域，或停留不动让系统自动归档。" : ""}
    </p>
  );
}

function ReportPanel({ mode, report, meters, onRestart }) {
  return (
    <section className="report-panel" aria-label="生成报告">
      <p className="kicker">GENERATED REPORT</p>
      <h2>身体记忆报告</h2>
      <div className="report-text">
        <ReportLine label="主要路径" value={report.type} />
        <ReportLine label="时代症状" value={report.symptom} />
        <ReportLine label="系统误判" value={report.misread} />
        <ReportLine label="最终判断" value={report.final} />
        <ReportLine label="路径说明" value={report.summary} />
      </div>
      <div className="report-stats">
        <ReportStat label="疼痛值" value={meters.pain} />
        <ReportStat label="速度值" value={meters.speed} />
        <ReportStat label="被观看值" value={meters.gaze} />
      </div>
      <button className="secondary-action" type="button" onClick={onRestart}>
        重新进入
      </button>
    </section>
  );
}

function ReportLine({ label, value }) {
  return (
    <p>
      <span>{label}</span>
      <b>{value}</b>
    </p>
  );
}

function ReportStat({ label, value }) {
  return (
    <div className="report-stat">
      <span>{label}</span>
      <b>{pad(value)}</b>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
