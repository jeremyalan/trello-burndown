App.Templates.SelectListsItemTemplate = _.template('''
   <div class="todo">
      <input type="checkbox" name="IsTodoList" />
   </div>
   <div class="done">
      <input type="checkbox" name="IsDoneList" />
   </div>
   <span class="list-name"><%= List.name %></span>
''');
