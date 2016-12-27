#ngCompleter

## 安装

* Bower: `bower install ngCompleter`

* 添加`ngCompleter.min.js`和`ngCompleter.css`到你的html

```
<link rel="stylesheet" href="bower_components/ng-completer/ngCompleter.css">
<script type="text/javascript" src="bower_components/ng-completer/ngCompleter.min.js"></script>
```

* 添加`ngCompleter`模块到你的ng-app模块依赖

```
angular.module('app', ['ngCompleter']);
```

## 使用教程

html

```
 <input type="text" name="email" class="form-control"
           ng-completer data-source="emailFormat" data-separator="@" data-z-index = "1000"
           ng-model="email"
           placeholder="请输入邮箱">
```

controller

```
  angular
    .module('app',['ngCompleter'])
    .controller('IndexController', function ($scope) {
      $scope.emailFormat = ['qq.com', '163.com', '126.com', 'live.com']
    })
```

## Demo

请查看[Demo Page](https://wangxingkang.github.io/ng-completer/)






