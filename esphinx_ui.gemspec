$:.push File.expand_path("../lib", __FILE__)

require "esphinx/rails/ui/version"

Gem::Specification.new do |s|
  s.name        = "esphinx-rails-ui"
  s.version     = ESphinx::Rails::UI::VERSION
  s.authors     = ["Home Labs"]
  s.email       = ["home-labs@outlook.com"]
  s.homepage    = "https://rubygems.org/gems/esphinx-rails-ui"
  s.summary     = %q{Summary of ESphinx UI.}
  s.description = %q{User Interface plugin to ESphinx.}
  s.license     = "MIT"
  s.test_files  = Dir["test/**/*"]

  s.files = Dir["{bin,config,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md", "esphinx_ui.gemspec"]
  s.require_paths = %w{lib vendor}

  # this is just for solve compatibility, but not to install gem
  s.add_dependency 'esphinx-rails', '~> 0.2'
  s.add_dependency 'basicss-rails', '~> 0.1'

end
