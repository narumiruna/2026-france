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
| Avignon | 2026-05-30 ~ 2026-06-02 | ✅ Completed | 401 | 400/400 hotel_nearby | 1 歇業 | 2026-05-29 | 住宿附近可用餐廳或咖啡廳已達 400 家；city JSON 與 map 主資料同步通過驗證。 |
| Nice | 2026-06-02 ~ 2026-06-05 | ✅ Completed | 400 | 400/400 hotel_nearby | 0 | 2026-05-29 | 住宿附近可用餐廳或咖啡廳已達 400 家；city JSON 與 map 主資料同步通過驗證。 |
| Mont Saint-Michel | 2026-06-05 ~ 2026-06-06 | ✅ Completed | 400 | 400/400 hotel_nearby | 0 | 2026-05-29 | 住宿附近可用餐廳或咖啡廳已達 400 家；外圍動線明確納入 La Caserne、Beauvoir、島內、Pontorson、Avranches、Granville、Dol-de-Bretagne 與 Saint-Malo。 |
| Paris | 2026-06-06 ~ 2026-06-10 | ✅ Completed | 415 | 400/400 hotel_nearby | 1 | 2026-05-29 | 住宿附近可用餐廳或咖啡廳已達 400 家；city JSON 與 map 主資料同步通過驗證。 |

## 更新紀錄
- 2026-05-29: 使用者將各地住宿周邊餐廳目標提高到 400 間；使用 OSM/Overpass 以住宿座標與周邊動線新增 1200 筆 `ready + hotel_nearby` 候選，並同步 `data/cities/*.json`、`data/restaurants.json`、`data/city-overview.json`、偏好與流程文件。
  - Avignon 新增 300 筆，住宿附近達 `400/400`。
  - Nice 新增 300 筆，住宿附近達 `400/400`。
  - Mont Saint-Michel 新增 300 筆，住宿附近達 `400/400`；外圍動線擴大納入 Granville、Dol-de-Bretagne 與 Saint-Malo 車程 / 轉乘備案。
  - Paris 新增 300 筆，住宿附近達 `400/400`。
  - 驗證：`node scripts/verify-hotel-nearby-counts.mjs` 通過，四站 city/map 計數皆為 `400/400` 且無 mismatch。
- 2026-05-29: 使用者將各地住宿周邊餐廳目標提高到 100 間；使用 OSM/Overpass 以住宿座標與周邊動線新增 200 筆 `ready + hotel_nearby` 候選，並同步 `data/cities/*.json`、`data/restaurants.json`、`data/city-overview.json`、偏好與流程文件。
  - Avignon 新增 50 筆，住宿附近達 `100/100`。
  - Nice 新增 50 筆，住宿附近達 `100/100`。
  - Mont Saint-Michel 新增 50 筆，住宿附近達 `100/100`；外圍動線擴大納入 Pontorson 與 Avranches 短程車程 / 轉乘備案。
  - Paris 新增 50 筆，住宿附近達 `100/100`。
  - 驗證：`node scripts/verify-hotel-nearby-counts.mjs` 通過，四站 city/map 計數皆為 `100/100` 且無 mismatch。
- 2026-05-15: 使用者明確允許外部查詢後，使用 OSM/Overpass 補齊住宿附近候選缺口，新增 66 筆 `ready + hotel_nearby` 候選並同步 `data/cities/*.json` 與 `data/restaurants.json`。
  - Avignon 新增 18 筆，住宿附近達 `50/50`。
  - Nice 新增 9 筆，住宿附近達 `50/50`。
  - Mont Saint-Michel 新增 20 筆，住宿附近達 `50/50`；外圍動線定義為 La Caserne、Beauvoir、島內進島動線與 Pontorson 短程車程 / 轉乘備案。
  - Paris 新增 19 筆，住宿附近達 `50/50`。
  - 驗證：`node scripts/verify-hotel-nearby-counts.mjs` 通過，四站 city/map 計數皆為 `50/50` 且無 mismatch。
