Jenvi - Build Pipeline Visualisation tool for Jenkins
=====================================================

Little javascript tool that helps visualise pipelines in Jenkins/Hudson.

Requires:
---------
Sinatra (webserver) - http://www.sinatrarb.com/
JQuery - http://jquery.com/
Javascript Infovis Toolkit - http://thejit.org/

and of course,
Jenkins (CI Server) - http://jenkins-ci.org/

To Run:
-------
- $ ruby -rubygems lib/jenvi.rb
- Browse to http://localhost:4567
- Give it the url to the Jenkins job which is the final stage of your pipeline
- Hit "Load Pipeline", then "Show Tree" (currently needs two steps due to as-yet-unresolved ajax issues)