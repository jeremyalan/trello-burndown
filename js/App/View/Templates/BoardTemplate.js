(function () {

   App.Templates.BoardTemplate = _.template('<a href="#">\n   <%= Board.name %>\n   <%= Organization == null ? "" : "(" + Organization.displayName + ")" %>\n</a>');

}).call(this);
