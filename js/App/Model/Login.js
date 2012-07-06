(function () {
   App.Models.Login = Backbone.Model.extend({
      initialize: function () {

      },

      connect: function () {
         var that = this;

         Trello.authorize({
            type: "popup",
            success: function () {
               that.onAuthorize();
            }
         })
      },

      onAuthorize: function () {
         this.trigger("connected");
      }
   });
} ());
