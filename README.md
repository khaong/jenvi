Jenvi - Build Pipeline Visualisation tool for Jenkins
=====================================================

Little javascript tool that helps visualise pipelines in Jenkins/Hudson.

Requires:
---------
###Ruby
*   Sinatra (webserver) - http://www.sinatrarb.com/
*   jslint_on_rails gem
*   jasmine (BDD for JavaScript) gem
*   bundler gem

*   and of course, a Jenkins server to reference:
    Jenkins (CI Server) - http://jenkins-ci.org/

Uses:
-----
*   JQuery - http://jquery.com/
*   Javascript Infovis Toolkit - http://thejit.org/

Build/Test:
-----------
*   $ rake

To Run:
-------
*   $ rake run
*   Browse to http://localhost:4567
*   Give it the url to the Jenkins job which is the final stage of your pipeline
*   Hit "Load Pipeline"