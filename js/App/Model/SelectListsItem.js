(function (App, Backbone) {
   App.Models.SelectListsItem = Backbone.Model.extend({
      initialize: function (list) {
         this.set("list", list);

         this.set("isTodoList", false);
         this.set("isDoneList", false);
      }
   });
} (App, Backbone));
