require 'jasmine'
load 'jasmine/tasks/jasmine.rake'
require 'jslint_on_rails'

JSLint.config_path = "config/jslint.yml"

task :default => ['jslint', 'jasmine:ci'] do
end

task :jslint do
  lint = JSLint::Lint.new(
      :paths => ['public/javascripts/**/*.js'],
      :exclude_paths => ['public/javascripts/support/**/*.js'],
      :config_path => 'config/jslint.yml'
  )

  lint.run
end

task :run do
  ruby('-rubygems', 'lib/jenvi.rb')
end