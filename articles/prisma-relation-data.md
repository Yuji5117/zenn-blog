---
title: "【Prisma】リレーション先のデータを取得する方法"
emoji: "🦍"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [React, Nesxtjs, Typescript, Javascript, Prisam]
published: true
---

# inculed を使用する

Join してリレーション先のデータを取得したい場合は、以下のように inculed を使用して取得することができる。

```
async findAll(): Promise<Habit[]> {
    return await this.prisma.habit.findMany({ include: { habitStatus: true } });
}
```