- 2026-05-15: 使用者將住宿附近覆蓋門檻提高為每個住宿地點至少 50 間餐廳或咖啡廳；現有資料實測四站皆為 `30` 筆 `ready + hotel_nearby + 未歇業`，因此 Avignon、Nice、Mont Saint-Michel、Paris 均改回 `In Progress`，各需再補 20 筆後才可重新標記完成。
  - 補充稽核：本地 git 歷史中的唯一候選 ID 數與目前資料相同，沒有可直接恢復的舊候選池；剩餘缺口需靠新一輪外部來源查證補齊。
  - 本地座標補標：將既有已研究且距住宿點 2 公里內的 Avignon 2 筆（`La Mirande`、`Sevin`）與 Nice 11 筆（`Flaveur`、`Boulangerie Pâtisserie Jeannot`、`Fenocchio`、`Lou Pilha Leva`、`JAN`、`La Rossettisserie`、`Les Agitateurs`、`Le Safari`、`Bar des Oiseaux`、`HOBO Coffee`、`Chez Pipo`）補標為 `hotel_nearby`；另將 Paris 3 公里內左岸南側備選 `Les Petits Parisiens` 補入住宿延伸動線。缺口更新為 Avignon 18、Nice 9、Mont Saint-Michel 20、Paris 19。
  - 後續缺口與補齊方向集中追蹤於 [HOTEL_NEARBY_GAPS.md](./HOTEL_NEARBY_GAPS.md)。
- 2026-05-13: 依使用者要求在現有基礎上再擴充住宿附近餐廳，每站各新增至少 10 家：
  - **Avignon**：新增 `Cafe Saint Jean`、`Le 26`、`Tulipe Café`、`French Coffee Shop`、`Regusto`、`Le Cid Café`、`Green Bagel Café`、`Pâtisserie Vernet`、`Chez Lisette`、`Le Goéland`，住宿附近提升至 30 家。
  - **Nice**：新增 `Café de Max`、`Délices de Tunis`、`That's Amore`、`L'Eau de Vie`、`Le Liber’Tea`、`Chez Mireille`、`La Brioche Dorée`、`Bulliz`、`Le 17 à table`、`Kiosque Chez Tintin`，住宿附近提升至 30 家。
  - **Mont Saint-Michel**：新增 `Restaurant Du Guesclin`、`Mont Burger`、`Au Pelerin`、`Le Tripot`、`La Fringale`、`La Coquille`、`Le Chapeau Rouge`、`Les Terrasses de la Baie`、`Le Bar à Crêpes`、`La Vieille Auberge`，住宿附近提升至 30 家。
  - **Paris**：新增 `Les Frères Bretons`、`Le Cherine`、`Il Tronchetto`、`L'Escudella`、`Restaurant La Gauloise`、`Le Filippo`、`Sushi Q`、`Les Favorites`、`Primerose`、`Gwon's Dining`，住宿附近提升至 30 家。
  - 同步更新 `data/cities/*.json`、`data/restaurants.json`、`data/city-overview.json`，讓住宿周邊敘述與地圖資料一致。
- 2026-05-13: 住宿點附近餐廳擴充補到每站至少 20 家：
  - **Avignon**：將 `L'Atelier de Belinda`、`Cuisine Centr'Halles`、`Brasserie de l'Horloge`、`L'Agape`、`Le Goût du Jour`、`La Fourchette`、`Première Édition` 補標 `hotel_nearby`，飯店 15 分鐘步行圈補滿 20 家。
  - **Nice**：將 `Le Bistrot Gourmand`、`Chez Davia`、`La Merenda`、`Le Bistrot d'Antoine`、`Acchiardo` 納入住宿周邊步行動線，`hotel_nearby` 補滿 20 家。
  - **Mont Saint-Michel**：新增 `La Salicorne`、`La Bergerie Restaurant`、`Hôtel-Restaurant La Digue`、`Le Jardin d'Anouck`、`L'Hippocampe`、`La Table de l'Ermitage`、`La Bisqu'in`、`Le Restaurant de la Galette`、`Saint James Café`、`La Gourmandise`、`Auberge de la Baie`、`La Fermette` 12 家，並將 `La Mère Poulard`、`Crêperie La Sirène`、`Crêperie La Cloche` 併入住宿動線，可用清單補滿 20 家。
  - **Paris**：將 `La Fontaine de Mars`、`L'Ami Jean`、`Café de Flore`、`Le Comptoir du Relais` 納入 Cambronne 住宿點延伸動線，住宿附近清單補滿 20 家。
  - 同步更新 `data/restaurants.json` 與 `data/city-overview.json`，讓 overview / map 的住宿周邊覆蓋敘述一致。
