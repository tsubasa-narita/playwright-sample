# SCM システム (Vue 3 + TypeScript + Vite)

このプロジェクトは、レガシーSCMシステムをVue 3、TypeScript、およびViteを用いてリファクタリングしたものです。

## プロジェクトセットアップ

```bash
npm install
```

### 開発サーバーの起動（ホットリロード付き）

```bash
npm run dev
```

### 本番用ビルド（型チェックとミニファイを含む）

```bash
npm run build
```

## E2Eテスト (Playwright)

このプロジェクトでは、エンドツーエンド（E2E）テストに [Playwright](https://playwright.dev/) を使用しています。

### テストの実行

ヘッドレスモードで全てのテストを実行する場合:

```bash
npx playwright test
```

UIモードでテストを実行する場合（インタラクティブデバッグ）:

```bash
npx playwright test --ui
```

### レポートの確認

テスト実行後、以下のコマンドでHTMLレポートを確認できます:

```bash
npx playwright show-report
```

### トラブルシューティング

#### ポート競合 (EADDRINUSE)

`show-report` を実行した際、`Error: listen EADDRINUSE: address already in use ::1:9323` というエラーが発生した場合、デフォルトのポート (9323) が既に使用されています（前回のプロセスが残っているなど）。

**解決策:** 別のポートを指定して実行してください。

```bash
npx playwright show-report --port 9324
```

もし頻繁に発生する場合は、タスクマネージャー等で `node.exe` プロセスを終了させてください。
