/*global Vue, todoStorage */

(function (exports) {
  "use strict";

  const filters = {
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
  function useBasicTodo() {
    const todos = ref(todoStorage.fetch());
    const newTodo = ref("");

    //若todos發生改變，更新localStorage資料
    watch(todos.value, (newValue) => {
      todoStorage.save(newValue);
    });

    //處理添加todo項目
    function addTodo() {
      var value = newTodo.value && newTodo.value.trim();
      if (!value) {
        return;
      }
      todos.value.push({
        id: todos.value.length + 1,
        title: value,
        completed: false,
      });
      newTodo.value = "";
    }

    return {
      todos,
      newTodo,
      addTodo,
    };
  }

  const { createApp, ref, watch } = Vue;
  exports.app = createApp({
    setup() {
      const { todos, newTodo, addTodo } = useBasicTodo();
      return {
        todos,
        newTodo,
        addTodo,
      };
    },
  }).mount(".todoapp");
})(window);
