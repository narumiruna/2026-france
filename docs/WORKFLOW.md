---
name: Workflow
description: 讀這份文件以快速理解專案工作流程。
---

# 工作流程（完整版）

本文件定義「研究到上線」的標準流程。功能與資料契約以 [DESIGN_STATIC_MAP.md](./DESIGN_STATIC_MAP.md) 為準；城市優先順序以 [ITINERARY.md](./ITINERARY.md) 為準。

## 1. 流程總覽（六階段）
1. 初始化：確認本次研究城市、日期、輸出目標。  
2. 候選蒐集：建立候選店家清單。  
3. 證據蒐集：為每家店補齊多來源證據。  
4. 評分與分級：依規則決定保留、觀察或排除。  
5. 資料發布：更新 `data/restaurants.json` 並驗證地圖顯示。  
6. 旅前/旅中維護：持續修正營業資訊與備選名單。  

## 2. 候選蒐集規則
- 主要來源：Le Fooding、Google Maps、Michelin Guide、Gault Millau。  
- 每筆候選至少先有：`name`, `category`, `address`, `google_maps_url`。  
- 候選狀態僅可使用：`inbox`, `researching`, `ready`, `rejected`。  
- 不可直接刪除候選；若不採用，改為 `rejected` 並記錄原因。  

## 3. 證據蒐集規則
- 每家店至少 4 個獨立來源後才可進入評分。  
- 至少包含：Google Maps + 至少 1 個指南型來源（Michelin/Le Fooding/Gault Millau）+ 其他來源。  
- 必填欄位：`source_urls`, `opening_hours`, `price_level`, `notes`。  
- 資訊衝突時，不可猜測；必須在 `notes` 明確標記衝突點。  

## 4. 評分與入庫規則
- `score` 使用 0–50。  
- 分級標準：
  - `40-50`：高優先（旅程主力）  
  - `30-39`：備選  
  - `<30`：`rejected`（需記錄原因）  
- 只有 `ready` 與高品質 `researching` 店家可寫入 `data/restaurants.json`。  

## 5. 發布前檢查
- JSON 欄位需符合設計文件契約。  
- `lat/lng` 必須可解析為數值。  
- 地圖驗證三項必過：
  - 允許定位可更新附近 2 公里店家。
  - 拒絕定位可回退巴黎預設點。
  - Popup 可顯示完整資訊。  

## 6. 維護節奏
- 旅前（每週）：更新熱門店家訂位難度、臨時公休、季節性菜單。  
- 旅中（每日）：根據當地狀況更新 `notes` 與優先順序。  
- 行程異動時，先更新 `ITINERARY.md`，再調整研究優先城市。  
