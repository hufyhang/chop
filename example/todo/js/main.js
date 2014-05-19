/* global $ch */

var todos = ['Coding'];

var listView = $ch.view({
  html: function () {
    'use strict';
    var html = '';
    var template = $ch.find('#todo-template').html();

    for (var index = 0; index !== todos.length; ++index) {
      var item = todos[index];
      html += $ch.template(template, {
        index: index,
        number: index + 1,
        content: item
      });
    }

    return html;
  }
});

var counterView = $ch.view({
  html: function () {
    'use strict';
    return '<hr/><p><b>' + todos.length + '</b> left</p>';
  }
});

var addTodo = function () {
  'use strict';
  var content = $ch.source('msg');
  todos.push(content);
  $ch.source('msg', '');

  $ch.find('.awesome-container').view([listView, counterView]);
};

var removeTodo = function (index) {
  'use strict';
  todos.splice(index, 1);
  $ch.find('.awesome-container').view([listView, counterView]);
};


$ch.find('#todo-input').focus();
