---
title: "【React】カスタムフック入門: useToggleフックを実装してみよう！💫"
emoji: "🌟"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "javascript", "typescript"]
published: true
---

## 概要

最近の個人開発プロジェクトで、"コンポーネントのロジックをカスタムフックに切り出すように実装することがあります。
アウトプットの一環で、簡単な toggle 機能をカスタムフックで実装しながら、カスタムフックの基本を理解できたらと思います！

## カスタムフックとは？

カスタムフックは、React の Hooks 機能を利用して独自で定義した Hooks のことを指します。
また、カスタムフックを実装する際は、以下のようなルールがあります。

- 関数名は、必ず use で始めること。
- トップレベルの関数内でのみ呼び出すことができる。ループ、条件、またはネストされた関数内ではフックを呼び出すことはできない。
- React 関数コンポーネント内、または、カスタムフック内でのみ使用できる。

カスタムフックを利用することで、以下の利点を得られると思います。

- コンポーネント内のロジックをカスタムフックとして切り出すことで、責務を分離できる。
- カスタムフックに切り出したロジックは、他のコンポーネントやカスタムフックで再利用できる。
- テストが容易になります。

## Toggle 機能を実装

それでは、先ほどの特徴をカスタムフックを作成していきたいたいと思います。
まずは、カスタムフックを使用せずに簡単な Toggle 機能を実装します。
以下がコードになります。

```js
import { useState } from "react";

function ToggleComponent() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div>
      <p>The shop is {isOpen ? "Open!!!" : "Closed!!"}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

export default ToggleComponent;
```

上記のコードは非常にシンプルで、ボタンをクリックするごとに isOpen の bool 値が切り替わり、その bool 値に応じて表示する文字列も切り替わる、簡易的な toggle 機能を持つコンポーネントです。

このコードでは、ToggleComponent は isOpen の状態を管理・更新する責務と、画面に描画する view の責務を担っています。React の関数コンポーネントでは、できるだけロジック部分を切り出し、view の責務に集中させることで、見通しの良い、読みやすいコンポーネントを作成することができます。

## useToggle カスタムフックを実装しよう

次は、カスタムフックを使って、ToggleComponent から`isOpen`状態を管理し更新する責務を切り出しましょう！
以下がコードになります。

```js
import { useState } from "react";

const useToggle = (): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(false);
  const toggle = () => setState((prev) => !prev);

  return [state, toggle];
};

function ToggleComponent() {
  const [isOpen, toggleIsOpen] = useToggle();

  return (
    <div>
      <p>The shop is {isOpen ? "Open!!!" : "Closed!!"}</p>
      <button onClick={toggleIsOpen}>Toggle</button>
    </div>
  );
}

export default ToggleComponent;
```

以下のように、`use`で始まる useToggle 関数を作成し、その関数内で`isOpen`の状態管理と更新のロジックを切り出しました。
さらに、useToggle は state や set 関数の名前を抽象的にして、再利用しやすくなるようにしました。

````js
// カスタムフックに状態の管理と更新のロジックを切り出す
const useToggle = (): [boolean, () => void] => {
 const [state, setState] = useState<boolean>(false);
 const toggle = () => setState((prev) => !prev);

 return [state, toggle];
};```

````

そして、作成した useToggle を ToggleComponent 内で呼び出し、state と toggle 関数を取り出し、適切な箇所に使用しました。呼び出す際に、名前を呼び出すコンポーネントに合わせて、命名が明示的になるようにしました。

```js
function ToggleComponent() {
  // カスタムフックを呼び出す
  const [isOpen, toggleIsOpen] = useToggle();

  return (
    <div>
      <p>The shop is {isOpen ? "Open!!!" : "Closed!!"}</p>
      <button onClick={toggleIsOpen}>Toggle</button>
    </div>
  );
}

export default ToggleComponent;
```

また、useToggle は他のコンポーネントでも同様に呼び出すことができます。他のコンポーネントで改めて呼び出した際は、それぞれが独立した state として認識されるため、互いの state が同時に変更されることはないという点に注意する必要があります。

## 今のところ、カスタムフックは積極的に使った方が良さそう。

以上が、カスタムフックの基本的な実装方法になります。今回の例はコード量が少なく、実装もシンプルだったため、カスタムフックの恩恵はあまり感じられないかもしれません。しかし、カスタムフックはコードの再利用性、読みやすさ、保守性を大いに向上させることができます。

実際、個人で開発を行う際やリファクタリングをする際には、カスタムフックを利用してコンポーネントからロジックを切り出すようにしています。これにより、1 ファイルあたりのコード量が減少し、コードがスッキリとして読みやすくなります。また、ロジックを切り出す際には、そのカスタムフックを他の場所でも再利用できないかを常に検討しています。

個人的には、積極的にカスタムフックを利用する方針を採用しています。

以下のリポジトリでは、多くのカスタムフックの例が紹介されているので、興味があればぜひ参照してください。

https://github.com/streamich/react-use

以下は、React 公式: カスタムフックによるロジックの再利用

https://react.dev/learn/reusing-logic-with-custom-hooks
