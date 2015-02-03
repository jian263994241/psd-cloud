# psdsync

Photoshop cc2014 应用扩展   管理共用的 psd 组件  适用于 cc2014 2.0以后的 版本 。


## 编译

### ZXPSignCmd

```
$ ./ZXPSignCmd.exe -sign ./extension extension.zxp selfDB.p12 123456 -tsa http://timestamp.comodoca.com/rfc3161

```
### UCF
```

$ java -jar ucf.jar -package -storetype PKCS12 -keystore selfDB.p12 -storepass 123456 -tsa  http://timestamp.comodoca.com/rfc3161 extension.zxp -C ./extension .

```