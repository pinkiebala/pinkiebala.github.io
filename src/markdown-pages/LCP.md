---
slug: "LCP"
date: "2020-11-02"
title: "LCP 最大內容繪製"
tags:
  - web-vital
---

Largeset Contentful Paint (LCP) 最大內容繪製。

版面上最有代表性、面積最大的區塊，通常是封面圖，當它繪製完成的時候就是 LCP。

如何讓首圖更快載入就是 LCP 的重點。

後端大大可以幫你的，用比較先進的圖片壓縮 (e.g webp)、用比較快的 CDN serve 靜態檔案、架設動態壓圖的伺服器讓你搭配 srcset。

前端這邊可以做 [responsive-image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) 設定 srcset, sizes 盡可能載剛剛好的圖片，減少不必要的傳輸浪費，再搭配 `<head>` 裡 preload 封面圖，就算是 srcset 也是可以做 preload 的，
見 [preload-responsive-images](https://web.dev/preload-responsive-images/)

## 補充細節

### sizes 的陷阱

`sizes="(min-width: 768px) 700w, (min-width:992px) 900w, 500w"`

螢幕寬度 1200px，他會載到哪一張圖呢？答案是 700w，竟然不是 900w?!，他找到第一個 match 的 media query 就會 return 了，要小心。

參考：[MDN 的 Note](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

> The browser ignores everything after the first matching condition, so be careful how you order the media conditions.

### 模糊小圖拉大，無效

蠻多社群網站會先載一張小圖，拉到跟原圖一樣大，並搭配 CSS blur 做 placeholder，稍後把原圖載進來再用 transition 做置換，個人認為這樣的使用者體驗還不錯。但這種作法根據 [web.dev](https://web.dev/lcp/) 對於 LCP 講解的文章中的這段，我自己也試過，是無效的。覺得有點怪又有點可惜，不知道之後會不會改。

> For example, images that are shrunk down to a much smaller than their intrinsic size will only report the size they're displayed at, whereas images that are stretched or expanded to a larger size will only report their intrinsic sizes.

### data url 放 svg，有效

個人試過在 img `src` 的地方寫 data url 用一個 1px*1px 的 svg 拉成原圖尺寸，跟圖片重疊，是可以被當作 LCP 的，這個實驗是在 Lighthouse 6，我覺得是 BUG，不知道之後會不會被修正 XD

```jsx
<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1' viewBox='0 0 1 1'%3E%3Crect width='100%25' height='100%25' fill='transparent'%3E%3C/rect%3E%3C/svg%3E"
```

因為我都有做 aspect-ratio-box 所以把上面這張圖一樣 `position: absolute`, 長寬 100% 就好了


### 避免 HTML parsing 被中斷

可以用 chrome devtool performance 錄製網站載入的過程，注意 HTML parsing 有沒有因為一些 inline script 或是 async script 中斷，這些會讓首圖的 HTML 沒有那麼快畫出來，而拖慢 LCP，同時 layout 一直重新計算，也會拖到一點 TBT。不過讓 HTML 一氣喝成 parsing 完的話，FCP 會因此變慢，所以最後對於網站效能分數的影響還有待釐清。