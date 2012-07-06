(function () {

   App.Templates.SelectListsItemTemplate = _.template('<div class="todo">\n   <input type="checkbox" name="IsTodoList" />\n</div>\n<div class="done">\n   <input type="checkbox" name="IsDoneList" />\n</div>\n<span class="list-name"><%= List.name %></span>');

}).call(this);
