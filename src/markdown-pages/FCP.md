---
slug: "/posts/FCP"
date: "2020-11-02"
title: "FCP 最初內容繪製"
---

First Contentful Paint (FCP) 最初內容繪製。

要優化 FCP 最重要的就是如何減少 blocking resource。

## Blocking resource

瀏覽器的很多事情像是 HTML 解析、版面繪製、JS 執行，都發生在一條主要執行序上。但資源的下載，是可以用多條執行序，平行於主要執行序進行的。然而，有些資源的下載，卻會擋住主要執行序的工作。 Blocking resource 指的是這些資源的下載階段，會擋住主要執行序上，網頁一開始 HTML 解析，進而拖慢網頁畫面呈現在使用者前的時間，常見的就是 CSS、Font、non async or defer script。

## CSS

當一個網頁在 CSS 還沒完成就繪製的話，那裸奔畫面幾乎是無法使用的，也因此 CSS 被瀏覽器設定為 Block resource，因此如何減少 CSS 的檔案大小就變得十分重要了。

### Split chunk 造成的額外樣式

避免多個 lazyload component import 同支 CSS。當 component 是 lazyload 的時候，會被切出為獨立的 chunk，而他用到的 CSS 也會一起被切出去，而今天如果有多個這樣的 component 都 import 同一支 CSS 時，理想上共用的 chunk 會被 Webpack 切出去，但 splitchunk 預設的 minSize 是 20kb，假設今天有 3 個 components import 同一支 CSS，worst case 就會有近 40kb 重複多餘的樣式。

## Font

使用 [postcss font display](https://github.com/dkrnl/postcss-font-display) 這個 PostCSS 插件，透過設定 CSS  [font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) 為 `swap`，可以讓字型不會 block 住 render

## Non defer, async script

當 `<script src="...">` 連結外部的 script tag 沒有加 `async` 或 `defer` 屬性的時候，他的下載解析和執行會 block 住 HTML 的解析，導致拖慢 FCP，以工作上的經驗來說就是廣告相關的 script 了，大概可以分 4 支 scirpts，分別是：

  - `setup.js` 需要擺在最前面的廣告和 prebid 相關設定
  - `call-ad.js` 實際去呼叫廣告的 script
  - `prebid.js` prebid 本體，會去廣告商那邊先競標一次
  - `gpt.js` gpt 本體，實際去要廣告，並將廣告繪製在版面上

最初希望廣告的 script 尤其是 prebid 相關的可以越早執行越好，這樣就可以在使用者畫面上待久一下，好創造更多收益，於是讓前三支 script，是 non async, defer 就這樣 blocking 載入，但後來我發現 `prebid.js` 的下載時間是遠大於 HTML parsing 的，就是說就算讓 `prebid.js` async 或 defer 載入，HTML parsing 完後到 `prebid.js` 執行之前，都還有時間執行 `setup` 和 `call-ad`。

## 補充雷坑

### 小心 Google Optimize 的 anti-flicker

如果你們站上有在用 [Google Optimize](https://optimize.google.com) 做 A/B test 的話，他做的事情其實就是用 client-side JS 來修改你的網頁，而用 JS 修改網頁的話，可能會讓畫面有很大的變化，讓使用者覺得網頁壞掉或不適，所以就需要他提供的 snippet : [anti-flicker](https://developers.google.com/optimize)。

連結中逐行解釋得很清楚，就是在 Optimize 執行玩之前，先把整個 document 藏起來，直到 Optimize 執行完，或是 4 秒 timeout 後才把 document 秀出來，也就是說你的網頁要等到 GTM 和 Optimize 載完、執行完，才會秀出來，那可想而知這樣的 FCP 會有多爛了吧。