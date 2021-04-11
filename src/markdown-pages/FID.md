---
slug: "FID"
date: "2020-11-02"
title: "FID 首次輸入延遲"
tags:
  - web-vital
---

## TTI, TBT

- 減少第三方套件的影響
- 原理：先出假的，有互動或 timout 再 import 真的 component 回來
- lite-youtube-embed
- react-live-chat-loader
- 減少 bundle size
  - babel-object-replace-plugin
  - dayjs