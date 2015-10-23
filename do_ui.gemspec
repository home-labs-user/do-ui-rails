$:.push File.expand_path("../lib", __FILE__)

require "do/ui/rails/version"

Gem::Specification.new do |s|
  s.name        = "do-ui-rails"
  s.version     = Do::Ui::Rails::VERSION
  s.authors     = ["Home Labs"]
  s.email       = ["home-labs@outlook.com"]
  s.homepage    = "https://rubygems.org/gems/do_ui_rails"
  s.summary     = "Summary of Do UI."
  s.description = "Description of Do UI."
  s.license     = "MIT"
  s.test_files = Dir["test/**/*"]

  s.files = Dir["{bin,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc", "do_ui.gemspec"]
  s.require_paths = %w{bin lib}

  s.add_dependency 'coffee-rails', "~> 4.1"
  s.add_dependency 'do-rails', "~> 0.1"

end
