---
title: "CORSエラーにハマった話とその解決メモ"
emoji: "☺️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "nodejs", "typescript", "javascript", "expressjs"]
published: true
---

## 発生したエラー

``` bash
Access to fetch at 'http://localhost:5001/me' from origin 'http://localhost:3000' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 原因の推測
サーバー側で Access-Control-Allow-Origin ヘッダーが返却されていないため、ブラウザがセキュリティポリシーでブロック。

フロントエンド (localhost:3000) からサーバー (localhost:5001) に クロスオリジンで fetch を実行したことで CORS エラーが発生。

サーバーで CORS ミドルウェアの導入・設定が漏れていた可能性が高い。

## 試したこと
サーバーコードを確認したが、cors ミドルウェアが未導入だった。

cors() を使ってすべてのオリジンを許可 → エラー解消。

セキュリティを考慮し、origin: "http://localhost:3000" のみ許可するよう変更。

認証付き通信も見据えて、credentials: true を追加。

fetch 側で credentials: "include" を指定して Cookie を送信できるように設定。

## 解決策
corsのインストール

```bash
npm install cors
```

```js

// Express サーバー側
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

```

```js

// フロントエンド側（fetch）
fetch("http://localhost:5001/me", {
  credentials: "include",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

```

## 学び・今後の対策
- CORS はブラウザ側のセキュリティ仕様による制限であり、サーバーとフロントの両方の設定が必要。
- credentials: true を使う場合、origin: "*" は使えない（セキュリティ上禁止）。
- クロスオリジン通信におけるプリフライト（OPTIONS）リクエストの重要性も理解した。
- 再発防止のため、今後は開発初期から cors の設定を意識し、fetch とサーバーの通信仕様を合わせて設計する。