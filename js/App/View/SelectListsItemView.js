(function (App) {
   App.Views.SelectListsItemView = Backbone.View.extend({
      tagName: "li",

      events: {
         "change input[name=IsTodoList]": "onTodoSelected",
         "change input[name=IsDoneList]": "onDoneSelected"
      },

      initialize: function () {
      },

      render: function () {
         this.$el.html(App.Templates.SelectListsItemTemplate({
            List: this.model.get("list")
         }));
      },

      onTodoSelected: function () {
         this.model.set("isTodoList", this.$("input[name=IsTodoList]").is(":checked"));
      },

      onDoneSelected:function () {
         this.model.set("isDoneList", this.$("input[name=IsDoneList]").is(":checked"));
      }
   });
} (App));
