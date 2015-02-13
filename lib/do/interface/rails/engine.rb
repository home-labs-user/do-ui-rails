module Do
  module Interface
    module Rails
      class Engine < ::Rails::Engine
        isolate_namespace Do::Interface::Rails
      end
    end
  end
end
