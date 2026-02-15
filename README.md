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

### テスト結果の共有

PlaywrightのUIモード (`--ui`) はローカルデバッグ用であり、その画面を直接ファイルとしてエクスポートする機能はありません。
テスト結果を他者に共有したい場合は、**HTMLレポート** (`playwright-report` フォルダ) を使用してください。

1. テストを実行してレポートを生成します (`npx playwright test`)
2. 生成された `playwright-report` フォルダ全体を共有します（ZIP圧縮など）
3. 受け取った人は、以下のコマンドでレポートを閲覧できます:

```bash
npx playwright show-report path/to/report-folder
```

> **注意:** `index.html` を直接ブラウザで開くと、セキュリティ制限により正しく表示されない場合があります。必ず `show-report` コマンドやVS CodeのLive Serverなどを使用してください。

### 実行済みのテスト詳細を確認する (Trace Viewer)

テスト実行時の挙動（スクリーンショット、ネットワークログ、コンソールログなど）を、タイムラインで後から再生・確認するには、**トレース機能**を使用します。

1. トレースを有効にしてテストを実行します:

```bash
npx playwright test --trace on
```

2. レポートを表示します:

```bash
npx playwright show-report
```

3. レポート内の各テストケースにある **Trace** アイコンをクリックすると、実行時の様子がUIモードのように再生されます。

### トラブルシューティング

#### ポート競合 (EADDRINUSE)

`show-report` を実行した際、`Error: listen EADDRINUSE: address already in use ::1:9323` というエラーが発生した場合、デフォルトのポート (9323) が既に使用されています（前回のプロセスが残っているなど）。

**解決策:** 別のポートを指定して実行してください。

```bash
npx playwright show-report --port 9324
```

もし頻繁に発生する場合は、タスクマネージャー等で `node.exe` プロセスを終了させてください。
