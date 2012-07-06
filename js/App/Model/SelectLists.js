(function (App, Backbone) {
   App.Models.SelectLists = Backbone.Model.extend({
      initialize: function () {
         this.on("change:board", this.fetchLists, this);
      },

      fetchLists: function () {
         var that = this;

         Trello.get("/boards/" + this.get("board") + "/lists", function (lists) {
            that.set("lists", _.map(lists, function (list) {
               return new App.Models.SelectListsItem(list);
            }));
         });
      }
   });
} (App, Backbone));
