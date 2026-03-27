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

| 城市 | 期間 | 狀態 | 已研究間數 | 首選 | 已排除 | 最後更新 | 備註 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Avignon | 2026-05-30 ~ 2026-06-02 | 📝 Needs Review | 11 | 7 | 0 | 2026-03-21 | 已補齊飯店附近美食：Brunch Coffee（咖啡/早餐/外帶）、Café Tulipe（精品咖啡）、Pavillon 84（晚餐）、Pollen（Michelin 晚餐）。新增 Acte 2（Michelin/Gault&Millau 精緻晚餐）。搜尋方法：先確認 12 Bd Saint Dominique → Allée de l'Oulle 街道 → 舊城區範圍。 |
| Nice | 2026-06-02 ~ 2026-06-05 | 📝 Needs Review | 15 | 9 | 0 | 2026-03-21 | 已補齊飯店附近美食：La Bélugue / Verdant Café（早餐）、La Gauloise / Aux Deux Chefs（晚餐）、Boulangerie Jeannot（外帶）。新增 HUG Café（精品咖啡/早餐）。搜尋方法：先確認 41 Rue Lamartine → Av. Malaussena 街道 → Libération 區域。 |
| Mont Saint-Michel | 2026-06-05 ~ 2026-06-06 | 📝 Needs Review | 6 | 2 | 0 | 2026-03-21 | 新增 La Ferme Saint-Michel（飯店同路段晚餐，諾曼第 agneau de pré-salé）、Le Relais du Roy（同路段備選晚餐，灣景）。已建立 mont-saint-michel.json，整合現有候選。 |
| Paris | 2026-06-06 ~ 2026-06-10 | 📝 Needs Review | 26 | 16 | 0 | 2026-03-27 | 新增 5 間：Biscotte、L'Accolade（15ème 飯店周邊）、Clamato、Le Chardenoux（11ème）、Les Petits Parisiens（14ème）。搜尋方法：先補 15ème 飯店周邊，再擴至 11ème/14ème。 |

## 更新紀錄
- 2026-03-21: 建立初始進度文件並初始化四城市狀態為 `In Progress`。
- 2026-03-21: 補強 Nice（+3 候選：Le Bistrot d'Antoine、Lou Pilha Leva、La Rossettisserie）與 Paris（+5 候選：Le Comptoir du Relais、Frenchie、Jacques Genin、Café des Musées、Breizh Café）；兩城市升級為 `Needs Review`。
- 2026-03-21: 依正確搜尋方法（先確認飯店地址 → 搜尋街道附近 → 擴大至區域）補齊四城市飯店附近美食候選（咖啡/早餐、晚餐、外帶）：
  - Avignon：Brunch Coffee、Café Tulipe、Pavillon 84、Pollen（共 4 筆新增）
  - Nice：La Bélugue、Verdant Café、La Gauloise、Aux Deux Chefs、Chez Davia、Boulangerie Jeannot、HOBO Coffee（共 7 筆新增）
  - Mont Saint-Michel：La Ferme Saint-Michel（1 筆新增）；建立 data/cities/mont-saint-michel.json
  - Paris：Maison Pichard、Brasserie Wallace、Melt Cambronne、La Véraison、Neige d'Été（共 5 筆新增）
  - 新增欄位 hotel_nearby 與 meal_tags 至所有新建條目
- 2026-03-21: 擴充各城市住宿附近餐廳研究，新增 5 筆 hotel_nearby 候選：
  - Avignon：Acte 2（Michelin/Gault&Millau 精緻晚餐，3b Rue de la Petite Calade）
  - Nice：HUG Café（精品咖啡/早餐，2 Rue de Suisse，飯店步行約 12 分鐘）
  - Mont Saint-Michel：Le Relais du Roy（諾曼第料理備選晚餐，8 Route du Mont Saint-Michel，同路段）
  - Paris：Maison Landemaine Cambronne（廣場烘焙坊，7 Place Cambronne，步行 2 分鐘）、Café Cambronne（廣場全日咖啡館，5 Place Cambronne，步行 2 分鐘）
- 2026-03-27: 擴充 Paris 候選（+5）並同步更新 `data/cities/paris.json`：
  - 15ème（飯店周邊/實用備選）：Le Beurre Noisette、L'Os à Moelle
  - 11ème（主力晚餐）：Bistrot Paul Bert、Le Servan
  - 3ème（傳統法餐備選）：Parcelles
  - 來源驗證流程：依使用者要求改用 Firecrawl（官方網站 + Michelin + Tripadvisor/Gault&Millau）交叉確認營業資訊與地址
- 2026-03-27: 擴充 Paris 候選（+5）並同步更新 `data/cities/paris.json`：
  - 15ème（飯店周邊/實用備選）：Biscotte、L'Accolade
  - 11ème（主力晚餐）：Clamato、Le Chardenoux
  - 14ème（左岸南側備選）：Les Petits Parisiens
  - 來源驗證流程：依使用者要求使用 Playwright + Firecrawl（官方網站 + Michelin + Tripadvisor）交叉確認地址、營業時段與訂位規則
