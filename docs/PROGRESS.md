---
name: Progress
description: 讀這份文件以追蹤各城市餐廳研究進度與最新狀態。
---

# 研究進度追蹤（PROGRESS）

本文件是餐廳研究進度的單一真實來源。每次完成研究或調整候選清單後，必須更新本文件。

## 狀態定義
- `⏳ Not Started`：尚未開始城市研究。
- `🔄 In Progress`：已開始蒐集或驗證資料，但未完成主力/備選清單。
- `📝 Needs Review`：候選與來源已整理，等待最終檢查。
- `✅ Completed`：已完成該城市本階段研究，且資料已同步到 JSON。

## 城市進度（依行程順序）

| 城市 | 期間 | 狀態 | 最後更新 | 備註 |
| --- | --- | --- | --- | --- |
| Avignon | 2026-05-30 ~ 2026-06-02 | 📝 Needs Review | 2026-03-21 | 已補齊飯店附近美食：Brunch Coffee（咖啡/早餐/外帶）、Café Tulipe（精品咖啡）、Pavillon 84（晚餐）、Pollen（Michelin 晚餐）。搜尋方法：先確認 12 Bd Saint Dominique → Allée de l'Oulle 街道 → 舊城區範圍。 |
| Nice | 2026-06-02 ~ 2026-06-05 | 📝 Needs Review | 2026-03-21 | 已補齊飯店附近美食：La Bélugue / Verdant Café（早餐）、La Gauloise / Aux Deux Chefs（晚餐）、Boulangerie Jeannot（外帶）。搜尋方法：先確認 41 Rue Lamartine → Av. Malaussena 街道 → Libération 區域。 |
| Mont Saint-Michel | 2026-06-05 ~ 2026-06-06 | 📝 Needs Review | 2026-03-21 | 新增 La Ferme Saint-Michel（飯店同路段晚餐，諾曼第 agneau de pré-salé）。已建立 mont-saint-michel.json，整合現有候選。 |
| Paris | 2026-06-06 ~ 2026-06-10 | 📝 Needs Review | 2026-03-21 | 已補齊飯店附近美食：Maison Pichard（早餐/外帶）、Brasserie Wallace（晚餐）、Melt Cambronne（外帶）、La Véraison / Neige d'Été（晚餐）。搜尋方法：先確認 2 Rue Cambronne → 街道本身 → 15ème 區域。 |

## 更新紀錄
- 2026-03-21: 建立初始進度文件並初始化四城市狀態為 `In Progress`。
- 2026-03-21: 補強 Nice（+3 候選：Le Bistrot d'Antoine、Lou Pilha Leva、La Rossettisserie）與 Paris（+5 候選：Le Comptoir du Relais、Frenchie、Jacques Genin、Café des Musées、Breizh Café）；兩城市升級為 `Needs Review`。
- 2026-03-21: 依正確搜尋方法（先確認飯店地址 → 搜尋街道附近 → 擴大至區域）補齊四城市飯店附近美食候選（咖啡/早餐、晚餐、外帶）：
  - Avignon：Brunch Coffee、Café Tulipe、Pavillon 84、Pollen（共 4 筆新增）
  - Nice：La Bélugue、Verdant Café、La Gauloise、Aux Deux Chefs、Chez Davia、Boulangerie Jeannot、HOBO Coffee（共 7 筆新增）
  - Mont Saint-Michel：La Ferme Saint-Michel（1 筆新增）；建立 data/cities/mont-saint-michel.json
  - Paris：Maison Pichard、Brasserie Wallace、Melt Cambronne、La Véraison、Neige d'Été（共 5 筆新增）
  - 新增欄位 hotel_nearby 與 meal_tags 至所有新建條目
