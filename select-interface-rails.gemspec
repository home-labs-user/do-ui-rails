Dir["./", "*/"].each{ |p| $:.unshift File.absolute_path(p) unless $:.include?(File.absolute_path(p)) }

require "select-interface-rails/version"

Gem::Specification.new do |s|
  s.name        = "select-interface-rails"
  s.version     = SelectInterfaceRails::VERSION
  s.authors     = ["rplauindo"]
  s.email       = ["rafaelplaurindo@gmail.com"]
  s.homepage    = "https://github.com/rplaurindo"
  s.summary     = "Summary of SelectInterfaceRails."
  s.description = "Description of SelectInterfaceRails."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.0"

  JUGGERNAUT_REQUIREMENTS = [
    "jquery-rails",
    "sass-rails"
  ]

  JUGGERNAUT_REQUIREMENTS.each do |pkg|
    s.add_dependency pkg
  end

end
