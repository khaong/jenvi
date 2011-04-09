require 'sinatra'

set :public, File.dirname(__FILE__) + '/../static'

get "/" do
  "Hello World"
end