- 2026-05-07: Avignon 續研：
  - **Maison Violette**（25 Rue Saint-Agricol）：從 `inbox` 升級為 `ready`，score 32。官方網站確認 Saint-Agricol 分店 Tue-Sat 07:30-19:00，Les Halles 分店 Tue-Sun 07:30-13:30 可作週日早上備案；補齊 Gault&Millau、Petit Futé、Tripadvisor、Restaurant Guru 來源。
  - 因 Tripadvisor 3.5/5 與 Restaurant Guru 3.8/5 評價中等，定位為早餐/咖啡/甜點外帶補位，不作專程主力；已加入 `hotel_nearby` 與 `meal_tags`，並同步新增至 `data/restaurants.json`。
- 2026-04-04: Avignon 歇業處理與新增 3 筆候選：
  - **Pavillon 84**（Allée de l'Oulle）：確認永久歇業，`data/restaurants.json` 標記 `is_closed: true`、`closure_checked_at: 2026-04-04`；`data/cities/avignon.json` 狀態改為 `rejected`。
  - **Première Édition**（5 Rue Prévôt）：新增。Michelin Guide France 2025 + Le Fooding + Gault&Millau 三指南收錄，Tripadvisor 4.4/5。雙主廚創意普羅旺斯料理，週二~六午餐、週三~六晚餐，週一日公休。score 42，需預約。
  - **Le Joat**（19 Rue des Trois Faucons，Fou de Fafa 隔壁）：新增。Michelin Guide + Petit Futé + TheFork，Pollen 出身主廚 Joris Tixador。套餐 €27-60，週一~六午晚餐，週日公休。hotel_nearby，score 41，需預約。
  - **Bibendum**（83 Rue Joseph Vernet）：新增。Michelin Bib Gourmand 2025，Pollen 主廚 Mathieu Desmarest 創辦。14 世紀修道院迴廊，tapas/起司吧/調酒，官網 bibendumavignon.fr，週二~六午晚餐。hotel_nearby，score 39，需預約。
  - `data/restaurants.json` 總計從 94 筆增至 97 筆。
- 2026-03-31: Mont Saint-Michel 補強 4 家來源不足候選並新增 2 筆，全部 8 筆升級為 ✅ Completed：
  - **La Mère Poulard**（Grande Rue）：補充官方網站 aubergelamerepoulard.com、Tripadvisor（2.7/5，5,500+ 則）。更正營業時段為 11:30-16:00 & 18:30-21:00。2025 年新主廚 Killian Rosini 加入。
  - **Crêperie La Sirène**（Grande Rue）：⚠️ 名稱更正為「Crêperie La Sirène」，類別改為 creperie。補充 Tripadvisor Traveller's Choice、ot-montsaintmichel.com、normandie-tourisme.fr。⚠️ 營業時段更正：Sun-Wed & Sat 11:45-15:30，**Thu-Fri 公休**，僅午餐。meal_tags 修正為 `[lunch, takeout]`。
  - **Le Relais Saint-Michel**（La Caserne）：補充 Tripadvisor、ot-montsaintmichel.com。更正營業時段為 12:00-15:00 & 19:00-21:30。
  - **Crêperie La Cloche**（Grande Rue）：補充 Tripadvisor 4.0/5（590+ 則）、LesCreperies.fr、Petit Futé。⚠️ 營業時段更正：Tue-Sat 12:00-17:00，**Sun-Mon 公休**。meal_tags 修正為 `[lunch, takeout]`。
  - **Le Pré Salé**（Route du Mont Saint-Michel，La Caserne）：新增。Tripadvisor #3（4.0/5，1,300+ 則），鹽沼羔羊專門店。hotel_nearby、dinner/lunch。score 38。
  - **Brioche Dorée**（La Caserne）：新增。連鎖烘焙咖啡館，每日 08:00-17:00。hotel_nearby、breakfast/coffee/takeout。score 30。唯一早餐外食選項。
  - 3 筆新增至 `data/restaurants.json`（msm-le-relais-du-roy、msm-le-pre-sale、msm-brioche-doree）。
- 2026-03-31: Paris 18 筆 `ready` 候選同步新增至 `data/restaurants.json`，全部 36 筆升級為 ✅ Completed：
  - 飯店周邊（15ème）新增 7 筆：Maison Landemaine、Café Cambronne、Le Beurre Noisette、L'Os à Moelle、Biscotte、L'Accolade、Quatre Heures、Le Casse-Noix
  - 跨區晚餐新增 6 筆：Bistrot Paul Bert、Le Servan、Parcelles、Clamato、Le Chardenoux、Les Petits Parisiens
  - 其他新增 5 筆：L'Ami Jean、La Fontaine de Mars、Stohrer、Boot Café
  - `data/restaurants.json` 總計從 73 筆增至 94 筆。
