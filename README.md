# gulpfile
SassとJadeのコンパイルと圧縮、JavaScriptの圧縮とファイルの結合ができます。またbrowser-syncによるライブリロードにも対応しています。

エラーが出た場合は処理を停止させず、デスクトップ通知されます。コンパイル元のファイルは`source`ディレクトリに置いてください。コンパイル先のファイルは`build`ディレクトリに出力されます。

## 使い方
使い方は簡単でwatchタスクを実行するだけです。

```bash
gulp watch
```

## CSS
CSSでできることは以下の通りです。

* scssからCSSにコンパイル
* source mapの出力
* ベンダープレフィックスの自動付与
* csscombで整形と宣言の順番を変更

## HTML
HTMLでできることは以下の通りです。

* JadeからHTMLにコンパイル

## JavaScript
JavaScriptでできることは以下の通りです。

* source mapの出力
* jsディレクトリ内の.jsファイルを圧縮
* jsディレクトリ内の.jsファイルを結合