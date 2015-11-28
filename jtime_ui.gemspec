$:.push File.expand_path("../lib", __FILE__)

require "jtime/rails/ui/version"

Gem::Specification.new do |s|
  s.name        = "jtime-rails-ui"
  s.version     = JTime::Rails::UI::VERSION
  s.authors     = ["Home Labs"]
  s.email       = ["home-labs@outlook.com"]
  s.homepage    = "https://rubygems.org/gems/jtime_rails_ui"
  s.summary     = "Summary of jTime UI."
  s.description = "Description of jTime UI."
  s.license     = "MIT"
  s.test_files = Dir["test/**/*"]

  s.files = Dir["{bin,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc", "do_ui.gemspec"]
  s.require_paths = %w{bin lib}

  s.add_dependency 'coffee-rails', "~> 4.1"
  s.add_dependency 'jtime-rails', "~> 0.0"

end
