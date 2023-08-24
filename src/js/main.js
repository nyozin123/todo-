import $ from "jquery";

$(document).ready(function () {
  const getId = () => Math.round(Math.random() * 10000000000);
  let todoTasks = [];

  const LS_set = () =>
    localStorage.setItem("todo_tasks", JSON.stringify(todoTasks));

  const createTask = (task) => {
    const actionDiv = $("<div></div>");
    const btnEdit = $(`<button class="me-3"></button>`).html(
      `<i class="fa-solid fa-pencil me-3 text-sky-200"></i>`
    );
    const btnDelete = $(`<button></button>`).html(
      `<i class="fa-solid fa-trash-can me-3 text-sky-200"></i>`
    );
    btnDelete.click(function () {
      const { id } = task;
      $(this).parents("li").remove();
      const filterToDo = todoTasks.filter((todo) => todo.id !== id);
      console.log(filterToDo);
      todoTasks = [...filterToDo];

      LS_set();
    });
    console.log(btnDelete);
    btnEdit.click(function () {
      const btnSaveChange = $(
        `<button class="me-3" id="saveChangeBtn"></button>`
      ).html(`<i class="fa-solid fa-check me-3 text-sky-200"></i>`);
      const btnCancel = $(`<button id="cancelBtn"></button>`).html(
        `<i class="fa-solid fa-xmark me-3 text-sky-200"></i>`
      );
      const { id, text } = task;
      const inp_edit = $("<input/>")
        .val(text)
        .addClass("bg-sky-500 outline-none text-sky-50");
      $(this).parent().prev().children("p").replaceWith(inp_edit);
      inp_edit.focus();
      btnSaveChange.click(function () {
        $(this).parent().children().toggleClass("hidden");
        task.text = inp_edit.val();
        LS_set();
      });

      $(this).parent().children().toggleClass("hidden");
      $("#saveChangeBtn,#cancelBtn").remove();
      $(this).parent().append(btnSaveChange, btnCancel);
    });
    actionDiv.append(btnEdit, btnDelete);

    const liContent = $(`<div class="flex items-center gap-3"></div>`).html(`
        <input type="radio" class="border-none" name="rdo-completed" id="rdo-completed">
        <p class="text-sky-50">${task.text}</p>
    `);
    const li = $(
      '<li class="flex p-4 bg-sky-500 justify-between w-full"></li>'
    );
    li.append(liContent, actionDiv);
    $("#task-list").append(li);
  };
  $("#frm-task").submit(function (e) {
    e.preventDefault();
    const inpTask = $("#task");
    const newTask = { id: getId(), text: inpTask.val(), completed: false };
    if (inpTask.val()) {
      createTask(newTask);
      todoTasks.push(newTask);
      inpTask.val("");
      LS_set();
    } else {
      //alert("please enter task!");
      inpTask.addClass("input_error");
      inpTask.focus();
      console.log(inpTask.parent());
      const error_el = $(`<span id="error_sm"></span>`)
        .addClass("error")
        .text("error message");
      $("#error_sm").remove();
      inpTask.parent().after(error_el);
    }
  });

  $("#task").keyup(function (e) {
    if ($("#task").val()) {
      $(this).removeClass("input_error");
      $("#error_sm").remove();
    }
  });
  const onLoad = () => {
    const LS_Data = JSON.parse(localStorage.todo_tasks);
    LS_Data.map((task) => {
      createTask(task);
      todoTasks.push(task);
    });
  };
  onLoad();
});
