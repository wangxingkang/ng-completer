(function () {
  'use strict';

  angular.module('ngCompleter', [])
    .directive('ngCompleter', function() {
      return {
        restrict: 'AE',
        scope: {
          itemTag: '@',//选择项的标签
          source: '=',//提供源数据
          selectedClass: '@',//选中项的样式
          completerModel: "=ngModel",
          separator: '@',//分隔符
          suggest: '@',
          template: '@',//模板
          zIndex: '@',
          filter: '&'
        },
        link: function(scope, element) {
          // 设置数据处理
          scope.itemTag = scope.itemTag || 'li';
          scope.source = scope.source || [];
          scope.suggest = scope.suggest || false;
          scope.selectedClass = scope.selectedClass || 'completer-selected';
          scope.template = scope.template || '<ul class="completer-container"></ul>';
          scope.zIndex = scope.zIndex || 600;

          element.attr('autocomplete', 'off'); // 关闭浏览器的自动提示
          element.after(scope.template); // 将选择容器插入到dom

          var container = element.next(); // 获取选择容器
          var active = false;
          var styles = {
            width: element[0].offsetWidth+'px',
            zIndex: scope.zIndex,
            display: 'none'
          };

          container.css(styles); // 初始化样式

          scope.regexp = toRegexp(scope.separator);

          scope.toggle = toggle;
          scope.complete = complete;

          // 绑定获取焦点及失去焦点事件
          element.on({
            focus: _enable,
            blur: _disable
          });

          /**
           * 获取焦点处理函数
           * @private
           */
          function _enable() {
            if (!active) {
              active = true;
              element.on({
                'keydown': _keydown,
                'keyup': _keyup
              });
              container.on({
                'mousedown': _mousedown,
                'mouseover': _mouseover
              });
            }
          }

          /**
           * 失去焦点处理函数
           * @private
           */
          function _disable() {
            if (active) {
              active = false;
              element.off('keydown');
              element.off('keyup');
              container.off('mousedown');
              container.off('mouseover');
            }
            _setContainerShow(false);
          }

          /**
           * 按键按下处理函数
           * @param e
           * @private
           */
          function _keydown(e) {
            var keyCode = e.keyCode || e.which || e.charCode;

            if (keyCode === 13) {
              e.stopPropagation();
              e.preventDefault();
            }
          }

          /**
           * 释放按键事件处理函数
           * @param e
           * @private
           */
          function _keyup(e) {
            var keyCode = e.keyCode || e.which || e.charCode;

            if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
              scope.toggle(keyCode);
            } else {
              scope.complete();
            }
          }

          /**
           * 设置容器是否显示
           * @param type {Boolean}
           * @private
           */
          function _setContainerShow (type) {
            if (type) {
              container.css('display', 'block');
            } else {
              container.css('display', 'none');
            }
          }

          function toggle(keyCode) {
            var selectedClass = scope.selectedClass;
            //获取当前设置选择
            var $selected = container.find('.'+selectedClass);

            switch (keyCode) {
              case 40:
                $selected.removeClass(selectedClass);
                //获取下一个元素
                $selected = angular.element($selected.next());
                break;
              case 38:
                $selected.removeClass(selectedClass);
                $selected = $selected.prev();
                break;
              case 13:
                _setValue($selected.text());
                break;
            }
            if ($selected.length === 0) {
              var tagList = container.children(scope.itemTag);
              if(keyCode === 40) {
                angular.element(tagList[0]);
              }else{
                angular.element(tagList[tagList.length -1]);
              }
              $selected = container.children(keyCode === 40 ? ':first' : ':last');
            }

            $selected.addClass(selectedClass);
          }

          function complete() {
            var val = element.val().toString();

            if (val === '') {
              _setContainerShow(false);
              return;
            }

            if (scope.suggest) {
              _suggest(val);
            } else {
              _attach(val);
            }
          }

          function _mouseover (e) {
            var selectedClass = scope.selectedClass;
            var $target = angular.element(e.target);
            var itemTag = e.target.localName;

            if (itemTag === scope.itemTag) {
              $target.parent().find('.'+selectedClass).removeClass(selectedClass);//删除兄弟元素的类
              $target.addClass(selectedClass);//在当前元素添加类
            }
          }

          function _mousedown(e) {
            e.stopPropagation();
            e.preventDefault();
            _setValue(angular.element(e.target).text());
          }

          /**
           * 设置选中的值
           * @param val
           * @private
           */
          function _setValue (val) {
            scope.$apply(function() {
              scope.completerModel = val;
            });
            _setContainerShow(false);
          }

          function _suggest (val) {
            var reg = new RegExp(espace(val), 'i');
            var matched = [];

            angular.forEach(scope.source, function(value) {
              if (reg.test(value)) {
                matched.push(value);
              }
            });

            matched.sort(function(a, b) {
              return a.indexOf(val) - b.indexOf(val);
            });

            angular.forEach(matched, function(value, key) {
              matched[key] = _tel(value);
            });

            _fill(matched.join(''));
          }

          function _attach(val) {
            var separator = scope.separator;
            var regexp = scope.regexp;
            var part = regexp ? val.match(regexp) : null;
            var matched = [];
            var all = [];
            var reg;
            var item;

            if (part) {
              part = part[0];
              val = val.replace(regexp, '');
              reg = new RegExp('^' +  espace(part), 'i');
            }

            angular.forEach(scope.source, function(data) {
              data = separator + data;
              item = _tel(val + data);

              if (reg && reg.test(data)) {
                matched.push(item);
              } else {
                all.push(item);
              }
            });

            matched = matched.length ? matched.sort() : all;

            _fill(matched.join(''));
          }

          function _tel(text) {
            var tag = scope.itemTag;
            return ('<' + tag + '>' + text + '</' + tag + '>');
          }

          function _fill(html) {
            container.empty();//清空内容
            if (html) {
              container.html(html);
              //设置第一个选择的类
              container.children(':first-child').toggleClass(scope.selectedClass);
              _setContainerShow(true);
            } else {
              _setContainerShow(false);
            }
          }

          function toRegexp (s) {
            if (typeof s === 'string' && s !== '') {
              s = espace(s);
              return new RegExp(s + '+[^' + s + ']*$', 'i');
            }
            return null;
          }

          function espace(s) {
            return s.replace(/([\.\$\^\{\[\(\|\)\*\+\?\\])/g, '\\$1');
          }
        }
      };
    });

})()
