Dir["./", "*/"].each{ |p| $:.unshift File.absolute_path(p) unless $:.include?(File.absolute_path(p)) }

require "interfaces_html/rails/version"

Gem::Specification.new do |s|
  s.name        = "interfaces_html-rails"
  s.version     = InterfacesHtml::Rails::VERSION
  s.authors     = ["rplauindo"]
  s.email       = ["rafaelplaurindo@gmail.com"]
  s.homepage    = "https://github.com/rplaurindo"
  s.summary     = "Summary of interfaces_html-rails."
  s.description = "Description of interfaces_html-rails."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.0"

  INTERFACES_HTML_REQUIREMENTS = [
    "jquery-rails",
    "sass-rails"
  ]

  INTERFACES_HTML_REQUIREMENTS.each do |pkg|
    s.add_dependency pkg
  end

end
