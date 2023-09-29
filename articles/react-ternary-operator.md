---
title: "【JS】三項演算子（?:）ではなくOR演算子（||）を使ったクリーンな方法"
emoji: "👋"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "javascript", "typescript"]
published: true
---

## 三項演算子の基本

三項演算子は以下のように使われます:

```js
const value = condition ? valueIfTrue : valueIfFalse;
```

例:

```js
const displayedResult = favoriteResult ? favoriteResult : result;
```

## OR 演算子の利用方法

一方、OR 演算子を利用すると、以下のように書くことができます

```js
const displayedResult = favoriteResult || result;
```

この方法で、favoriteResult が truthy (true または truthy と評価される値) であれば favoriteResult が displayedResult に代入され、falsy (false または falsy と評価される値) であれば result が displayedResult に代入されます。

## なぜ OR 演算子が良いのか？

- 簡潔性: 三項演算子よりも少ない文字で同じ意味を持つコードを書くことができる。
- 読みやすさ: シンプルな条件の場合、OR 演算子を使った方が直感的であり、コードの読み手にとってわかりやすい場合が多い。

## 注意点

先ほどの例はシンプルでしたが、、複雑な条件や複数の選択肢が必要な場合は、三項演算子や他の方法を使う方が適していることもありかと思いますので、コードの読みやすさを考慮して使用することをおすすめします。

## まとめ

シンプルな三項演算子の場合は、OR 演算子を使用し、少し複雑な条件式の場合は、三項演算子の使用を検討するという判断でよさそうです。
