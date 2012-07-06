(function (App) {
   App.Views.LoginView = Backbone.View.extend({
      el: $("#app"),

      initialize: function () {
         this.model.on("connected", this.onConnected, this);
      },

      events: {
         "click a": "onConnect"
      },

      render: function () {
         this.$el.html(App.Templates.Login());

         return this;
      },

      onConnect: function (){
         this.model.connect();
      },

      onConnected: function () {
         this.trigger("connected");
      }
   })
} (App));
