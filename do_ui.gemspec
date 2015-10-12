Dir["./", "*/"].each{ |p| $:.unshift File.absolute_path(p) unless $:.include?(File.absolute_path(p)) }

require "do/ui/rails/version"

Gem::Specification.new do |s|
  s.name        = "do-ui-rails"
  s.version     = Do::Ui::Rails::VERSION
  s.authors     = ["home-labs"]
  s.email       = ["home-labs@outlook.com"]
  s.homepage    = "https://rubygems.org/gems/do_ui_rails"
  s.summary     = "Summary of Do UI."
  s.description = "Description of Do UI."
  s.license     = "MIT"
  s.test_files = Dir["test/*"]

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency 'coffee-rails'

end
