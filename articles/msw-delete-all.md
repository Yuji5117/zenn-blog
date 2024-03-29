---
title: "【msw】mswjs/dataで全てのデータを削除する方法"
emoji: "😂"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "nextjs", "nodejs", "typescript", "msw"]
published: true
---

## 動機

mswのmswjs/dataを使用して仮想DBを構築し、個人開発を進めています。開発の過程で、特定のモデルに関連するデータを全件削除する必要があり、その方法についての情報が少なかったため、調査して解決策を見つけました。
この記事は、その過程と解決策を備忘録として残すものになります。

## 全てのデータを削除する方法

結論から言うと、deleteMany 関数のwhere句の引数に空のオブジェクト`{}`を渡すだけでした！

```js
const deletedUsers = db.user.deleteMany({
  where: {},
});
```

簡単だった...
せっかくなので、以下に調査メモを記載したいと思います！

## 調査メモ

最初に、github のリポジトリの[Readme](https://github.com/mswjs/data#deletemany)を確認したのですが、deleteMany 関数を使用することで、複数のデータを削除できることはわかりました。
ですが、以下のように関数の引数に where 句を使って条件に当てはまるデータを削除する方法しか載っておらず、条件に関わらず全てのデータを削除する方法は記載されていませんでした。

```js
const deletedUsers = db.user.deleteMany({
  where: {
    followersCount: {
      lt: 10,
    },
  },
});
```

色々記事などを探した結果、直接リポジトリのソースコードを読むことにしました！
すると、`mswjs/data/src/factory.ts`ファイルに deleteMany 関数が定義されていました。

```js
deleteMany({ strict, ...query }) {
  const records = executeQuery(modelName, primaryKey, query, db)

  if (records.length === 0) {
    if (strict) {
      throw new OperationError(
        OperationErrorType.EntityNotFound,
        format(
          'Failed to execute "deleteMany" on the "%s" model: no entities found matching the query "%o".',
          modelName,
          query.where,
        ),
      )
    }

    return null as any
  }

  records.forEach((record) => {
    db.delete(modelName, record[record[PRIMARY_KEY]] as string)
  })

  return records
},
```

上記のコードを見る限り、おそらく、`executeQuery(modelName, primaryKey, query, db)`where句で条件を指定してデータを取得している関数だろうと予想しました。
そして、最後の`records.forEach`で取得したデータを削除していると推測しました。
そこで、`executeQuery`の動作を理解するためにその関数の定義を追ってみたのですが、その先のコードを追うのが大変で、他にわかる方法はないか調査したところ、以下のように`mswjs/data/test/model/deleteMany.test-d.ts`というテストコードファイルにその方法が記載されているのを見つけました。

```js
db.user.deleteMany({
  // Providing no query criteria matches all entities.
  // クエリの条件を提供しない場合、すべてのエンティティがマッチします。（日本語訳）
  where: {},
});
```

コメントに、「where 句を指定しなかった場合は、全てのエンティティが対象となる」と記載されており、実際に以下のように書くと対象のモデルのデータを全て削除できました。

```js
const deletedUsers = db.user.deleteMany({
  where: {},
});
```

他にも、`mswjs/data/src/db/drop.ts`ファイルの、drop 関数からも推測ができました。


```js
export function drop(factoryApi: FactoryAPI<any>): void {
  Object.values(factoryApi).forEach((model) => {
    model.deleteMany({ where: {} });
  });
}
```

```js
const db = factory(...models);

drop(db);
```

drop 関数は、引数に渡された db インスタンスのモデルを全て削除する機能です。
drop関数では、渡されたdbインスタンスを`Object.values`でループさせ、`model.deleteMany({ where: {} });`で各モデルのデータを全て削除しています。
このコードからも、`deleteMany({ where: {} })`でモデルの全てのデータを削除できることがわかります！！

## 気づき
今回の大きな気づきは、**リポジトリのソースコードを直接読む**ことの重要性です！！
以前、業務でも、他のライブラリのソースコードを読み、その仕様を理解できた経験もあるので、今後も積極的にソースコードを読みにいくように心がけたいと思います！
