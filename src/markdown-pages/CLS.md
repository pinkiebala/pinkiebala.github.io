---
slug: "/posts/CLS"
date: "2020-11-02"
title: "CLS 累積版面位移"
---


# Cumulative Layout Shift (CLS)

不預期的版面位移會讓使用體驗很糟，想像你正在看一段文字，這時網頁突然長出一張大圖或是廣告，害你不知道剛剛的文字跳到哪裡，感覺很糟對吧？

於是版面位移也被加入效能指標之一，可以透過 Lighthouse V6 測量，佔了 5% 的分數。

好在這個指標其實是最容易修的了，5分輕鬆到手。這邊分享一個簡單好用的技巧

## Aspect ratio boxes

最容易造成 CLS 就是各種媒體，比方說 `<img>` 、廣告，或是嵌入 widget，像圖片如果不知道他的尺寸的話，瀏覽器就得載完圖片才會知道他長寬多少，然後就會把文字擠開，所以如果知道圖片尺寸的話，最好是寫死他的 `width` ,`height` 避免版面位移。

那如果今天想要圖片的寬度是 100%，高度可以維持比例呢？有個 CSS 技巧叫做 [aspect-ratio-boxes](https://css-tricks.com/aspect-ratio-boxes/) 可以讓圖片的框維持固定的比例。

直接上 code

```HTML

<div class="aspect-ratio-box">
  <div class="aspect-ratio-box-holder"></div>
  <img class="aspect-ratio-box-media"  src="...">
</div>

```

```CSS

.aspect-ratio-box {
  background: lightgray; // Placeholder color;
  position: relative;
}

.aspect-ratio-box-holder {
  padding-top: calc(9 / 16 * 100%); // width:height = 16:9
}

.aspect-ratio-box-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

```

這段 code 的關鍵就是 `padding-top: calc(9 / 16 * 100%);`，因為 CSS 有個特性，百分比的 padding，是用 parent 的 width 來算的，如果 `aspect-ratio-box` 寬 `100px`，`aspect-ratio-box-holder` 設定 `padding-top: 75%` 那就等於 `padding-top: 75px` 的意思。

利用這個特性就可以做出 responsive 的圖片框，就不會因為圖片載入時造成版面位移了。

## 補充雷坑

另外還有一個細節是 css 的 `position`、 `left` 這種的變動，也會被算做 CLS，如果要做動畫之類的話，請用 `transform: translate()`。

會踩到這個坑是因為用到 [react-slick](https://github.com/akiran/react-slick) 這個套件，這是以前搭配 jQuery 使用的 [slick](https://kenwheeler.github.io/slick/) 的 React 替代版。

他的 center mode 在 server-side render 的時候，會用 `left` 搭配每個 slide 的 width 來計算要位移多少，但是在 client-side js 動起來後，會用 `transform: translate` 來做輪轉動畫。我們首頁最大的 slick 雖然在 client-side js 動起來後，畫面看起來一模一樣，卻有著高達 0.4 的 CLS。

為了修正這個問題，我先用一個 css class 強行 override 他的 `left` 並用 `translate` 去實作一樣的初始位移， client-side js didMount 的時候再把他拿掉，才把這個問題解掉。