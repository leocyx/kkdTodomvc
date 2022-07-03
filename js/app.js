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
    watch(
      todos,
      (newValue) => {
        todoStorage.save(newValue);
      },
      { deep: true }
    );

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
    //處理刪除todo項目
    function removeTodo(todo) {
      todos.value = todos.value.filter((data) => data.id !== todo.id);
    }
    //處理清除所有已勾選項目
    function removeCompleted() {
      todos.value = filters.active(todos.value);
    }

    return {
      todos,
      newTodo,
      addTodo,
      remaining,
      allDone,
      removeTodo,
      removeCompleted,
    };
  }

  function useEditTodo(removeTodo) {
    const beforeEditCache = ref("");
    const editedTodo = ref(null);
    //暫存編輯前的內容title，並將原內容綁定editedTodo
    function editTodo(todo) {
      beforeEditCache.value = todo.title;
      editedTodo.value = todo;
    }
    //處理完成編輯後動作
    function doneEdit(todo) {
      if (!editedTodo.value) {
        return;
      }
      todo.title = todo.title.trim();
      editedTodo.value = null;
      if (!todo.title) {
        removeTodo(todo);
      }
    }
    //處理取消編輯後回復先前內容
    function cancelEdit(todo) {
      editedTodo.value = null;
      todo.title = beforeEditCache.value;
    }

    return {
      beforeEditCache,
      editTodo,
      editedTodo,
      doneEdit,
      cancelEdit,
    };
  }

  function useDynamicTodos(todos) {
    const visibility = ref("all");
    //取得visibility選項過濾後的todos資料
    const filteredTodos = computed(() => {
      return filters[visibility.value](todos.value);
    });
    return {
      visibility,
      filteredTodos,
    };
  }

  const { createApp, ref, watch, computed } = Vue;
  exports.app = createApp({
    setup() {
      const { todos, newTodo, addTodo, removeTodo, ...restProps } =
        useBasicTodo();
      const editFunctions = useEditTodo(removeTodo);
      const dynamicTodos = useDynamicTodos(todos);

      const pluralize = (word, count) => {
        return word + (count === 1 ? "" : "s");
      };

      return {
        todos,
        newTodo,
        addTodo,
        removeTodo,
        pluralize,
        ...restProps,
        ...editFunctions,
        ...dynamicTodos,
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