- 2026-03-30: Nice 5 家 `researching` 餐廳補強來源，全部升級 → `ready`，同步修正錯誤並新增 2 筆至 `data/restaurants.json`：
  - **Acchiardo**（38 Rue Droite）：補充 Tripadvisor 4.5/5（2,000+ 則）、explorenicecotedazur.com、RestaurantGuru。1927 年第四代家族餐廳，Michelin/Le Fooding 均未收錄。
  - **Lou Pilha Leva**（10-13 Rue du Collet）：補充官方網站 loupilhaleva.shop。Michelin/Le Fooding 均未收錄，Tripadvisor Quick Bites #14（3.4/5，570+ 則）。
  - **La Rossettisserie**（8 Rue Mascoinat）：補充官方網站 larossettisserie.com、Académie du Goût 收錄、explorenicecotedazur.com。Tripadvisor 4.4/5（1,300+ 則），營業時段更正：12:00-14:00 & 18:30-22:00。
  - **La Brioche Chaude**（50 Av. Jean Médecin）：無官方網站。Tripadvisor Nice **#9**（4.8/5，320+ 則）、RestaurantGuru。升為 `ready`，score 31；**同步新增至 `data/restaurants.json`**。
  - **Le Bonjour**（Place de la Gare du Sud）：⚠️ 地址更正（加入門牌號 **6**）；⚠️ 營業時段更正（咖啡館型：Mon-Sat 08:00-19:00，Sun 08:00-13:30，**不提供晚餐**）；meal_tags 更正為 `[breakfast, lunch]`；category 改為 `cafe`。升為 `ready`，score 32；**同步新增至 `data/restaurants.json`**。
  - Nice 全部 31 筆候選現均為 `ready`；修正 `data/restaurants.json` 中 La Bélugue（nice-la-belugue）缺少 `id` 的錯誤。
- 2026-03-30: Avignon 4 家 `researching` 餐廳補強權威來源，全部升級 → `ready`，並修正關鍵名稱與地址錯誤：
  - **Cuisine Centr'Halles**（原記為「Les Halles Bistro」）：⚠️ 名稱更正。實際為 Cuisine Centr'Halles，主廚 Jonathan Chiri，位於 18 Place Pie（Les Halles Centrales 市場內）。官方網站：cuisine-centrhalles-restaurant-avignon.com；Tripadvisor；Grand Avignon 旅遊局頁面。Michelin/Le Fooding **均未收錄**。營業：Tue-Sun 10:00-14:00（週一公休，僅午餐）。
  - **L'Atelier de Belinda**：⚠️ 地址更正（48 → **17** Place des Corps Saints）。無官方網站。Tripadvisor 4.7-4.8/5（數百則）；LaCarte.menu；Restaurants-de-France；RestaurantGuru。Michelin/Le Fooding **均未收錄**。約 26 席，€20-35，每日菜單。
  - **Ma Belle Cuisine**：新增官方網站 ma-belle-cuisine.fr；Tripadvisor Traveler's Choice 獎（4.6/5，近 500 則）；Pages Jaunes。Michelin/Le Fooding **均未收錄**。營業時段確認：Tue-Sat 12:00-14:00 & 19:00-21:30。
  - **La Sou'Pape**：無官方網站。Tripadvisor **4.8/5**（440+ 則，Avignon 最高評分午餐小館之一）；Pages Jaunes；jrbistronomie.fr；RestaurantGuru。Michelin/Le Fooding **均未收錄**。週一至五僅午餐（12:00-14:00），週末公休確認。
