# lambda-imagemagick

- API Gateway 作成
- lambda function 作成
- CORS を有効化
- [image\-magick\-lambda\-layer \- AWS Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:145266761615:applications~image-magick-lambda-layer) をデプロイ
- layer を使用
- zip archive をデプロイ

```
$ ./create-archive.sh

or

$ zip -r deploy.zip ./
```

参考: [BiteSizeAcademy/lambda\-imagemagick\-demo](https://github.com/BiteSizeAcademy/lambda-imagemagick-demo)

jpg, png の画像url をPOST。 
