Dir["./", "*/"].each{ |p| $:.unshift File.absolute_path(p) unless $:.include?(File.absolute_path(p)) }

require "do/interface/rails/version"

Gem::Specification.new do |s|
  s.name        = "do-interface-rails"
  s.version     = Do::Interface::Rails::VERSION
  s.authors     = ["rplauindo"]
  s.homepage    = "https://github.com/rplaurindo/do-interface-rails"
  s.summary     = "Summary of DoInterface."
  s.description = "Description of DoInterface."

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
