---
title: "分割代入で変数名を変更する方法"
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "javascript", "typescript"]
published: true
---

React と TypeScript を使用した個人開発中に、汎用的なローカルストレージのカスタムフックを作成していました。ですが、そのカスタムフックを使用する際、分割代入で変数名を変更する方法について忘れてしまったので、それについての簡単なメモを記載します。

## 結論

以下のように、**変数名の横に`:`を追記し、新しい変数名を書くだけです！**

```js
const obj = {
  name: "Taro",
  age: 25,
  country: "Japan",
};

const { name: firstName, age: yearsOld, country: nation } = obj;

console.log(firstName); // Taro
console.log(yearsOld); // 25
console.log(nation); // Japan
```

## 今回の問題のコード

今回、書いているコードは以下で、オブジェクトで state や関数を返しているカスタムフックになります。

```js
import { useEffect, useState } from "react";

export const useLocalStorage = (key: string) => {
  const [state, setState] = useState < string > "";

  useEffect(() => {
    const initializer = (key: string) => {
      const value = localStorage.getItem(key) || "";
      setState(value);
    };

    initializer(key);
  }, [key]);

  const set = (value: string) => {
    try {
      localStorage.setItem(key, value);
      setState(value);
    } catch {
      console.error("ローカルストレージへの保存が失敗しました。");
    }
  };

  const remove = () => {
    try {
      localStorage.removeItem(key);
      setState("");
    } catch {
      console.error(`ローカルストレージの${key}の値の削除に失敗しました。`);
    }
  };

  return { state, set, remove };
};
```

そして、呼び出し側では、remove 関数のみ使用する必要がありました。
また、呼び出し側のコードの冗長性をなくす意図として、返り値を配列ではなくオブジェクトにしております。

もし、配列で返してしまうと、呼び出し側が下記のコードのようになってしまいます。

```js
const [, , remove] = useLocalStorage(sourceWord);
```

オブジェクトで返すと以下になり、スッキリします。

```js
const { remove } = useLocalStorage(key);
```

## 呼び出し側のコード

わざわざ、変数名を変える必要はない単純なケースもあると思いますが、今回は、「対象のお気に入りしたデータを削除する」という要件なので、以下のように名前を明確にした方がいいと判断しました。

```js
const { remove: removeFavorite } = useLocalStorage(key);
```

こうすることで、何を remove するかが明確になったかと思います。

## まとめ

今回、分割代入を使った変数名の変更方法について紹介しました。
変数名を適切に変更することは、コードの可読性やメンテナンス性の向上に役立ちます。

また、カスタムフックの返り値を配列かオブジェクトのどちらで返すべきかは、開発者間での議論の対象となることがあるようです。このトピックに関しても、近いうちに記事としてまとめたいと思っています。

おまけ：以下が「配列 or オブジェクトで返すか」に関する読んだ記事になりますので、ぜひ読んでみてください。
https://blog.ojisan.io/why-hooks-need-array/
