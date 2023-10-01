---
title: "JavaScriptのnull合体演算子'??'と論理OR演算子'||'を理解しよう！💫"
emoji: "😔"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "javascript", "typescript"]
published: true
---

今回は、JavaScript の null 合体演算子と論理 OR 演算子についてまとめようと思います！
この記事を書こうとしたきっかけは、先日書いた記事で、null 合体演算子についてコメントをいただいたので、これを機に理解を深めて使い分けができるようにしようと思ったからです！

https://zenn.dev/yuji6523/articles/react-ternary-operator

それではいきましょう！

## null 合体演算子 '??'

null 合体演算子は、??のように二重の疑問符を使って書きます。
また、以下のように左側の値が、**null または undefind**の時に右側の値を返します。

```js
// nullのケース
const valueA = null;
const valueB = "Default";

let result = valueA ?? valueB; // "Default"
```

```js
// undefindのケース
const valueA = undefined;
const valueB = "Default";

let result = valueA ?? valueB; // "Default"
```

```js
// ""のケース
const textA = "";
const textB = "Default";

let result = textA ?? textB; // ""
```

## 論理 OR 演算子 '||'

論理 OR 演算子は、||のように書きます。
また、左辺の値が、**以下の falsy な値**の時に右側の値を返します。

- null
- NaN
- 0
- 空文字列 ("" または '' または ``)
- undefined
- false

```js
// nullのケース
const valueA = null;
const valueB = "Default";

let result = valueA || valueB; // "Default"
```

```js
// 0のケース
const numberA = 0;
const numberB = "Default Number";

let result = numberA || numberB; // "Default Number"
```

```js
const textA = "";
const textB = "Default";

let result = textA || textB; // ""
```

## 使い分け

null 合体演算子と論理 OR 演算子の違いは、**falsy の値をどこまで許容させるかです。**
ですので、使い分けとしては以下になると思います！

- ある変数が falsyな値（0 や""などを含む）の場合にデフォルト値を提供したい時は、||を使う。
- ある変数が`null`または`undefined`であり、その他の falsy な値（0 や空文字列など）をそのまま保持したい時、??を使う。

## まとめ
null 合体演算子と論理 OR 演算子を使用する際は、falsyな値をどこまで許容させるかという観点が重要になってきますので、コードを書く際に気をつけたいと思います！