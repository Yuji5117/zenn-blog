---
title: "【React】絶対パスでインポートできるようにして、エイリアスを設定しよう"
emoji: "😎"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [React, Nesxtjs, Typescript, Javascript, tsconfig]
published: true
---

# 動機

現在、React をキャッチアップ中でディレクトリ構成の参考として、`bulletproof-react`をみていたのですが、インポート時に`import { Button } from '@/components/Elements';`てな感じで絶対パスでインポートされていたので、真似してみることにしました！
あと、他のリポジトリでも良く`@`を見かけることがあったので、なんとなく憧れていたのは秘密にしておきます www

前提として、Typescript を使っているため、tsconfig に関してのみ記載しております。

https://github.dev/alan2207/bulletproof-react

# そもそも絶対パスってなんじゃい？

ファイルのインポート方法は、`相対パス`と`絶対パス`の 2 種類があり、
絶対パスは、他のファイルを import してくる際に、指定されたデレクトリを起点にしてパスを書きます
一方、相対パスは、自分がいるディレクトリを起点にしてパスを書きます。

React では、初期設定は絶対パスではなく相対パスになっているため、絶対パスにする際は各自で設定が必要です！

設定自体は超簡単です。

# 絶対パスに設定する方法

`tsconfig.json` ファイルの`compilerOptions`に`baseUrl`を追記するだけです。

```
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"

    "baseUrl": ".", ⇦ 追加するだけ
  },
  ...

```

`"baseUrl": "."`にすることで、ルートディレクトリを起点に絶対パスを記載できます。
`.`を`src`に変更すると`src`が起点となりますので、用途に合わせて設定してください。

# エイリアスを設定しよう

よく使うコンポーネントなどを import する場合、毎回毎回、パスを書くのは面倒。特に階層が深いとパスの記述量も増えていきます。
そこで、そのようなパスをエイリアス化することで、記述量も減りスッキリするかと思います。

設定方法は、tsconfig に以下のように`paths`を追記します。

```
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"

    "baseUrl": ".",
    "paths": {             ⇦ 追加する
      "@/*": ["./src/*"]
    }
  },
  ...

```

`@`の箇所は、`@hoge`などに任意のエイリアス名に設定が可能です。
上記の設定だと、`src`を`@`と記載してパスに書くことができます。

```
// エイリアスなし
import { Todo } from "src/types/index";

// エイリアスあり
import { Todo } from "@/types/index";
```

エイリアスは複数設定が可能ですので、任意で必要なだけ設定すればいいのかなと思います。

# 絶対パスにすると何が嬉しい？

ディレクトリ構成が複雑化してくると、異なる階層のファイルをインポートしてくる必要があったりして、相対パスだとかなり大変だなと感じました。

特に、一度ルートディレクトリに戻って、他のディレクトリのファイルを読み込む場合は`../`の記述が増えてよくわからなくなりそう...

その点、絶対パスだとルートディレクトリに戻るための記述は不要なので、よりスッキリしたパスになり、どのファイルを読み込んでいるか追いやすくなるかと思います。

他にも、ファイルを他のディレクトリに移動した場合に、import のパスを変更しないといけないので、この面倒くささも解消できます。

エイリアスなども駆使すると、よりパスの記述量も減らせて、どのディレクトリのファイルを読み込んでいるかも認識しやすくなるのかなと思います。

# まとめ

絶対パスの設定は簡単で、メリットも多いので、導入した方がいい！

# おまけ

tsconfig のオプション設定は、他のファイルに切り出して管理できたりします。
今回のケースだと、`tsconfig.paths.json`を作成し、以下を記載します。

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

そして、tsconfig ファイルで`extends`を追記し読み込んであげれば、同じ設定内容になります。

```
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules"],
  "extends": "./tsconfig.paths.json"　⇦ 追加し読み込む
}
```

tsconfig ファイルのオプションに関してまとまった良い記事があったので是非一読ください！
https://qiita.com/ryokkkke/items/390647a7c26933940470

# 参考記事

https://qiita.com/tkeshiino21/items/ac442edabe9ff1b6720c

https://reigle.info/entry/2022/08/22/100000

https://zenn.dev/nbr41to/articles/84f4a7a7c1c165af2ef7
