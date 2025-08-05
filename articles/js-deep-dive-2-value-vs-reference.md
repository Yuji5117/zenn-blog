---
title: "JavaScriptを深く知る旅 #2：値渡し・参照渡しって？"
emoji: "😇"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "nodejs", "typescript", "javascript"]
published: true
---

## はじめに
JavaScriptの基礎を学ぶために、今回は第2回として「値渡し」と「参照渡し」についてまとめていきます。
この概念を理解しておくと、たとえば`React`で`state`を更新したのに再レンダリングされないといった問題にも、仕組みから納得して対処できるようになります。

## 値渡しってなに？

「値渡し」とは、変数に格納されている値そのもののコピーを渡すことを指します。
対象となるのは、`string`、`number`、`boolean` などのプリミティブな値です。

例えば、変数 `x` を変数 `y` に代入し、その後 `y` の値を変更しても、`x` の値には影響がありません。
これは、代入時に値のコピーが渡されているためで、`x` の**元の値とは別物として扱われる**からです。

イメージとしては、ある証明書のコピーを渡しているようなもの。
受け取ったコピーにメモを書いたり、折り目をつけたりしても、元の証明書には一切影響がないという感覚です。

```
let x = "Hello!!"
let y = x

y = "Change!!"

console.log(x) // "Hello!!" <- 値は変わらない
```

## 参照渡しってなに？

一方、「参照渡し」は、値渡しとは異なる挙動を示します。
対象となるのは、オブジェクト・配列・関数などの **非プリミティブ型（オブジェクト型）** です。

たとえば、変数 `x` にオブジェクトを代入し、それを変数 `y` にコピーしたあと、`y` の中身を変更すると、`x` の中身も一緒に変わってしまいます。
これは、`x` と `y` が同じ参照（メモリ上の同じ場所）を見ているためです。

つまり、値そのものをコピーして渡すのではなく、「どこにあるか（参照先）」の情報が渡されているのが「参照渡し」です。
先ほどの証明書の例で言うと、証明書そのものを渡すのではなく、「保管場所の地図」を渡すイメージです。
保管場所を知っていれば、誰でもその場所に行けて、内容を変更できる。
そのため、どちらの変数からアクセスしても、同じオブジェクトに影響を与えることになります。

```js
let x = { message: "Hello!!" };
let y = x;

y.message = "Change!!";

console.log(x.message); // "Change!!" ← xの中身も変わってしまう

```

参照渡しには「浅いコピー（シャローコピー）」と「深いコピー（ディープコピー）」の2種類があります。それぞれ見ていきましょう。

### 浅いコピー（shallow copy）
浅いコピー（shallow copy）とは、**ネストされたオブジェクトや配列の最初の階層だけをコピーする**ことを指します。

以下のコードでは、ネストされたオブジェクトを持つ変数を、別の変数に代入しています。
このとき、ネストされていないプロパティ（第一階層）を変更しても、元のオブジェクトには影響がありません。これは、その部分が値としてコピーされているためです。

しかし、ネストされた部分（オブジェクトの中のオブジェクトなど）を変更するとどうなるでしょうか？
その答えは、**元の変数の値も一緒に変更されてしまう**、です。

これは、浅いコピーではネストされた内部の値まではコピーされず、参照（アドレス）だけが渡されているためです。
つまり、**「外側はコピーされたけれど、中身は共有されたまま」**になっているということです。

```js

const original = {
  name: "Taro",
  address: {
    city: "Tokyo",
  },
};

const copy = { ...original };

// 浅い部分を変更
copy.name = "Bob";
console.log(original.name); // "Taro" → 影響なし

// ネストされた部分を変更
copy.address.city = "Osaka";
console.log(original.address.city); // "Osaka" → 元のオブジェクトも変わってしまう

```

### 深いコピー（deep copy）
深いコピー（deep copy）とは、オブジェクトのネストされたすべての階層を含めてコピーする方法です。
これにより、コピー先を変更しても元のオブジェクトには影響しません。

注意点
- 関数や undefined、シンボルはコピー対象外になる
- Date や RegExp は文字列化されてしまう
- 循環参照があるとエラーになる

```js

const original = {
  name: "Taro",
  address: {
    city: "Tokyo",
  },
};

const copy = JSON.parse(JSON.stringify({ ...original }));

// 浅い部分を変更
copy.name = "Bob";
console.log(original.name); // "Taro" → 影響なし

// ネストされた部分を変更
copy.address.city = "Osaka";
console.log(original.address.city); // "Tokyo" → 影響なし

```

モダンな書き方としては、structuredCloneがあります。
ES2021 以降、ブラウザや Node.js に標準搭載された組み込み関数です。関数・Date・循環参照なども正しく複製できるのが特徴です。

```js
const original = {
  name: "Taro",
  address: {
    city: "Tokyo",
  },
};

const copy = structuredClone(original);

copy.address.city = "Osaka";
console.log(original.address.city); // → "Tokyo"

```

## useState 更新時の注意点
React でオブジェクトを state として管理する場合、オブジェクトのプロパティを直接変更しても再レンダリングされません。これは、React が state の更新判定に Object.is() （参照の等価性チェック）を使っているためで、オブジェクトの中身（プロパティ）が変わっても参照先が同じだと「変化なし」とみなされるからです。

### 正しい更新方法
必ず 新しいオブジェクトを作成 してから setState に渡しましょう。以下のようにスプレッド構文でコピーを作るのが基本パターンです。

```js

import React, { useState } from 'react';

function Profile() {
  const [user, setUser] = useState({
    name: 'Taro',
    city: 'Tokyo',
  });

  // NG: 参照が同じなので更新を検知しない
  const invalid = () => {
    user.name = 'Alice';
    setUser(user);
  };

  // OK: 新しいオブジェクトを渡して再レンダリング
  const valid = () =>
    setUser(prev => ({ ...prev, name: 'Alice' }));

  return (
    <div>
      <p>
        {user.name} — {user.city}
      </p>
      <button onClick={invalid}>NG</button>
      <button onClick={valid}>OK</button>
    </div>
  );
}

export default Profile;

```

## まとめ
- **値渡し**：プリミティブ型（数値・文字列・真偽値）は値そのものがコピーされる。コピー先を更新しても元の値は変わらない。
- **参照渡し**：オブジェクトや配列は参照（アドレス）がコピーされる。コピー先でプロパティを変更すると、元オブジェクトにも影響が及ぶ。
- 元のオブジェクトを変更したくない場合は、コピーを作成してから操作する。
- **シャローコピー：最上位のプロパティのみコピーし、ネスト内部は参照のままになる。
- **ディープコピー：ネストされた階層まで完全にコピーする。`structuredClone`などを活用。
- **React の state 更新**：オブジェクトのプロパティを直接変更せず、必ずスプレッド構文などで 新しいオブジェクト を生成して `setState` に渡す。

これらを正しく理解しないと、意図した再レンダリングが起きなかったり、状態が不意に書き換わったりするので、しっかり理解して実装していきたいと思います！