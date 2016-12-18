'use strict';

describe('测试ngCompleter模块', function () {

  var $compile;
  var $rootScope;

  beforeEach(module('ngCompleter'));

  beforeEach(inject(function (_$compile, _$rootScope) {
    $compile = _$compile;
    $rootScope = _$rootScope;
    $rootScope.emailFormat = ['qq.com', '163.com', '126.com', 'live.com'];
  }));

  it('测试ngCompleter指令', inject(function($rootScope, $compile) {
    //创建DOM
    var element = $compile('<input type="text" ng-completer data-source="emailFormat" data-separator="@">')($compile);
    $rootScope.$digest();
  }));
});