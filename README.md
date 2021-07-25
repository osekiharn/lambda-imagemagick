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

jpg, png の画像url をPOST。 Buffer が返るので base64 に変換する。

```
// sample
!function(){const t=document.querySelectorAll("img"),e=async function(a){a.preventDefault();try{await navigator.clipboard.writeText(JSON.stringify(a.target.src));const n=await fetch(【 your API endpoint 】,{method:"POST",body:JSON.stringify({url:a.target.src})}),o="data:image/png;base64,"+function(t){let e="",a=new Uint8Array(t),n=a.byteLength;for(let t=0;t<n;t++)e+=String.fromCharCode(a[t]);return window.btoa(e)}((await n.json()).body.data),r=document.createElement("a");document.body.appendChild(r),r.href=o,r.download="download.png",r.click(),r.remove()}catch(a){alert(a)}finally{t.forEach(t=>{t.removeEventListener("click",e)})}};t.forEach(t=>{t.addEventListener("click",e)})}();
```
