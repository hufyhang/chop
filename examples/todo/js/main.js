/* global $ch */
$ch.require('event');

var STORAGE = 'todo-list';
var todos = $ch.store(STORAGE);
if (todos === null) {
  todos = [{
    index: 0,
    number: 1,
    content: 'Coding'
  }];
}

$ch.source('todos', todos);

var counterView = $ch.view({
  html: function () {
    'use strict';
    return '<hr/><p><b>' + todos.length + '</b> left</p>';
  }
});

var addTodo = function () {
  'use strict';
  var content = $ch.source('msg');
  todos.push({
    index: todos.length,
    number: todos.length + 1,
    content: content
  });
  $ch.source('msg', '');

  $ch.event.emit('update');
};

var removeTodo = function (id) {
  'use strict';
  todos.splice(id, 1);
  $ch.each(todos, function(item, index) {
    item.index = index;
    item.number = index + 1;
  });
  $ch.event.emit('update');
};


$ch.find('#todo-input').focus();

$ch.event.listen('update', function () {
  'use strict';
  $ch.source('todos', todos);
  $ch.find('#awesome-inline').inline();
  counterView.render();
  $ch.store(STORAGE, todos);
});
