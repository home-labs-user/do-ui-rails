$:.push File.expand_path("../lib", __FILE__)

require "esphinx/rails/ui/version"

Gem::Specification.new do |spec|
  spec.name        = "esphinx-rails-ui"
  spec.version     = ESphinx::Rails::UI::VERSION
  spec.authors     = ["Home Labs"]
  spec.email       = ["home-labs@outlook.com"]
  spec.homepage    = "https://rubygemspec.org/gems/esphinx-rails-ui"
  spec.summary     = %q{Summary of ESphinx UI.}
  spec.description = %q{User Interface plugin for ESphinx.}
  spec.license     = "MIT"
  spec.test_files  = Dir["test/**/*"]

  spec.files = Dir["{bin,config,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md", "esphinx_ui.gemspec"]
  spec.require_paths = %w{lib vendor}

  # this is just for solve compatibility, but not to install gem
  spec.add_dependency 'esphinx-rails', '~> 0.2'
  spec.add_dependency 'basicss-rails', '~> 0.1'

end
