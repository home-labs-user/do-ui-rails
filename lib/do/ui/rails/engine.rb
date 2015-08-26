module Do
  module Ui
    module Rails
      class Engine < ::Rails::Engine
        isolate_namespace Do::Ui::Rails
      end
    end
  end
end
