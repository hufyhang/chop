/* global $ch */

var todos = [];

var addTodo = function () {
  'use strict';
  var content = $ch.source('msg');
  todos.push(content);
  $ch.source('msg', '');

  $ch.find('.awesome-container').view(listView);
};

var listView = $ch.view({
  html: function () {
    'use strict';
    var html = '';
    var template = $ch.find('#todo-template').html();

    for (var index = 0; index !== todos.length; ++index) {
      var item = todos[index];
      html += $ch.template(template, {number: index + 1, content: item});
    }

    return html;
  }
});

$ch.find('#todo-input').focus();
