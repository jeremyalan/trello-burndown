(function (App) {
   App.Views.BoardView = Backbone.View.extend({
      tagName: "li",

      initialize: function () {
         this.model.on("change:organization", this.render, this);
      },

      events: {
         "click a": "onSelected"
      },

      render: function () {
         this.$el.html(App.Templates.BoardTemplate({
            Board:this.model.get("board"),
            Organization: this.model.get("organization")
         }));
      },

      deselect: function () {
         this.$el.removeClass("selected");
      },

      onSelected: function () {
         this.$el.addClass("selected");
         this.trigger("selected");
      }
   })
} (App));
