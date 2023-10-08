---
title: "【JS】文字列をbool値に変換したいなら二重否定（!!）を使おう"
emoji: "😀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "javascript", "typescript"]
published: true
---

## 動機

React の開発を進めている際、あるコンポーネントに props として文字列が存在するかどうかを真偽値として渡すシチュエーションがありました。
以下はその際の簡略化されたコードです。

```jsx
<FavoriteButton
  hasFavorite={favoriteResult !== ""} //　⇦ 文字列が含まれていれば`true`、そうでなければ`false`
  addToFavorite={addToFavorite}
  removeFromFavorite={removeToFavorite}
/>
```

このコードの意図としては、`favoriteResult` に文字列が存在すれば `hasFavorite` に `true` を、存在しなければ `false` を渡すというものです。

最初のアプローチでは `favoriteResult !== ""`という式を使用して、文字列が空でない場合に `true` を返すようにしていました。しかし、この表現をよりシンプルにできないかと思い、調査したところ`二重否定（!!）`を使う方法が見つかりました。この記事では、その手法について簡単に解説します。

## 二重否定（!!）とは？

JavaScript における`!`は、論理否定の演算子として機能します。
この演算子は真偽値を反転させる役割を持ちます。具体的には、真 (true) は偽 (false) に、偽は真に反転されます。
以下がその例になります。

```js
console.log(!true); // false
console.log(!false); // true
console.log(!0); // true
console.log(!1); // false
console.log(!""); // true
console.log(!"Hello"); // false
console.log(!null); // true
console.log(!undefined); // true
```

本題である二重否定（!!）についてですが、これは論理否定の`!`を 2 回続けて使用する表現です。
これにより、ある値を強制的に真偽値に変換することができます。
イメージがつきやすいように、以下にそのプロセスを書いていきます。

```js
const text = "hello";

// 1回目の反転
const hasTextFirst = !text;
console.log(hasTextFirst); // false

// 2回目の反転
const hasTextSecond = !hasTextFirst;
console.log(hasTextSecond); // true
```

1 回目の反転で、`text`が文字列を持っているため、`!`により真偽値が`true`から`false`に反転されます。
次に、2 回目の反転で、1 回目で得られた`hasTextFirst`の真偽値を再度反転させて、`false`から`true`にします。

この 2 回の操作を 1 行で表現したものが、以下のように`!!`を使ったコードになります。

```js
const text = "hello";

const hasText = !!text;
console.log(hasText); // true
```

この方法により、2 つのステップを 1 行で簡潔に書くことができ、文字列から真偽値を効率的に得ることができました。

## まとめ

二重否定（!!）は、文字列などの値を真偽値に変換する際に役立ちます。
もちろん、当初の動機で触れたように、`favoriteResult !== ""`という表現で「空文字ではない場合は true」と判定することも可能ですが、二重否定を使って、`!!favoriteResult`と書いた方がコードがよりシンプルになり読みやすいかと思います。

```jsx
<FavoriteButton
  hasFavorite={!!favoriteResult} //　⇦ 文字列が含まれていれば`true`、そうでなければ`false`
  addToFavorite={addToFavorite}
  removeFromFavorite={removeToFavorite}
/>
```

今後も積極的に二重否定を活用していきたいと考えていますが、過度な使用により読みにくくなることや、チームメンバーの理解度を考慮しながら、適切な場面で使用するよう心掛けたいと思います。

## 参考記事

[MDN の!!に関するセクション](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Logical_NOT#%E4%BA%8C%E9%87%8D%E5%90%A6%E5%AE%9A_!!)
