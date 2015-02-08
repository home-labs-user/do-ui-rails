Dir["./", "*/"].each{ |p| $:.unshift File.absolute_path(p) unless $:.include?(File.absolute_path(p)) }

require "do_interface/rails/version"

Gem::Specification.new do |s|
  s.name        = "do_interface-rails"
  s.version     = DoInterface::Rails::VERSION
  s.authors     = ["rplauindo"]
  s.email       = ["rafaelplaurindo@gmail.com"]
  s.homepage    = "https://github.com/rplaurindo"
  s.summary     = "Summary of do_interface-rails."
  s.description = "Description of do_interface-rails."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.0"

  DO_INTERFACE_REQUIREMENTS = [
    "jquery-rails",
    "sass-rails"
  ]

  DO_INTERFACE_REQUIREMENTS.each do |pkg|
    s.add_dependency pkg
  end

end