- 2026-03-30: Nice 飯店附近（ibis Nice Centre Notre-Dame，41 Rue Lamartine）補強 10 筆 hotel_nearby 候選，聚焦 Quartier Libération：
  - `nice-la-route-du-miam`：La Route du Miam（1 Rue Molière，步行約 10 分鐘，Tripadvisor 4.8/5 西南法晚餐）升為 `ready`，score 40。
  - `nice-brasserie-le-gambetta`：Brasserie Le Gambetta（1 Place du Général de Gaulle，步行約 10 分鐘，每日午晚海鮮/小館）升為 `ready`，score 36。
  - `nice-restaurant-linstant`：Restaurant L'Instant（9 Rue Clément Roassal，步行約 10 分鐘，Travelers' Choice bistronomique）升為 `ready`，score 37。
  - `nice-braise`：Braise（6 Place de la Gare du Sud，步行約 10 分鐘，木火碳烤現代餐廳）升為 `ready`，score 35。
  - `nice-a-la-table-du-marche`：À la Table du Marché（24 Bd Joseph Garnier，步行約 12 分鐘，市場鮮料理）升為 `ready`，score 37。
  - `nice-la-femme-du-boulanger`：La Femme du Boulanger（3 Rue du Commandant Raffalli，步行約 5 分鐘，全日早午餐）升為 `ready`，score 34。
  - `nice-panivore`：Panivore（14 Ave du Maréchal Foch，步行約 3 分鐘，外帶早餐/午餐）升為 `ready`，score 33。
  - `nice-chez-les-garcons`：Chez Les Garçons（1 Rue Niépce，步行約 5 分鐘，復古早午餐）升為 `ready`，score 34。
  - `nice-la-brioche-chaude`：La Brioche Chaude（50 Ave Jean Médecin，步行約 8 分鐘，每日烘焙坊）為 `researching`，score 31。
  - `nice-le-bonjour`：Le Bonjour（Place de la Gare du Sud，步行約 10 分鐘，在地 Niçoise/Provençal 小館）為 `researching`，score 32。
  - 8 筆 `ready` 同步新增至 `data/restaurants.json`；`data/city-overview.json` 新增 Libération 區域與 hotel_nearby 頂候選。
  - Nice hotel_nearby 總計達 15 筆（原 5 筆 + 新增 10 筆）。
- 2026-03-30: Avignon 飯店附近餐廳補強（+6 筆 hotel_nearby）：
  - `avignon-grands-bateaux-provence`：Les Grands Bateaux de Provence（Bd de l'Oulle，步行約 5 分鐘，河畔船上餐廳）升為 `ready`，score 35。
  - `avignon-fou-de-fafa`：Fou de Fafa（17 Rue des Trois Faucons，步行約 12 分鐘，Tripadvisor 4.7/5）升為 `ready`，score 37。
  - `avignon-le-cochon-bleu`：Le Cochon Bleu（9 Rue d'Annanelle，步行約 10 分鐘，傳統法式）升為 `ready`，score 35。
  - `avignon-hiely-lucullus`：Hiély-Lucullus（5 Rue de la République，步行約 12 分鐘，Michelin 綠星）升為 `ready`，score 43。
  - `avignon-ma-belle-cuisine`：Ma Belle Cuisine（3 Rue Félix Gras，步行約 10 分鐘）為 `researching`，score 33，待補指南型來源。
  - `avignon-la-soupape`：La Sou'Pape（51 Rue de la Grande Fusterie，步行約 10 分鐘，平價午餐）為 `researching`，score 30，待補指南型來源。
  - Avignon hotel_nearby 總計達 11 筆（原 5 筆 + 新增 6 筆）；同步更新 `data/cities/avignon.json`、`data/restaurants.json`、`data/city-overview.json`。
- 2026-03-30: Nice 新增 6 筆重要景點附近餐廳，同步更新 `data/cities/nice.json` 與 `data/restaurants.json`：
  - Flaveur（Michelin 2 星，25 Rue Gubernatis，近 Place Masséna）
  - JAN（Michelin 1 星，12 Rue Lascaris，Vieux Nice）
  - Les Agitateurs（Michelin 1 星，24 Rue Bonaparte，Vieux Nice/近 Colline du Château）
  - Le Bistrot Gourmand（Michelin Bib Gourmand，3 Rue Desboutin，近 Place Masséna）
  - Bar des Oiseaux（Michelin Guide 收錄，5 Rue Saint Vincent，Vieux Nice）
  - Le Safari（1972 年地標，1 Cours Saleya 花市旁）
  - 同步補齊 HUG Café 至 `data/restaurants.json`（先前僅收錄於 `data/cities/nice.json`）
