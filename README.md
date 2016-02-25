# 设置WebStorm的字符集：

+ File --> Settings --> Editor --> File Encodings

```
IDE encoding: UTF-8
Project encoding: UTF-8
```

**windows下，执行命令行命令，需要以管理员身份打开cmd或者powershell，建议使用powershell**

# 快速运行

+ 安装Git， 参照 [帮助文档](http://code.fdjf.net/git/wenqiang/help/wiki/%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AEWindows%E6%9C%AC%E5%9C%B0git%E7%9A%84ssh%E7%8E%AF%E5%A2%83) 进行设置

+ 可选安装python *注意把Python.exe添加到PATH选项选中, 请安装python-2.XXX*

+ 安装nodejs

+ 安装npm windows里面不需要单独安装

+ 命令行执行以下命令

    ```
    $ npm install -g cnpm --registry=https://registry.npm.taobao.org
    $ cnpm install bower grunt grunt-cli gulp -g
    ```

+ 设置系统环境变量 `CHROMEDRIVER_CDNURL` 为 `http://oss-cn-hangzhou.aliyuncs.com/cnpm/dist/chromedriver/`  *一般情况下这个地址能下载*

+ 安装源代码以及依赖，git clone 版本库到目录wechat，然后执行以下命令， *如果执行`cnpm install`出错，请多次执行*

    ```
    $ cd wechat
    $ cnpm install
    $ bower install
    $ cd bower_components/angular-ui-bootstrap
    $ cnpm install
    $ grunt build:carousel
    $ cd ../../
    ```

+ 如果 *需要HTTPS* 访问，先安装openssl(注意把openssl.exe加入到PATH路径), 然后执行以下命令生成HTTPS证书

    ```
    $ openssl genrsa -out privatekey.pem 1024
    Generating RSA private key, 1024 bit long modulus
    ........++++++
    ....................................++++++
    e is 65537 (0x10001)
    $ openssl req -new -key privatekey.pem -out certrequest.csr
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    Country Name (2 letter code) [AU]:CN
    State or Province Name (full name) [Some-State]:Shanghai
    Locality Name (eg, city) []:Shanghai
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:localhost
    Organizational Unit Name (eg, section) []:localhost
    Common Name (e.g. server FQDN or YOUR name) []:localhost
    Email Address []:choudouhu@163.com
    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:
    $ openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
    Signature ok
    subject=/C=CN/ST=Shanghai/L=Shanghai/O=localhost/OU=localhost/CN=localhost/emailAddress=choudouhu@163.com
    Getting Private key
    ```
    
+ 拷贝`config/app.default.json` 到 `config/app.json` 这个文件是一些绑定到部署环境的配置

    ```
    {

      "apiBaseUrl":"https://www.XXX.com/f", //api 地址
      "appRoot":"app/dist/",//正式环境部署用 app/dist/，测试环境用 app/
      "version":"1.0.0",//正式环境每次重新build时，需要更改这个数字，这个数字对应到git的tag
      "deployServer":{//正式环境部署目录
        "host":"",
        "port":"",
        "user":"",
        "privatekey":"C:\\Users\\Administrator\\.ssh\\wechat.key", //私钥
        "path":"/home/wechat/www/fakeapp" //目录
      },
      "wechatShare":{    //微信分享接口默认参数
           "title":"花生金服",   //默认标题
           "desc":"花生金服",    //默认描述
           "imgUrl":"/images/app/logo.png"    //默认图片地址
       },
         "hjxc":{   //和记小菜接口地址
           "grantTicket":"/a/channel/interface/grantTicket",    //发卷接口
           "queryTicketInfosByMobile":"/a/channel/interface/queryTicketInfosByMobile",  //根据用户手机号查询卷详情接口
           "channelCode":"",    //渠道编码
           "agreeCode":"12345"  //约定码
       },
          "register":{ //添加一个wifi落地页全局参数，需要添加在WIFI落地页LINK（发送验证码）这个按钮上。
            "url":"http://sammix.adsame.com/t?z=sammix&id=1216866"
          }
    }
    ```

+ 拷贝`config/log.default.json` 到 `config/log.json` 这个文件是一些绑定到部署环境的配置

    ```
    {
      "enabled" : true, //是否启动log日志
      "defaultLevel" : "log", //默认日志级别
      "consolePrint":true, //是否打印控制台
      "alertLevel":"debug", //alert 日志级别
      "appenders":[  //发送远程请求的对象
          {
            "levels":["warn","error"], //需要发送的日志级别
            "remote" :"http://localhost:3000/log" //接口
          }
      ],
      "allowReplace":true  //是否允许改变配置
    }
    ```

+ 拷贝`config/config.default.less` 到 `config/config.less` 这个文件是一些绑定到部署环境的配置

    ```
    @img-path:            '/images'; //图片路径，可以指向cdn
    @img-version:            '?v=1.0.0'; //图片版本，用于清除浏览器缓存 
    @fa-font-path:        '/fonts'; //正式环境用 '/fonts' 测试环境 '/font-awesome/fonts'  
    @icon-font-path:        '/fonts/'; //正式环境 '/fonts/' 测试环境 '/bootstrap/fonts/'
    ```


+ 拷贝`config/activity.default.less` 到 `config/activity.less` 这个文件是一些绑定到部署环境的配置,这里面是活动相关数据

    ```
    [
     {
       "key": "英文主键",
       "title": "标题1",
       "type": "0不跳转,1跳转项目，2跳转内部state，3跳转外部网页",
       "img": "图片地址",
       "target": "type等于1表示项目ID，2表示内部state名称，3表示url",
       "targetParams": "type为2state的参数",
       "datetime": "时间",
       "description": "描述",
       "slide": "boolean是否展示在首页幻灯片"
     }
    ]
    ```
   
+ 调试前端或者模拟接口 `gulp`

+ 生成并上传模拟接口文档 `gulp fakedocs`

+ 远程同步模拟接口 `gulp fakeroutes`

+ CSS组件开发测试 `gulp csstest`

+ 正式环境编译部署 `gulp deploy:real`

+ 测试环境编译部署 `gulp deploy:fake`

+ jenkins CI路径 http://192.168.5.31:8080/job/wechat jenkins部署在192.168.5.20的虚拟机上,通过git触发

+ http访问 http://localhost:3000    https访问 https://localhost:3000

# [JS karma unit test](test/README.md##js-karma-unit-test)
# [protractor e2e test](test/README.md#protractor-e2e-test)

# 其他
+ 服务器端可以使用forever启动监听：forever -w --watchDirectory /var/www/hswechat-fakeserver/routes start /var/www/hswechat-fakeserver/bin/www

# 部署
+ 确认git分支正确
+ 修改 `config/app.json` `deployServer` 字段
+ privateKey 是ssh私钥
+ 运行 `gulp deploy:real`

# markdown 语法

+ http://daringfireball.net/projects/markdown/syntax

+ http://www.appinn.com/markdown/

# 全局参数列表
全局参数可以通过get参数形式注入 http://domain.com?m=MTU4MDA4MDQ2MDk=&regm=MTU4MDA4MDQ2MDk=
+ `ad`  推广渠道，页面从哪个渠道导入进来的，包括广告渠道或者ios、Android APP等
+ `subid` 渠道用户ID，对应ad参数
+ `m`  默认推荐人手机号码(base64Encode后的结果)
+ `regm` 默认注册用户的手机号码(base64Encode后的结果)
+ `_hideNavbar` 隐藏全局顶部导航栏和标题栏
+ `_hideNavbarBottom` 隐藏全局底部tab导航栏
