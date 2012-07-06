App.Templates.SelectBoardTemplate = _.template('''
   <ul>
<% _.each (Boards, function (board) {
%>    <li>
         <a href="#"><%= board.name %></a>
      </li>
<% });
%> </ul>
''')
;
