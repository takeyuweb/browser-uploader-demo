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
2.匿名ユーザー用のIAM RoleにS3へのPutObjectおよびPutObjectAclを許可

ロールポリシーサンプル

```json
{
    "Version": "2012-10-17",
    "Statement": [
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

## TODO

Lambda や DynamoDB と組み合わせてよくあるアップローダをにしてみる



