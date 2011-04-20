require 'sinatra'

set :public, File.dirname(__FILE__) + '/../public'

get '/' do
  redirect to('/index.html')
end