---
name: Structure
description: 讀這份文件以快速理解文件與程式結構。
---

# 專案資料夾結構（標準）

本專案採「靜態網站 + JSON 資料 + 文件規格」三層結構。建議結構如下：

```text
2026-france/
├─ index.html
├─ assets/
│  ├─ app.js
│  └─ style.css
├─ data/
│  ├─ restaurants.json
│  ├─ city-overview.json
│  └─ cities/
│     ├─ avignon.json
│     ├─ nice.json
│     ├─ mont-saint-michel.json
│     └─ paris.json
├─ docs/
│  ├─ DESIGN_STATIC_MAP.md
│  ├─ OBJECTIVES.md
│  ├─ STRUCTURE.md
│  ├─ WORKFLOW.md
│  ├─ PREFERENCES.md
│  ├─ ITINERARY.md
│  └─ references/
└─ README.md
```

## 各層責任
- `index.html`, `assets/`：分頁 UI（`overview` / `map`）與互動邏輯。
- `data/restaurants.json`：地圖主資料來源（整合後輸入）。
- `data/city-overview.json`：城市層級美食總覽資料來源。
- `data/cities/*.json`：各城市原始或分段資料，方便分工與維護。
- `docs/`：需求、流程、偏好、行程與規則，不存放執行邏輯。

## 命名規則
- 城市檔名使用小寫 kebab-case，例如 `mont-saint-michel.json`。
- `id` 必須唯一且穩定，建議格式：`<city>-<slug>`，例如 `paris-septime`。
- 文件檔名延續全大寫主題命名（既有規範），新文件優先放在 `docs/`。

## 單一真實來源
- 功能與資料契約：`docs/DESIGN_STATIC_MAP.md`
- 流程與維護步驟：`docs/WORKFLOW.md`
- 行程與城市優先順序：`docs/ITINERARY.md`
