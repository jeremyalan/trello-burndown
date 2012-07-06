$(function () {
   Trello.authorize({
      interactive:false
   });

   var defaultStartDate = new Date();
   defaultStartDate.setDate(defaultStartDate.getDate() - 14);

   var defaultEndDate = new Date();

   $("input[name=StartDate]").datepicker().val(getUIDateString(defaultStartDate));
   $("input[name=EndDate]").datepicker().val(getUIDateString(defaultEndDate));

   $("#logout a").click(function () {
      Trello.deauthorize();

      $("#app").hide();
      $("#connect").show();
   });

   $("#create-burndown-chart button").button();
   $("#create-burndown-chart button").click(function (event) {
      event.preventDefault();

      var todoLists =
         _.chain(selectListsModel.get("lists"))
            .filter(function (list) { return list.get("isTodoList"); })
            .map(function (list) { return list.get("list").id; })
            .value();

      var doneLists =
         _.chain(selectListsModel.get("lists"))
            .filter(function (list) { return list.get("isDoneList"); })
            .map(function (list) { return list.get("list").id; })
            .value();

      createBurndownChart(selectListsModel.get("board"), todoLists, doneLists);
   });

   // Boards
   var selectBoardModel = new App.Models.SelectBoard();
   var selectBoardView = new App.Views.SelectBoardView({
      model:selectBoardModel
   });

   selectBoardView.on("selected", function (board) {
      selectListsModel.set("board", board);
   });

   selectBoardView.render();
   $("#boards-inner ul").replaceWith(selectBoardView.$el);

   // Lists
   var selectListsModel = new App.Models.SelectLists();
   var selectListsView = new App.Views.SelectListsView({
      model:selectListsModel
   });

   selectListsView.render();
   $("#lists-inner ul").replaceWith(selectListsView.$el);

   if (Trello.authorized()) {
      onConnected();
   }
   else {
      var loginModel = new App.Models.Login();
      var loginView = new App.Views.LoginView({
         el:$("#connect"),
         model:loginModel
      });

      loginView.on("connected", onConnected);
      loginView.render();
   }

   function onConnected() {
      $("#app").show();
      $("#connect").hide();

      selectBoardModel.updateBoards();
   }

   function createBurndownChart(board, todoLists, doneLists) {
      $("#burndown-chart").empty().append($('<div id="burndown-progress"><label>Calculating burndown chart...</label><div class="progressbar"></div></div>'));
      $("#burndown-progress .progressbar").progressbar();

      getTotalPoints(board, todoLists.concat(doneLists), function (totalPoints) {
         getDailyCounts(board, todoLists, doneLists, totalPoints, function (dailyCounts) {
            var step = totalPoints / _.keys(dailyCounts).length;
            var current = totalPoints;
            var countdown = [];

            for (var i = 0; i <= _.keys(dailyCounts).length; i++) {
               countdown.push(current);

               current -= step;
            }

            new Highcharts.Chart({
               chart:{
                  renderTo: "burndown-chart",
                  height:500
               },
               title:{
                  text:"Burndown Chart"
               },
               tooltip:{
                  enabled:false
               },
               credits:{
                  enabled:false
               },
               plotOptions:{
                  area:{
                     marker: {
                        enabled: false
                     }
                  }
               },
               yAxis: {
                  min: 0
               },
               legend:false,
               series:[{
                  name:"Tasks Remaining",
                  type:'area',
                  data:_.values(dailyCounts)
               }, {
                  name:"Target",
                  type:'area',
                  data:countdown,
                  color: "#FF0000",
                  fillColor: "transparent",
                  lineWidth: 2,

               }]
            });
         });
      });
   }

   function padLeft(target, totalLength, padChar) {
      var result = target + "";

      while (result.length != totalLength) {
         result = padChar + result;
      }

      return result;
   }

   function getUIDateString(date) {
      return padLeft(date.getMonth() + 1, 2, "0") + "/" + padLeft(date.getDate(), 2, "0") + "/" + date.getFullYear();
   }

   function getDateString(date) {
      return date.getFullYear() + "-" + padLeft(date.getMonth() + 1, 2, "0") + "-" + padLeft(date.getDate(), 2, "0");
   }

   function getDate(dateString) {
      var year = parseInt(dateString.substring(6, 10));
      var month = parseInt(dateString.substring(0, 2));
      var day = parseInt(dateString.substring(3, 5));

      return new Date(year, month - 1, day);
   }

   function getCardPoints(card) {
      var regex = /^(?:\()([\d]+)(?:\)).*/;
      var target = card.name;
      var points = 1;

      if (target.match(regex)) {
         var result = regex.exec(target);
         points = parseInt(result[1]);
      }

      return points;
   }

   function getDailyCounts(board, todoLists, doneLists, totalCards, onComplete) {
      var progressBar = $("#burndown-progress .progressbar");

      var statusesByCard = {};
      var dailyCounts = {};

      var startDate = getDate($("input[name=StartDate]").val());
      var endDate = getDate($("input[name=EndDate]").val());

      var currentDate = new Date(startDate.getTime());

      while (currentDate <= endDate) {
         dailyCounts[getDateString(currentDate)] = totalCards;

         currentDate.setDate(currentDate.getDate() + 1);
      }

      var populateDailyCounts = function () {
         _.each(_.values(statusesByCard), function (status) {
            var points = getCardPoints(status.card);

            if (_.any(doneLists, function (list) { return list == status.list })) {
               // This card is completed.
               _.each(_.keys(dailyCounts), function (targetDate) {
                  if ((status.statusOn.length > 0 && targetDate >= status.statusOn) || targetDate < status.createdOn)
                     dailyCounts[targetDate] -= points;
               });
            }
            else {
               _.each(_.keys(dailyCounts), function (targetDate) {
                  if (targetDate < status.createdOn)
                     dailyCounts[targetDate] -= points;
               });
            }
         });

         console.log(dailyCounts);

         onComplete(dailyCounts);
      };

      getRelevantCards(board, todoLists.concat(doneLists), function (cards) {
         if (cards.length == 0) {
            populateDailyCounts();
            return;
         }

         var requestsPending = cards.length;

         _.each(cards, function (card) {
            getCardStatus(statusesByCard, card, function () {
               requestsPending--;

               progressBar.progressbar("value", Math.round(((cards.length - requestsPending) / cards.length) * 100));

               if (requestsPending == 0) {
                  populateDailyCounts();
               }
            })
         });
      });
   }

   function getCardStatus(statusesByCard, card, onComplete) {
      var url = "/cards/" + card.id + "/actions";
      var options = {
         filter:"createCard,updateCard:idList",
         limit:1000
      };

      Trello.get(url, options, function (actions) {
         var currentStatus =
            _.chain(actions)
               .filter(function (action) {
                  return action.type == "updateCard";
               })
               .sortBy(function (action) {
                  return action.date;
               })
               .last()
               .value();

         var createdStatus =
            _.find(actions, function(action) {
               return action.type == "createCard";
            });

         statusesByCard[card.id] = {
            card: card,
            createdOn: createdStatus.date.substring(0, 10),
            list: currentStatus == null ? "" : currentStatus.data.listAfter.id,
            statusOn: currentStatus == null ? "" : currentStatus.date.substring(0, 10)
         };

         onComplete();
      });
   }

   function getTotalPoints(board, lists, onComplete) {
      getRelevantCards(board, lists, function (cards) {
         var totalPoints =
            _.reduce(cards, function (memo, card) {
               return memo + getCardPoints(card);
            }, 0);

         onComplete(totalPoints);
      });
   }

   function getRelevantCards(board, lists, onComplete) {
      var url = "/boards/" + board + "/cards";
      var options = {
         filter:"open"
      };

      Trello.get(url, options, function (cards) {
         var filteredCards = _.filter(cards, function (card) {
            return _.any(lists, function (list) {
               return list == card.idList;
            });
         });

         onComplete(filteredCards);
      });
   }
});
