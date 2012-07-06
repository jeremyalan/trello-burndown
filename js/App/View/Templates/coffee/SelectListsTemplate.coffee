App.Templates.SelectListsTemplate = _.template('''
   <div>
      <table>
         <thead>
            <tr>
               <th>To-Do</th>
               <th>Done</th>
               <th>Name</th>
            </tr>
         </thead>
         <tbody></tbody>
      </table>
      <div class="buttons">
         <button type="button">Select</button>
      </div>

      <div id="burndown-chart"></div>
   </div>
''');
