App.Templates.BoardTemplate = _.template('''
      <a href="#">
         <%= Board.name %>
         <%= Organization == null ? "" : "(" + Organization.displayName + ")" %>
      </a>
''')
;
