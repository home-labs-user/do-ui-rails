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

  # ~> entre a atual informada e uma nova versão na casa imediatamente a esquerda.
  # Ex. ~> 0.1.1 é o mesmo que < 0.2.0, >= 0.1.1. Isso validará 0.1.1, 0.1.1.0, 0.1.1.1, 0.1.2,....
  # >= igual ou superior a dada versão

  s.add_runtime_dependency 'jquery-rails', '~> 3.0'
  s.add_runtime_dependency 'do-rails', '~> 0.0.9'
  # s.add_dependency 'do-rails', '~> 0.0.9'
  s.add_runtime_dependency 'singleton_js-rails', '~> 0.0.1'
  s.add_runtime_dependency 'basicss-rails', '~> 0.0.7'

end
