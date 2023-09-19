---
title: "【React】関数型アップデートで useState の落とし穴を避ける"
emoji: "😸"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "javascript", "typescript"]
published: true
---

# 動機

React と Typescript を使用した個人開発を進めている中で、useState フックの使用方法に関して混乱する箇所があるなと感じました。特に、状態を更新する際に直接値を変更する方法と関数型アップデートを使用する方法の間での選択は、初心者にとって混乱の原因となる場合があるかと思います。

なので、今回は関数型アップデートを使って「useState」のちょっとした落とし穴を避ける方法を深掘りしたいと思い記事にしました！

# そもそも直接値と関数型アップデートって何？

useState を用いて状態を更新する方法として`直接値`と`関数型アップデート`があります。
それぞれの違いを簡単に言えば、

- 直接値は、ステートを直接変更する方法で、 **新しい値をそのままセットするだけ** になります。
- 関数型アップデートは、 **現在のステートを引数として受け取り、新しいステートを返す関数を使用してステートを更新する。** これにより、 **前のステートの値を使用して新しい値を計算する** ことができます。

以下にてそれぞれのコードを簡易的に記載してます！

### 直接値

```js
const [count, setCount] = useState(0);

const increaseOne = () => {
  setCount(count + 1); // countを直接セットしている
  // countは1になる
};

increaseOne();
```

### 関数型アップデート

```js
const [count, setCount] = useState(0);

const increaseOne = () => {
  setCount((prevCount) => prevCount + 1); // 関数の引数で現在のステートとして受け取り、それを用いて、値を更新している
  // countは1になる
};

increaseOne();
```

# 問題点

先ほどの簡易的な例を見ると、どちらの場合も `count` は最終的に `1`となり、意図した結果が得られるように見えます。しかし、次のコードはどうでしょうか？

```js
const [count, setCount] = useState(0);

const increaseDouble = () => {
  setCount(count + 1);
  setCount(count + 1);
  // countの合計値は？
};

increaseDouble();
```

一見すると、`count` の合計値は `2` でしょ！となると思いますが、実際には `1` になります。
ここの挙動がまさに今回の落とし穴になります！

ここでの問題は、`setCount` 関数が即時に `count` の状態を更新しないために発生します。React の useState フックでは、状態の更新は非同期に行われます。useState の `setCount` 関数が非同期に動作するため、レンダリング後に `setCount` の値が一括で更新されます。

この非同期性のために、increaseDouble 関数の中で二回連続して `setCount` を呼び出すと、二度目の呼び出しでは `count` の更新がまだ反映されていない状態を参照してしまいます。
つまり、以下のような流れとなります：

1. 最初の `setCount(count + 1)`が呼び出される。
2. ただし、この時点では `count` はまだ `0` です（非同期更新のため）。
3. すぐに二度目の `setCount(count + 1)`が呼び出される。
4. 二度目の呼び出しも `count` が `0` であると認識しています（最初の更新がまだ完了していないため）。

そのため、両方の `setCount` 呼び出しは、実際には `count` を `0` から `1` に変更するという同じ操作を行ってしまいます。

# 解決策

先ほどの落とし穴を回避するための解決策は、 **`setCount` に関数型アップデートを使って、常に現在（最新）の状態を基に更新を行えるようにする必要があります。**
この形式では、`setCount` 関数に前の状態を引数として取る関数を渡します。これによって、前の状態に基づいた確実な更新が行えるようになります：

```js
const [count, setCount] = useState(0);

const increaseDouble = () => {
  setCount((prevCount) => prevCount + 1);
  setCount((prevCount) => prevCount + 1);
  // countの合計値2になる！
};

increaseDouble();
```

# 結局は常に関数型アップデートを使えばいいてこと？

こちらに関しては、[こちらの](https://react.dev/reference/react/useState#is-using-an-updater-always-preferred)React 公式ドキュメントに記載がありました。

ほとんどの場合、直接値と関数型アップデートの 2 つには違いがないようで、関数型を常に使った方が良いというわけでもないようです。
今回の例のように、同じイベント内で複数の更新を行う場合や、同じイベント内で更新後の値にアクセスして何かしらの処理を行いたいといったケースに遭遇した時に関数型アップデートを使うようにすれば一旦良いのでは？と感じました。

なので、結論としては常に使う必要はなく、行いたい処理に応じて使い分けるといった感じでしょうか。

# まとめ

- useState フックには、[直接値](#直接値)と[関数型アップデート](#関数型アップデート)の 2 つの更新方法がある
- 直接値を使った更新だと、同じイベント内で、複数回更新したい場合に更新がうまくできないケースがあるため、その際は関数型アップデートを使用して、現在のステートを使って更新することで落とし穴を避けることができる。
- 常に関数型アップデートを使う必要はなく、今回のような落とし穴にはまるケースの時に使う感じで良さそう。

# 参考記事

https://zenn.dev/syu/articles/3c4aa813b57b8c

https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
