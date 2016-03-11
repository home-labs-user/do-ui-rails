module ESphinx
  module Rails
    module UI
      class Engine < ::Rails::Engine

        config.assets.precompile += %w( esphinx_ui.css )
      end
    end
  end
end
