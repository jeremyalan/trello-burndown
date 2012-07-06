(function (App) {
   App.Views.SelectListsView = Backbone.View.extend({
      tagName: "ul",

      initialize: function () {
         this.model.on("change:lists", this.render, this);
      },

      events: {
         "click button": "onSelect"
      },

      render: function () {
         var that = this;

         this.$el.empty();

         _.each (this.model.get("lists"), function (list) {
            var view = new App.Views.SelectListsItemView({
               model: list
            });

            view.render();

            that.$el.append(view.$el);
         });
      },

      onSelect: function () {
         this.trigger("done");
      }
   });
} (App));