- 2026-03-30: Avignon 景點周邊補強（+3 新增，+1 更名確認）：
  - `avignon-la-mirande`：La Mirande（4 Place de l'Amirande，Michelin 1★ + 綠星，Palais des Papes 正旁）升為 `ready`，score 45。
  - `avignon-le-gout-du-jour`：Le Goût du Jour（20 Rue Saint-Étienne，Michelin 推薦，舊城區）升為 `ready`，score 40。
  - `avignon-brasserie-horloge`：Brasserie de l'Horloge（26 Place de l'Horloge，每日開放，Place de l'Horloge 正面）升為 `ready`，score 32。
  - `avignon-christian-etienne`：確認 Christian Etienne 於 2020 年更名為 Sevin（主廚 Guilhem Sevin 接手），更新名稱、營業時間、價位及來源，升為 `ready`，score 42。
  - 四筆同步新增至 `data/restaurants.json`；同步補入先前遺漏的 `avignon-acte-2`。
  - `data/city-overview.json` Avignon 頂候選更新為 7 筆，覆蓋 Palais des Papes、Place de l'Horloge 兩大景點周邊。
- 2026-03-28: Paris 續研（多間增補）：
  - `paris-le-moulin-croix-nivert`、`paris-laboulangerie-laos`、`paris-boulangerie-barlan` 皆補齊多來源佐證後由 `researching` 升級為 `ready`。
  - 三筆均為飯店周邊（Cambronne / Motte-Picquet 一帶）早餐/咖啡/外帶低風險備選。
  - 三筆已同步新增至 `data/restaurants.json`，可直接由地圖主資料載入。
- 2026-03-28: Paris 續研（最小增補）：
  - `paris-merci-jerome-motte-picquet` 補齊 4 筆來源（官方頁、Google Maps、Tripadvisor、Mappy），狀態由 `researching` 升級為 `ready`。
  - 同步新增至 `data/restaurants.json`，確保地圖主資料可顯示此飯店周邊早餐/咖啡/外帶備選。
- 2026-03-28: Paris 店家狀態維護：
  - Maison Pichard 改為歇業保留策略（不刪除，新增 `is_closed: true`、`closure_checked_at`、`closure_note`）。
  - `data/cities/paris.json` 同步改為 `status: rejected`，保留歷史資訊避免重複研究。
  - 前端 `assets/app.js` 加入 `is_closed` 過濾，歇業店不顯示於地圖、側欄與 overview 計數。
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
- 2026-03-27: 使用 Lightpanda MCP 延續 Paris 研究，新增 3 筆 15ème 飯店周邊候選並同步更新 `data/cities/paris.json`：
  - Le Moulin de la Croix Nivert（早餐/外帶）
  - Laboulangerie（早餐/外帶）
  - Quatre Heures - Cambronne（早餐/外帶）
  - 本輪限制：Tripadvisor/Michelin 清單頁受反爬限制，因此先以官方站 + OSM/Nominatim + 在地店家資料頁建立 `researching` 候選，待下一輪補齊指南型來源後再升級 `ready`。
- 2026-03-27: 使用 Playwright MCP 針對上一輪限制補強 Paris 15ème 候選（+2）並同步更新 `data/cities/paris.json`：
  - Boulangerie Barlan（Rue Cambronne，早餐/外帶）
  - Merci Jérôme（Avenue de la Motte-Picquet，早餐/外帶）
  - 同步將 Le Moulin de la Croix Nivert 的地理來源改為 Nominatim，以符合「官方站 + OSM/Nominatim + 在地店家資料頁」的 `researching` 來源結構。
- 2026-03-28: 補強 Nice 5 家餐廳的權威來源，全部升級 `researching` → `ready`：
  - Acchiardo（38 Rue Droite）：Tripadvisor 4.5/5（2,000+則），Nice Côte d'Azur 旅遊局頁面；無官網、無 Michelin、無 Le Fooding
  - Lou Pilha Leva（10-13 Rue du Collet）：官方網站 loupilhaleva.shop；Tripadvisor；無 Michelin、無 Le Fooding
  - La Rossettisserie（8 Rue Mascoinat）：官方網站 larossettisserie.com；Tripadvisor 4.4/5（1,300+則）；旅遊局頁面；Académie du Goût；無 Michelin、無 Le Fooding
  - La Brioche Chaude（50 Av. Jean Médecin）：Tripadvisor Nice #9（4.8/5，320+則）；Pages Jaunes；無官網、無 Michelin、無 Le Fooding
  - Le Bonjour（6 Place de la Gare du Sud）：精確地址確認為「6 Place de la Gare du Sud」；Petit Futé 收錄；**修正營業時段**：咖啡館型（週一至六 08:00–19:00，週日 08:00–13:30），**不提供晚餐**
