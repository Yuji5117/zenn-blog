---
title: "【JS】Javascriptでこんな文字列操作をしたい集をまとめました！！！"
emoji: "✏️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "nodejs", "typescript", "javascript"]
published: true
---

# 動機

最近、Javascript を使ってコーディング問題を解くときがあるのですが、その際に、文字列の操作をスムーズに思いつかなかったので、復習がてらまとめることにしました。
こういう操作がしたい集のように書いていきたいと思います！

# こんな文字列操作をしたい集！！！

## 文字列を特定の文字で分割して、配列にしたい。

解決策：`split(separator)` メソッドを使う。

```js
const str = "Hello";
const result = str.split(""); // 空文字を指定

console.log(result);
// ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]
```

```js
const str = "Hello World";
const result = str.split(" "); // 空白を指定

console.log(result);
// ["Hello World"]
```

## 文字列内の一部を別の文字列で置換したい。

解決策: `replace(searchFor, replaceWith)`メソッドを使う。

```js
const str = "Hello World";
const result = str.replace("World", "Everyone");

console.log(result);
// "Hello Everyone"
```

## 文字列の先頭と末尾から空白を取り除きたい。

解決策: `trim() `メソッドを使う。

```js
const str = " Hello World ";
const result = str.trim();

console.log(result);
// "Hello World"
```

### 補足：trimStart()と trimEnd()

- `trimStart()`は、元の文字列の先頭にある空白のみを取り除く。
- `trimEnd()`は、元の文字列の末尾にある空白のみを取り除く。

```js
const str = "   Hello World!　　";
const trimmedStr = str.trimStart();

console.log(trimmedStr);
// "Hello World!　　"
```

```js
const str = "   Hello World!　　";
const trimmedStr = str.trimEnd();

console.log(trimmedStr);
// "　　Hello World!"
```

## 文字列から特定の部分を取り出したい。

解決策: `substring(start, end)` または `slice(start, end)` を使う。

```js
const str = "Hello World";
const resultForSubstring = str.substring(0, 5);

console.log(resultForSubstring);
// "Hello"

const resultForSlice = str.slice(0, 5);

console.log(resultForSlice);
// "Hello"
```

## 文字数を取得する

解決策：`str.length`を使う

```js
const str = "おはよう";
console.log(str.length); // 4
```

## 文字列から特定の位置の文字を取得したい

解決策：`str[index]`を使う。

```js
const str = "おはよう";
console.log(str[0]); // "お"

console.log(str[3]); // "う"
```

### 補足：str.charAt(index)

`str.charAt(index)`を使って、文字列から特定の位置の文字を取得できます。
`str[index]`との違いは、以下になります。

**戻り値の違い**

- charAt() は範囲外のインデックスに対して空の文字列を返します。
- str[index] は範囲外のインデックスに対して undefined を返します。

## 特定の文字が最初に出現するインデックスを取得したい

解決策：`str.indexOf('特定の文字')`を使う。

```js
const str = "Hello World";
console.log(str.indexOf("o")); // 4
```

特定の文字が見つからない場合は、`-1`が返却値となる。

```js
const str = "Hello World";
console.log(str.indexOf("g")); // -1
```

## 文字列が指定した文字で始まるか確認したい

解決策：`str.startsWith('特定の文字')`を使う。

```js
const str = "Hello, World!";
console.log(str.startsWith("H")); // true
console.log(str.startsWith("Hello")); // true
console.log(str.startsWith("W")); // false
```

## 文字列が指定した文字で終わっているかを確認したい

解決策：`str.endsWith('特定の文字')`を使う。

```js
const str = "Hello, World!";
console.log(str.endsWith("!")); // true
console.log(str.endsWith("World!")); // true
console.log(str.endsWith("Hello")); // false
console.log(str.endsWith("W")); // false
```

## 文字列を大文字または小文字に変換したい！

解決策：`str.toUpperCase()`・`str.toLowerCase()`を使う。

```js
const str = "Hello, World!";

console.log(str.toUpperCase());
// "HELLO, WORLD!"

console.log(str.toLowerCase());
// "hello, world!"
```

## 文字列が特定の文字列を含んでいるか確認したい！

解決策：`includes()`メソッドを使う。

```js
const str = "Hello, World!";

console.log(str.includes("Hello")); // true
console.log(str.includes("cool")); // false
```

### 補足：第 2 引数を指定する場合

`includes()`メソッドは、第 2 引数として開始検索位置（）index を取ることができます。

```js
const str = "Hello, World!";

console.log(sentence.includes("Hello, 6)) // false
```

第 2 引数には、`6`を指定しているので、includes()メソッドは `str` の 6 番目の位置（index）から "Hello" を検索します。
なので、この場合は false を返します。

# まとめ

Javascript には、文字列を操作するための組み込みの関数が結構あるんだと、改めて感じました。
この辺りの文字列操作をパッと使えるようになれるように定期的にコーディング問題解くのも良さそうです。

他にも、正規表現を使った、`str.match()`なども次回の記事でまとめてみようと思います。
正規表現は覚えるの大変ですが、使いこなすと色々便利そうなので、時間を作って勉強してみます！
