Dir["./", "*/"].each{ |p| $:.unshift File.absolute_path(p) unless $:.include?(File.absolute_path(p)) }

require "do/ui/rails/version"

Gem::Specification.new do |s|
  s.name        = "do-ui-rails"
  s.version     = Do::Ui::Rails::VERSION
  s.authors     = ["home-labs"]
  s.email       = ["home-labs@outlook.com"]
  s.homepage    = "https://rubygems.org/gems/do-ui-rails"
  s.summary     = "Summary of Do UI."
  s.description = "Description of Do UI."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc", "do.gemspec"]
  s.require_paths = ["lib", "config"]

  # ~> entre a atual informada e uma nova versão na casa imediatamente a esquerda.
  # Ex. ~> 0.1.1 é o mesmo que < 0.2.0, >= 0.1.1. Isso validará 0.1.1, 0.1.1.0, 0.1.1.1, 0.1.2,....
  # >= igual ou superior a dada versão

  # serão instaladas no bundle, porém, para serem usadas devem estar no Gemfile
  s.add_runtime_dependency 'do_rails', '>= 0.0.3'
  s.add_dependency 'basicss-rails', '>= 0.0.7'

end
