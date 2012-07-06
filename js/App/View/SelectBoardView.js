(function (App) {
   App.Views.SelectBoardView = Backbone.View.extend({
      tagName: "ul",

      initialize: function () {
         this.model.on("change:boards", this.render, this);
      },

      render: function () {
         var that = this;

         that.$el.empty();

         var views = [];
         _.each (this.model.get("boards"), function (board) {
            var view = new App.Views.BoardView({
               model: board
            });

            view.on("selected", function () {
               _.each (views, function (target) {
                  if (target == view)
                     return;

                  target.deselect();
               });

               that.trigger("selected", board.get("board").id);
            });

            view.render();
            that.$el.append(view.$el);

            views.push(view);
         });
      }
   })
} (App));
