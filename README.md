# （アプリ名）

## 1. 概要
- アプリの一言説明：
- デモURL（本番環境）：
- テストアカウント：
  - email: guest@example.com
  - password: password1234

## 2. 開発背景（なぜ作ったのか）
- 課題：
- 解決したいこと：
- 主要な工夫：

## 3. デモ画像 / 操作方法
### 主要画面
- 画像（スクショを貼る）
- 画像（スクショを貼る）

### 操作手順（採用担当者向け）
1. 本番URLへアクセス
2. テストアカウントでログイン
3. ルーム一覧 → ルーム詳細 → メッセージ確認

## 4. 使用技術
### フロントエンド
- Next.js / TypeScript
- （UIライブラリ等）
- NextAuth（認証）など

### バックエンド
- Ruby on Rails（API）
- PostgreSQL
- 認証（Devise / JWT 等）

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
flowchart LR
  U[User] -->|HTTPS| V[Vercel\nNext.js]
  V -->|API| ALB_DNS[api.chatroomblog.com]
  ALB_DNS --> ALB[ALB 443 (ACM)]
  ALB --> TG[TargetGroup 80]
  TG --> NGINX[nginx 80]
  NGINX --> RAILS[Rails(Puma) 8000]
  RAILS -->|5432| RDS[(RDS PostgreSQL)]
  NGINX --> CW[(CloudWatch Logs)]
  RAILS --> CW
