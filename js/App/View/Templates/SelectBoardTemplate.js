(function () {

   App.Templates.SelectBoardTemplate = _.template('<ul>\n<% _.each (Boards, function (board) {\n%>    <li>\n      <a href="#"><%= board.name %></a>\n   </li>\n<% });\n%> </ul>');

}).call(this);
