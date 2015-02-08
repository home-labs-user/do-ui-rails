module DoInterface
  module Rails
    class Engine < ::Rails::Engine
      isolate_namespace DoInterface::Rails
    end
  end
end
