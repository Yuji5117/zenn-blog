---
title: "JavaScriptを深く知る旅 #1：ホイスティングってなに？"
emoji: "😇"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "nodejs", "typescript", "javascript"]
published: true
---

## はじめに
最近 React を学んでいる中で、React の開発者である Dan Abramov さんの記事を読み、自分自身もまったく同じことを感じました。
JavaScript や TypeScript を強みにしていきたいと考えている自分にとって、やはり JavaScript の基礎をしっかり理解することが欠かせない！！そんな思いが強くなり、この記事を書くことにしました。

これからしばらく、JavaScript に関する学びをアウトプットしていこうと思っています。
第1回は「ホイスティング（巻き上げ）」についてです。

参照元：[What is JavaScript made of? – Dan Abramov](https://overreacted.io/what-is-javascript-made-of/)

## ホイスティングって？
ホイスティング（Hoisting）とは、コードが実行される前に、変数や関数の宣言がスコープの先頭に持ち上げられる（ように振る舞う）JavaScriptの挙動のことを指します。
この仕組みにより、宣言より前に変数や関数にアクセスできてしまうという現象が起こります。

クラスや import 文にもホイスティングに似た挙動があるようですが、今回は主に 変数 と 関数 に絞って解説していきます。

## 変数のホイスティング
変数のホイスティングとは、var、let、const で宣言された変数が、実行前にスコープの先頭に巻き上げられるように扱われることを指します。
ただし、var と let / const ではホイスティングの動作が異なります。

### var と let / const の違い
まずは var の挙動を見てみましょう。

var で宣言された変数は、スコープの先頭に巻き上げられ、宣言前であっても参照することが可能です。
ただし、この時点では初期化はまだ行われていないため、値は undefined になります。
代入は、実際に記述された位置で行われます。

```js

console.log(x) // undefined

var x = "value"

console.log(x) // valueと出力される。

```

これは、JavaScript エンジンが次のように解釈しているイメージです：

```js
var x;
console.log(x) // undefined

x = "value"

console.log(x) // valueと出力される。

```

一方、let や const もホイスティングの対象ではあるようですが、宣言前に参照しようとすると ReferenceError が発生します。
なぜなら、let や const で宣言された変数は、「一時的なデッドゾーン（TDZ: Temporal Dead Zone）」に入っているため、宣言より前にアクセスすることができないのです。

### TDZ（一時的なデッドゾーン）て何？
TDZ（Temporal Dead Zone）とは、変数がスコープ内で既にホイスティングされてはいるものの、まだ初期化されていない状態のことを指します。
この期間中に変数へアクセスしようとすると、以下のように ReferenceError が発生します。

```js

console.log(y); // ReferenceError

let y = "hello";

```

### まとめ
- var：宣言と同時にスコープの先頭に巻き上げられ undefined で初期化される → 参照可能だが未定義
- let / const：ホイスティングされるが、初期化される前はTDZにあり → 参照するとエラー

## 関数のホイスティング
次は、関数に関するホイスティングの挙動について見ていきましょう。
関数には主に以下の2つの定義方法があります。

- 関数宣言（function declaration）
- 関数式（function expression）

関数のホイスティングが有効なのは、関数宣言の場合のみです。
関数式ではホイスティングが「されるように見える」ことはありますが、実際には定義前に呼び出すとエラーになります。

### 関数宣言

関数宣言は、関数本体ごとスコープの先頭に巻き上げられるため、宣言より前であっても安全に呼び出すことができます。

``` js
greet(); // "Hello!"

function greet() {
  console.log("Hello!");
}

```

JavaScriptエンジンによって、実際には以下のように解釈されていると考えられます：

```js
function greet() {
  console.log("Hello!");
}

greet(); // "Hello!"
```

### 関数式

一方、関数式ではホイスティングの挙動が異なります。

const を使った関数式の場合、以下のように、スコープの中でホイスティングされますが、初期化前は一時的なデッドゾーン（TDZ）にあるため、参照すると ReferenceError が発生します。

``` js
sayHi(); // ReferenceError: Cannot access 'sayHi' before initialization

const sayHi = function () {
  console.log("Hi!");
};
```

var を使った関数式の場合、変数自体は undefined として巻き上げられますが、関数としての代入は行われていないため、呼び出すと TypeError になります。

```js

sayHi(); // TypeError: sayHi is not a function

var sayHi = function () {
  console.log("Hi!");
};

```

この例では、以下のように解釈されていると考えられます。

```js

var sayHi;

sayHi(); // TypeError sayHi is not a function

sayHi = function () {
  console.log("Hi!");
};

```

### まとめ
- 関数宣言は関数本体ごと巻き上げられる → 宣言前でも呼び出せる
- 関数式（const / let）はTDZの影響で宣言前に参照不可 → ReferenceError
- 関数式（var）は変数のみ巻き上げ → undefined → TypeError


## 全体のまとめ
- ホイスティングとは、変数や関数の宣言がスコープの先頭に「巻き上げられる」挙動のこと。
- var で宣言した変数は、宣言のみが巻き上げられ、値は undefined になる（そのため実行時エラーにはならないが、意図しない挙動になりやすい）。
- let / const は 「一時的なデッドゾーン（TDZ）」 に入るため、宣言前にアクセスすると ReferenceError が発生する。
- 関数宣言は、関数全体が巻き上げられるため、宣言前に呼び出しても実行可能。
- 一方で 関数式は、変数として扱われるため：
  - var を使えば undefined が巻き上げられ、実行時に TypeError になる。
  - let / const を使えば TDZ に入り、ReferenceError となる。

いつか「あ、あのときのホイスティングだ」と気づける日が来るように。React/Next.js の実践の中で、知識が発揮できれば嬉しいです！！🌱

## 補足
const や let については内部的にはスコープの先頭に移動しているとも言われますが、「一時的なデッドゾーン（TDZ）」によって参照できないため、厳密には「ホイスティングされている」と断言しにくい側面もあるようです。

## 参考記事

[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript)