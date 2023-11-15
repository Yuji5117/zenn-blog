---
title: "【LeetCode】2727.Is Object Emptyに挑戦（30 Days of JavaScript編）"
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["LeetCode", "javascript", "React"]
published: true
---

最近、LeetCode を使ってコーディング問題を解いており、先日から「30 Days of JavaScript」に挑戦し、3 日目となりました。
せっかくなので、習慣化するためにも Zenn に挑戦メモを残していこうと思います。

30 Days of JavaScript 以外の問題もちょくちょく解いているので、勉強になったものは、記録に残していこうと思います。

# 問題の概要

該当の問題

https://leetcode.com/problems/is-object-empty/description/

与えられたオブジェクトまたは配列が空かどうかを判定する関数を作成します。

- 空のオブジェクトとは、キーと値のペアが一つも含まれていないものを指します。
- 空の配列とは、要素が一つも含まれていないものを指します。

このオブジェクトまたは配列は、JSON.parse の出力と仮定して構いません。

### 例

```js
例１;
Input: obj = { x: 5, y: 42 };
Output: false;

例２;
Input: obj = {};
Output: true;
```

# 実装したコード

```js
/**
 * @param {Object|Array} obj
 * @return {boolean}
 */
var isEmpty = function (obj) {
  if (Array.isArray(obj)) return obj.length === 0 ? true : false;

  if (Object.keys(obj).length === 0) return true;

  return false;
};
```

### 解説

input で渡される obj は、配列かオブジェクトの二択になります。
そして、true を返す条件は、配列またはオブジェクトの中身が空であることです。

このことから、1 つめの条件式に配列かつ配列が空であれば、true をそうでなければ false を返す式を書く

```js
if (Array.isArray(obj)) return obj.length === 0 ? true : false;
```

ここで三項演算子を利用して、条件に合わなければ、false を返すようにしてた理由は、後続の条件である、「オブジェクトかつオブジェクトが空である」の「オブジェクトである」の判定を別関数に切り出したくなかったためです。（変にメモリを使わない方がいいのかな？と判断）

これにより、2 つめのオブジェクトに関する条件式は、オブジェクトがからかどうかを確認すだけで良くなりました。
オブジェクトが空かどうかの判定は、Object.keys で obj のキーを配列として持たせ、その長さを length で抽出し、長さが０（つまり空）かどうかで判定しています。

```js
if (Object.keys(obj).length === 0) return true;
```

残りの他の条件は、全て false を返すようにしております。

```js
return false;
```

# 気づき

そもそも、配列かオブジェクトかの判定を行わずに、`Object.keys().length`を使えば、両方の中身の要素の長さが取得でき、中身の要素が存在するか確認できた...

```js
function isEmpty(obj: Obj): boolean {
  if (Object.keys(obj).length === 0) return true;

  return false;
}
```

他にも、for inを用いた解き方もあり、勉強になる。

```js
var isEmpty = function (obj) {
  // 配列、オブジェクトに関わらずループできる。
  for (let key in obj) return false;
  return true;
};
```
