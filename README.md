# ツナガル

## 1. 概要
![ツナガル](assets/tsunagaru.png)
- デモURL（本番環境）：[chatroomblog.com](https://chatroomblog.com/)
- テストアカウント：
  - email: guest1@example.com
  - password: password1234

## 2. 開発背景（なぜ作ったのか）
私は色んな人と話すことが好きで、人と人が気軽につながり、楽しめるコンテンツを作りたいと考えていました。しかし、既存のサービスにはシンプルで使いやすいが、UIが古風（例：4chan）、モダンだが機能が多すぎて初心者には使いづらいもの（例：X、Discord）です。そこで私は、シンプルさとモダンさの中間にあるアプリを作りたいと考え、その構想から生まれたのが「ツナガル」 です。

## 3. 使用技術
### フロントエンド
- React 19.2.3
- Next.js 15.5.9
- TypeScript 5.9.3
- NextAuth 4.24.13

#### UI / デザイン
- Mantine 8.3.12
- Tailwind CSS 3.4.19
- Headless UI 2.2.9
- Tabler Icons 3.36.1
- Framer Motion 12.23.26

#### コード品質
- ESLint 9.39.2

#### テスト
- Jest 30.2.0
- React Testing Library 16.3.2

### バックエンド
- Ruby 3.3.8
- Rails 7.2.3
- PostgreSQL 1.5.9

#### コード品質
- rubocop 1.81.7

#### テスト
- rspec-rails 8.0.2

### インフラ
- Vercel（フロント）
- AWS: ECS(Fargate), ALB, RDS(PostgreSQL), CloudWatch Logs
-（必要なら）VPC Endpoint（ECR/Logs/SSM系）

## 5. 機能一覧
- ユーザー登録 / ログイン
- ルーム作成 / 一覧
- メッセージ投稿 / 一覧
- （実装済みのものを列挙）

## 6. インフラ構成図
```mermaid

