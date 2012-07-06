(function (App, _) {
   "use strict";

   App.Models.SelectBoard = Backbone.Model.extend({
      initialize: function () {
         if (Trello.authorized())
            this.updateBoards();
      },

      updateBoards: function () {
         var that = this;

         Trello.get("members/me/boards", function (boards) {
            var models =
               _.chain(boards)
                  .filter(function (board) {
                     return !board.closed;
                  })
                  .map(function (board) {
                     return new App.Models.Board(board);
                  })
                  .value();

            that.set("boards", models);
         });
      }
   });
} (App, _));
