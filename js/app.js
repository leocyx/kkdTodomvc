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

    //取得未勾選的todos陣列長度
    const remaining = computed(() => {
      return filters.active(todos.value).length;
    });

    //get回傳是否還有未勾選項目，set處理全部勾選或取消
    const allDone = computed({
      get() {
        return remaining.value === 0;
      },
      set(value) {
        todos.value.forEach(function (todo) {
          todo.completed = value;
        });
      },
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
      remaining,
      allDone,
    };
  }

  const { createApp, ref, watch, computed } = Vue;
  exports.app = createApp({
    setup() {
      const { todos, newTodo, addTodo, ...restProps} = useBasicTodo();
      return {
        todos,
        newTodo,
        addTodo,
		...restProps
      };
    },
  }).mount(".todoapp");
})(window);
