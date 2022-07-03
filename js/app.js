/*global Vue, todoStorage */

(function (exports) {
  "use strict";

  var filters = {
    all: function (todos) {
      return todos;
    },
    active: function (todos) {
      return todos.filter(function (todo) {
        return !todo.completed;
      });
    },
    completed: function (todos) {
      return todos.filter(function (todo) {
        return todo.completed;
      });
    },
  };

  const { createApp } = Vue;
  exports.app = createApp({
    setup() {
      
    }
  }).mount(".todoapp");
})(window);
