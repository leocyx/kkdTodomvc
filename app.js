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

  const { createApp, ref, watch, computed } = Vue;
  exports.app = createApp({
    setup() {
      const todos = ref(todoStorage.fetch());
      const newTodo = ref("");
      const editedTodo = ref(null);
      const visibility = ref("all");

      const filteredTodos = computed(() => {
        return filters[visibility.value](todos.value);
      });

      const remaining = computed(() => {
        return filters.active(todos.value).length;
      });

      const allDone = computed({
        get: function () {
          return remaining.value === 0;
        },
        set: function (value) {
          todos.value.forEach(function (todo) {
            todo.completed = value;
          });
        },
      });

      watch(todos.value, (newValue) => {
        todoStorage.save(newValue);
      });

      function pluralize(word, count) {
        return word + (count === 1 ? "" : "s");
      }

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

      function removeTodo(todo) {
        var index = todos.value.indexOf(todo);
        todos.value.splice(index, 1);
      }

      function editTodo(todo) {
        this.beforeEditCache = todo.title;
        editedTodo.value = todo;
      }

      function doneEdit(todo) {
        if (!editedTodo.value) {
          return;
        }
        editedTodo.value = null;
        todo.title = todo.title.trim();
        if (!todo.title) {
          removeTodo(todo);
        }
      }

      function cancelEdit(todo) {
        editedTodo.value = null;
        todo.title = this.beforeEditCache;
      }

      function removeCompleted() {
        todos.value = filters.active(todos.value);
      }

      return {
        todos,
        newTodo,
        editedTodo,
        visibility,
        filteredTodos,
        remaining,
        allDone,
        pluralize,
        addTodo,
        removeTodo,
        editTodo,
        doneEdit,
        cancelEdit,
        removeCompleted
      };
    },
    directives: {
      "todo-focus": function (el, binding) {
        if (binding.value) {
          el.focus();
        }
      },
    },
  }).mount(".todoapp");
})(window);
