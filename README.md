#README
### Simple quiz ### 

### Uses following frameworks etc ###

* Parse.com - mobile Backend
* simple javascript, css and js
* ionic css framework for mobile look and feel
* mustache for templates


### Installation and How to Use ###

* Create an account on Parse.com and use your own keys. Create tables Quiz, and UserActivity.
* Import Quiz.json and UserActivity.json into Parse for quickstart. Add more questions to Quiz.json.
* Just hit the index.html on the browser   
 

   
### Features ###

* Provides one quiz at a time, user keeps on playing till questions exhaust
* Does not require a login for people to play
* Easy to import json format for quiz questions
* Uses window.localStorage 


### Todo and wishlist ###

* Optimise calls to server. Currently it fetches one question at a time and also fetches everytime it needs to verify answer and then again to update activity/score
* Add a module for db access for portability - refactoring 
* Create more quiz categories , then show score/progress per category
* More animated way to show results, instead of current javascript alert
* Package it into phonegap for mobile app
* Use angular templates 
   
   