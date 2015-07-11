browser-uploader-demo
---

## Demo

http://browser-uploader-demo.s3-website-ap-northeast-1.amazonaws.com/

## 下準備

### S3

1.S3バケット作成
2.Static Web Hosting設定
3.CORS設定

CORS設定サンプル

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>http://browser-uploader-demo.s3-website-ap-northeast-1.amazonaws.com</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

### Cognito

1.Cognito identity pool作成（匿名ID発行を許可）
2.匿名ユーザー用のIAM RoleにS3へのPutObjectおよびPutObjectAcl、DynamoDBへのScanを許可

ロールポリシーサンプル

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1436605832000",
            "Effect": "Allow",
            "Action": [
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-1:XXXXXXXXXXXX:table/browser-uploader-demo-uploads"
            ]
        }
        {
            "Sid": "Stmt1436545283000",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::browser-uploader-demo/upload/*"
            ]
        }
    ]
}
```

## DynamoDB

config/default.json で設定したテーブルを作成

キー Key (文字列)

レンジキー CreatedAt (文字列)

## Lambda

S3と同じリージョンにファンクション作成

ZIPアップロードかS3へのZIP配置のどちらか

handler

browserUploaderDemo.handler

新しいIAMロールを作成

lambda_browser_uploader_demo_execution

IAMで`lambda_browser_uploader_demo_execution`のロールポリシーを追加

S3 GetObject および DynamoDB putItem を許可

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1436603300000",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::browser-uploader-demo/upload/*"
            ]
        },
        {
            "Sid": "Stmt1436603324000",
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-1:XXXXXXXXXXXX:table/browser-uploader-demo-uploads"
            ]
        }
    ]
}
```

S3にアップロードされたらLambaファンクションを実行するように設定

Add event source

Event Source Type S3

Bucket 指定したバケット

Event Type Object Created


## LambdaにアップロードするZIPについて

ZIPに含めるのは

- browserUploaderDemo.js
- config/default.json
- node_modules

注意するのはZIPのルート直下に配置すること。（フォルダ内ではない）
プロジェクトフォルダごとZIPするとモジュールが見つからない的なエラーが発生する。

### node_modules

```
npm install
```

### TODO

S3から削除されたファイルをDynamoDBから消すLambdaファンクション





