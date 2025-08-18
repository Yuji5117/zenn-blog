---
title: "Reactコンポジションで不要な再レンダリングを防ぐ"
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: []
published: false
---

## 動機
最近、Reactのパフォーマンスチューニングに興味を持ち、「不要な再レンダリングを防ぐ」ことが本質だと再確認しました。とくに下記YouTubeチャンネルのショート動画で紹介されていたテクニックを深掘りし、自分の言葉で整理しておきたく、本記事にまとめます。

https://www.youtube.com/@cosdensolutions

## 狙い
仕組み理解 → コンポジション設計 → 不要レンダー回避を実践できるようになること。

## コード

まずは以下のコードで、不要な再レンダリングが起きる状態を確認します。

``` ts
function Parent() {
  const [count, setCount] = React.useState(0);

  console.count('Parent render');

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>increment</button>
      <p>count: {count}</p>
      {/* 子は count に依存していないのに毎回実行される */}
      <VeryHeavyComp />
    </div>
  );
}

function VeryHeavyComp() {
  console.count('VeryHeavyComp render');
  // 重い処理の代わりに擬似負荷（デモ用）
  let s = 0;
  for (let i = 0; i < 1e6; i++) s += i;
  return <div>Very Heavy UI</div>;
}
```

上記のコードはよくあるカウンターコンポーネントになります。
increment を押すと count が増えて Parent が再レンダリングされますが、VeryHeavyComp は count に依存していないのに 毎回いっしょに再レンダリングされます。

これは、**親が再レンダリングされると、親の JSX に“直に書かれている子”も再評価される**ためです。

では、コンポジションを使って書き換えてみます。

``` tsx

function App() {
  return (
    <Parent>
      <VeryHeavyComp />
    </Parent>
  );
}

function Parent({ children }: { children: React.ReactNode }) {
  const [count, setCount] = React.useState(0);

  console.count('Parent render');

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>increment</button>
      <p>count: {count}</p>
      {/* 親が再レンダリングされても、再レンダリングされない */}
      {children}
    </div>
  );
}

function VeryHeavyComp() {
  console.count('VeryHeavyComp render');
  // 重い処理
}
```

上記のように、<VeryHeavyComp /> を children として<Parent />に渡します。これにより、increment ボタンを押して<Parent />が再レンダリングされても、children に渡している React 要素の参照が変わらないかぎり、<VeryHeavyComp /> 配下のサブツリーは評価がスキップされます。つまり 親だけが再レンダリングされ、<VeryHeavyComp /> は再レンダリングされません。

これで不要な再レンダリングを防げる、次から使おう！と言いたいところですが、なぜ、こうかくと再レンダリングされないのかもう少し深ぼってみます。


## なぜ再レンダリングが発生しない？

propsとして渡されたchildrenはただのReact要素（不変のオブジェクト）で、親がレンダリングされても、chidlrenであるReact要素は作り替えられないため、同じオブジェクトとして評価される、そのため、再レンダリングがされない。

レンダリング起きるタイミングとして、propsが変更されたかどうかがあります。
今回childrenとして渡している＜＞は、親の中では、定義されていないため、レンダリングが起きても作り替えられません。
そのため、親のレンダリングが起きても子に渡すchildrenのReact要素は同じなため、再レンダリングが発生しません。

例えば以下のコードだと再レンダリングが発生してしまいます。
なぜなら、が再レンダリングされるたびに、childrenのReact要素が毎回新しいオブジェクトとして生成されるためです。

なので、もし、このケースで再レンダリングを防ぎたい場合は、useMemoを使用して、メモ化して同一のオブジェうとであることを保証して渡す必要があります。


## 改めてコードを見てみる

## まとめ

## 参考記事
https://www.developerway.com/posts/react-elements-children-parents