Background
----------
A burndown chart is a useful visual aid used by many Agile teams (especially those practicing Scrum or other sprint-based methodologies), in order to get a clear picture of how much work is remaining before a particular deadline, and whether they will be able to meet their goals at their current pace.  This allows the team to make informed decisions on whether they need to limit the number of features they plan to release in the current sprint (or bring in more resources, etc.), or whether they have the capacity to complete more work than they originally planed.

There are other similar tools available, but most of these solutions required a dependency on third-party tools, such as Google Apps scripting, or required the site to "check in" daily to store an on-going list of completed tasks each day.  Trello has an awesome API, including action history on all boards, lists, and cards, so I figured there had to be a way to get an accurate view of daily completed tasks, using only the Trello API and a web browser.

Overview
--------
Trello Burndown Chart is a web-based application that allows you to render burndown charts based on task information from a Trello taskboard.  The history of each card is inspected to determine when it was created, and if/when it was completed in order to create a time-based view of tasks remaining over a specified period of time.

How to install
--------------
Installation is easy because all you need is a place to save the files, and a browser to run them.  It uses client.js, a JavaScript library developed by the Trello team to manage OAuth authentication and Trello API calls.  Simply save the files to a directory, and open up index.html in a web browser to start building your Burndown Chart.