(function (App) {
   App.Models.Board = Backbone.Model.extend({
      initialize: function (board) {
         this.set("board", board);
         this.fetchOrganization();
      },

      fetchOrganization: function () {
         var that = this;

         var orgId = this.get("board").idOrganization;

         if (orgId == null || typeof (orgId) == 'undefined' || orgId.length == 0) {
            return;
         }

         Trello.get("/organizations/" + orgId, function (organization) {
            that.set("organization", organization);
         });
      }
   });
} (App))
