# SCM Manager - 作業履歴

## プロジェクト概要

テスト用のSCMシステム（受注管理画面）を Vue.js + TypeScript でリファクタリング。  
Vite を使用した SPA (Single Page Application) 構成。  
サーバー不要で `dist/index.html` または `npm run dev` で動作する。

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Vue.js 3 (Composition API) |
| 言語 | TypeScript |
| ビルドツール | Vite |
| ルーティング | Vue Router |
| CSS | Vanilla CSS (Scoped & Global) |

## ファイル構成

```
c:\develop\scm\
├── _legacy/             ... リファクタリング前の旧ファイル
├── src/
│   ├── assets/          ... 静的アセット
│   ├── components/
│   │   ├── layout/      ... Header, Sidebar
│   │   ├── scm/         ... OrderTable, FilterPanel, SummaryCards
│   │   └── ui/          ... BaseModal, ToastNotification
│   ├── composables/     ... useToast (トースト状態管理)
│   ├── router/          ... Vue Router 設定
│   ├── services/        ... api.ts (Mock API & Data)
│   ├── types/           ... TypeScript 型定義 (Order, Customer等)
│   ├── views/           ... OrderListView.vue (メイン画面)
│   ├── App.vue          ... ルートコンポーネント
│   ├── main.ts          ... エントリポイント
│   └── style.css        ... グローバルスタイル (旧 style.css を移植)
├── index.html           ... エントリHTML
├── package.json         ... 依存関係定義
└── WORK_LOG.md          ... 本ファイル
```

## 更新履歴

### 2026-02-15: Vue.js + TypeScript リファクタリング

- **SPA化**: `index.html` + `app.js` の構成から、Vueコンポーネントベースの設計へ移行。
- **TypeScript導入**:
    - `Order`, `Product` 等のインターフェースを定義し、型安全性確保。
    - `api.ts` のモックデータ生成ロジックを型付け。
- **コンポーネント分割**:
    - `TheHeader`, `TheSidebar`: レイアウト部品。
    - `OrderTable`: 受注一覧表示（ページネーション、ソートロジック内包）。
    - `FilterPanel`: 検索条件入力フォーム。
    - `SummaryCards`: 集計ロジックを `computed` で実装。
    - `BaseModal`: 汎用モーダルコンポーネント。
- **状態管理**:
    - `useToast`: トースト通知の状態を管理する Composable を実装。
- **スタイル移植**:
    - 旧 `style.css` を `src/style.css` に移植し、一部コンポーネント固有のスタイルは `Scoped CSS` に移行可能（現状はグローバル適用）。

## 実装済み機能 (Feature Parity)

旧バージョン(`_legacy`)の機能を完全に再現:
- [x] ヘッダー・サイドバー表示
- [x] ダミーデータ生成・APIモック (遅延シミュレーション付き)
- [x] サマリー集計 (件数・金額・処理待ち・遅延)
- [x] 受注一覧表示・ソート・ページネーション・全選択
- [x] 検索フィルター (条件による絞り込み)
- [x] 詳細モーダル表示
- [x] 新規受注モーダル (UIのみ)
- [x] CSV出力 (トーストのみ)

## 起動方法

### 開発サーバー起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```
生成された `dist/` ディレクトリを配信可能。
