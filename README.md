# Google Apps Scrip を単体テストしながら開発するためのモロモロ
Google Apps Script(GAS) 開発でローカル環境で開発したり、単体テストしたり、デプロイ先(Dev/Prod)を切り替えたりする開発プロジェクトのテンプレ。  


こんな事を思ったこと有りませんか？  
* いきなり皆が使ってるGASを書き換えるのが怖い。Dev環境みたいなので動作確認したい
* ローカルの手慣れたエディタで開発したい
* ローカルでも単体テストがしたい
* Node的に良い感じにファイル分割して書きたい


こういうのを解消する一案です。

## ファイル構成
* src/*
  * ソースコード
* src-test/*
  * 単体テストコード
* src-mock/*
  * GASのモックファイル(SpreadSheetAppとかの)
  * オマケでリアルにHTTP通信を受け取るHTTPサーバーのモックも有るよ
* src-mock/Test*
  * モックの単体テストコード

## 大まかな仕組み解説
* Google Drive上のGASプロジェクトをローカルにDLしたり、逆にULしたりするのにはGoogle公式ツール、「[clasp](https://github.com/google/clasp)」を使っっています
* Node的にファイル分割されたファイルをGASでも動くように変換するには「[gasify](https://github.com/fossamagna/gasify)」を使っています
* 単体テストには「[GasT](https://github.com/huan/gast)」を使っています

## 環境準備(for Mac)
```
$ brew install node
$ npm install -g browserify
$ npm install -g @google/clasp
$ npm install
```

よしなにググって clasp login までやっておくこと。

```
$ cp clasp_dev.json.sample clasp_dev.json
$ cp clasp_prod.json.sample clasp_prod.json
```
各 clasp_xxx.json の scriptId に開発用や本番用に使う Google Apps Script プロジェクトのプロジェクトIDを記載しておく。

### Google Dirveからコードをダウンロード
既存のコードをベースに開発をするときは既存のコードをまずDL
```
$ ./build.sh -s [-t prod]
```

## ビルド
Browserify＆gasify します。

### 開発環境向けビルド
```
$ ./build.sh -b
```
### 本番環境向けビルド
```
$ ./build.sh -b -t prod
```

## ビルド ＆ デプロイ
### 開発環境へデプロイ
```
$ ./build.sh -b -d
```

### 本番環境へデプロイ
```
$ ./build.sh -b -d -t prod
```

## 単体テスト
### ローカル環境で単体テスト
1. テスト実行
```
$ node -e "require('./src-test/MockTestRunner'); gastTestRunner();"
```

### 開発環境で単体テスト
1. ビルド＆デプロイ
```
$ ./build.sh -b -d -e ./src-test/RealTestRunner.js
```

2. GASのテスト用プロジェクトを開いて、「gastTestRunner」関数を実行すると単体テストが実行できる。実行結果はログに出力される。

### ローカル環境でモッククラス自体の単体テスト
```
$ node -e "require('./src-mock/TestRunner'); gastTestRunner();"
```
