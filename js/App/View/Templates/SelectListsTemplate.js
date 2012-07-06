(function () {

   App.Templates.SelectListsTemplate = _.template('<div>\n   <table>\n      <thead>\n         <tr>\n            <th>To-Do</th>\n            <th>Done</th>\n            <th>Name</th>\n         </tr>\n      </thead>\n      <tbody></tbody>\n   </table>\n   <div class="buttons">\n      <button type="button">Select</button>\n   </div>\n\n   <div id="burndown-chart"></div>\n</div>');

}).call(this);
